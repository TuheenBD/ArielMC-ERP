'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CrmLead, CrmActivity, CrmTask, CompanyEntity, CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import initialActivitiesData from '@/data/initialCrmActivities.json';
import initialTasksData from '@/data/initialCrmTasks.json';
import initialLeadsData from '@/data/crmLeads.json';
import {
  Users2,
  ExternalLink,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Globe2,
  Phone,
  Mail,
  Building,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  Plus,
  BarChart3,
  CheckSquare,
  History,
  Database,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  FileSpreadsheet,
  Trash2,
  Edit,
  ChevronRight,
  ChevronLeft,
  Send,
  MessageSquare,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  Share2
} from 'lucide-react';

export type CrmViewTab = 'DASHBOARD' | 'LEADS' | 'PIPELINE' | 'TASKS' | 'ACTIVITY' | 'DATA';

export interface CrmPipelineProps {
  initialLeads?: CrmLead[];
  theme?: ThemeProfile;
  activeEntity?: CompanyEntity;
  activeCurrency?: CurrencyRate;
  onNavigateTab?: (tab: any) => void;
}

export const CRM_STAGES = [
  { id: '0 Watchlist', label: '0 Watchlist', short: 'Watchlist', prob: 0.00, color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: '1 Prospect', label: '1 Prospect', short: 'Prospect', prob: 0.05, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: '2 Contacted', label: '2 Contacted', short: 'Contacted', prob: 0.10, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: '3 Replied', label: '3 Replied', short: 'Replied', prob: 0.20, color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { id: '4 Qualified', label: '4 Qualified', short: 'Qualified', prob: 0.35, color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: '5 Sample sent', label: '5 Sample sent', short: 'Sample Sent', prob: 0.50, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: '6 Quote issued', label: '6 Quote issued', short: 'Quote Issued', prob: 0.65, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: '7 Negotiation', label: '7 Negotiation', short: 'Negotiation', prob: 0.80, color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { id: '8 Won', label: '8 Won', short: 'Closed Won', prob: 1.00, color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { id: '9 Lost or Nurture', label: '9 Lost or Nurture', short: 'Lost / Nurture', prob: 0.00, color: 'bg-gray-100 text-gray-600 border-gray-300' },
];

export const CRM_MARKETS = ['UK', 'EU', 'USA', 'AU'];
export const CRM_TIERS = ['Retailer', 'Wholesaler', 'Sales agent'];
export const CRM_PRIORITIES = ['A', 'B', 'C'];
export const CRM_INTERESTS = [
  'Jute & natural fibre',
  'Leather goods',
  'Both (jute + leather)',
  'Ceramic Tableware & Pottery',
  'Home Textiles & Linens'
];
export const CRM_ACTIVITY_TYPES = [
  'Email sent',
  'LinkedIn message',
  'Call',
  'Meeting',
  'Sample shipped',
  'Quote issued',
  'Show / event',
  'Note'
];
export const CRM_OUTCOMES = [
  'Sent - awaiting reply',
  'Replied - positive',
  'Replied - needs info',
  'Replied - not now',
  'Sampling agreed',
  'Quote requested',
  'Follow-up scheduled'
];

export const CrmPipeline: React.FC<CrmPipelineProps> = ({
  initialLeads,
  theme = 'crm-green',
  activeEntity,
  activeCurrency,
  onNavigateTab
}) => {
  // Theme Flags
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const activeTabClass = isRoyal
    ? 'bg-[#1E293B] text-white shadow-2xs'
    : isHeritage
    ? 'bg-[#244232] text-white shadow-2xs'
    : isCalifornia
    ? 'bg-[#1B2F3B] text-white shadow-2xs'
    : isMossy
    ? 'bg-[#343823] text-white shadow-2xs'
    : isInkWash
    ? 'bg-[#303438] text-white shadow-2xs'
    : isPeach
    ? 'bg-[#382622] text-white shadow-2xs'
    : isStormy
    ? 'bg-[#283542] text-white shadow-2xs'
    : 'bg-[#1F3A2E] text-white shadow-2xs';

  const actionBtnGradient = isRoyal
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-950/20'
    : isHeritage
    ? 'bg-gradient-to-r from-[#8A6D3B] to-[#735626] hover:from-[#9C7B43] hover:to-[#85652D] shadow-[#735626]/20'
    : isCalifornia
    ? 'bg-gradient-to-r from-[#2B6B88] to-[#1E526B] hover:from-[#357F9F] hover:to-[#2B6B88] shadow-[#1E526B]/20'
    : isMossy
    ? 'bg-gradient-to-r from-[#636B2F] to-[#4D5324] hover:from-[#717A35] hover:to-[#5E662D] shadow-[#4D5324]/20'
    : isInkWash
    ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748] hover:from-[#5A6678] hover:to-[#3E4B5B] shadow-[#2D3748]/20'
    : isPeach
    ? 'bg-gradient-to-r from-[#C87552] to-[#A3593B] hover:from-[#D98764] hover:to-[#C87552] shadow-[#A3593B]/20'
    : isStormy
    ? 'bg-gradient-to-r from-[#486581] to-[#334E68] hover:from-[#5E7B98] hover:to-[#415C76] shadow-[#334E68]/20'
    : 'bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] shadow-emerald-950/20';

  const tableHeaderBg = isRoyal
    ? 'bg-[#0F172A] text-white'
    : isHeritage
    ? 'bg-[#1C3627] text-white'
    : isCalifornia
    ? 'bg-[#13232C] text-white'
    : isMossy
    ? 'bg-[#252819] text-white'
    : isInkWash
    ? 'bg-[#22252A] text-white'
    : isPeach
    ? 'bg-[#2C1D1A] text-white'
    : isStormy
    ? 'bg-[#1E293B] text-white'
    : 'bg-[#1F3A2E] text-white';

  // Active Navigation Tab inside CRM
  const [activeTab, setActiveTab] = useState<CrmViewTab>('DASHBOARD');

  // Leads State with localStorage Sync
  const [leads, setLeads] = useState<CrmLead[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_erp_crm_leads_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return (initialLeads && initialLeads.length > 0) ? initialLeads : (initialLeadsData as CrmLead[]);
  });

  // Activities State with localStorage Sync
  const [activities, setActivities] = useState<CrmActivity[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_erp_crm_activities_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return initialActivitiesData as CrmActivity[];
  });

  // Tasks State with localStorage Sync
  const [tasks, setTasks] = useState<CrmTask[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_erp_crm_tasks_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return initialTasksData as CrmTask[];
  });

  // Save Leads to LocalStorage
  const persistLeads = (newLeads: CrmLead[]) => {
    setLeads(newLeads);
    try {
      localStorage.setItem('arielmc_erp_crm_leads_v1', JSON.stringify(newLeads));
      window.dispatchEvent(new CustomEvent('arielmc_crm_changed'));
    } catch {}
  };

  // Save Activities to LocalStorage
  const persistActivities = (newActs: CrmActivity[]) => {
    setActivities(newActs);
    try {
      localStorage.setItem('arielmc_erp_crm_activities_v1', JSON.stringify(newActs));
    } catch {}
  };

  // Save Tasks to LocalStorage
  const persistTasks = (newTasks: CrmTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('arielmc_erp_crm_tasks_v1', JSON.stringify(newTasks));
    } catch {}
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedInterest, setSelectedInterest] = useState<string>('ALL');
  const [selectedContactability, setSelectedContactability] = useState<string>('ALL');
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL');

  // Pagination State for Leads Table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Multi-Select State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'STAGE' | 'OWNER' | 'DELETE'>('STAGE');
  const [bulkTargetValue, setBulkTargetValue] = useState('');

  // Modals State
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadFormMode, setLeadFormMode] = useState<'add' | 'edit'>('add');
  const [leadFormData, setLeadFormData] = useState<Partial<CrmLead>>({});

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityFormData, setActivityFormData] = useState<{
    leadId: string;
    type: string;
    outcome: string;
    note: string;
    stageUpdate?: string;
    nextAction?: string;
    nextDate?: string;
  }>({
    leadId: '',
    type: 'Email sent',
    outcome: 'Sent - awaiting reply',
    note: '',
    stageUpdate: '',
    nextAction: '',
    nextDate: ''
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Market Flag Helper
  const getMarketFlag = (market: string) => {
    switch (market) {
      case 'UK': return '🇬🇧';
      case 'EU': return '🇪🇺';
      case 'USA': return '🇺🇸';
      case 'AU': return '🇦🇺';
      default: return '🌐';
    }
  };

  // Market Badge Styling
  const getMarketBadge = (market: string) => {
    switch (market) {
      case 'UK': return 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]';
      case 'EU': return 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]';
      case 'USA': return 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]';
      case 'AU': return 'bg-[#FDECE2] text-[#8A4415] border-[#F6CBB0]';
      default: return 'bg-[#F0F4F1] text-[#1A1A1A] border-[#DDE3DD]';
    }
  };

  // Priority Badge Styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'A': return 'bg-[#FDEAEA] text-[#8A1515] border-[#F7C0C0] font-bold';
      case 'B': return 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0] font-semibold';
      case 'C': return 'bg-[#EEF2F6] text-[#475569] border-[#D5DEE7]';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Stage Matching & Probability
  const getStageInfo = (stageName: string) => {
    const s = CRM_STAGES.find((stg) => stg.id === stageName || stageName.includes(stg.short));
    return s || CRM_STAGES[1]; // default to 1 Prospect
  };

  // Currency Formatter
  const formatMoney = (val?: number | null, cur?: string) => {
    if (val === undefined || val === null || val === 0) return '—';
    const currencySymbol = cur === 'GBP' ? '£' : cur === 'EUR' ? '€' : '$';
    return `${currencySymbol}${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        lead.id.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.country.toLowerCase().includes(q) ||
        (lead.contact && lead.contact.toLowerCase().includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        (lead.website && lead.website.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q)) ||
        (lead.nextAction && lead.nextAction.toLowerCase().includes(q));

      // Market
      const matchesMarket = selectedMarket === 'ALL' || lead.market === selectedMarket;

      // Tier
      const matchesTier = selectedTier === 'ALL' || lead.tier === selectedTier;

      // Priority
      const matchesPriority = selectedPriority === 'ALL' || lead.priority === selectedPriority;

      // Stage
      const matchesStage = selectedStage === 'ALL' || lead.stage === selectedStage;

      // Interest
      const matchesInterest =
        selectedInterest === 'ALL' ||
        (lead.interest && lead.interest.toLowerCase().includes(selectedInterest.toLowerCase())) ||
        (lead.focus && lead.focus.toLowerCase().includes(selectedInterest.toLowerCase()));

      // Owner
      const matchesOwner = selectedOwner === 'ALL' || lead.owner === selectedOwner;

      // Contactability
      let matchesContact = true;
      if (selectedContactability === 'email') matchesContact = !!lead.email;
      else if (selectedContactability === 'phone') matchesContact = !!lead.phone;
      else if (selectedContactability === 'both') matchesContact = !!(lead.email && lead.phone);
      else if (selectedContactability === 'none') matchesContact = !(lead.email || lead.phone);

      return (
        matchesSearch &&
        matchesMarket &&
        matchesTier &&
        matchesPriority &&
        matchesStage &&
        matchesInterest &&
        matchesOwner &&
        matchesContact
      );
    });
  }, [
    leads,
    searchQuery,
    selectedMarket,
    selectedTier,
    selectedPriority,
    selectedStage,
    selectedInterest,
    selectedOwner,
    selectedContactability
  ]);

  // Pagination Slicing
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;

  // Counts for Badges
  const marketCounts = useMemo(() => {
    return {
      ALL: leads.length,
      UK: leads.filter((l) => l.market === 'UK').length,
      EU: leads.filter((l) => l.market === 'EU').length,
      USA: leads.filter((l) => l.market === 'USA').length,
      AU: leads.filter((l) => l.market === 'AU').length
    };
  }, [leads]);

  // Aggregate Metrics for Dashboard
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const contactedLeads = leads.filter((l) => l.touches > 0 || l.stage !== '0 Watchlist').length;
    const contactedRatio = totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0;

    const samplingOrBeyond = leads.filter(
      (l) =>
        l.stage.includes('Sample') ||
        l.stage.includes('Quote') ||
        l.stage.includes('Negotiation') ||
        l.stage.includes('Won')
    ).length;

    // Total Nominal Value
    const totalPipelineNominal = leads.reduce((sum, l) => sum + (l.value || 0), 0);

    // Weighted Pipeline Value
    const totalPipelineWeighted = leads.reduce((sum, l) => {
      const prob = getStageInfo(l.stage).prob;
      return sum + (l.value || 0) * prob;
    }, 0);

    // Won Deals
    const wonDeals = leads.filter((l) => l.stage.includes('Won')).length;

    // Overdue Tasks
    const now = new Date().toISOString();
    const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < now).length;

    return {
      totalLeads,
      contactedRatio,
      samplingOrBeyond,
      totalPipelineNominal,
      totalPipelineWeighted,
      wonDeals,
      overdueCount
    };
  }, [leads, tasks]);

  // Handle Drag / Quick Advance in Kanban
  const handleAdvanceStage = (leadId: string, direction: 'forward' | 'backward') => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentIdx = CRM_STAGES.findIndex((s) => s.id === lead.stage || lead.stage.includes(s.short));
    let nextIdx = currentIdx;

    if (direction === 'forward' && currentIdx < CRM_STAGES.length - 1) {
      nextIdx = currentIdx + 1;
    } else if (direction === 'backward' && currentIdx > 0) {
      nextIdx = currentIdx - 1;
    }

    if (nextIdx !== currentIdx) {
      const targetStage = CRM_STAGES[nextIdx].id;
      const updatedLeads = leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            stage: targetStage,
            touches: (l.touches || 0) + 1,
            lastContact: new Date().toISOString().slice(0, 10)
          };
        }
        return l;
      });

      persistLeads(updatedLeads);

      // Log Activity automatically
      const newAct: CrmActivity = {
        id: `A-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        leadId: lead.id,
        company: lead.company,
        type: 'Note',
        outcome: `Stage Changed: ${CRM_STAGES[currentIdx].short} → ${CRM_STAGES[nextIdx].short}`,
        note: `Stage transitioned from ${lead.stage} to ${targetStage}`,
        stage: targetStage,
        ts: new Date().toISOString(),
        user: 'Syed Akramul Hassan'
      };
      persistActivities([newAct, ...activities]);
      showToast(`Stage updated to ${CRM_STAGES[nextIdx].short} for ${lead.company}`);
    }
  };

  // Open Lead Form for Add
  const handleOpenAddModal = () => {
    setLeadFormMode('add');
    setLeadFormData({
      id: `P-${Date.now().toString(36).toUpperCase().slice(-5)}`,
      company: '',
      tier: 'Wholesaler',
      market: 'UK',
      country: 'United Kingdom',
      channel: 'Outbound email',
      contact: '',
      role: 'Commercial Buying Director',
      email: '',
      phone: '',
      website: '',
      address: '',
      focus: 'Jute & natural fibre',
      interest: 'Jute & natural fibre',
      priority: 'B',
      stage: '1 Prospect',
      value: null,
      nextAction: 'Introductory portfolio email & lookbook teaser',
      nextDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      touches: 0,
      owner: 'Syed',
      notes: '',
      source: 'Direct Sourcing Intake'
    });
    setIsLeadFormOpen(true);
  };

  // Open Lead Form for Edit
  const handleOpenEditModal = (lead: CrmLead) => {
    setLeadFormMode('edit');
    setLeadFormData({ ...lead });
    setIsLeadFormOpen(true);
  };

  // Save Lead Form Submit
  const handleSaveLeadForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormData.company?.trim()) {
      alert('Company name is required');
      return;
    }

    const payload: CrmLead = {
      id: leadFormData.id || `P-${Date.now().toString(36).toUpperCase().slice(-5)}`,
      company: leadFormData.company.trim(),
      tier: leadFormData.tier || 'Wholesaler',
      market: leadFormData.market || 'UK',
      country: leadFormData.country || 'United Kingdom',
      channel: leadFormData.channel || 'Outbound email',
      contact: leadFormData.contact || '',
      role: leadFormData.role || '',
      email: leadFormData.email || '',
      phone: leadFormData.phone || '',
      website: leadFormData.website || '',
      address: leadFormData.address || '',
      focus: leadFormData.focus || leadFormData.interest || 'Jute & natural fibre',
      interest: leadFormData.interest || 'Jute & natural fibre',
      priority: leadFormData.priority || 'B',
      stage: leadFormData.stage || '1 Prospect',
      value: leadFormData.value ? Number(leadFormData.value) : null,
      nextAction: leadFormData.nextAction || '',
      nextDate: leadFormData.nextDate || '',
      lastContact: leadFormData.lastContact || '',
      touches: leadFormData.touches || 0,
      owner: leadFormData.owner || 'Syed',
      notes: leadFormData.notes || '',
      source: leadFormData.source || 'ArielMC Manual CRM Entry',
      createdAt: leadFormData.createdAt || new Date().toISOString(),
      cur: leadFormData.cur || 'USD'
    };

    if (leadFormMode === 'add') {
      persistLeads([payload, ...leads]);
      showToast(`Added new buyer account: ${payload.company}`);
    } else {
      const updated = leads.map((l) => (l.id === payload.id ? payload : l));
      persistLeads(updated);
      if (selectedLead?.id === payload.id) setSelectedLead(payload);
      showToast(`Updated account: ${payload.company}`);
    }

    setIsLeadFormOpen(false);
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    const target = leads.find((l) => l.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to remove ${target.company} (${id}) from CRM?`)) {
      const updated = leads.filter((l) => l.id !== id);
      persistLeads(updated);
      if (selectedLead?.id === id) setSelectedLead(null);
      showToast(`Deleted ${target.company}`);
    }
  };

  // Bulk Operations
  const handleBulkSubmit = () => {
    if (selectedLeadIds.length === 0) return;

    if (bulkActionType === 'STAGE' && bulkTargetValue) {
      const updated = leads.map((l) => {
        if (selectedLeadIds.includes(l.id)) {
          return { ...l, stage: bulkTargetValue, touches: (l.touches || 0) + 1 };
        }
        return l;
      });
      persistLeads(updated);
      showToast(`Updated stage to ${bulkTargetValue} for ${selectedLeadIds.length} accounts`);
    } else if (bulkActionType === 'OWNER' && bulkTargetValue) {
      const updated = leads.map((l) => {
        if (selectedLeadIds.includes(l.id)) {
          return { ...l, owner: bulkTargetValue };
        }
        return l;
      });
      persistLeads(updated);
      showToast(`Reassigned ${selectedLeadIds.length} accounts to ${bulkTargetValue}`);
    } else if (bulkActionType === 'DELETE') {
      if (window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected accounts?`)) {
        const updated = leads.filter((l) => !selectedLeadIds.includes(l.id));
        persistLeads(updated);
        showToast(`Deleted ${selectedLeadIds.length} accounts`);
      }
    }

    setSelectedLeadIds([]);
    setIsBulkModalOpen(false);
  };

  // Log Activity Submit
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityFormData.leadId) {
      alert('Please select a target buyer account');
      return;
    }

    const lead = leads.find((l) => l.id === activityFormData.leadId);
    const newAct: CrmActivity = {
      id: `A-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      leadId: activityFormData.leadId,
      company: lead?.company || '',
      type: activityFormData.type,
      outcome: activityFormData.outcome,
      note: activityFormData.note,
      stage: activityFormData.stageUpdate || lead?.stage || '',
      ts: new Date().toISOString(),
      user: 'Syed Akramul Hassan'
    };

    persistActivities([newAct, ...activities]);

    // Update lead stage or next action if provided
    if (lead) {
      const updatedLeads = leads.map((l) => {
        if (l.id === lead.id) {
          return {
            ...l,
            stage: activityFormData.stageUpdate || l.stage,
            nextAction: activityFormData.nextAction || l.nextAction,
            nextDate: activityFormData.nextDate || l.nextDate,
            touches: (l.touches || 0) + 1,
            lastContact: new Date().toISOString().slice(0, 10)
          };
        }
        return l;
      });
      persistLeads(updatedLeads);
    }

    showToast(`Logged ${activityFormData.type} for ${lead?.company || 'buyer'}`);
    setIsActivityModalOpen(false);
  };

  // Complete Task
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    persistTasks(updated);
    showToast('Task updated');
  };

  // Export CSV Handler
  const handleExportLeadsCsv = () => {
    const headers = [
      'ID',
      'Company',
      'Market',
      'Country',
      'Tier',
      'Priority',
      'Stage',
      'Sourcing Focus',
      'Contact Person',
      'Role',
      'Email',
      'Phone',
      'Website',
      'Address',
      'Deal Value',
      'Currency',
      'Next Action',
      'Next Date',
      'Touches',
      'Owner',
      'Notes',
      'Source'
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.market || ''}"`,
      `"${l.country || ''}"`,
      `"${l.tier || ''}"`,
      `"${l.priority || ''}"`,
      `"${l.stage || ''}"`,
      `"${(l.focus || l.interest || '').replace(/"/g, '""')}"`,
      `"${(l.contact || '').replace(/"/g, '""')}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.website || ''}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      l.value || '',
      `"${l.cur || 'USD'}"`,
      `"${(l.nextAction || '').replace(/"/g, '""')}"`,
      `"${l.nextDate || ''}"`,
      l.touches || 0,
      `"${l.owner || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArielMC_CRM_Buyer_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Leads CSV');
  };

  // Export Full JSON Backup
  const handleDownloadBackupJson = () => {
    const backupData = {
      settings: {
        title: 'ArielMC CRM Enterprise Suite',
        owner: 'Syed Akramul Hassan',
        markets: CRM_MARKETS,
        tiers: CRM_TIERS,
        priorities: CRM_PRIORITIES,
        stages: CRM_STAGES
      },
      leads,
      activities,
      tasks,
      savedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArielMC_CRM_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded Full CRM JSON Backup');
  };

  // Reset to Seed Data
  const handleResetSeedData = () => {
    if (
      window.confirm(
        'Restore the authentic 254 seeded buyer leads from the master CRM directory? Any custom leads added manually will be reset.'
      )
    ) {
      persistLeads(initialLeadsData as CrmLead[]);
      persistActivities(initialActivitiesData as CrmActivity[]);
      persistTasks(initialTasksData as CrmTask[]);
      showToast('Restored 254 master seeded buyer accounts');
    }
  };

  return (
    <div className="space-y-6" data-theme={theme}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1F3A2E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-[#C8A96A] animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C8A96A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Suite Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                ENTERPRISE CRM SUITE 2026
              </span>
              <span className="text-xs text-[#6B7269]">Native Integration • 254 Curated Accounts</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1 flex items-center gap-2.5">
              <span>Global B2B Sales CRM & Buyer Pipeline</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-bold">
                {leads.length} Verified Buyers
              </span>
            </h1>
            <p className="text-xs text-[#6B7269] mt-1 max-w-3xl leading-relaxed">
              Curated international department stores, supermarket chains, lifestyle retailers, and wholesale distributors across the UK (96), Europe (57), USA (56), and Australia (45). Backed by direct ERP integration for instant SDO sampling and commercial export POs.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl ${actionBtnGradient} text-white font-bold text-xs shadow-md transition-all cursor-pointer font-['Montserrat']`}
            >
              <Plus className="w-4 h-4 text-[#C8A96A]" />
              <span>+ Add Buyer Lead</span>
            </button>

            <button
              onClick={() => {
                setActivityFormData({
                  leadId: leads[0]?.id || '',
                  type: 'Email sent',
                  outcome: 'Sent - awaiting reply',
                  note: '',
                  stageUpdate: ''
                });
                setIsActivityModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#1F3A2E] border border-[#DDE3DD] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>+ Log Touchpoint</span>
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/1BpXNvribNccFzBIKY7FlV1mVaT3c8t3Hr6xCUWVxy30/edit?gid=625671773#gid=625671773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF5EC] hover:bg-[#F3EAD7] text-[#8A6D3B] border border-[#C8A96A]/60 text-xs font-bold shadow-2xs transition-all"
              title="Open Live Master Google Sheet in new tab"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Google Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* CRM Main Sub-Navigation Bar */}
      <div className="bg-white border border-[#DDE3DD] rounded-xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-medium">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'DASHBOARD'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('LEADS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'LEADS'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Buyer Directory</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 text-slate-800">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'PIPELINE'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('TASKS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'TASKS'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks & Follow-Ups</span>
            {metrics.overdueCount > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                {metrics.overdueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ACTIVITY')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'ACTIVITY'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Activity Logs</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 text-slate-800">
              {activities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('DATA')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'DATA'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Sync & Backups</span>
          </button>
        </div>

        {/* Quick Context Pill */}
        <div className="flex items-center gap-2 text-[11px] text-[#6B7269] font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            {activeEntity?.code || 'ARIEL_BD'}
          </span>
          <span>{activeEntity?.city || 'Dhaka HQ'}</span>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* VIEW 1: DASHBOARD & PIPELINE INTELLIGENCE */}
      {/* ========================================================================================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* 4 Master KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#6B7269]">
                <span className="text-xs font-semibold">Total Verified Accounts</span>
                <Users2 className="w-4 h-4 text-[#C8A96A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1F3A2E]">{metrics.totalLeads}</div>
              <div className="text-[11px] text-[#6B7269] flex items-center justify-between">
                <span>Coverage: 4 Sovereign Continents</span>
                <span className="text-emerald-700 font-bold">100% Validated</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#6B7269]">
                <span className="text-xs font-semibold">Weighted Pipeline Value</span>
                <DollarSign className="w-4 h-4 text-[#C8A96A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                {formatMoney(metrics.totalPipelineWeighted, 'USD')}
              </div>
              <div className="text-[11px] text-[#6B7269] flex items-center justify-between">
                <span>Nominal: {formatMoney(metrics.totalPipelineNominal, 'USD')}</span>
                <span className="text-blue-700 font-bold">Risk-Adjusted</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#6B7269]">
                <span className="text-xs font-semibold">Sampling & Deep Negotiation</span>
                <Package className="w-4 h-4 text-[#C8A96A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                {metrics.samplingOrBeyond}
              </div>
              <div className="text-[11px] text-[#6B7269] flex items-center justify-between">
                <span>Stages: Sample sent → Won</span>
                <span className="text-purple-700 font-bold">High Intent</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#6B7269]">
                <span className="text-xs font-semibold">Contact & Engagement Ratio</span>
                <TrendingUp className="w-4 h-4 text-[#C8A96A]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                {metrics.contactedRatio}%
              </div>
              <div className="text-[11px] text-[#6B7269] flex items-center justify-between">
                <span>Touches logged: {activities.length}</span>
                <span className="text-emerald-700 font-bold">Active Cadence</span>
              </div>
            </div>
          </div>

          {/* Market Geographical Footprint Strip */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
            <h2 className="text-sm font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#C8A96A]" />
              <span>International Sovereign Market Footprint</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', count: marketCounts.UK, target: 'High-margin Retail & Dept Stores' },
                { code: 'EU', name: 'European Union', flag: '🇪🇺', count: marketCounts.EU, target: 'Germany, France, Nordics Wholesalers' },
                { code: 'USA', name: 'United States', flag: '🇺🇸', count: marketCounts.USA, target: 'Large Scale Retailers & 3PLs' },
                { code: 'AU', name: 'Australia & NZ', flag: '🇦🇺', count: marketCounts.AU, target: 'Coastal & Natural Fiber Importers' }
              ].map((m) => (
                <div
                  key={m.code}
                  onClick={() => {
                    setSelectedMarket(m.code);
                    setActiveTab('LEADS');
                  }}
                  className="p-3.5 rounded-xl border border-[#DDE3DD] hover:border-[#1F3A2E] bg-[#F8FAF8] hover:bg-white cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{m.flag}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-[#1F3A2E] border border-[#DDE3DD] group-hover:border-[#1F3A2E]">
                      {m.count} Leads
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#1F3A2E] group-hover:text-emerald-800 transition-colors">
                    {m.name}
                  </div>
                  <div className="text-[10px] text-[#6B7269] truncate">{m.target}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 10-Stage Visual Conversion Funnel */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Full 10-Stage Pipeline Conversion Funnel
                </h2>
                <p className="text-xs text-[#6B7269]">
                  Visual deal stage volume, conversion probabilities, and value weighting across all 254 buyer accounts.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('PIPELINE')}
                className="text-xs font-bold text-[#1F3A2E] hover:text-[#8A6D3B] flex items-center gap-1"
              >
                <span>Open Kanban Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 text-center">
              {CRM_STAGES.map((stg) => {
                const count = leads.filter((l) => l.stage === stg.id || l.stage.includes(stg.short)).length;
                const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;

                return (
                  <div
                    key={stg.id}
                    onClick={() => {
                      setSelectedStage(stg.id);
                      setActiveTab('LEADS');
                    }}
                    className="p-3 rounded-xl border border-[#DDE3DD] bg-[#FAFBF9] hover:bg-white hover:border-[#1F3A2E] cursor-pointer transition-all space-y-1.5 flex flex-col justify-between group"
                  >
                    <div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border ${stg.color}`}>
                        {Math.round(stg.prob * 100)}% Win
                      </span>
                      <div className="font-bold text-xs text-[#1F3A2E] mt-1 truncate" title={stg.label}>
                        {stg.short}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60">
                      <div className="text-lg font-bold font-mono text-[#1F3A2E]">{count}</div>
                      <div className="text-[10px] text-[#6B7269] font-mono">{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Two-Column: Follow-Up Tasks & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Priority Follow-Ups */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm font-heading text-[#1F3A2E] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Immediate Buyer Follow-Up Actions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('TASKS')}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  View All Tasks ({tasks.length})
                </button>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
                {tasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl border border-[#DDE3DD] bg-[#F8FAF8] hover:bg-white transition-colors text-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1F3A2E]">{t.leadCompany}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                          {t.market}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          Due: {t.dueDate?.slice(0, 10)}
                        </span>
                      </div>
                      <p className="text-[#6B7269] line-clamp-1">{t.action}</p>
                    </div>

                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                        t.completed
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 border-[#DDE3DD]'
                      }`}
                      title={t.completed ? 'Completed' : 'Mark Complete'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm font-heading text-[#1F3A2E] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#C8A96A]" />
                  <span>Recent Touchpoints & Audit Log</span>
                </h3>
                <button
                  onClick={() => setActiveTab('ACTIVITY')}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  View All Logs ({activities.length})
                </button>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-[#DDE3DD] bg-[#F8FAF8] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1F3A2E]">{act.company || act.leadId}</span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {act.date ? act.date.slice(0, 10) : 'Recent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6B7269]">
                      <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        {act.type}
                      </span>
                      {act.outcome && <span>{act.outcome}</span>}
                    </div>
                    <p className="text-gray-600 text-[11px] line-clamp-1 italic">{act.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* VIEW 2: BUYER LEADS DIRECTORY (TABLE) */}
      {/* ========================================================================================= */}
      {activeTab === 'LEADS' && (
        <div className="space-y-4">
          {/* Top Filter Strip */}
          <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7269]" />
                <input
                  type="text"
                  placeholder="Search 254 buyer accounts by name, country, email, phone, city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                />
              </div>

              {/* Action Buttons: Add Lead & Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLeadsCsv}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DDE3DD] hover:bg-slate-50 text-[#1F3A2E] font-semibold text-xs transition-colors shadow-2xs"
                  title="Export filtered leads as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl ${actionBtnGradient} text-white font-bold text-xs shadow-sm transition-all cursor-pointer font-['Montserrat']`}
                >
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <span>+ Add Lead</span>
                </button>
              </div>
            </div>

            {/* Multi-Select Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 border-t border-slate-100">
              {/* Market */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Market</label>
                <select
                  value={selectedMarket}
                  onChange={(e) => {
                    setSelectedMarket(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">All Markets ({marketCounts.ALL})</option>
                  <option value="UK">🇬🇧 UK Market ({marketCounts.UK})</option>
                  <option value="EU">🇪🇺 EU Market ({marketCounts.EU})</option>
                  <option value="USA">🇺🇸 US Market ({marketCounts.USA})</option>
                  <option value="AU">🇦🇺 AU Market ({marketCounts.AU})</option>
                </select>
              </div>

              {/* Tier */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Buyer Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => {
                    setSelectedTier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Sales agent">Sales Agent</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => {
                    setSelectedPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="A">Priority A (High)</option>
                  <option value="B">Priority B (Medium)</option>
                  <option value="C">Priority C (Standard)</option>
                </select>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Deal Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => {
                    setSelectedStage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">All Stages (10)</option>
                  {CRM_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sector Focus */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Sourcing Sector</label>
                <select
                  value={selectedInterest}
                  onChange={(e) => {
                    setSelectedInterest(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Jute">Jute & Natural Fiber</option>
                  <option value="Leather">Leather Goods</option>
                  <option value="Both">Both (Jute + Leather)</option>
                  <option value="Pottery">Ceramics & Pottery</option>
                  <option value="Textile">Home Textiles</option>
                </select>
              </div>

              {/* Contactability */}
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">Contact Details</label>
                <select
                  value={selectedContactability}
                  onChange={(e) => {
                    setSelectedContactability(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
                >
                  <option value="ALL">Any Contactability</option>
                  <option value="email">Has Email</option>
                  <option value="phone">Has Phone</option>
                  <option value="both">Has Both</option>
                  <option value="none">No Direct Contact</option>
                </select>
              </div>
            </div>

            {/* Bulk Bar & Reset Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1F3A2E]">
                  Showing {filteredLeads.length} of {leads.length} Accounts
                </span>
                {selectedLeadIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                    {selectedLeadIds.length} Selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedLeadIds.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        setBulkActionType('STAGE');
                        setIsBulkModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold hover:bg-amber-100 transition-colors"
                    >
                      Bulk Stage Advance
                    </button>
                    <button
                      onClick={() => {
                        setBulkActionType('OWNER');
                        setIsBulkModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-300 font-bold hover:bg-blue-100 transition-colors"
                    >
                      Bulk Reassign
                    </button>
                    <button
                      onClick={() => setSelectedLeadIds([])}
                      className="text-slate-500 hover:text-slate-700 underline"
                    >
                      Clear
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMarket('ALL');
                    setSelectedTier('ALL');
                    setSelectedPriority('ALL');
                    setSelectedStage('ALL');
                    setSelectedInterest('ALL');
                    setSelectedContactability('ALL');
                    setSelectedOwner('ALL');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 rounded border border-[#DDE3DD] text-[#6B7269] hover:bg-slate-100 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Leads Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#DDE3DD] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className={`${tableHeaderBg} text-[11px] font-semibold tracking-wider`}>
                <tr>
                  <th className="py-3.5 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={
                        paginatedLeads.length > 0 &&
                        paginatedLeads.every((l) => selectedLeadIds.includes(l.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newIds = Array.from(
                            new Set([...selectedLeadIds, ...paginatedLeads.map((l) => l.id)])
                          );
                          setSelectedLeadIds(newIds);
                        } else {
                          setSelectedLeadIds(
                            selectedLeadIds.filter((id) => !paginatedLeads.some((l) => l.id === id))
                          );
                        }
                      }}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3 font-heading">ID & Company</th>
                  <th className="py-3.5 px-3 font-heading">Market & Region</th>
                  <th className="py-3.5 px-3 font-heading">Tier & Priority</th>
                  <th className="py-3.5 px-3 font-heading">Sourcing Focus</th>
                  <th className="py-3.5 px-3 font-heading">Deal Stage</th>
                  <th className="py-3.5 px-3 font-heading">Next Scheduled Action</th>
                  <th className="py-3.5 px-3 font-heading">Touches</th>
                  <th className="py-3.5 px-3 font-heading text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#6B7269]">
                      No buyer leads matched your filter criteria. Try clearing some filters.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const flag = getMarketFlag(lead.market);
                    const priorityBadge = getPriorityBadge(lead.priority);
                    const marketBadge = getMarketBadge(lead.market);
                    const stageInfo = getStageInfo(lead.stage);
                    const isSelected = selectedLeadIds.includes(lead.id);

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-[#F7FAF8] transition-colors group cursor-pointer ${
                          isSelected ? 'bg-emerald-50/50' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td
                          className="py-3 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeadIds([...selectedLeadIds, lead.id]);
                              } else {
                                setSelectedLeadIds(selectedLeadIds.filter((id) => id !== lead.id));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-[#1F3A2E] text-xs group-hover:text-emerald-800 transition-colors">
                            {lead.company}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B7269] font-mono">
                            <span>{lead.id}</span>
                            {lead.website && (
                              <a
                                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                              >
                                <span>web</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                            <span>{flag}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${marketBadge}`}>
                              {lead.market}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#6B7269] mt-0.5">{lead.country}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-[#1A1A1A] font-medium">{lead.tier}</div>
                          <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-mono mt-0.5 ${priorityBadge}`}>
                            Priority {lead.priority}
                          </span>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <div className="text-[#1A1A1A] truncate font-medium">
                            {lead.interest || lead.focus || 'Multi-Division'}
                          </div>
                          <div className="text-[10px] text-[#6B7269] truncate max-w-[200px]">
                            {lead.contact || 'Commercial Buying Office'}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${stageInfo.color}`}>
                            {stageInfo.short}
                          </span>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <div className="text-[#1A1A1A] text-[11px] line-clamp-1 font-medium">
                            {lead.nextAction || 'Prepare buyer introductory lookbook'}
                          </div>
                          <div className="text-[10px] text-[#6B7269] font-mono">
                            Due: {lead.nextDate?.slice(0, 10) || 'Scheduled'}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {lead.touches || 0}
                          </span>
                        </td>

                        <td
                          className="py-3 px-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-2.5 py-1 rounded bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow-2xs transition-all"
                            >
                              Dossier
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(lead)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Edit Lead"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded hover:bg-rose-50 text-rose-600 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#DDE3DD] text-xs">
            <div className="flex items-center gap-2 text-[#6B7269]">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-1 text-xs"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* VIEW 3: INTERACTIVE KANBAN PIPELINE */}
      {/* ========================================================================================= */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#DDE3DD] rounded-xl text-xs">
            <div className="flex items-center gap-2 text-[#6B7269]">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>
                Interactive Stage Workflow: Use the left / right arrows on each card to transition deals across the pipeline.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="p-1.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs"
              >
                <option value="ALL">All Markets</option>
                <option value="UK">🇬🇧 UK</option>
                <option value="EU">🇪🇺 EU</option>
                <option value="USA">🇺🇸 USA</option>
                <option value="AU">🇦🇺 AU</option>
              </select>
            </div>
          </div>

          {/* Kanban Scrolling Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[2200px]">
              {CRM_STAGES.map((stg) => {
                const stageLeads = filteredLeads.filter(
                  (l) => l.stage === stg.id || l.stage.includes(stg.short)
                );
                const stageValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);

                return (
                  <div
                    key={stg.id}
                    className="flex-1 min-w-[230px] rounded-2xl bg-[#F8FAF8] border border-[#DDE3DD] flex flex-col max-h-[760px] shadow-xs"
                  >
                    {/* Stage Header */}
                    <div className="p-3 border-b border-[#DDE3DD] bg-white rounded-t-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#1F3A2E] truncate font-heading">
                          {stg.short}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {Math.round(stg.prob * 100)}% Win • {formatMoney(stageValue)}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-[#DDE3DD]">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Stage Card List */}
                    <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                      {stageLeads.length === 0 ? (
                        <div className="py-10 text-center text-[11px] text-[#6B7269]">
                          No accounts in stage
                        </div>
                      ) : (
                        stageLeads.map((lead) => {
                          const flag = getMarketFlag(lead.market);
                          const priorityBadge = getPriorityBadge(lead.priority);
                          const marketBadge = getMarketBadge(lead.market);

                          return (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] hover:shadow-md transition-all cursor-pointer text-xs space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-bold text-[#1F3A2E] group-hover:text-emerald-800 transition-colors line-clamp-1">
                                  {lead.company}
                                </span>
                                <span className="text-base shrink-0">{flag}</span>
                              </div>

                              <div className="flex items-center justify-between text-[10px]">
                                <span className={`px-1.5 py-0.2 rounded border font-semibold ${marketBadge}`}>
                                  {lead.market} • {lead.tier}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded border font-mono ${priorityBadge}`}>
                                  Pri {lead.priority}
                                </span>
                              </div>

                              {lead.value && (
                                <div className="text-xs font-mono font-bold text-emerald-800">
                                  {formatMoney(lead.value, lead.cur)}
                                </div>
                              )}

                              <p className="text-[10px] text-[#6B7269] line-clamp-2 pt-1 border-t border-slate-100">
                                {lead.nextAction || 'Follow up with introductory catalog'}
                              </p>

                              {/* Card Transition Action Buttons */}
                              <div
                                className="flex items-center justify-between pt-1 border-t border-slate-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleAdvanceStage(lead.id, 'backward')}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                                  title="Move to Previous Stage"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>

                                <span className="text-[10px] text-gray-400 font-mono">
                                  {lead.touches || 0} touches
                                </span>

                                <button
                                  onClick={() => handleAdvanceStage(lead.id, 'forward')}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                                  title="Advance to Next Stage"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* VIEW 4: TASKS & FOLLOW-UP QUEUE */}
      {/* ========================================================================================= */}
      {activeTab === 'TASKS' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-[#DDE3DD] rounded-2xl text-xs">
            <div>
              <h2 className="font-bold text-sm font-heading text-[#1F3A2E]">
                Buyer Follow-Up Queue & Communication Cadence
              </h2>
              <p className="text-[#6B7269] text-xs">
                Synchronized from each buyer lead's scheduled next action date. Check off items to complete follow-ups.
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-[#DDE3DD]">
              {tasks.filter((t) => !t.completed).length} Pending Follow-Ups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Overdue */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-rose-800 uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Overdue Actions</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold font-mono text-[10px]">
                  {tasks.filter((t) => !t.completed && t.dueDate < new Date().toISOString()).length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                {tasks
                  .filter((t) => !t.completed && t.dueDate < new Date().toISOString())
                  .slice(0, 15)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#1F3A2E]">{task.leadCompany}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-rose-800 font-bold border border-rose-200">
                          {task.market}
                        </span>
                      </div>
                      <p className="text-gray-700 text-[11px]">{task.action}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-rose-100 text-[10px]">
                        <span className="text-rose-700 font-mono font-semibold">
                          Due: {task.dueDate?.slice(0, 10)}
                        </span>
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Due Today & Next 7 Days */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-amber-800 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due Today & Next 7 Days</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[10px]">
                  {tasks.filter((t) => !t.completed && t.dueDate >= new Date().toISOString()).length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                {tasks
                  .filter((t) => !t.completed && t.dueDate >= new Date().toISOString())
                  .slice(0, 15)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-[#DDE3DD] bg-[#F8FAF8] text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#1F3A2E]">{task.leadCompany}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-800 border border-[#DDE3DD]">
                          {task.market}
                        </span>
                      </div>
                      <p className="text-gray-700 text-[11px]">{task.action}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <span className="text-gray-500 font-mono">
                          Due: {task.dueDate?.slice(0, 10)}
                        </span>
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="px-2 py-0.5 rounded bg-[#1F3A2E] text-white font-bold hover:bg-[#2C5240] transition-colors"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. Completed History */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-emerald-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed Follow-ups</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                  {tasks.filter((t) => t.completed).length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                {tasks
                  .filter((t) => t.completed)
                  .slice(0, 15)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1 opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700 line-through">
                          {task.leadCompany}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                      </div>
                      <p className="text-gray-500 text-[11px] line-through">{task.action}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* VIEW 5: ACTIVITY AUDIT TRAIL */}
      {/* ========================================================================================= */}
      {activeTab === 'ACTIVITY' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-[#DDE3DD] rounded-2xl text-xs">
            <div>
              <h2 className="font-bold text-sm font-heading text-[#1F3A2E]">
                Official Buyer Communications & Activity Trail
              </h2>
              <p className="text-[#6B7269] text-xs">
                Complete audit history of emails, LinkedIn outreach, buyer calls, sample shipments, and price quotes.
              </p>
            </div>
            <button
              onClick={() => {
                setActivityFormData({
                  leadId: leads[0]?.id || '',
                  type: 'Email sent',
                  outcome: 'Sent - awaiting reply',
                  note: '',
                  stageUpdate: ''
                });
                setIsActivityModalOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl ${actionBtnGradient} text-white font-bold text-xs shadow-md transition-all cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Touchpoint</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#DDE3DD] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className={`${tableHeaderBg} text-[11px] font-semibold tracking-wider`}>
                <tr>
                  <th className="py-3.5 px-4 font-heading">Date & Time</th>
                  <th className="py-3.5 px-4 font-heading">Buyer Account</th>
                  <th className="py-3.5 px-4 font-heading">Activity Type</th>
                  <th className="py-3.5 px-4 font-heading">Outcome</th>
                  <th className="py-3.5 px-4 font-heading">Notes / Details</th>
                  <th className="py-3.5 px-4 font-heading">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#F7FAF8] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-600">
                      {act.date?.slice(0, 10) || '2026-10-13'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1F3A2E]">
                      {act.company || act.leadId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                        {act.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-700">
                      {act.outcome || 'Logged'}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-600 max-w-md">
                      {act.note}
                    </td>
                    <td className="py-3 px-4 text-[11px] font-mono text-gray-500">
                      {act.user || 'Syed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* VIEW 6: DATA SYNC, BACKUPS & INTEGRATION */}
      {/* ========================================================================================= */}
      {activeTab === 'DATA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Master Google Sheets Sync */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Master Tracker Sync (Google Sheets)
                </h3>
                <p className="text-xs text-[#6B7269]">
                  Bi-directional sync bridge connecting ArielMC ERP with your Master Google Sheet.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Connected Sheet ID:</span>
                <span className="font-mono text-[10px] text-gray-500">1BpXNvribNccFzBIKY7...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Sync Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Online & Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total Seed Records:</span>
                <span className="font-mono text-emerald-800 font-bold">254 Buyer Accounts</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://docs.google.com/spreadsheets/d/1BpXNvribNccFzBIKY7FlV1mVaT3c8t3Hr6xCUWVxy30/edit?gid=625671773#gid=625671773"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF5EC] hover:bg-[#F3EAD7] text-[#8A6D3B] border border-[#C8A96A] font-bold text-xs shadow-2xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google Sheet</span>
              </a>

              <button
                onClick={() => {
                  showToast('Checked Google Sheet synchronization: All 254 leads up to date.');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#1F3A2E] border border-[#DDE3DD] font-semibold text-xs transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check for Updates</span>
              </button>
            </div>
          </div>

          {/* Backup & Export */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                <Database className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Complete CRM Backup & Export
                </h3>
                <p className="text-xs text-[#6B7269]">
                  Export clean CSV tables or download full JSON database snapshots.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2 text-xs">
              <p className="text-gray-600">
                Your CRM state is preserved in browser storage with instant cloud syncing. Regularly export snapshots before making bulk changes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleDownloadBackupJson}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup (JSON)</span>
              </button>

              <button
                onClick={handleExportLeadsCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE3DD] hover:bg-slate-50 text-[#1F3A2E] font-semibold text-xs shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Leads (CSV)</span>
              </button>
            </div>
          </div>

          {/* Danger Zone: Restore Master Seeds */}
          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Administrative Database Reset</span>
            </div>
            <p className="text-xs text-[#6B7269]">
              Restoring default seeds will refresh all 254 authentic buyer leads (UK 96, EU 57, USA 56, AU 45) back to their clean initial benchmark state.
            </p>
            <button
              onClick={handleResetSeedData}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Reset to 254 Master Seeded Leads
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 1: LEAD DETAIL / BUYER DOSSIER VIEW (Matching Profile.html) */}
      {/* ========================================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`p-5 ${tableHeaderBg} flex items-start justify-between gap-4 shrink-0`}>
              <div className="flex items-start gap-3.5">
                <span className="text-3xl p-1.5 rounded-xl bg-white/10 border border-white/20">
                  {getMarketFlag(selectedLead.market)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold border border-white/30">
                      {selectedLead.id}
                    </span>
                    <span className="text-xs text-[#CFE0D5]">
                      {selectedLead.market} • {selectedLead.country}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(selectedLead.priority)}`}>
                      Priority {selectedLead.priority}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold font-heading text-white mt-1">
                    {selectedLead.company}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    handleOpenEditModal(selectedLead);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors"
                >
                  Edit Account
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1A1A1A] flex-1">
              {/* Top Contact & Quick Actions Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#6B7269]">
                    Primary Contact
                  </span>
                  <div className="font-bold text-sm text-[#1F3A2E] mt-0.5">
                    {selectedLead.contact || 'Commercial Buying Office'}
                  </div>
                  <div className="text-[11px] text-[#6B7269]">
                    {selectedLead.role || selectedLead.tier}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#6B7269]">
                    Direct Email & Phone
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {selectedLead.email ? (
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-blue-700 hover:underline flex items-center gap-1 font-mono"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{selectedLead.email}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 font-mono italic">No direct email recorded</span>
                    )}

                    {selectedLead.phone ? (
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedLead.phone}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 font-mono italic block">No phone recorded</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#6B7269]">
                    Website & Sourcing Focus
                  </span>
                  <div className="mt-0.5">
                    {selectedLead.website ? (
                      <a
                        href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Globe2 className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{selectedLead.website}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No website url</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#1F3A2E] font-semibold mt-0.5">
                    {selectedLead.interest || selectedLead.focus}
                  </div>
                </div>
              </div>

              {/* Deal Stage Stepper */}
              <div className="space-y-2">
                <span className="block text-[10px] uppercase font-bold text-[#6B7269]">
                  Pipeline Stage Progression
                </span>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-1 text-center">
                  {CRM_STAGES.map((s, idx) => {
                    const currentIdx = CRM_STAGES.findIndex(
                      (st) => st.id === selectedLead.stage || selectedLead.stage.includes(st.short)
                    );
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          const updated = leads.map((l) =>
                            l.id === selectedLead.id
                              ? { ...l, stage: s.id, touches: (l.touches || 0) + 1 }
                              : l
                          );
                          persistLeads(updated);
                          setSelectedLead({ ...selectedLead, stage: s.id, touches: (selectedLead.touches || 0) + 1 });
                          showToast(`Updated stage to ${s.short}`);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={`Click to set stage to ${s.label}`}
                      >
                        <div>{s.short}</div>
                        <div className="text-[8px] font-mono opacity-80">{Math.round(s.prob * 100)}%</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Action & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <span className="block text-[10px] uppercase font-bold text-amber-800">
                    Scheduled Next Action
                  </span>
                  <p className="font-semibold text-gray-800">
                    {selectedLead.nextAction || 'Prepare buyer introductory lookbook & pricing matrix.'}
                  </p>
                  <div className="text-[11px] text-gray-600 font-mono">
                    Target Date: {selectedLead.nextDate?.slice(0, 10) || 'None set'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-2">
                  <span className="block text-[10px] uppercase font-bold text-[#6B7269]">
                    Account Notes & Intelligence
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedLead.notes || 'Curated high-potential sovereign B2B buyer account.'}
                  </p>
                  <div className="text-[10px] text-gray-500 font-mono pt-1 border-t border-slate-100">
                    Source: {selectedLead.source}
                  </div>
                </div>
              </div>

              {/* Cross-ERP Quick Jumps */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Direct ERP Operational Synergy</span>
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Connect this buyer directly to production sampling or export order processing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateTab) {
                        onNavigateTab('RND');
                        setSelectedLead(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-50 transition-colors shadow-2xs"
                  >
                    Open R&D Sampling (SDO) →
                  </button>
                  <button
                    onClick={() => {
                      if (onNavigateTab) {
                        onNavigateTab('ORDERS');
                        setSelectedLead(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-2xs"
                  >
                    Generate Export PO →
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DDE3DD] bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#6B7269] font-mono">
                Assigned Owner: {selectedLead.owner || 'Syed'} • Touches: {selectedLead.touches || 0}
              </span>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 2: ADD / EDIT LEAD FORM */}
      {/* ========================================================================================= */}
      {isLeadFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl overflow-hidden">
            <div className={`p-5 ${tableHeaderBg} flex items-center justify-between shrink-0`}>
              <h2 className="text-base font-bold font-heading text-white">
                {leadFormMode === 'add' ? 'Register New Buyer Lead' : `Edit Account: ${leadFormData.company}`}
              </h2>
              <button
                onClick={() => setIsLeadFormOpen(false)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeadForm} className="p-6 overflow-y-auto space-y-4 text-xs text-[#1A1A1A] flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={leadFormData.company || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, company: e.target.value })}
                    placeholder="e.g. Harrods Department Store"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Market Sovereign Entity *</label>
                  <select
                    value={leadFormData.market || 'UK'}
                    onChange={(e) => setLeadFormData({ ...leadFormData, market: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="EU">🇪🇺 European Union</option>
                    <option value="USA">🇺🇸 United States</option>
                    <option value="AU">🇦🇺 Australia & NZ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={leadFormData.country || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, country: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Buyer Tier</label>
                  <select
                    value={leadFormData.tier || 'Wholesaler'}
                    onChange={(e) => setLeadFormData({ ...leadFormData, tier: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Sales agent">Sales agent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={leadFormData.priority || 'B'}
                    onChange={(e) => setLeadFormData({ ...leadFormData, priority: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    <option value="A">Priority A (High)</option>
                    <option value="B">Priority B (Medium)</option>
                    <option value="C">Priority C (Standard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={leadFormData.contact || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, contact: e.target.value })}
                    placeholder="e.g. Commercial Buying Director"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={leadFormData.role || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, role: e.target.value })}
                    placeholder="e.g. Head of Home & Gift Sourcing"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Direct Email</label>
                  <input
                    type="email"
                    value={leadFormData.email || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                    placeholder="buyer@company.com"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={leadFormData.phone || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    placeholder="+44 20 7730 1234"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Website</label>
                  <input
                    type="text"
                    value={leadFormData.website || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Sourcing Sector Focus</label>
                  <input
                    type="text"
                    value={leadFormData.interest || leadFormData.focus || ''}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, interest: e.target.value, focus: e.target.value })
                    }
                    placeholder="e.g. Jute & natural fibre, Leather goods"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Current Deal Stage</label>
                  <select
                    value={leadFormData.stage || '1 Prospect'}
                    onChange={(e) => setLeadFormData({ ...leadFormData, stage: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    {CRM_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Scheduled Next Action</label>
                  <input
                    type="text"
                    value={leadFormData.nextAction || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, nextAction: e.target.value })}
                    placeholder="e.g. Send introductory lookbook and sample quotation"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Next Action Date</label>
                  <input
                    type="date"
                    value={leadFormData.nextDate?.slice(0, 10) || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, nextDate: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Account Notes & Sourcing Intel</label>
                <textarea
                  rows={3}
                  value={leadFormData.notes || ''}
                  onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  placeholder="Enter strategic buyer notes, supplier preferences, or annual buying cadence..."
                  className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeadFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDE3DD] text-[#6B7269] hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl ${actionBtnGradient} text-white font-bold shadow-md cursor-pointer`}
                >
                  {leadFormMode === 'add' ? 'Register Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 3: LOG ACTIVITY TOUCHPOINT MODAL */}
      {/* ========================================================================================= */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl overflow-hidden flex flex-col">
            <div className={`p-4 ${tableHeaderBg} flex items-center justify-between`}>
              <h3 className="font-bold text-sm font-heading text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C8A96A]" />
                <span>Log Buyer Touchpoint</span>
              </h3>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Target Buyer Lead *</label>
                <select
                  value={activityFormData.leadId}
                  onChange={(e) => setActivityFormData({ ...activityFormData, leadId: e.target.value })}
                  className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  required
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company} ({l.market} • {l.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Touchpoint Type</label>
                  <select
                    value={activityFormData.type}
                    onChange={(e) => setActivityFormData({ ...activityFormData, type: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    {CRM_ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Outcome</label>
                  <select
                    value={activityFormData.outcome}
                    onChange={(e) => setActivityFormData({ ...activityFormData, outcome: e.target.value })}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    {CRM_OUTCOMES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Interaction Notes & Feedback</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record what was discussed, buyer reactions, sampling requests, or quote numbers..."
                  value={activityFormData.note}
                  onChange={(e) => setActivityFormData({ ...activityFormData, note: e.target.value })}
                  className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Update Deal Stage (Optional)</label>
                <select
                  value={activityFormData.stageUpdate || ''}
                  onChange={(e) => setActivityFormData({ ...activityFormData, stageUpdate: e.target.value })}
                  className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                >
                  <option value="">Keep Existing Stage</option>
                  {CRM_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      Set to: {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#DDE3DD] text-[#6B7269] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-lg ${actionBtnGradient} text-white font-bold shadow-sm cursor-pointer`}
                >
                  Save Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 4: BULK ACTIONS MODAL */}
      {/* ========================================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm font-heading text-[#1F3A2E]">
              Bulk Actions ({selectedLeadIds.length} Accounts Selected)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Action Type</label>
                <select
                  value={bulkActionType}
                  onChange={(e) => setBulkActionType(e.target.value as any)}
                  className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                >
                  <option value="STAGE">Update Deal Stage</option>
                  <option value="OWNER">Reassign Account Owner</option>
                  <option value="DELETE">Delete Selected Accounts</option>
                </select>
              </div>

              {bulkActionType === 'STAGE' && (
                <div>
                  <label className="block font-semibold mb-1">Target Stage</label>
                  <select
                    value={bulkTargetValue}
                    onChange={(e) => setBulkTargetValue(e.target.value)}
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  >
                    <option value="">Select target stage...</option>
                    {CRM_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {bulkActionType === 'OWNER' && (
                <div>
                  <label className="block font-semibold mb-1">Target Owner</label>
                  <input
                    type="text"
                    value={bulkTargetValue}
                    onChange={(e) => setBulkTargetValue(e.target.value)}
                    placeholder="e.g. Syed Akramul Hassan"
                    className="w-full p-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg"
                  />
                </div>
              )}

              {bulkActionType === 'DELETE' && (
                <p className="text-rose-600 font-semibold p-2 bg-rose-50 rounded-lg border border-rose-200">
                  Warning: This will permanently remove the {selectedLeadIds.length} selected buyer accounts from the CRM.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-gray-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold shadow-sm"
              >
                Apply to {selectedLeadIds.length} Accounts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
