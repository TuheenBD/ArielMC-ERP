'use client';

import React, { useState } from 'react';
import {
  Landmark,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign,
} from 'lucide-react';
import { BankLoanApplication, BankLoanStatus } from '@/types/arelCrm';

interface BankDossierModalProps {
  application: BankLoanApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (applicationId: string, newStatus: BankLoanStatus) => void;
  theme?: string;
}

export default function BankDossierModal({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  theme = 'crm-green',
}: BankDossierModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<BankLoanStatus>(
    application?.status || 'dossier_submitted'
  );
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const totalCapex = application.loanFacilityAmountBdt + application.clientEquityAmountBdt;
  const equityBdt = application.clientEquityAmountBdt;
  const debtBdt = application.loanFacilityAmountBdt;
  const projectName = application.factoryName;
  const bankName = application.targetPfi;
  const dscrValue = application.dscrProjected;

  // 10-Year Amortization schedule generator (4.5% fixed interest, 10-year tenor, 1-yr grace)
  const annualPrincipal = debtBdt / 9; // 9 repayment years after 1-yr grace
  const schedule = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const isGrace = year === 1;
    const remainingDebt = isGrace ? debtBdt : Math.max(0, debtBdt - annualPrincipal * (year - 1));
    const interest = remainingDebt * 0.045;
    const principal = isGrace ? 0 : annualPrincipal;
    const totalDebtService = principal + interest;
    // Estimated annual generation revenue at Tk 10.50/kWh (assuming ~1,450 kWh/kWp/yr)
    const annualSavingsBdt = (totalCapex / 52000) * 1450 * 10.50; // estimate based on capex
    const netCashFlow = annualSavingsBdt - totalDebtService;
    const dscr = totalDebtService > 0 ? (annualSavingsBdt / totalDebtService) : 2.5;

    return {
      year,
      remainingDebt,
      principal,
      interest,
      totalDebtService,
      annualSavingsBdt,
      netCashFlow,
      dscr,
    };
  });

  const handleSaveStatus = () => {
    setIsUpdating(true);
    onUpdateStatus(application.id, selectedStatus);
    setTimeout(() => {
      setIsUpdating(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
                  Bankable Feasibility Dossier &amp; Debt Amortization
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  4.5% Refinance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {projectName} • Target PFI: {bankName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 text-xs font-sans overflow-y-auto flex-1">
          {/* Key Deal Terms Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Total CapEx</span>
              <span className="text-sm font-bold font-mono text-[#0A1A2F]">
                Tk {(totalCapex / 10000000).toFixed(2)} Cr
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">70% Debt Facility</span>
              <span className="text-sm font-bold font-mono text-emerald-700">
                Tk {(debtBdt / 10000000).toFixed(2)} Cr
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Interest &amp; Tenor</span>
              <span className="text-sm font-bold font-mono text-[#0A1A2F]">
                4.5% • 10 Yrs
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Audited DSCR</span>
              <span className="text-sm font-bold font-mono text-emerald-800">
                {dscrValue ? `${dscrValue}x` : '1.62x'} (Min: 1.45x)
              </span>
            </div>
          </div>

          {/* Regulatory & Circulars */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-900 leading-relaxed">
              <strong>Bangladesh Bank Refinance Desk SFD Circular No. 02/2024:</strong> Eligible under industrial green transformation. Maximum lending cap at 70% of audited EPC invoice. SREDA Net-Metering approval enables bi-directional feed-in tariff at Tk 10.50/kWh credited directly against factory utility invoice.
            </div>
          </div>

          {/* 10-Year Amortization Schedule Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-[11px] uppercase tracking-wider font-mono text-slate-800">
                10-Year Debt Service &amp; Cash Flow Waterfall (BDT)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-Year Grace Period Active</span>
            </div>
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-[#0A1A2F] text-white uppercase text-[9px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Remaining Debt</th>
                    <th className="py-2.5 px-3">Principal (BDT)</th>
                    <th className="py-2.5 px-3">Interest (4.5%)</th>
                    <th className="py-2.5 px-3">Total Debt Service</th>
                    <th className="py-2.5 px-3 text-right">Net Cash Flow</th>
                    <th className="py-2.5 px-3 text-center">DSCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 font-bold text-[#0A1A2F]">Year {row.year}</td>
                      <td className="py-2 px-3">Tk {Math.round(row.remainingDebt).toLocaleString()}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {row.principal > 0 ? `Tk ${Math.round(row.principal).toLocaleString()}` : 'Grace Period (0)'}
                      </td>
                      <td className="py-2 px-3 text-amber-700">Tk {Math.round(row.interest).toLocaleString()}</td>
                      <td className="py-2 px-3 font-bold text-[#0A1A2F]">Tk {Math.round(row.totalDebtService).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        +Tk {Math.round(row.netCashFlow).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-800">
                        {row.dscr.toFixed(2)}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workflow Status Advance Control */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800 block text-xs">PFI Workflow Approval Stage</span>
              <span className="text-[10px] text-slate-500">Advance the loan application through credit committee milestones</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as BankLoanStatus)}
                className="p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold text-xs focus:outline-none focus:border-emerald-600 font-mono"
              >
                <option value="dossier_submitted">1. Dossier Submitted</option>
                <option value="lenders_engineer_audit">2. Lender&apos;s Engineer Audit</option>
                <option value="credit_committee_review">3. Credit Committee Appraisal</option>
                <option value="sanction_letter_issued">4. Sanction Letter Issued</option>
                <option value="first_tranche_disbursed">5. First Tranche Disbursed</option>
              </select>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition text-xs cursor-pointer shadow-xs"
              >
                {isUpdating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A1A2F] hover:bg-emerald-800 text-white text-xs font-bold transition font-mono shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Download Bankable Dossier PDF</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
