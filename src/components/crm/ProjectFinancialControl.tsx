'use client';

import React, { useState } from 'react';
import { ProjectFinancialAccount, MilestoneBillingItem, ProjectCostItem } from '@/types/arelCrm';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Sparkles,
  PieChart,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ProjectFinancialControlProps {
  accounts: ProjectFinancialAccount[];
}

export default function ProjectFinancialControl({ accounts }: ProjectFinancialControlProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(accounts[0]?.projectId || '');

  const activeAccount = accounts.find((a) => a.projectId === selectedProjectId) || accounts[0];

  const totalContractPipelineBdt = accounts.reduce((acc, a) => acc + a.turnkeyContractPriceBdt, 0);
  const totalCollectedBdt = accounts.reduce((acc, a) => acc + a.totalCollectedBdt, 0);
  const totalOutstandingBdt = accounts.reduce((acc, a) => acc + a.totalOutstandingBdt, 0);
  const totalGrossProfitBdt = accounts.reduce((acc, a) => acc + a.grossProfitBdt, 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Turnkey Revenue</div>
          <div className="text-xl font-extrabold text-[#0A1A2F] mt-1 font-mono">
            Tk {(totalContractPipelineBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Commercial EPC Contracts</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Cash Collected</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">
            Tk {(totalCollectedBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Via 80% Debt &amp; 20% ERQ LC</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Gross Turnkey Margin</div>
          <div className="text-xl font-extrabold text-[#C8A96A] mt-1 font-mono">
            Tk {(totalGrossProfitBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-slate-600 font-bold mt-0.5">Exactly 25.0% Gross Profit</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Outstanding Receivables</div>
          <div className="text-xl font-extrabold text-amber-600 mt-1 font-mono">
            Tk {(totalOutstandingBdt / 10000000).toFixed(2)} Crore
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Milestones pending installation</div>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700 uppercase">Select Project Financial Account:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
          >
            {accounts.map((acc) => (
              <option key={acc.projectId} value={acc.projectId}>
                {acc.projectName} ({acc.capacityKwp} kWp)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Statutory Margin Rule:</span>
          <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            AUDITED 25.0% GROSS MARGIN
          </span>
        </div>
      </div>

      {/* Active Project Financial Deep-Dive */}
      {activeAccount && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Project P&L Summary */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                PROJECT PROFIT &amp; LOSS STATEMENT
              </span>
              <h4 className="text-base font-bold text-[#0A1A2F] mt-0.5">
                {activeAccount.projectName}
              </h4>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Turnkey Contract Revenue:</span>
                <span className="font-bold text-slate-900">
                  Tk {activeAccount.turnkeyContractPriceBdt.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-red-700">
                <span>(-) Actual Landed COGS:</span>
                <span className="font-bold">
                  Tk {activeAccount.actualTotalCostBdt.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 px-2 rounded-lg text-emerald-900 font-bold border border-emerald-200">
                <span>(=) Gross Profit (25.0%):</span>
                <span>Tk {activeAccount.grossProfitBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 text-[11px]">
                <span>Realized Gross Margin:</span>
                <span className="font-bold text-emerald-700">{activeAccount.realizedGrossMarginPct.toFixed(1)}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800 text-[11px] uppercase font-mono">
                5% Defect Liability Period (DLP) Retention:
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Retention Amount:</span>
                <span className="font-bold text-slate-900">Tk {activeAccount.retention5PercentBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-500">
                <span>Maturity Release Date:</span>
                <span>{activeAccount.retentionMaturityDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
              <div className="font-bold text-amber-900 text-[11px] uppercase font-mono">
                SREDA Net-Metering Surplus Yield:
              </div>
              <div className="text-amber-800 font-mono text-sm font-bold">
                Tk {activeAccount.annualSurplusCashExportBdt.toLocaleString()} / Year
              </div>
              <div className="text-[10px] text-amber-700">
                Guaranteed cash buyback @ Tk 10.50/kWh for weekend export.
              </div>
            </div>
          </div>

          {/* Right Column: Milestone Invoices & Cost Ledger */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Milestone Billing Schedule */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Milestone Billing &amp; Collections Schedule
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  Collected: Tk {(activeAccount.totalCollectedBdt / 100000).toFixed(2)} Lakh / Tk {(activeAccount.turnkeyContractPriceBdt / 100000).toFixed(2)} Lakh
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">Milestone Scope</th>
                      <th className="py-2 px-3">%</th>
                      <th className="py-2 px-3">Amount (BDT)</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3 text-right">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeAccount.milestones.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{m.milestoneTitle}</td>
                        <td className="py-2.5 px-3">{m.percentage}%</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          Tk {m.amountBdt.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{m.dueDate}</td>
                        <td className="py-2.5 px-3 text-right">
                          {m.status === 'paid_in_bank' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Paid in Bank
                            </span>
                          )}
                          {m.status === 'invoice_issued' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Invoice Issued
                            </span>
                          )}
                          {m.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                              Pending Milestone
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct Cost Itemized Ledger */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Direct Cost Expense Ledger (BOM &amp; Subcontractors)
                </h4>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Total COGS: Tk {(activeAccount.actualTotalCostBdt / 100000).toFixed(2)} Lakh
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Description &amp; Vendor</th>
                      <th className="py-2 px-3">Budgeted</th>
                      <th className="py-2 px-3">Actual Spent</th>
                      <th className="py-2 px-3 text-right">Ledger Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeAccount.costLedger.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-[10px] font-bold text-slate-500">
                          {c.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{c.description}</div>
                          <div className="text-[10px] text-slate-400">{c.vendorName}</div>
                        </td>
                        <td className="py-2 px-3 text-slate-600">Tk {c.budgetedAmountBdt.toLocaleString()}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          Tk {c.actualSpentAmountBdt.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
