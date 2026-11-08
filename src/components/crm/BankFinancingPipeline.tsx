'use client';

import React, { useState } from 'react';
import { BankLoanApplication, BankPfi, BankLoanStatus } from '@/types/arelCrm';
import BankDossierModal from './BankDossierModal';
import {
  Landmark,
  BadgePercent,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Filter,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  UserCheck,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

interface BankFinancingPipelineProps {
  applications: BankLoanApplication[];
  onUpdateStatus?: (id: string, newStatus: BankLoanStatus) => void;
  theme?: string;
}

export default function BankFinancingPipeline({
  applications,
  onUpdateStatus,
  theme = 'crm-green',
}: BankFinancingPipelineProps) {
  const [selectedPfi, setSelectedPfi] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [selectedAppForDossier, setSelectedAppForDossier] = useState<BankLoanApplication | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  const handleOpenDossier = (app?: BankLoanApplication) => {
    setSelectedAppForDossier(app || applications[0] || null);
    setIsDossierModalOpen(true);
  };

  const handleModalStatusUpdate = (appId: string, newStatus: BankLoanStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(appId, newStatus);
    }
  };

  const filtered = applications.filter((app) => {
    if (selectedPfi !== 'ALL' && app.targetPfi !== selectedPfi) return false;
    return true;
  });

  const totalFacilityBdt = applications.reduce((acc, a) => acc + a.loanFacilityAmountBdt, 0);
  const totalDisbursedBdt = applications.reduce((acc, a) => acc + a.disbursedAmountBdt, 0);

  const getStatusBadge = (status: BankLoanStatus) => {
    switch (status) {
      case 'dossier_submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">1. Dossier Submitted</span>;
      case 'lenders_engineer_audit':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">2. Lender's Engineer Audit</span>;
      case 'credit_committee_review':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">3. Credit Committee Appraisal</span>;
      case 'sanction_letter_issued':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">4. Sanction Letter Issued (4.5%)</span>;
      case 'milestone_disbursement_active':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 font-mono">5. Milestone Tranches Active</span>;
      case 'fully_amortized':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">6. Fully Amortized</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Green Loan Facility</div>
          <div className="text-xl font-extrabold text-[#0A1A2F] mt-1 font-mono">
            Tk {(totalFacilityBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">80% Concessionary Debt @ 4.5%</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Disbursed to Date</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">
            Tk {(totalDisbursedBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disbursed against verified milestones</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Fixed Interest Rate</div>
          <div className="text-xl font-extrabold text-amber-600 mt-1 font-mono">
            4.50% Fixed
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bangladesh Bank Refinance Scheme</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Average Portfolio DSCR</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1 font-mono">
            1.57x
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Bank Minimum Cut-off: 1.20x</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700 uppercase">Filter Participating Bank (PFI):</span>
          <select
            value={selectedPfi}
            onChange={(e) => setSelectedPfi(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All PFIs &amp; IDCOL</option>
            <option value="BRAC Bank PLC">BRAC Bank PLC</option>
            <option value="City Bank PLC">City Bank PLC</option>
            <option value="Eastern Bank (EBL)">Eastern Bank (EBL)</option>
            <option value="Prime Bank PLC">Prime Bank PLC</option>
            <option value="IDCOL">IDCOL</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenDossier()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white text-xs font-bold transition font-mono cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Bank Dossier</span>
          </button>
        </div>
      </div>

      {/* Applications Conditional View */}
      {displayMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Application &amp; Client</th>
                  <th className="py-3 px-4">PFI Bank &amp; SFD Officer</th>
                  <th className="py-3 px-4">Facility (80% Debt)</th>
                  <th className="py-3 px-4">Equity (20%)</th>
                  <th className="py-3 px-4">DSCR &amp; Tenure</th>
                  <th className="py-3 px-4">Appraisal Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0A1A2F]">{app.factoryName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{app.applicationCode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <Building className="w-3 h-3 text-emerald-700" />
                        <span>{app.targetPfi}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Desk: {app.sfdDeskOfficerName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                      Tk {(app.loanFacilityAmountBdt / 10000000).toFixed(2)} Cr
                      <div className="text-[10px] text-slate-400 font-normal">
                        Disbursed: Tk {(app.disbursedAmountBdt / 10000000).toFixed(2)} Cr
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      Tk {(app.clientEquityAmountBdt / 10000000).toFixed(2)} Cr
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#0A1A2F]">{app.dscrProjected}x DSCR</div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round(app.tenureMonths / 12)}y ({Math.round(app.moratoriumGraceMonths / 12)}y Grace)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDossier(app)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 rounded text-[11px] font-bold transition cursor-pointer font-mono"
                      >
                        <FileText className="w-3 h-3 text-emerald-700" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Applications Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold block">{app.applicationCode}</span>
                    <h4 className="font-bold text-[#0A1A2F] text-base">{app.factoryName}</h4>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Bank (PFI):</span>
                    <span className="font-bold text-slate-900">{app.targetPfi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SFD Desk Officer:</span>
                    <span className="font-semibold text-slate-700">{app.sfdDeskOfficerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest &amp; Tenure:</span>
                    <span className="font-mono font-bold text-amber-700">4.50% &bull; {Math.round(app.tenureMonths / 12)} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DSCR Coverage:</span>
                    <span className="font-mono font-bold text-emerald-700">{app.dscrProjected}x</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs font-mono">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">80% Green Debt</div>
                    <div className="text-sm font-extrabold text-emerald-800 mt-0.5">
                      Tk {(app.loanFacilityAmountBdt / 10000000).toFixed(2)} Cr
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">20% Client Equity</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">
                      Tk {(app.clientEquityAmountBdt / 10000000).toFixed(2)} Cr
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Disbursed: Tk {(app.disbursedAmountBdt / 10000000).toFixed(2)} Cr</span>
                <button
                  type="button"
                  onClick={() => handleOpenDossier(app)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded text-xs font-bold transition cursor-pointer font-mono"
                >
                  <FileText className="w-3 h-3 text-[#C9A86A]" />
                  <span>View Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Bankable Feasibility & Debt Amortization Dossier Modal */}
      <BankDossierModal
        application={selectedAppForDossier}
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        onUpdateStatus={handleModalStatusUpdate}
        theme={theme}
      />
    </div>
  );
}
