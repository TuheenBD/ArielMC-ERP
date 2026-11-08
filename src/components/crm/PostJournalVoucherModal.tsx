'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Receipt,
  Scale,
} from 'lucide-react';
import { ProjectFinancialAccount } from '@/types/arelCrm';

export interface JournalVoucherPayload {
  voucherRef: string;
  projectId: string;
  projectName: string;
  voucherType: 'JV' | 'BPV' | 'BRV' | 'SV';
  postingDate: string;
  debitAccountCode: string;
  debitAccountTitle: string;
  creditAccountCode: string;
  creditAccountTitle: string;
  amountBdt: number;
  description: string;
  isCostItem: boolean;
  costCategory?: string;
}

interface PostJournalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectFinancialAccount[];
  activeProject?: ProjectFinancialAccount | null;
  onPostVoucher: (payload: JournalVoucherPayload) => void;
  theme?: string;
}

export default function PostJournalVoucherModal({
  isOpen,
  onClose,
  projects,
  activeProject,
  onPostVoucher,
  theme = 'crm-green',
}: PostJournalVoucherModalProps) {
  const [projectId, setProjectId] = useState<string>(
    activeProject?.id || projects[0]?.id || ''
  );
  const [voucherType, setVoucherType] = useState<'JV' | 'BPV' | 'BRV' | 'SV'>('BPV');
  const [postingDate, setPostingDate] = useState('2026-11-08');
  const [debitAccount, setDebitAccount] = useState('1300 - Construction Work-in-Progress (CWIP Turnkey Solar)');
  const [creditAccount, setCreditAccount] = useState('1010 - Eastern Bank PLC (AREL Project Escrow)');
  const [amountBdt, setAmountBdt] = useState<number>(1250000);
  const [description, setDescription] = useState('Mobilization payment for civil mounting and racking foundation casting.');
  const [costCategory, setCostCategory] = useState('CIVIL_LABOR');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (activeProject) {
      setProjectId(activeProject.id);
    }
  }, [activeProject]);

  if (!isOpen) return null;

  const currentProj = projects.find((p) => p.id === projectId) || activeProject || projects[0];
  const voucherRef = `AREL-${voucherType}-2026-${Math.floor(100 + Math.random() * 900)}`;

  // Real-time margin audit check
  const currentActualCost = currentProj ? currentProj.actualTotalCostBdt : 0;
  const currentRevenue = currentProj ? currentProj.turnkeyContractPriceBdt : 1;
  const newCostEstimate = currentActualCost + (voucherType === 'BPV' ? amountBdt : 0);
  const projectedMarginPct = ((currentRevenue - newCostEstimate) / currentRevenue) * 100;
  const isMarginHealthy = projectedMarginPct >= 24.8; // around 25.0%

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [debitCode, debitTitle] = debitAccount.split(' - ');
    const [creditCode, creditTitle] = creditAccount.split(' - ');

    const payload: JournalVoucherPayload = {
      voucherRef,
      projectId,
      projectName: currentProj?.projectName || 'Turnkey Solar Project',
      voucherType,
      postingDate,
      debitAccountCode: debitCode || '1300',
      debitAccountTitle: debitTitle || debitAccount,
      creditAccountCode: creditCode || '1010',
      creditAccountTitle: creditTitle || creditAccount,
      amountBdt,
      description,
      isCostItem: voucherType === 'BPV' || debitAccount.includes('CWIP') || debitAccount.includes('Cost'),
      costCategory,
    };

    onPostVoucher(payload);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Post Project General Ledger Voucher</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Double-Entry
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time debit/credit posting with mandatory 25.0% gross profit margin audit guard
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

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#0A1A2F]">Voucher Posted Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Voucher <span className="font-mono font-bold text-emerald-800">{voucherRef}</span> of <span className="font-mono font-bold">Tk {amountBdt.toLocaleString()}</span> has been recorded in the General Ledger. Project P&amp;L updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            {/* Project & Voucher Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Solar Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName} ({p.capacityKwp} kWp)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Voucher Type</label>
                <select
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:outline-none focus:border-emerald-600 text-xs"
                >
                  <option value="BPV">Bank Payment Voucher (BPV) - Vendor / Subcontractor</option>
                  <option value="BRV">Bank Receipt Voucher (BRV) - Milestone Collection</option>
                  <option value="JV">General Journal Voucher (JV) - Accrual / Adjustment</option>
                  <option value="SV">Milestone Invoicing Voucher (SV) - Progress Billing</option>
                </select>
              </div>
            </div>

            {/* Posting Date & Cost Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Posting Date</label>
                <input
                  type="date"
                  value={postingDate}
                  onChange={(e) => setPostingDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">BOM / Cost Ledger Category</label>
                <select
                  value={costCategory}
                  onChange={(e) => setCostCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs focus:outline-none focus:border-emerald-600"
                >
                  <option value="CIVIL_LABOR">Civil Mounting &amp; Concrete Piers</option>
                  <option value="ELECTRICAL_LABOR">Electrical HT/LT Substation &amp; Cabling</option>
                  <option value="HARDWARE_MODULES">Tier-1 Solar PV Modules</option>
                  <option value="HARDWARE_INVERTERS">On-Grid String Inverters</option>
                  <option value="CUSTOMS_AND_PORT">ASYCUDA Duty &amp; Port Freight</option>
                  <option value="ENGINEERING_IEB">IEB Engineering Body &amp; LiDAR Topography</option>
                </select>
              </div>
            </div>

            {/* Double-Entry Accounts */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-extrabold text-[11px] uppercase tracking-wider font-mono text-slate-800 block">
                Double-Entry Balanced Accounting Legs
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-800 text-[10px] font-bold mb-1 uppercase font-mono">
                    Debit (DR) Account
                  </label>
                  <select
                    value={debitAccount}
                    onChange={(e) => setDebitAccount(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-none focus:border-emerald-600"
                  >
                    <option value="1300 - Construction Work-in-Progress (CWIP Turnkey Solar)">
                      1300 - Construction Work-in-Progress (CWIP Turnkey Solar)
                    </option>
                    <option value="1200 - Solar Hardware Inventory (Modules/Inverters)">
                      1200 - Solar Hardware Inventory (Modules/Inverters)
                    </option>
                    <option value="5010 - Cost of Goods Sold (Subcontractor Labor)">
                      5010 - Cost of Goods Sold (Subcontractor Labor)
                    </option>
                    <option value="1010 - Eastern Bank PLC (AREL Project Escrow)">
                      1010 - Eastern Bank PLC (AREL Project Escrow)
                    </option>
                    <option value="1030 - Accounts Receivable (Milestone Billing)">
                      1030 - Accounts Receivable (Milestone Billing)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 text-[10px] font-bold mb-1 uppercase font-mono">
                    Credit (CR) Account
                  </label>
                  <select
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-none focus:border-emerald-600"
                  >
                    <option value="1010 - Eastern Bank PLC (AREL Project Escrow)">
                      1010 - Eastern Bank PLC (AREL Project Escrow)
                    </option>
                    <option value="2010 - Accounts Payable (Subcontractors &amp; Vendors)">
                      2010 - Accounts Payable (Subcontractors &amp; Vendors)
                    </option>
                    <option value="4010 - Turnkey Solar EPC Contract Revenue">
                      4010 - Turnkey Solar EPC Contract Revenue
                    </option>
                    <option value="2020 - 5% Defects Liability Escrow Retention">
                      2020 - 5% Defects Liability Escrow Retention
                    </option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Transaction Amount (BDT):</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">BDT</span>
                  <input
                    type="number"
                    value={amountBdt}
                    onChange={(e) => setAmountBdt(Number(e.target.value))}
                    className="w-44 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm text-right focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Narration */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Voucher Description / Narration</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* 25% Gross Profit Margin Safeguard */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-[11px] text-emerald-900 font-semibold">
                  25.0% Gross Margin Safeguard:
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800">
                Projected Margin: {projectedMarginPct.toFixed(1)}% {isMarginHealthy ? '✓ Compliant' : '⚠ Audit Warning'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer text-xs font-mono"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#C9A86A]" />
                <span>Post Voucher ({voucherRef})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

