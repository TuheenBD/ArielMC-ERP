'use client';

import React, { useState, useEffect } from 'react';
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
  AfterSalesTicket,
  BankLoanApplication,
  SubcontractorEntity,
  ShipmentConsignment,
  SolarSupplier,
  SolarProductMaster,
  InventoryLot,
  ProjectFinancialAccount,
} from '@/types/arelCrm';

// CRM Module Components
import ExecutiveDashboard from '@/components/crm/ExecutiveDashboard';
import LeadManagement from '@/components/crm/LeadManagement';
import LeadDetailConversionModal, { ProjectConversionPayload } from '@/components/crm/LeadDetailConversionModal';
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
import QuadPlatformSyncModule from '@/components/crm/QuadPlatformSyncModule';
import UserProfileModal, { DEMO_USERS } from '@/components/crm/UserProfileModal';
import { ThemeSelector, getThemeTokens } from '@/components/crm/ThemeSelector';

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
  Globe,
  Radio,
  User,
  Lock,
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
  | 'finance'
  | 'sync';

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
  sync: {
    title: 'Quad-Platform Live Enterprise Synchronization Bus',
    subtitle:
      'Zero-duplication cross-platform bus linking ERP (3001) • Master-CRM • Catalog (3000) • Website (8080) • SaaS (3002)',
    icon: Radio,
  },
};

