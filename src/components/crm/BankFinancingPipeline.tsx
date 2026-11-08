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
  Eye,
  Edit3,
  Trash2,
  Share2,
  X,
  Printer,
  Copy,
} from 'lucide-react';

interface BankFinancingPipelineProps {
  applications: BankLoanApplication[];
  onUpdateStatus?: (id: string, newStatus: BankLoanStatus) => void;
  onEditApplication?: (app: BankLoanApplication) => void;
  onDeleteApplication?: (id: string) => void;
  theme?: string;
}

export default function BankFinancingPipeline({
  applications,
  onUpdateStatus,
  onEditApplication,
  onDeleteApplication,
  theme = 'crm-green',
}: BankFinancingPipelineProps) {
  const [selectedPfi, setSelectedPfi] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [selectedAppForDossier, setSelectedAppForDossier] = useState<BankLoanApplication | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // Multi-select & CRUD states
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [editingApp, setEditingApp] = useState<BankLoanApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<BankLoanApplication | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedAppIds.length === filtered.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filtered.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedAppIds.length} loan applications?`)) {
      if (onDeleteApplication) {
        selectedAppIds.forEach((id) => onDeleteApplication(id));
      }
      setSelectedAppIds([]);
      showToast(`Deleted ${selectedAppIds.length} loan applications`);
    }
  };

  // Share handler
  const handleShare = (app: BankLoanApplication, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=banking&appId=${app.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Dossier URL for ${app.applicationCode} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Download PDF handler
  const handleDownloadPdf = (app: BankLoanApplication, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating Bankable Dossier PDF for ${app.applicationCode}...`);

    setTimeout(() => {
      const docContent = `
================================================================================
BANGLADESH BANK GREEN TRANSFORMATION & SFD 4.5% REFINANCE DOSSIER
CONFIDENTIAL CREDIT APPRAISAL PACKET
================================================================================
Application Ref:      ${app.applicationCode}
Factory Name:         ${app.factoryName}
Lead ID:              ${app.leadId}
Target PFI Bank:      ${app.targetPfi}
SFD Desk Officer:     ${app.sfdDeskOfficerName} (${app.sfdDeskOfficerContact})

FACILITY DETAILS:
Total Concessionary Debt: Tk ${(app.loanFacilityAmountBdt / 10000000).toFixed(2)} Crore (80%)
Promoter Equity:          Tk ${(app.clientEquityAmountBdt / 10000000).toFixed(2)} Crore (20%)
Total Capital Outlay:     Tk ${((app.loanFacilityAmountBdt + app.clientEquityAmountBdt) / 10000000).toFixed(2)} Crore
Fixed Interest Rate:      ${app.fixedInterestRatePct}% per annum
Loan Tenure:              ${app.tenureMonths} Months (${Math.round(app.tenureMonths / 12)} Years)
Moratorium / Grace:       ${app.moratoriumGraceMonths} Months
Projected DSCR:           ${app.dscrProjected}x
First Disbursement Date:  ${app.nextDisbursementMilestone || 'Pending Committee Review'}

AUDIT VERIFICATION:
Status:                   ${app.status.toUpperCase()}
Disbursed Amount to Date: Tk ${(app.disbursedAmountBdt / 10000000).toFixed(2)} Crore
Debt Refinance Window:    Bangladesh Bank SFD Circular No. 04/2020 & 02/2023
Technical Certifier:      Ariel Renewable Energy Limited (AREL-ENG-2026)
================================================================================
      `;
      const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${app.applicationCode}_Bank_Dossier.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    if (onEditApplication) {
      onEditApplication(editingApp);
    }
    showToast(`Updated Application ${editingApp.applicationCode}`);
    setEditingApp(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingApp) return;
    if (onDeleteApplication) {
      onDeleteApplication(deletingApp.id);
    }
    setSelectedAppIds((prev) => prev.filter((id) => id !== deletingApp.id));
    showToast(`Deleted ${deletingApp.applicationCode}`);
    setDeletingApp(null);
  };

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
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Green Loan Facility</div>
          <div className="text-lg font-black text-[#0A1A2F] mt-1 font-mono">
            Tk {(totalFacilityBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">80% Concessionary Debt @ 4.5%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Disbursed to Date</div>
          <div className="text-lg font-black text-emerald-700 mt-1 font-mono">
            Tk {(totalDisbursedBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disbursed against milestones</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Fixed Interest Rate</div>
          <div className="text-lg font-black text-amber-600 mt-1 font-mono">
            4.50% Fixed
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bangladesh Bank Refinance</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Average Portfolio DSCR</div>
          <div className="text-lg font-black text-emerald-800 mt-1 font-mono">
            1.57x
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Cut-off: 1.20x</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700 uppercase">PFI Bank:</span>
          <select
            value={selectedPfi}
            onChange={(e) => setSelectedPfi(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All PFIs &amp; IDCOL</option>
            <option value="BRAC Bank PLC">BRAC Bank PLC</option>
            <option value="City Bank PLC">City Bank PLC</option>
            <option value="Eastern Bank (EBL)">Eastern Bank (EBL)</option>
            <option value="Prime Bank PLC">Prime Bank PLC</option>
            <option value="IDCOL">IDCOL</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Selection Bar */}
          {selectedAppIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedAppIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected applications"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenDossier()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white text-xs font-bold transition font-mono cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Bank Dossier</span>
          </button>
        </div>
      </div>

      {/* Applications Conditional View */}
      {displayMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedAppIds.length === filtered.length}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3">Application &amp; Client</th>
                  <th className="py-2.5 px-3">PFI Bank &amp; SFD Officer</th>
                  <th className="py-2.5 px-3">Facility (80% Debt)</th>
                  <th className="py-2.5 px-3">Equity (20%)</th>
                  <th className="py-2.5 px-3">DSCR &amp; Tenure</th>
                  <th className="py-2.5 px-3">Appraisal Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((app) => {
                  const isSelected = selectedAppIds.includes(app.id);

                  return (
                    <tr key={app.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(app.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#0A1A2F]">{app.factoryName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{app.applicationCode}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <Building className="w-3 h-3 text-emerald-700" />
                          <span>{app.targetPfi}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Desk: {app.sfdDeskOfficerName}</div>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                        Tk {(app.loanFacilityAmountBdt / 10000000).toFixed(2)} Cr
                        <div className="text-[10px] text-slate-400 font-normal">
                          Disbursed: Tk {(app.disbursedAmountBdt / 10000000).toFixed(2)} Cr
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        Tk {(app.clientEquityAmountBdt / 10000000).toFixed(2)} Cr
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        <div className="font-bold text-[#0A1A2F]">{app.dscrProjected}x DSCR</div>
                        <div className="text-[10px] text-slate-400">
                          {Math.round(app.tenureMonths / 12)}y ({Math.round(app.moratoriumGraceMonths / 12)}y Grace)
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* View Dossier */}
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(app)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="View Bank Dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Edit Application */}
                          <button
                            type="button"
                            onClick={() => setEditingApp({ ...app })}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Edit Loan Application Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          </button>

                          {/* Share Dossier Link */}
                          <button
                            type="button"
                            onClick={(e) => handleShare(app, e)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Share Dossier Link"
                          >
                            <Share2 className="w-3.5 h-3.5 text-teal-600" />
                          </button>

                          {/* Download Dossier PDF */}
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPdf(app, e)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Download Dossier PDF / Report"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-700" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingApp(app)}
                            className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                            title="Delete Application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
        /* Applications Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((app) => {
            const isSelected = selectedAppIds.includes(app.id);

            return (
              <div
                key={app.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 ${
                  isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(app.id, e)}
                        className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold block">{app.applicationCode}</span>
                        <h4 className="font-bold text-[#0A1A2F] text-sm">{app.factoryName}</h4>
                      </div>
                    </div>
                    <div>{getStatusBadge(app.status)}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
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

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs font-mono">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">80% Green Debt</div>
                      <div className="text-xs font-black text-emerald-800 mt-0.5">
                        Tk {(app.loanFacilityAmountBdt / 10000000).toFixed(2)} Cr
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">20% Client Equity</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">
                        Tk {(app.clientEquityAmountBdt / 10000000).toFixed(2)} Cr
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Disbursed: Tk {(app.disbursedAmountBdt / 10000000).toFixed(2)} Cr
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDossier(app)}
                      className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                      title="View Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingApp({ ...app })}
                      className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(app, e)}
                      className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPdf(app, e)}
                      className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingApp(app)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Edit Application Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-[#0A1A2F]">Edit Bank Application: {editingApp.applicationCode}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Factory Name</label>
                <input
                  type="text"
                  value={editingApp.factoryName}
                  onChange={(e) => setEditingApp({ ...editingApp, factoryName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target PFI Bank</label>
                  <select
                    value={editingApp.targetPfi}
                    onChange={(e) => setEditingApp({ ...editingApp, targetPfi: e.target.value as BankPfi })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  >
                    <option value="Eastern Bank (EBL)">Eastern Bank (EBL)</option>
                    <option value="BRAC Bank PLC">BRAC Bank PLC</option>
                    <option value="City Bank PLC">City Bank PLC</option>
                    <option value="Prime Bank PLC">Prime Bank PLC</option>
                    <option value="IDCOL">IDCOL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">SFD Desk Officer</label>
                  <input
                    type="text"
                    value={editingApp.sfdDeskOfficerName}
                    onChange={(e) => setEditingApp({ ...editingApp, sfdDeskOfficerName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Facility Amount (BDT)</label>
                  <input
                    type="number"
                    value={editingApp.loanFacilityAmountBdt}
                    onChange={(e) => setEditingApp({ ...editingApp, loanFacilityAmountBdt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Equity (BDT)</label>
                  <input
                    type="number"
                    value={editingApp.clientEquityAmountBdt}
                    onChange={(e) => setEditingApp({ ...editingApp, clientEquityAmountBdt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Projected DSCR</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingApp.dscrProjected}
                    onChange={(e) => setEditingApp({ ...editingApp, dscrProjected: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Appraisal Status</label>
                  <select
                    value={editingApp.status}
                    onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as BankLoanStatus })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  >
                    <option value="dossier_submitted">1. Dossier Submitted</option>
                    <option value="lenders_engineer_audit">2. Lender's Engineer Audit</option>
                    <option value="credit_committee_review">3. Credit Committee Appraisal</option>
                    <option value="sanction_letter_issued">4. Sanction Letter Issued (4.5%)</option>
                    <option value="milestone_disbursement_active">5. Milestone Tranches Active</option>
                    <option value="fully_amortized">6. Fully Amortized</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete loan application <span className="font-mono font-bold text-rose-600">{deletingApp.applicationCode}</span> ({deletingApp.factoryName})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingApp(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
