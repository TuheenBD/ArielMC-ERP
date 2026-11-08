'use client';

import React, { useMemo } from 'react';
import {
  ArelLead,
  BankLoanApplication,
  SubcontractorEntity,
  SolarProductMaster,
  BomPackage,
  InventoryLot,
  SolarSupplier,
  ShipmentConsignment,
  AfterSalesTicket,
  ProjectFinancialAccount,
  PlatformSyncStatus,
} from '@/types/arelCrm';
import {
  Building2,
  TrendingUp,
  Zap,
  Landmark,
  ShieldCheck,
  Truck,
  Ship,
  Boxes,
  Activity,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  Layers,
  ChevronRight,
  FileText,
  Percent,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  leads: ArelLead[];
  applications: BankLoanApplication[];
  subcontractors: SubcontractorEntity[];
  products: SolarProductMaster[];
  bomPackages: BomPackage[];
  lots: InventoryLot[];
  suppliers: SolarSupplier[];
  shipments: ShipmentConsignment[];
  tickets: AfterSalesTicket[];
  accounts: ProjectFinancialAccount[];
  syncStatus: PlatformSyncStatus;
  onNavigateTab: (tab: any) => void;
  onOpenNewLeadModal: () => void;
}

export default function ExecutiveDashboard({
  leads,
  applications,
  subcontractors,
  products,
  bomPackages,
  lots,
  suppliers,
  shipments,
  tickets,
  accounts,
  syncStatus,
  onNavigateTab,
  onOpenNewLeadModal,
}: ExecutiveDashboardProps) {
  // SREDA Cutoff Date: Feb 28, 2027
  const sredaDaysRemaining = useMemo(() => {
    const target = new Date('2027-02-28').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  // Aggregate Key Executive Metrics
  const metrics = useMemo(() => {
    const totalPipelineCapexBdt = leads.reduce((sum, l) => sum + l.totalProjectCapexBdt, 0);
    const totalCapacityKwp = leads.reduce((sum, l) => sum + l.proposedCapacityKwp, 0);
    const totalGreenDebt80Bdt = leads.reduce((sum, l) => sum + l.concessionaryDebt80Bdt, 0);
    const totalFirstYearSavingsBdt = leads.reduce((sum, l) => sum + l.firstYearAnnualSavingsBdt, 0);
    const totalFacilitySanctionedBdt = applications.reduce((sum, a) => sum + a.loanFacilityAmountBdt, 0);
    const totalDisbursedBdt = applications.reduce((sum, a) => sum + a.disbursedAmountBdt, 0);
    const activeAuditsCount = leads.filter((l) => l.stage === 'audit_scheduled' || l.stage === 'discovery').length;
    const bankReviewCount = leads.filter((l) => l.stage === 'bank_sfd_review' || l.stage === 'feasibility_prepared').length;
    const activeLcsCount = suppliers.reduce((sum, s) => sum + s.activeOrdersCount, 0);
    const criticalTicketsCount = tickets.filter((t) => t.priority === 'critical_power_loss' || t.priority === 'high').length;

    // Sector Aggregations
    const sectorMap: Record<string, { count: number; capacityKwp: number; capexBdt: number }> = {};
    leads.forEach((l) => {
      if (!sectorMap[l.industrySector]) {
        sectorMap[l.industrySector] = { count: 0, capacityKwp: 0, capexBdt: 0 };
      }
      sectorMap[l.industrySector].count += 1;
      sectorMap[l.industrySector].capacityKwp += l.proposedCapacityKwp;
      sectorMap[l.industrySector].capexBdt += l.totalProjectCapexBdt;
    });

    return {
      totalPipelineCapexBdt,
      totalCapacityKwp,
      totalGreenDebt80Bdt,
      totalFirstYearSavingsBdt,
      totalFacilitySanctionedBdt,
      totalDisbursedBdt,
      activeAuditsCount,
      bankReviewCount,
      activeLcsCount,
      criticalTicketsCount,
      sectorMap,
    };
  }, [leads, applications, suppliers, tickets]);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. HERO EXECUTIVE KPI COCKPIT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline CapEx */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total C&amp;I Pipeline CapEx
            </span>
            <div className="text-3xl font-black text-[#0A1A2F] font-mono tracking-tight">
              Tk {(metrics.totalPipelineCapexBdt / 10000000).toFixed(2)} Cr
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Across {leads.length} Tier-1 Industrial Plants</span>
            </div>
          </div>
        </div>

        {/* Target Solar Megawatts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Target Capacity (MWp)
            </span>
            <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
              {(metrics.totalCapacityKwp / 1000).toFixed(2)} MWp
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{metrics.totalCapacityKwp.toLocaleString()} kWp DC Solar PV</span>
            </div>
          </div>
        </div>

        {/* 4.5% Bank Green Debt Facility */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              80% Green Debt Pipeline (@ 4.5%)
            </span>
            <div className="text-3xl font-black text-[#0A1A2F] font-mono tracking-tight">
              Tk {(metrics.totalGreenDebt80Bdt / 10000000).toFixed(2)} Cr
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-700">
              <Landmark className="w-3.5 h-3.5 text-blue-600" />
              <span>PFI / IDCOL Refinance Window</span>
            </div>
          </div>
        </div>

        {/* SREDA Cutoff Countdown Clock */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A1A2F] to-[#152a45] text-white shadow-xs border border-[#C9A86A]/40 relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A86A]">
                SREDA Tk 10.50 Cutoff Clock
              </span>
              <span className="animate-pulse flex h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
              {sredaDaysRemaining} Days
            </div>
            <div className="text-[10px] text-slate-300 font-light mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C9A86A]" />
              <span>COD Deadline: Feb 28, 2027 (Lock 20-Yr Buyback)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE WORKFLOW: 4-STEP PROCEDURE TO GOVERNMENT 4.5% LOAN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                SOP-AREL-BNK-2026
              </span>
              <h3 className="text-base font-extrabold text-[#0A1A2F]">
                4-Step Standard Procedure to Get Government 4.5% Solar Loan for Factory Clients
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict statutory procedure for pre-qualification, feasibility dossier appraisal, credit committee defense, and milestone disbursements.
            </p>
          </div>

          <a
            href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Download Bankable Feasibility Dossier (PDF)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div
            onClick={() => onNavigateTab('leads')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Step 01
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Pre-Qual Audit</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Pre-Qualification &amp; 3D Drone Audit
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Verify client's utility bill &amp; enforce the <strong>SREDA 70% Sanctioned Load Cap</strong> (AC Capacity &le; Sanctioned kVA &times; 0.90 &times; 0.70). Conduct 3-hour on-site 3D LiDAR drone shadow &amp; IEB structural integrity survey.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
              <span>{metrics.activeAuditsCount} Audits Active</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigateTab('technical')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Step 02
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Dossier Package</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Prepare "Bankable Feasibility Study"
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Compile official 10-page bank dossier (AREL-BNK-2026-FEAS-V1): PVsyst/HelioScope energy yield simulation (80.4% PR), 25-yr cashflow waterfall showing DSCR &gt; 1.50x, SREDA Tier-1 compliance sheets, and IEB-certified SLD.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-[11px] text-blue-700 font-bold">
              <span>10-Page Template Ready</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigateTab('banking')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Step 03
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">PFI Credit Desk</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Submit to Bank's SFD Desk or IDCOL
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Submit directly through the client's existing Corporate Relationship Manager (RM) linked with Sustainable Finance Departments (SFD) at BRAC Bank, City Bank, EBL, Prime Bank, Bank Asia, or IDCOL Renewable Desk.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-[11px] text-amber-700 font-bold">
              <span>{applications.length} PFI Desks Active</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onNavigateTab('finance')}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Step 04
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Disbursement</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Sanction &amp; Milestone Disbursement
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Once PFI/IDCOL approves the 80% loan @ 4.5% (1-yr moratorium, 10-yr tenor), the client contributes 20% equity (or opens hardware LC via their ERQ account for a 2%-3% discount), and bank disburses against verified milestones.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-[11px] text-purple-700 font-bold">
              <span>Tk {(metrics.totalDisbursedBdt / 10000000).toFixed(2)} Cr Disbursed</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN STRATEGIC SECTION: SECTOR MATRIX & SCM LOGISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Sector-Wise Distribution Matrix */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-[#0A1A2F] uppercase tracking-wider">
                  Bangladesh Industrial Sector Matrix
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                8 Core Strategic Sectors
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {Object.entries(metrics.sectorMap).map(([sector, data]) => {
                const pctOfTotal = ((data.capexBdt / metrics.totalPipelineCapexBdt) * 100).toFixed(1);
                return (
                  <div key={sector} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-[180px]">
                      <div className="font-bold text-xs text-[#0A1A2F]">{sector}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {data.count} Factory Account{data.count > 1 ? 's' : ''} &bull; {(data.capacityKwp / 1000).toFixed(2)} MWp Target
                      </div>
                    </div>

                    <div className="flex-1 max-w-[140px] hidden sm:block">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${pctOfTotal}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block text-right">
                        {pctOfTotal}% of Pipeline
                      </span>
                    </div>

                    <div className="text-right whitespace-nowrap font-mono">
                      <div className="font-extrabold text-xs text-[#0A1A2F]">
                        Tk {(data.capexBdt / 10000000).toFixed(2)} Cr
                      </div>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        70% Cap OK
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Strict 25.0% Gross Profit Margin Enforced</span>
            <button
              type="button"
              onClick={() => onNavigateTab('leads')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Sector Leads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): SCM Chittagong Port Inbound Watch & Active Shipments */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-extrabold text-[#0A1A2F] uppercase tracking-wider">
                  Chittagong Port &amp; Customs Watch
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700">
                Box 44: 1.0% SRO 159/338
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {shipments.map((sh) => (
                <div key={sh.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#0A1A2F]">{sh.shipmentCode}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono bg-purple-100 text-purple-800">
                      NOC: {sh.sredaNocNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 font-semibold">{sh.factoryName}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                    <span>Vessel: {sh.vesselName}</span>
                    <span className="text-emerald-700 font-bold">ETA: {sh.etaPortDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    BoE: {sh.customsBoeNumber} &bull; Duty Paid: Tk {sh.customsDutyPaidBdt.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Client ERQ USD LC Active</span>
            <button
              type="button"
              onClick={() => onNavigateTab('suppliers_scm')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage SCM Customs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. EXECUTIVE LAUNCHPAD & QUICK ACTIONS */}
      <div className="bg-[#0A1A2F] text-white rounded-2xl p-6 shadow-md border border-[#C9A86A]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A86A]" />
              <span>Executive Command Launchpad</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid operational shortcuts for project directors, credit committee analysts, and EPC engineering chiefs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenNewLeadModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Onboard New Factory Lead</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigateTab('leads')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <Building2 className="w-4 h-4 text-emerald-400 mb-2" />
            <div className="text-xs font-bold text-white">Lead Control</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Sectors &amp; 70% Cap</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('banking')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <Landmark className="w-4 h-4 text-blue-400 mb-2" />
            <div className="text-xs font-bold text-white">4.5% Bank Desk</div>
            <span className="text-[10px] text-slate-400 mt-0.5">IDCOL &amp; PFIs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('subcontractors')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 mb-2" />
            <div className="text-xs font-bold text-white">IEB Engineers</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Certified Partners</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('products')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <Boxes className="w-4 h-4 text-purple-400 mb-2" />
            <div className="text-xs font-bold text-white">BOM &amp; Packages</div>
            <span className="text-[10px] text-slate-400 mt-0.5">25% Margin BoQs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <Truck className="w-4 h-4 text-teal-400 mb-2" />
            <div className="text-xs font-bold text-white">Lot Staging</div>
            <span className="text-[10px] text-slate-400 mt-0.5">Port to Factory Roof</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('finance')}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition cursor-pointer flex flex-col justify-between"
          >
            <DollarSign className="w-4 h-4 text-[#C9A86A] mb-2" />
            <div className="text-xs font-bold text-white">Project Financials</div>
            <span className="text-[10px] text-slate-400 mt-0.5">P&amp;L, GL &amp; Escrow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
