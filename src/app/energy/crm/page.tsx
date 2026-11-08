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
  Sun,
  Zap,
  Building,
  Landmark,
  Cpu,
  Layers,
  ArrowLeft,
  Download,
  Plus,
  ShieldCheck,
  Clock,
  Sparkles,
  Building2,
  ArrowUpRight,
  Boxes,
  Truck,
  Wrench,
  DollarSign,
  Activity,
  CheckCircle2,
  Share2,
} from 'lucide-react';

type CrmTab =
  | 'leads'
  | 'banking'
  | 'subcontractors'
  | 'products'
  | 'inventory'
  | 'suppliers_scm'
  | 'after_sales'
  | 'finance'
  | 'technical';

export default function ArielEnergyCrmPage() {
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

  const [activeTab, setActiveTab] = useState<CrmTab>('leads');
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

  const tabs: { id: CrmTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'leads', label: 'Lead Control', icon: Building, badge: `${leads.length}` },
    { id: 'banking', label: '4.5% Bank Debt Desk', icon: Landmark, badge: 'IDCOL/PFI' },
    { id: 'subcontractors', label: 'Subcontractors & IEB', icon: ShieldCheck, badge: `${subcontractors.length}` },
    { id: 'products', label: 'Product & BOM Vault', icon: Boxes, badge: '25% Margin' },
    { id: 'inventory', label: 'Inventory Staging', icon: Truck, badge: `${lots.length} Lots` },
    { id: 'suppliers_scm', label: 'SCM & Customs', icon: Layers, badge: 'Box 44 1%' },
    { id: 'after_sales', label: 'After-Sales SLA', icon: Wrench, badge: `${tickets.length} Tickets` },
    { id: 'finance', label: 'Project Financials', icon: DollarSign, badge: 'P&L / GL' },
    { id: 'technical', label: 'Technical & SLD', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-slate-800 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & CRM Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/energy/calculator"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0A1A2F] font-semibold pr-3 border-r border-slate-200 transition"
              title="Return to ERP Energy Desk"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Energy Desk</span>
            </Link>

            <a
              href="https://crm.arielmc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#C8A96A] bg-[#0A1A2F] px-2.5 py-1 rounded-lg hover:bg-[#132A4A] font-semibold transition shadow-xs border border-[#C8A96A]/30"
              title="Open Master-CRM Group Executive OS"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Master-CRM</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img
                src="/logos/ariel-energy-logo.png"
                alt="Ariel Renewable Energy Limited — Sovereign Green Infrastructure & Industrial Decarbonization"
                className="h-8 sm:h-9 w-auto object-contain shrink-0"
              />
              <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 self-center">
                Enterprise Operating System
              </span>
            </div>
          </div>

          {/* Right Header Controls: Quad Sync Pill & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quad Platform Sync Pill */}
            <button
              type="button"
              onClick={() => setSyncModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
              title="Open Quad-Platform Real-Time Sync Status (Website • SaaS • ERP • Master-CRM)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="hidden md:inline font-mono">Quad-Bus: 4/4 Connected</span>
              <Share2 className="w-3 h-3 text-emerald-700" />
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
              title="Download Master Pipeline CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Global Navigation Sub-Header (Full Module Tabs) */}
        <div className="bg-slate-50 border-t border-slate-200/80 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A1A2F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1A2F] hover:bg-slate-200/70'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#C9A86A]' : 'text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        isActive
                          ? 'bg-[#152a45] text-[#C9A86A]'
                          : 'bg-slate-200 text-slate-600'
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
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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

      {/* Modals */}
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