export default function ArielEnergyCrmPage() {
  const [arelLeads] = useState(INITIAL_AREL_LEADS);
  const [leads, setLeads] = useState<SolarLead[]>(INITIAL_SOLAR_LEADS);
  const [bankApplications, setBankApplications] = useState(INITIAL_BANK_APPLICATIONS);
  const [subcontractors, setSubcontractors] = useState(INITIAL_SUBCONTRACTORS);
  const [products, setProducts] = useState<SolarProductMaster[]>(INITIAL_SOLAR_PRODUCTS);
  const [bomPackages, setBomPackages] = useState(INITIAL_BOM_PACKAGES);
  const [lots, setLots] = useState(INITIAL_INVENTORY_LOTS);
  const [suppliers, setSuppliers] = useState<SolarSupplier[]>(INITIAL_SOLAR_SUPPLIERS);
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [tickets, setTickets] = useState(INITIAL_AFTER_SALES_TICKETS);
  const [projectAccounts, setProjectAccounts] = useState(INITIAL_PROJECT_FINANCIALS);
  const [syncStatus, setSyncStatus] = useState(INITIAL_PLATFORM_SYNC);

  // Active User Profile State (Strict 2SA Verified)
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Turnkey EPC Conversion Modal State
  const [selectedLeadForConversion, setSelectedLeadForConversion] = useState<SolarLead | null>(null);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<CrmTab>('overview');
  const [activeLeadForTechId, setActiveLeadForTechId] = useState<string>(
    INITIAL_SOLAR_LEADS[0].id
  );
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // ERP Color Scheme Theme Profile State
  const [theme, setTheme] = useState<string>('crm-green');

  useEffect(() => {
    const savedTheme = localStorage.getItem('arielmc_erp_theme') || 'crm-green';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('arielmc_erp_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  // Switch User Profile
  const handleSwitchUser = (email: string) => {
    const found = DEMO_USERS.find((u) => u.email === email);
    if (found) setCurrentUser(found);
  };

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

  // Open Lead Dossier & Turnkey EPC Conversion Modal
  const handleOpenLeadConversion = (lead: SolarLead) => {
    setSelectedLeadForConversion(lead);
    setIsConversionModalOpen(true);
  };

  // Execute Turnkey EPC Conversion: Quad-Module Provisioning
  const handleConfirmConversion = (payload: ProjectConversionPayload) => {
    // 1. Update lead stage to contract_executed
    setLeads((prev) =>
      prev.map((l) =>
        l.id === payload.leadId
          ? { ...l, stage: 'contract_executed' as LeadStage, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );

    // 2. Provision Project Financial Account with strictly locked 25.0% Gross Profit Margin
    const turnkeyContractPriceBdt = payload.projectValueBdt;
    const budgetedTotalCostBdt = Math.round(turnkeyContractPriceBdt * 0.75); // Strict 25.0% gross margin lock!
    const grossProfitBdt = turnkeyContractPriceBdt - budgetedTotalCostBdt;

    const newProjectAccount = {
      id: `fin-00${projectAccounts.length + 1}`,
      projectId: payload.leadId,
      projectName: `${payload.projectName} ${payload.capacityKwp} kWp Turnkey Solar Project`,
      capacityKwp: payload.capacityKwp,
      turnkeyContractPriceBdt,
      actualTotalCostBdt: budgetedTotalCostBdt,
      budgetedTotalCostBdt,
      grossProfitBdt,
      realizedGrossMarginPct: 25.0, // Strict 25.0%
      milestones: [
        { id: 'm1', milestoneTitle: 'Milestone 1: 20% Contract Advance', percentage: 20, amountBdt: Math.round(turnkeyContractPriceBdt * 0.20), status: 'paid_in_bank' as any, dueDate: '2026-11-15', paidDate: '2026-11-18' },
        { id: 'm2', milestoneTitle: 'Milestone 2: 40% Chittagong Port Hardware Arrival', percentage: 40, amountBdt: Math.round(turnkeyContractPriceBdt * 0.40), status: 'invoice_issued' as any, dueDate: '2026-12-10' },
        { id: 'm3', milestoneTitle: 'Milestone 3: 30% Civil Mounting & Inverter Setup', percentage: 30, amountBdt: Math.round(turnkeyContractPriceBdt * 0.30), status: 'pending' as any, dueDate: '2027-01-15' },
        { id: 'm4', milestoneTitle: 'Milestone 4: 10% SREDA Grid Synchronization COD', percentage: 10, amountBdt: Math.round(turnkeyContractPriceBdt * 0.10), status: 'pending' as any, dueDate: '2027-02-15' },
      ],
      totalCollectedBdt: Math.round(turnkeyContractPriceBdt * 0.20),
      totalOutstandingBdt: Math.round(turnkeyContractPriceBdt * 0.80),
      retention5PercentBdt: Math.round(turnkeyContractPriceBdt * 0.05),
      retentionMaturityDate: '2028-02-15',
      retentionReleased: false,
      annualSurplusCashExportBdt: Math.round(payload.capacityKwp * 1450 * 10.50 * 0.15),
      costLedger: [
        { id: 'c1', category: 'HARDWARE_MODULES' as any, description: `${payload.pvModuleCount}x ${payload.pvModuleBrand} ${payload.pvModuleWattage}W Panels`, vendorName: payload.pvModuleBrand, budgetedAmountBdt: Math.round(budgetedTotalCostBdt * 0.45), actualSpentAmountBdt: Math.round(budgetedTotalCostBdt * 0.45), status: 'approved' as any },
        { id: 'c2', category: 'HARDWARE_INVERTERS' as any, description: `${payload.inverterCount}x ${payload.inverterBrand} Inverters`, vendorName: payload.inverterBrand, budgetedAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), actualSpentAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), status: 'approved' as any },
        { id: 'c3', category: 'MOUNTING_STRUCTURE' as any, description: 'Aluminum AL6005 Racking & Fasteners', vendorName: 'Kai Aluminum Ltd.', budgetedAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), actualSpentAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), status: 'approved' as any },
        { id: 'c4', category: 'CIVIL_LABOR' as any, description: `Civil Mounting & Pier Foundation (${payload.structuralSubcontractor})`, vendorName: payload.structuralSubcontractor, budgetedAmountBdt: Math.round(budgetedTotalCostBdt * 0.10), actualSpentAmountBdt: Math.round(budgetedTotalCostBdt * 0.10), status: 'approved' as any },
        { id: 'c5', category: 'ELECTRICAL_LABOR' as any, description: `Substation & Grid Sync (${payload.electricalSubcontractor})`, vendorName: payload.electricalSubcontractor, budgetedAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), actualSpentAmountBdt: Math.round(budgetedTotalCostBdt * 0.15), status: 'approved' as any },
      ],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjectAccounts((prev) => [newProjectAccount, ...prev]);

    // 3. Provision Inventory Staging Lot
    const newLot = {
      id: `lot-00${lots.length + 1}`,
      lotNumber: `LOT-2026-00${lots.length + 1}`,
      assignedProjectName: payload.projectName,
      warehouseLocation: 'Central SCM Distribution Hub (Tongi Industrial Corridor)',
      pvModulesStock: {
        brand: payload.pvModuleBrand,
        wattageWp: payload.pvModuleWattage,
        quantityUnits: payload.pvModuleCount,
        qcPassedUnits: payload.pvModuleCount,
        status: 'reserved' as any,
      },
      invertersStock: {
        brand: payload.inverterBrand,
        model: `${payload.inverterBrand} 100KTL-M2`,
        quantityUnits: payload.inverterCount,
        qcPassedUnits: payload.inverterCount,
        status: 'reserved' as any,
      },
      stagedDate: new Date().toISOString().split('T')[0],
      stagingStatus: 'ready_for_dispatch' as any,
    };
    setLots((prev) => [newLot as any, ...prev]);

    // 4. Provision 4.5% Bank Financing Desk Application
    const newBankApp = {
      id: `app-00${bankApplications.length + 1}`,
      applicationCode: `AREL-BNK-2026-${Math.floor(100 + Math.random() * 900)}`,
      leadId: payload.leadId,
      factoryName: payload.projectName,
      targetPfi: (payload.bankPfi as any) || 'Eastern Bank PLC',
      sfdDeskOfficerName: 'Md. Ashraful Alam (VP & Green Head)',
      sfdDeskOfficerContact: '+880 1711-234567',
      loanFacilityAmountBdt: Math.round(payload.projectValueBdt * 0.70), // 70% Debt
      clientEquityAmountBdt: Math.round(payload.projectValueBdt * 0.30), // 30% Equity
      fixedInterestRatePct: 4.5,
      tenureMonths: 120,
      moratoriumGraceMonths: 12,
      status: 'dossier_submitted' as any,
      disbursedAmountBdt: 0,
      dscrProjected: 1.62,
      expectedFirstDisbursementDate: '2026-12-15',
    };
    setBankApplications((prev) => [newBankApp as any, ...prev]);

    // 5. Update Subcontractors active projects
    const chosenSubs = [payload.structuralSubcontractor, payload.mechanicalSubcontractor, payload.electricalSubcontractor];
    setSubcontractors((prev) =>
      prev.map((sub) => {
        if (chosenSubs.some((cs) => cs && (sub.companyName.includes(cs) || cs.includes(sub.companyName)))) {
          return {
            ...sub,
            activeProjects: [payload.projectName, ...sub.activeProjects],
          };
        }
        return sub;
      })
    );

    // 6. Switch to Project Financials to showcase the 25.0% margin lock
    setActiveTab('finance');
  };

  // Handle Subcontractor Work Order
  const handleAssignWorkOrder = (payload: any) => {
    setSubcontractors((prev) =>
      prev.map((s) =>
        s.id === payload.subcontractorId
          ? {
              ...s,
              activeProjects: [payload.projectName, ...s.activeProjects],
            }
          : s
      )
    );
  };

  // Handle ASYCUDA Declaration
  const handleFileAsycudaDeclaration = (payload: any) => {
    const newShipment = {
      id: `sh-${Date.now()}`,
      shipmentCode: `SH-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectLeadId: 'lead-001',
      factoryName: 'Ha-Meem Denim Washing & Weaving Plant',
      lcNumber: payload.lcNumber,
      erqAccountUtilized: true,
      shippingLine: 'COSCO Shipping Lines',
      vesselName: 'M/V Banglar Shourabh V.204',
      billOfLadingNo: payload.blNumber,
      portOfLoading: 'Shanghai Port (SHA)',
      portOfDischarge: 'Chittagong Port (CGP)' as any,
      etdDate: '2026-11-01',
      etaPortDate: payload.etaPortDate,
      cfAgentName: 'Bengal Cargo & Customs House Agency',
      cfAgentContact: '+880 1819-223344',
      sredaNocNumber: payload.sredaNocNumber,
      sredaNocDate: '2026-10-25',
      customsBoeNumber: `ASYCUDA-${payload.blNumber}`,
      hsCode: '8541.43.00',
      customsDutyPaidBdt: payload.customsDutyPaidBdt,
      clearanceStatus: 'customs_duty_1pct_assessed' as any,
    };
    setShipments((prev) => [newShipment, ...prev]);
  };

  // Handle Journal Voucher
  const handlePostVoucher = (payload: any) => {
    if (payload.isCostItem) {
      setProjectAccounts((prev) =>
        prev.map((p) => {
          if (p.id === payload.projectId || p.projectId === payload.projectId) {
            const updatedActualCost = p.actualTotalCostBdt + payload.amountBdt;
            const updatedGrossProfit = p.turnkeyContractPriceBdt - updatedActualCost;
            const updatedMargin = (updatedGrossProfit / p.turnkeyContractPriceBdt) * 100;
            return {
              ...p,
              actualTotalCostBdt: updatedActualCost,
              grossProfitBdt: updatedGrossProfit,
              realizedGrossMarginPct: Math.round(updatedMargin * 10) / 10,
            };
          }
          return p;
        })
      );
    }
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
      lastSyncTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }));
  };

  // Lead CRUD handlers
  const handleEditLead = (updated: SolarLead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };
  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Ticket CRUD handlers
  const handleEditTicket = (updated: AfterSalesTicket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };
  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // Bank Application CRUD handlers
  const handleEditBankApp = (updated: BankLoanApplication) => {
    setBankApplications((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };
  const handleDeleteBankApp = (id: string) => {
    setBankApplications((prev) => prev.filter((b) => b.id !== id));
  };

  // Subcontractor CRUD handlers
  const handleEditSubcontractor = (updated: SubcontractorEntity) => {
    setSubcontractors((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const handleDeleteSubcontractor = (id: string) => {
    setSubcontractors((prev) => prev.filter((s) => s.id !== id));
  };

  // Shipment & Supplier CRUD handlers
  const handleEditShipment = (updated: ShipmentConsignment) => {
    setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const handleDeleteShipment = (id: string) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  };
  const handleEditSupplier = (updated: SolarSupplier) => {
    setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const handleDeleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Product & BOM CRUD handlers
  const handleEditProduct = (updated: SolarProductMaster) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const handleDeletePackage = (id: string) => {
    setBomPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  // Inventory Lot CRUD handlers
  const handleEditLot = (updated: InventoryLot) => {
    setLots((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };
  const handleDeleteLot = (id: string) => {
    setLots((prev) => prev.filter((l) => l.id !== id));
  };

  // Project Financial Account CRUD handlers
  const handleEditProjectAccount = (updated: any) => {
    setProjectAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };
  const handleDeleteProjectAccount = (id: string) => {
    setProjectAccounts((prev) => prev.filter((a) => a.id !== id));
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
    {
      title: 'Cross-Platform Sync',
      items: [
        { id: 'sync', label: '10. Quad-Bus Sync', icon: Radio, badge: '4/4 Live' },
      ],
    },
  ];

  const currentMeta = TAB_METADATA[activeTab];
  const CurrentIcon = currentMeta.icon;
  const tokens = getThemeTokens(theme);

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-row font-sans text-[#1A1A1A]" data-theme={theme}>
      {/* =========================================================================
          LEFT FIXED PANEL (Dynamic Theme Adapting, Fixed, Zero Layout Jump)
          ========================================================================= */}
      <aside className={`w-64 xl:w-72 ${tokens.sidebarBg} text-slate-200 border-r ${tokens.sidebarBorder} fixed left-0 top-0 bottom-0 h-screen z-40 flex flex-col justify-between overflow-hidden select-none shadow-xl transition-colors`}>
        {/* 1. Header & Brand Wordmark */}
        <div className={`p-3.5 border-b ${tokens.sidebarBorder} shrink-0 ${tokens.sidebarHeaderBg} transition-colors`}>
          <div className="flex items-center gap-2.5">
            <img
              src="/logos/ariel-energy-icon.png"
              alt="AREL Seal"
              className="w-8 h-8 object-contain drop-shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black tracking-tight text-white leading-tight truncate">
                Ariel Renewable Energy
              </div>
              <div className={`text-[9px] uppercase font-mono tracking-widest ${tokens.sidebarSubtext} truncate`}>
                Enterprise OS 2026.1
              </div>
            </div>
          </div>

          {/* Quad Sync Live Pulse Pill */}
          <div className={`mt-2.5 flex items-center justify-between ${tokens.sidebarPulseBox} px-2 py-1 rounded-lg border transition-colors`}>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold text-emerald-300 font-mono">
                Quad-Bus: 4/4 Synced
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`text-[9px] font-mono font-bold ${tokens.sidebarSubtext} hover:opacity-80 transition cursor-pointer`}
            >
              Verify &rarr;
            </button>
          </div>
        </div>

        {/* 2. Grouped Navigation Menus (Fixed within panel) */}
        <nav className="flex-1 px-2.5 py-2.5 space-y-2.5 overflow-y-auto no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-2 mb-1.5 text-[11px] font-mono uppercase tracking-widest font-black text-white drop-shadow-xs transition-colors">
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
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer text-left ${
                        isActive
                          ? `${tokens.sidebarActiveItem}`
                          : `${tokens.sidebarInactiveItem}`
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-inherit' : 'opacity-75'
                          }`}
                        />
                        <span className="truncate text-[11px]">{tab.label}</span>
                      </div>

                      {tab.badge && (
                        <span
                          className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono font-semibold shrink-0 ${
                            isActive
                              ? tokens.sidebarBadgeActive
                              : tokens.sidebarBadgeInactive
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
        <div className={`px-2.5 py-2 border-t ${tokens.sidebarBorder} shrink-0 ${tokens.sidebarFooterBg} transition-colors`}>
          <button
            type="button"
            onClick={() => setNewLeadModalOpen(true)}
            className={`w-full py-1.5 ${tokens.headerPrimaryBtn} rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer`}
          >
            <Plus className={`w-3.5 h-3.5 ${tokens.headerPrimaryBtnText}`} />
            <span>Onboard Factory Lead</span>
          </button>
        </div>

        {/* 4. Bottom Footer: SREDA Countdown & Ecosystem Portals */}
        <div className={`p-2.5 ${tokens.sidebarFooterBg} border-t ${tokens.sidebarBorder} shrink-0 text-xs transition-colors`}>
          {/* SREDA Countdown Pill */}
          <div className={`p-2 rounded-lg ${tokens.sidebarPulseBox} mb-2 text-[10px] border transition-colors`}>
            <div className={`font-bold flex items-center justify-between ${tokens.sidebarSectionText}`}>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>SREDA Net-Meter Cutoff</span>
              </span>
              <span className="font-mono">Feb 28, 2027</span>
            </div>
            <div className="text-slate-400 text-[8.5px] mt-0.5">
              Lock Tk 10.50/kWh buyback tariff before policy sunset
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="grid grid-cols-2 gap-1 text-[9.5px] font-bold">
            <a
              href="https://crm.arielmc.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2 py-1 rounded ${tokens.sidebarActionBtnBg} text-center truncate flex items-center justify-center gap-1 transition`}
              title="Open Master-CRM Group Hub"
            >
              <span>Master-CRM</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-amber-400" />
            </a>

            <button
              type="button"
              onClick={handleExportCsv}
              className={`px-2 py-1 rounded ${tokens.sidebarActionBtnBg} text-center truncate flex items-center justify-center gap-1 transition cursor-pointer`}
              title="Export Full Pipeline to CSV"
            >
              <span>Export CSV</span>
              <Download className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WINDOW (Compact, Zero Overflow, ERP Color Scheme & Footer)
          ========================================================================= */}
      <div className="flex-1 ml-64 xl:ml-72 min-h-screen flex flex-col bg-[#FAF9F5] overflow-x-hidden">
        {/* Main Window Top Header (Fixed, Increased Standard Height, Same Color as Side Panel) */}
        <header className={`fixed top-0 right-0 left-64 xl:left-72 z-30 h-16 px-6 flex items-center justify-between shadow-md transition-colors ${tokens.sidebarBg} border-b ${tokens.sidebarBorder} text-white`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl ${tokens.headerIconBg} ${tokens.headerIconText} border ${tokens.headerIconBorder} flex items-center justify-center shrink-0 transition-colors shadow-2xs`}>
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white tracking-tight truncate">
                  {currentMeta.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  AREL-CRM
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate max-w-xl">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Right Top Status & Fast Action Toolbar with Auth User Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono text-white border border-white/15">
              <span className="text-slate-300 uppercase text-[9px] font-bold">Pipeline:</span>
              <span className="font-bold text-emerald-300">Tk 48.75 Cr</span>
              <span className="text-white/30">|</span>
              <span className="font-bold text-white">9.75 MWp</span>
            </div>

            {/* ERP Color Scheme Theme Selector */}
            <ThemeSelector currentTheme={theme} onSelectTheme={handleSelectTheme} />

            <button
              type="button"
              onClick={handleExportCsv}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer font-mono"
            >
              <Download className="w-3.5 h-3.5 text-slate-200" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => setNewLeadModalOpen(true)}
              className={`px-3 py-1.5 ${tokens.headerPrimaryBtn} rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer`}
            >
              <Plus className={`w-3.5 h-3.5 ${tokens.headerPrimaryBtnText}`} />
              <span>New Lead</span>
            </button>

            {/* Auth & User Profile Pill */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 shadow-2xs transition cursor-pointer text-white"
              title="Open User Profile & 2SA Authentication Settings"
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black font-mono shrink-0 shadow-2xs"
                style={{ backgroundColor: currentUser.avatarColor, color: '#0A1A2F' }}
              >
                {currentUser.avatarInitials}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-emerald-300 font-bold font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{currentUser.role.replace('_', ' ')}</span>
                </div>
              </div>
            </button>
          </div>
        </header>

        {/* Dedicated Fixed Header Spacer (Ensures Main Window Content Never Collides Under Header) */}
        <div className="h-16 w-full shrink-0" aria-hidden="true" />

        {/* Main Content Workspace Body (Lowered with Standard Margin & Fitting Main Window) */}
        <main className="flex-1 w-full max-w-full px-5 sm:px-6 lg:px-8 py-6 space-y-6">
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
              onSelectLead={handleOpenLeadConversion}
              onOpenNewLeadModal={() => setNewLeadModalOpen(true)}
              onOpenTechnicalForLead={handleOpenTechnicalForLead}
              onUpdateLeadStage={handleUpdateStage}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
            />
          )}

          {activeTab === 'banking' && (
            <BankFinancingPipeline
              applications={bankApplications}
              onUpdateStatus={handleUpdateBankStatus}
              onEditApplication={handleEditBankApp}
              onDeleteApplication={handleDeleteBankApp}
              theme={theme}
            />
          )}

          {activeTab === 'subcontractors' && (
            <SubcontractorManagement
              subcontractors={subcontractors}
              onAssignWorkOrder={handleAssignWorkOrder}
              onEditSubcontractor={handleEditSubcontractor}
              onDeleteSubcontractor={handleDeleteSubcontractor}
              theme={theme}
            />
          )}

          {activeTab === 'products' && (
            <ProductBomVault
              products={products}
              bomPackages={bomPackages}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onDeletePackage={handleDeletePackage}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryLotTracking
              lots={lots}
              onEditLot={handleEditLot}
              onDeleteLot={handleDeleteLot}
            />
          )}

          {activeTab === 'suppliers_scm' && (
            <SupplierScmControl
              suppliers={suppliers}
              shipments={shipments}
              onFileDeclaration={handleFileAsycudaDeclaration}
              onEditShipment={handleEditShipment}
              onDeleteShipment={handleDeleteShipment}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              theme={theme}
            />
          )}

          {activeTab === 'after_sales' && (
            <AfterSalesSlaManagement
              tickets={tickets}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onAddTicket={(newTkt) => setTickets((prev) => [newTkt, ...prev])}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {activeTab === 'finance' && (
            <ProjectFinancialControl
              accounts={projectAccounts}
              onPostVoucher={handlePostVoucher}
              onEditProjectAccount={handleEditProjectAccount}
              onDeleteProjectAccount={handleDeleteProjectAccount}
              theme={theme}
            />
          )}

          {activeTab === 'technical' && (
            <TechnicalControl
              leads={leads}
              activeLeadId={activeLeadForTechId}
              onSelectLeadId={setActiveLeadForTechId}
              onUpdateLeadTechnical={handleUpdateTechnical}
            />
          )}

          {activeTab === 'sync' && (
            <QuadPlatformSyncModule
              syncStatus={syncStatus}
              onTriggerSync={handleTriggerSync}
            />
          )}
        </main>

        {/* =========================================================================
            INSTITUTIONAL MASTER SYSTEM FOOTER (Dedicated for Ariel - SaaS™)
            ========================================================================= */}
        <footer className="mt-8 pt-5 pb-6 border-t border-[#DDE3DD] text-center select-none bg-white/70">
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-1.5">
            {/* Line 1: Official Brand & Entity Lockup */}
            <div className="flex flex-wrap items-center justify-center gap-2 font-bold text-xs tracking-tight text-[#0A1A2F]">
              <img
                src="/logos/ariel-energy-icon.png"
                alt="AREL Seal"
                className="w-4 h-4 object-contain inline-block"
              />
              <span className="font-black text-[#003177] tracking-tight">
                Ariel - SaaS<sup className="text-[0.65em] font-bold -top-0.5 ml-[1px]">™</sup>
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-extrabold text-[#1F3A2E]">
                Ariel Renewable Energy Limited
              </span>
              <span className="text-[#C9A86A]">|</span>
              <span className="font-medium text-[#6B7269]">
                Sovereign Green Infrastructure &amp; Industrial Decarbonization
              </span>
            </div>

            {/* Line 2: Legal Copyright & Compliance */}
            <div className="text-[11px] text-[#6B7269] flex flex-wrap items-center justify-center gap-1.5 font-medium">
              <span>© 2026</span>
              <strong className="text-[#003177] font-bold">Ariel - SaaS™</strong>
              <span className="text-[#1F3A2E] font-medium">Cloud Enterprise Operating Platform</span>
              <span className="opacity-50">&bull;</span>
              <span>All Right Reserve</span>
              <span className="opacity-50">|</span>
              <span>SREDA Net-Metering Compliance</span>
              <span className="opacity-50">&bull;</span>
              <span>BDS IEC 61215/61730 Tested</span>
            </div>

            {/* Line 3: Quad-Bus Sync Beacon & Protocols */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-[9.5px] font-mono text-[#6B7269] pt-0.5">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Quad-Bus: 4/4 Connected (ERP • Master-CRM • Catalog • Website • SaaS)</span>
              </span>
              <span>•</span>
              <span>Refinance: Bangladesh Bank SFD 4.5% Green Desk</span>
              <span>•</span>
              <span>Port: Chittagong CFS ASYCUDA Box 44 (1.0% AIT)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          MODALS: Onboard New Factory Lead & User Profile Control & Conversion Engine
          ========================================================================= */}
      <LeadDetailConversionModal
        lead={selectedLeadForConversion}
        isOpen={isConversionModalOpen}
        onClose={() => setIsConversionModalOpen(false)}
        onConfirmConversion={handleConfirmConversion}
        theme={theme}
      />

      <NewLeadModal
        isOpen={newLeadModalOpen}
        onClose={() => setNewLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />
    </div>
  );
}
