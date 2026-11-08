'use client';

import React, { useState } from 'react';
import { BankLoanApplication, BankPfi, BankLoanStatus } from '@/types/arelCrm';
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
} from 'lucide-react';

interface BankFinancingPipelineProps {
  applications: BankLoanApplication[];
  onUpdateStatus?: (id: string, newStatus: BankLoanStatus) => void;
}

export default function BankFinancingPipeline({
  applications,
  onUpdateStatus,
}: BankFinancingPipelineProps) {
  const [selectedPfi, setSelectedPfi] = useState<string>('ALL');

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
          <div className="text-[10px] text-slate-500 mt-0.5">Bangladesh Bank SFD Master Circular</div>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
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

        <a
          href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download 10-Page Master Bank Dossier</span>
        </a>
      </div>

      {/* Applications Table */}
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
                    <div className="text-[10px] text-slate-500">{app.sfdDeskOfficerName}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-emerald-800">
                      Tk {(app.loanFacilityAmountBdt / 100000).toFixed(2)} Lakh
                    </div>
                    <div className="text-[10px] text-slate-400">@ 4.5% Fixed p.a.</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-semibold text-slate-700">
                      Tk {(app.clientEquityAmountBdt / 100000).toFixed(2)} Lakh
                    </div>
                    <div className="text-[10px] text-slate-400">via Client ERQ</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 font-mono">{app.dscrProjected.toFixed(2)}x DSCR</div>
                    <div className="text-[10px] text-slate-500">7 Yrs &bull; 1-Yr Grace</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(app.status)}
                    {app.nextDisbursementMilestone && (
                      <div className="text-[9.5px] text-slate-500 mt-1 max-w-xs truncate">
                        Next: {app.nextDisbursementMilestone}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <a
                      href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition"
                      title="Inspect Bank Feasibility Dossier"
                    >
                      <FileText className="w-3 h-3 text-emerald-700" />
                      <span>Dossier</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
