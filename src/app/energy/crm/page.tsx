'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_SOLAR_LEADS } from '@/data/crmLeads';
import { SolarLead, LeadStage } from '@/types/crm';
import {
  INITIAL_AREL_LEADS,
  INITIAL_BANK_APPLICATIONS,
  INITIAL_SUBCONTRACTORS,
  INITIAL_SOLAR_PRODUCTS,
  INITIAL_BOM_PACKAGES,
  INITIAL_INVENTORY_LOTS,
  INITIAL_SOLAR_SUPPLIERS,
  INITIAL_SHIPMENTS,
  INITIAL_AFTER_SALES_TICKETS,
  INITIAL_PROJECT_FINANCIALS,
  INITIAL_PLATFORM_SYNC,
} from '@/data/arelCrmData';
import {
  BankLoanStatus,
  TicketStatus,
} from '@/types/arelCrm';

// CRM Module Components
import ExecutiveDashboard from '@/components/crm/ExecutiveDashboard';
import LeadManagement from '@/components/crm/LeadManagement';
import TechnicalControl from '@/components/crm/TechnicalControl';
import NewLeadModal from '@/components/crm/NewLeadModal';
import BankFinancingPipeline from '@/components/crm/BankFinancingPipeline';
import SubcontractorManagement from '@/components/crm/SubcontractorManagement';
import ProductBomVault from '@/components/crm/ProductBomVault';
import InventoryLotTracking from '@/components/crm/InventoryLotTracking';
import SupplierScmControl from '@/components/crm/SupplierScmControl';
import AfterSalesSlaManagement from '@/components/crm/AfterSalesSlaManagement';
import ProjectFinancialControl from '@/components/crm/ProjectFinancialControl';
import QuadPlatformSyncModal from '@/components/crm/QuadPlatformSyncModal';

import {
  Activity,
  Building,
  Landmark,
  ShieldCheck,
  Cpu,
  Boxes,
  Truck,
  Layers,
  Wrench,
  DollarSign,
  Plus,
  Download,
  Share2,
  ArrowUpRight,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

type CrmTab =
  | 'overview'
  | 'leads'
  | 'banking'
  | 'subcontractors'
  | 'technical'
  | 'products'
  | 'inventory'
  | 'suppliers_scm'
  | 'after_sales'
  | 'finance';

interface NavMenuItem {
  id: CrmTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeCol?: string;
}

interface NavMenuSection {
  title: string;
  items: NavMenuItem[];
}

const TAB_METADATA: Record<
  CrmTab,
  { title: string; subtitle: string; icon: React.ElementType }
> = {
  overview: {
    title: 'Executive Command Cockpit',
    subtitle:
      'Strategic C&I Portfolio KPIs, SREDA 2027 Regulatory Countdown & 4-Step Green Debt Pipeline',
    icon: Activity,
  },
  leads: {
    title: 'Industrial Rooftop Lead Control & Conversion',
    subtitle:
      'Sector-wise lead qualification, SREDA 70% sanctioned load cap audit & 1-click Bank Feasibility Dossier',
    icon: Building,
  },
  banking: {
    title: '4.5% Bank Debt Financing Desk (PFI & IDCOL)',
    subtitle:
      'Bangladesh Bank Green Refinance Scheme, 80% debt coverage (DSCR ≥ 1.45x) & milestone disbursements',
    icon: Landmark,
  },
  subcontractors: {
    title: 'IEB Engineering Bodies & Vetted Subcontractors',
    subtitle:
      'Civil mounting, electrical HT/LT substations, 3D LiDAR geomatics & work order assignments',
    icon: ShieldCheck,
  },
  technical: {
    title: 'Technical Substation & Single Line Diagram (SLD)',
    subtitle:
      'HT/LT switchgear, 11kV/33kV transformer sizing, utility interconnection & earthing resistance < 1.0 Ω',
    icon: Cpu,
  },
  products: {
    title: 'Solar Product Master & Standard BOM Vault',
    subtitle:
      'Tier-1 module/inverter specifications, BDS IEC certifications, ASYCUDA HS codes & 25% gross margin BoQs',
    icon: Boxes,
  },
  inventory: {
    title: 'Inventory Staging & Lot Custody Tracking',
    subtitle:
      'Chittagong Port CFS → Central Tongi Warehouse → Factory Rooftop staging with serial custody',
    icon: Truck,
  },
  suppliers_scm: {
    title: 'Supplier Sourcing Vault & SCM Customs Control',
    subtitle:
      'Tier-1 OEM MoUs, Client ERQ USD LCs & ASYCUDA Box 44 SREDA statutory 1.0% duty clearance',
    icon: Layers,
  },
  after_sales: {
    title: 'After-Sales Service SLA & IoT Telemetry',
    subtitle:
      'Tri-party maintenance tickets (Client ↔ Subcontractor ↔ OEM RMA), module washing cycles & PR < 75% alerts',
    icon: Wrench,
  },
  finance: {
    title: 'Project Financial Control, General Ledger & P&L',
    subtitle:
      'Project-wise General Ledger, P&L Statement, Balance Sheet, 25% gross margin lock & milestone billing',
    icon: DollarSign,
  },
};

export default function ArielEnergyCrmPage() {
  const [arelLeads] = useState(INITIAL_AREL_LEADS);
  const [leads, setLeads] = useState<SolarLead[]>(INITIAL_SOLAR_LEADS);
  const [bankApplications, setBankApplications] = useState(INITIAL_BANK_APPLICATIONS);
  const [subcontractors, setSubcontractors] = useState(INITIAL_SUBCONTRACTORS);
  const [products] = useState(INITIAL_SOLAR_PRODUCTS);
  const [bomPackages] = useState(INITIAL_BOM_PACKAGES);
  const [lots, setLots] = useState(INITIAL_INVENTORY_LOTS);
  const [suppliers] = useState(INITIAL_SOLAR_SUPPLIERS);
  const [shipments] = useState(INITIAL_SHIPMENTS);
  const [tickets, setTickets] = useState(INITIAL_AFTER_SALES_TICKETS);
  const [projectAccounts] = useState(INITIAL_PROJECT_FINANCIALS);
  const [syncStatus, setSyncStatus] = useState(INITIAL_PLATFORM_SYNC);

  const [activeTab, setActiveTab] = useState<CrmTab>('overview');
  const [activeLeadForTechId, setActiveLeadForTechId] = useState<string>(
    INITIAL_SOLAR_LEADS[0].id
  );
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // Update lead stage
  const handleUpdateStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );
  };

  // Update technical specs
  const handleUpdateTechnical = (
    leadId: string,
    updatedTech: SolarLead['technical']
  ) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, technical: updatedTech, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );
  };

  // Add new lead
  const handleAddLead = (newLead: SolarLead) => {
    setLeads([newLead, ...leads]);
    setActiveLeadForTechId(newLead.id);
  };

  // Switch to technical for a specific lead
  const handleOpenTechnicalForLead = (lead: SolarLead) => {
    setActiveLeadForTechId(lead.id);
    setActiveTab('technical');
  };

  // Update Bank Status
  const handleUpdateBankStatus = (id: string, newStatus: BankLoanStatus) => {
    setBankApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Trigger Quad-Platform Sync
  const handleTriggerSync = () => {
    setSyncStatus((prev) => ({
      ...prev,
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  // Export Pipeline to CSV
  const handleExportCsv = () => {
    const headers = [
      'Lead ID',
      'Factory Name',
      'Parent Group',
      'Industry Sector',
      'Location',
      'Corridor',
      'Contact Person',
      'Phone',
      'Target Capacity (kWp)',
      'CapEx Value (BDT)',
      'Pipeline Stage',
      'SREDA Status',
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.factoryName}"`,
      `"${l.parentGroup || ''}"`,
      `"${l.industrySector}"`,
      `"${l.location}"`,
      `"${l.corridor}"`,
      `"${l.contactPerson}"`,
      `"${l.phone}"`,
      l.estimatedCapacityKwp,
      l.projectValueBdt,
      `"${l.stage}"`,
      `"${l.technical.sredaApplicationStatus}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ariel_Energy_Pipeline_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nav Menu Sections
  const navSections: NavMenuSection[] = [
    {
      title: 'Command & Pipeline',
      items: [
        { id: 'overview', label: 'Executive Cockpit', icon: Activity, badge: 'Overview' },
        { id: 'leads', label: '1. Lead Control', icon: Building, badge: `${leads.length}` },
        { id: 'banking', label: '2. 4.5% Bank Debt Desk', icon: Landmark, badge: 'IDCOL/PFI' },
      ],
    },
    {
      title: 'Engineering & EPC',
      items: [
        { id: 'subcontractors', label: '3. Subcontractors & IEB', icon: ShieldCheck, badge: `${subcontractors.length}` },
        { id: 'technical', label: '4. Technical & SLD', icon: Cpu, badge: 'HT/LT' },
      ],
    },
    {
      title: 'Commercial & SCM (1–7)',
      items: [
        { id: 'products', label: '5. Product & BOM Vault', icon: Boxes, badge: '25% Mgn' },
        { id: 'inventory', label: '6. Inventory Staging', icon: Truck, badge: `${lots.length} Lots` },
        { id: 'suppliers_scm', label: '7. SCM & Customs', icon: Layers, badge: 'Box 44 1%' },
      ],
    },
    {
      title: 'Operations & Finance',
      items: [
        { id: 'after_sales', label: '8. After-Sales SLA', icon: Wrench, badge: `${tickets.length}` },
        { id: 'finance', label: '9. Project Financials', icon: DollarSign, badge: 'P&L / GL' },
      ],
    },
  ];

  const currentMeta = TAB_METADATA[activeTab];
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans text-slate-800">
      {/* =========================================================================
          LEFT FIXED PANEL (No Scroll, Fixed, Zero horizontal/vertical layout jump)
          ========================================================================= */}
      <aside className="w-64 xl:w-72 bg-[#0A1A2F] text-slate-200 border-r border-[#1B2D45] fixed left-0 top-0 bottom-0 h-screen z-40 flex flex-col justify-between overflow-hidden select-none shadow-xl">
        {/* 1. Header & Brand Wordmark */}
        <div className="p-4 border-b border-[#1B2D45] shrink-0 bg-[#071324]">
          <div className="flex items-center gap-2.5">
            <img
              src="/logos/ariel-energy-icon.png"
              alt="AREL Seal"
              className="w-9 h-9 object-contain drop-shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-black tracking-tight text-white leading-tight truncate">
                Ariel Renewable Energy
              </div>
              <div className="text-[9px] uppercase font-mono tracking-widest text-[#C9A86A] truncate">
                Enterprise OS 2026.1
              </div>
            </div>
          </div>

          {/* Quad Sync Live Pulse Pill */}
          <div className="mt-3 flex items-center justify-between bg-[#0F223D] px-2.5 py-1.5 rounded-lg border border-[#1E375B]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 font-mono">
                Quad-Bus: 4/4 Synced
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSyncModalOpen(true)}
              className="text-[9px] font-mono font-bold text-[#C9A86A] hover:text-amber-300 transition cursor-pointer"
            >
              Sync Details
            </button>
          </div>
        </div>

        {/* 2. Grouped Navigation Menus (Fixed within panel) */}
        <nav className="flex-1 px-3 py-3 space-y-3.5 overflow-y-auto no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-2 mb-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-2.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-[#13253F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{tab.label}</span>
                      </div>

                      {tab.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#183152] text-slate-300'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 3. Quick Action Button inside Sidebar */}
        <div className="px-3 py-2 border-t border-[#1B2D45] shrink-0 bg-[#081527]">
          <button
            type="button"
            onClick={() => setNewLeadModalOpen(true)}
            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Factory Lead</span>
          </button>
        </div>

        {/* 4. Bottom Footer: SREDA Countdown & Ecosystem Portals */}
        <div className="p-3 bg-[#06101D] border-t border-[#1B2D45] shrink-0 text-xs">
          {/* SREDA Countdown Pill */}
          <div className="p-2 rounded-lg bg-[#0C1A2E] border border-[#1C3659] mb-2 text-[10px]">
            <div className="text-amber-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>SREDA Net-Meter Cutoff</span>
              </span>
              <span className="font-mono text-amber-300">Feb 28, 2027</span>
            </div>
            <div className="text-slate-400 text-[9px] mt-0.5">
              Lock Tk 10.50/kWh buyback tariff before policy sunset
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-slate-300">
            <a
              href="https://crm.arielmc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 rounded bg-[#10223A] hover:text-white hover:bg-[#183256] text-center truncate flex items-center justify-center gap-1 border border-[#1B3252] transition"
              title="Open Master-CRM Group Hub"
            >
              <span>Master-CRM</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-amber-400" />
            </a>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2 py-1.5 rounded bg-[#10223A] hover:text-white hover:bg-[#183256] text-center truncate flex items-center justify-center gap-1 border border-[#1B3252] transition cursor-pointer"
              title="Export Full Pipeline to CSV"
            >
              <span>Export CSV</span>
              <Download className="w-2.5 h-2.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WINDOW (Offset by sidebar width, full height scrollable)
          ========================================================================= */}
      <div className="flex-1 ml-64 xl:ml-72 min-h-screen flex flex-col bg-slate-50">
        {/* Main Window Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-[#0A1A2F] tracking-tight truncate">
                  {currentMeta.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  AREL-CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xl">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Right Top Status & Fast Action Toolbar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-mono text-slate-700 border border-slate-200/80">
              <span className="text-slate-400 uppercase text-[10px]">Pipeline:</span>
              <span className="font-bold text-emerald-700">Tk 48.75 Cr</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-slate-900">9.75 MWp</span>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => setNewLeadModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace Body */}
        <main className="p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto space-y-6">
          {activeTab === 'overview' && (
            <ExecutiveDashboard
              leads={arelLeads}
              applications={bankApplications}
              subcontractors={subcontractors}
              products={products}
              bomPackages={bomPackages}
              lots={lots}
              suppliers={suppliers}
              shipments={shipments}
              tickets={tickets}
              accounts={projectAccounts}
              syncStatus={syncStatus}
              onNavigateTab={setActiveTab}
              onOpenNewLeadModal={() => setNewLeadModalOpen(true)}
            />
          )}

          {activeTab === 'leads' && (
            <LeadManagement
              leads={leads}
              onSelectLead={handleOpenTechnicalForLead}
              onOpenNewLeadModal={() => setNewLeadModalOpen(true)}
              onOpenTechnicalForLead={handleOpenTechnicalForLead}
              onUpdateLeadStage={handleUpdateStage}
            />
          )}

          {activeTab === 'banking' && (
            <BankFinancingPipeline
              applications={bankApplications}
              onUpdateStatus={handleUpdateBankStatus}
            />
          )}

          {activeTab === 'subcontractors' && (
            <SubcontractorManagement subcontractors={subcontractors} />
          )}

          {activeTab === 'products' && (
            <ProductBomVault products={products} bomPackages={bomPackages} />
          )}

          {activeTab === 'inventory' && (
            <InventoryLotTracking lots={lots} />
          )}

          {activeTab === 'suppliers_scm' && (
            <SupplierScmControl suppliers={suppliers} shipments={shipments} />
          )}

          {activeTab === 'after_sales' && (
            <AfterSalesSlaManagement
              tickets={tickets}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onAddTicket={(newTkt) => setTickets((prev) => [newTkt, ...prev])}
            />
          )}

          {activeTab === 'finance' && (
            <ProjectFinancialControl accounts={projectAccounts} />
          )}

          {activeTab === 'technical' && (
            <TechnicalControl
              leads={leads}
              activeLeadId={activeLeadForTechId}
              onSelectLeadId={setActiveLeadForTechId}
              onUpdateLeadTechnical={handleUpdateTechnical}
            />
          )}
        </main>
      </div>

      {/* =========================================================================
          MODALS: Onboard New Factory Lead & Quad Platform Sync
          ========================================================================= */}
      <NewLeadModal
        isOpen={newLeadModalOpen}
        onClose={() => setNewLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {syncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#C9A86A]" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Quad-Platform Live Enterprise Synchronization
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSyncModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6">
              <QuadPlatformSyncModal
                syncStatus={syncStatus}
                onTriggerSync={handleTriggerSync}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
