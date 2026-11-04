'use client';

import React, { useState } from 'react';
import { BuyerSalesOrder } from '@/types/erp';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  Layers,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';

interface SplitPaymentsEscrowEngineProps {
  orders?: BuyerSalesOrder[];
  bdtRate?: number;
}

interface SplitPaymentTranche {
  id: string;
  soId: string;
  soNumber: string;
  poNumber: string;
  buyerCompany: string;
  factoryName: string;
  totalOrderUsd: number;
  totalPoBdt: number;
  currency: string;
  
  // Gate 1: 30% Advance
  gate1Status: 'DISBURSED' | 'PENDING_APPROVAL' | 'AWAITING_LC';
  gate1AmountUsd: number;
  gate1AmountBdt: number;
  gate1Date: string;
  gate1TxRef: string;
  gate1Bank: string;
  
  // Gate 2: 50% Clean B/L
  gate2Status: 'RELEASED' | 'LOCKED_IN_ESCROW' | 'AWAITING_BL';
  gate2AmountUsd: number;
  gate2AmountBdt: number;
  gate2Date?: string;
  gate2TxRef?: string;
  gate2Bank: string;
  blNumber?: string;
  psiCertNo?: string;
  
  // Gate 3: 20% NOC
  gate3Status: 'SETTLED' | 'HELD_FOR_NOC' | 'PENDING_PORT_ARRIVAL';
  gate3AmountUsd: number;
  gate3AmountBdt: number;
  gate3Date?: string;
  gate3TxRef?: string;
  gate3Bank: string;
  nocCertNo?: string;
}

const INITIAL_TRANCHES: SplitPaymentTranche[] = [
  {
    id: 'TR-2026-001',
    soId: 'AMC-SO-2026-001',
    soNumber: 'SO-2026-UK-001',
    poNumber: 'PO-2026-FAC-001',
    buyerCompany: 'Harrods London',
    factoryName: 'Sonali Jute Mills Ltd (Demra)',
    totalOrderUsd: 8400,
    totalPoBdt: 625000,
    currency: 'GBP',
    gate1Status: 'DISBURSED',
    gate1AmountUsd: 1543.20,
    gate1AmountBdt: 187500,
    gate1Date: '2026-10-20',
    gate1TxRef: 'BRAC-FT-2026-98102',
    gate1Bank: 'BRAC Bank PLC Corporate Branch',
    gate2Status: 'LOCKED_IN_ESCROW',
    gate2AmountUsd: 2572.00,
    gate2AmountBdt: 312500,
    gate2Bank: 'BRAC Bank PLC Trade Desk',
    blNumber: 'MSC-CTG-SOU-882194',
    psiCertNo: 'SGS-PSI-2026-019',
    gate3Status: 'HELD_FOR_NOC',
    gate3AmountUsd: 1028.80,
    gate3AmountBdt: 125000,
    gate3Bank: 'BRAC Bank PLC Escrow Vault',
    nocCertNo: 'Awaiting UK Port Intake Receipt',
  },
  {
    id: 'TR-2026-002',
    soId: 'AMC-SO-2026-002',
    soNumber: 'SO-2026-EU-002',
    poNumber: 'PO-2026-FAC-002',
    buyerCompany: 'Galeries Lafayette Paris',
    factoryName: 'Apex Artisan Leatherworks Ltd (Savar)',
    totalOrderUsd: 16800,
    totalPoBdt: 1240000,
    currency: 'EUR',
    gate1Status: 'DISBURSED',
    gate1AmountUsd: 3100.00,
    gate1AmountBdt: 372000,
    gate1Date: '2026-10-18',
    gate1TxRef: 'EBL-TR-2026-44910',
    gate1Bank: 'Eastern Bank PLC Gulshan Corporate',
    gate2Status: 'RELEASED',
    gate2AmountUsd: 5166.66,
    gate2AmountBdt: 620000,
    gate2Date: '2026-11-02',
    gate2TxRef: 'EBL-TR-2026-55102',
    gate2Bank: 'Eastern Bank PLC Trade Desk',
    blNumber: 'HLCU-CTG-LEH-291840',
    psiCertNo: 'INTERTEK-AQL15-9921',
    gate3Status: 'HELD_FOR_NOC',
    gate3AmountUsd: 2066.67,
    gate3AmountBdt: 248000,
    gate3Bank: 'Eastern Bank PLC Escrow Desk',
    nocCertNo: 'NOC-GLP-2026-002-PENDING',
  },
  {
    id: 'TR-2026-003',
    soId: 'AMC-SO-2026-003',
    soNumber: 'SO-2026-US-003',
    poNumber: 'PO-2026-FAC-003',
    buyerCompany: 'Williams-Sonoma USA',
    factoryName: 'Beni Boonon Handcrafted Home Decor Ltd',
    totalOrderUsd: 24500,
    totalPoBdt: 1820000,
    currency: 'USD',
    gate1Status: 'DISBURSED',
    gate1AmountUsd: 4550.00,
    gate1AmountBdt: 546000,
    gate1Date: '2026-10-24',
    gate1TxRef: 'SCB-FT-2026-00192',
    gate1Bank: 'Standard Chartered Bank Dhaka',
    gate2Status: 'LOCKED_IN_ESCROW',
    gate2AmountUsd: 7583.33,
    gate2AmountBdt: 910000,
    gate2Bank: 'Standard Chartered Bank Trade Ops',
    blNumber: 'MSKU-CTG-LAX-481920',
    psiCertNo: 'TUV-QC-2026-441',
    gate3Status: 'HELD_FOR_NOC',
    gate3AmountUsd: 3033.34,
    gate3AmountBdt: 364000,
    gate3Bank: 'Standard Chartered Bank Escrow',
    nocCertNo: 'Awaiting Long Beach Customs Release',
  },
  {
    id: 'TR-2026-004',
    soId: 'AMC-SO-2026-004',
    soNumber: 'SO-2026-EU-004',
    poNumber: 'PO-2026-FAC-004',
    buyerCompany: 'El Corte Inglés Madrid',
    factoryName: 'Bangla Eco (Hazaribagh / Savar)',
    totalOrderUsd: 14200,
    totalPoBdt: 1050000,
    currency: 'EUR',
    gate1Status: 'DISBURSED',
    gate1AmountUsd: 2625.00,
    gate1AmountBdt: 315000,
    gate1Date: '2026-10-28',
    gate1TxRef: 'BRAC-FT-2026-88192',
    gate1Bank: 'BRAC Bank PLC Corporate Branch',
    gate2Status: 'LOCKED_IN_ESCROW',
    gate2AmountUsd: 4375.00,
    gate2AmountBdt: 525000,
    gate2Bank: 'BRAC Bank PLC Trade Desk',
    blNumber: 'CMA-CTG-VAL-772190',
    psiCertNo: 'SGS-AQL15-2026-99',
    gate3Status: 'HELD_FOR_NOC',
    gate3AmountUsd: 1750.00,
    gate3AmountBdt: 210000,
    gate3Bank: 'BRAC Bank PLC Escrow Vault',
    nocCertNo: 'Valencia Port Delivery Inspection Pending',
  },
];

export const SplitPaymentsEscrowEngine: React.FC<SplitPaymentsEscrowEngineProps> = ({
  bdtRate = 120,
}) => {
  const [tranches, setTranches] = useState<SplitPaymentTranche[]>(INITIAL_TRANCHES);
  const [selectedTranche, setSelectedTranche] = useState<SplitPaymentTranche | null>(INITIAL_TRANCHES[0]);
  const [activeGateFilter, setActiveGateFilter] = useState<'ALL' | 'GATE1' | 'GATE2' | 'GATE3'>('ALL');
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Totals
  const totalEscrowUsd = tranches.reduce((sum, t) => sum + t.totalOrderUsd, 0);
  const totalDisbursedAdvanceUsd = tranches.reduce((sum, t) => sum + (t.gate1Status === 'DISBURSED' ? t.gate1AmountUsd : 0), 0);
  const totalLockedInTransitUsd = tranches.reduce((sum, t) => sum + (t.gate2Status === 'LOCKED_IN_ESCROW' ? t.gate2AmountUsd : 0), 0);
  const totalNocReserveUsd = tranches.reduce((sum, t) => sum + (t.gate3Status === 'HELD_FOR_NOC' ? t.gate3AmountUsd : 0), 0);

  const handleAuthorizeGate2 = (trancheId: string) => {
    if (window.confirm('Authorize Stage 2 (50% Clean B/L Release) payment to manufacturer? This confirms Clean On-Board B/L and Passed PSI Inspection.')) {
      setTranches((prev) =>
        prev.map((t) =>
          t.id === trancheId
            ? {
                ...t,
                gate2Status: 'RELEASED',
                gate2Date: new Date().toISOString().split('T')[0],
                gate2TxRef: `BRAC-FT-${Date.now().toString().slice(-6)}`,
              }
            : t
        )
      );
      if (selectedTranche?.id === trancheId) {
        setSelectedTranche((prev) =>
          prev
            ? {
                ...prev,
                gate2Status: 'RELEASED',
                gate2Date: new Date().toISOString().split('T')[0],
                gate2TxRef: `BRAC-FT-${Date.now().toString().slice(-6)}`,
              }
            : null
        );
      }
    }
  };

  const handleAuthorizeGate3 = (trancheId: string) => {
    if (window.confirm('Authorize Final Stage 3 (20% Delivery NOC Release) to manufacturer? This confirms port customs clearance and buyer acceptance.')) {
      setTranches((prev) =>
        prev.map((t) =>
          t.id === trancheId
            ? {
                ...t,
                gate3Status: 'SETTLED',
                gate3Date: new Date().toISOString().split('T')[0],
                gate3TxRef: `BRAC-FT-${Date.now().toString().slice(-6)}`,
                nocCertNo: `NOC-APPROVED-${Date.now().toString().slice(-5)}`,
              }
            : t
        )
      );
      if (selectedTranche?.id === trancheId) {
        setSelectedTranche((prev) =>
          prev
            ? {
                ...prev,
                gate3Status: 'SETTLED',
                gate3Date: new Date().toISOString().split('T')[0],
                gate3TxRef: `BRAC-FT-${Date.now().toString().slice(-6)}`,
                nocCertNo: `NOC-APPROVED-${Date.now().toString().slice(-5)}`,
              }
            : null
        );
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Institutional Top Header */}
      <div className="p-6 rounded-2xl bg-[#1F3A2E] text-white border-b-[3px] border-[#C8A96A] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] text-[10px] font-mono font-bold uppercase tracking-wider">
              Department 6 Commercial Finance
            </span>
            <span className="text-xs text-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Tri-Partite Escrow Protocol</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat'] tracking-tight">
            {ArielMC.name} Split Payments &amp; Milestone Escrow Directorate
          </h2>
          <p className="text-xs text-white/80 max-w-2xl font-['Open_Sans'] mt-1">
            Enforcing the strict <strong>30% Advance Procurement | 50% Clean B/L &amp; PSI Pass | 20% Delivery NOC</strong> cash-flow architecture between international buyers and certified Bangladesh factories.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowVoucherModal(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-['Montserrat'] flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#1F3A2E]" />
            <span>Print Escrow Voucher</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Escrow Orders</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-xl font-bold font-mono text-[#1F3A2E] block mt-1">
            ${totalEscrowUsd.toLocaleString()} USD
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            ৳{((totalEscrowUsd * bdtRate) / 100000).toFixed(1)} Lakh BDT Portfolio
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">30% Factory Advance (Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-xl font-bold font-mono text-emerald-900 block mt-1">
            ${totalDisbursedAdvanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            100% Disbursed on Raw Material Lock
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-800 uppercase">50% In-Transit Locked (Clean B/L)</span>
            <Lock className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-xl font-bold font-mono text-blue-900 block mt-1">
            ${totalLockedInTransitUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
          <span className="text-[10px] text-blue-700 font-medium mt-0.5 block">
            Released upon Clean On-Board B/L &amp; PSI
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#C8A96A]/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A6D3B] uppercase">20% Final NOC Reserve</span>
            <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
          </div>
          <span className="text-xl font-bold font-mono text-[#8A6D3B] block mt-1">
            ${totalNocReserveUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
          <span className="text-[10px] text-[#8A6D3B] font-medium mt-0.5 block">
            Protected until Port Warehouse Intake
          </span>
        </div>
      </div>

      {/* Visual Workflow Explainer Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs">
        <h4 className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C8A96A]" />
          <span>The 3 Statutory Split Payment Release Gates</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold text-[10px] flex items-center justify-center">1</span>
              <span className="text-xs font-bold text-[#1F3A2E]">30% Advance Procurement</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Triggered immediately upon official Purchase Order execution and signing of the Sourcing Deed. Protects factory raw material yarn &amp; hide purchase.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-mono font-bold text-[10px] flex items-center justify-center">2</span>
              <span className="text-xs font-bold text-[#1F3A2E]">50% Clean B/L &amp; PSI Pass</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Locked until shipping line issues original Clean On-Board Bill of Lading, Chattogram customs validates EXP form, and third-party PSI certifies AQL 1.5/2.5.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono font-bold text-[10px] flex items-center justify-center">3</span>
              <span className="text-xs font-bold text-[#1F3A2E]">20% Delivery Acceptance NOC</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Final release upon vessel arrival at destination port (Felixstowe / Southampton / Long Beach), container devanning, and buyer issuance of Delivery NOC.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Payment Register Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
              Live Commercial Contracts &amp; Tranche Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Tracking payment release verification across all active buyer sales orders and factory back-to-back POs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F4F6F4] p-1 rounded-xl border border-[#DDE3DD] text-xs">
            <button
              type="button"
              onClick={() => setActiveGateFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${activeGateFilter === 'ALL' ? 'bg-[#1F3A2E] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#1F3A2E]'}`}
            >
              All Tranches ({tranches.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveGateFilter('GATE2')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${activeGateFilter === 'GATE2' ? 'bg-[#1F3A2E] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#1F3A2E]'}`}
            >
              Gate 2 (50%) Actionable
            </button>
            <button
              type="button"
              onClick={() => setActiveGateFilter('GATE3')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${activeGateFilter === 'GATE3' ? 'bg-[#1F3A2E] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-[#1F3A2E]'}`}
            >
              Gate 3 (20%) Reserves
            </button>
          </div>
        </div>

        {/* Tranche Cards */}
        <div className="space-y-4">
          {tranches
            .filter((t) => {
              if (activeGateFilter === 'GATE2') return t.gate2Status === 'LOCKED_IN_ESCROW';
              if (activeGateFilter === 'GATE3') return t.gate3Status === 'HELD_FOR_NOC';
              return true;
            })
            .map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-[#DDE3DD] hover:border-[#C8A96A] bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#FAF5EC] text-[#8A6D3B] font-bold border border-[#C8A96A]/50">
                      {t.soNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2">
                        <span>{t.buyerCompany}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700 font-normal">{t.factoryName}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>PO Ref: <strong className="font-mono text-slate-700">{t.poNumber}</strong></span>
                        <span>&bull;</span>
                        <span>Total SO: <strong className="font-mono text-[#1F3A2E]">${t.totalOrderUsd.toLocaleString()} USD</strong></span>
                        <span>&bull;</span>
                        <span>PO Outward: <strong className="font-mono text-slate-700">৳{t.totalPoBdt.toLocaleString()} BDT</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                      B/L: {t.blNumber || 'Awaiting Vessel'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTranche(t);
                        setShowVoucherModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] text-[#1F3A2E] text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Dossier</span>
                    </button>
                  </div>
                </div>

                {/* 3 Gates Progress Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Gate 1 Card */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Stage 1: 30% Advance</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {t.gate1Status}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono text-[#1F3A2E]">
                        ${t.gate1AmountUsd.toFixed(2)} USD
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        ৳{t.gate1AmountBdt.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                      <div>Paid: <strong className="text-slate-700">{t.gate1Date}</strong></div>
                      <div className="truncate">Ref: <strong className="font-mono text-slate-700">{t.gate1TxRef}</strong></div>
                    </div>
                  </div>

                  {/* Gate 2 Card */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${t.gate2Status === 'RELEASED' ? 'bg-[#F8FAF8] border-emerald-200' : 'bg-blue-50/50 border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-900 uppercase flex items-center gap-1">
                        {t.gate2Status === 'RELEASED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>Stage 2: 50% Clean B/L</span>
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${t.gate2Status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        {t.gate2Status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono text-[#1F3A2E]">
                        ${t.gate2AmountUsd.toFixed(2)} USD
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        ৳{t.gate2AmountBdt.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                      <div>PSI: <strong className="text-slate-700">{t.psiCertNo || 'In Queue'}</strong></div>
                      {t.gate2Status === 'LOCKED_IN_ESCROW' ? (
                        <button
                          type="button"
                          onClick={() => handleAuthorizeGate2(t.id)}
                          className="w-full mt-1.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                        >
                          Authorize 50% Release
                        </button>
                      ) : (
                        <div className="text-emerald-700 font-semibold">Disbursed: {t.gate2Date}</div>
                      )}
                    </div>
                  </div>

                  {/* Gate 3 Card */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${t.gate3Status === 'SETTLED' ? 'bg-[#F8FAF8] border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
                        {t.gate3Status === 'SETTLED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>Stage 3: 20% NOC Release</span>
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${t.gate3Status === 'SETTLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.gate3Status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono text-[#1F3A2E]">
                        ${t.gate3AmountUsd.toFixed(2)} USD
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        ৳{t.gate3AmountBdt.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                      <div className="truncate">NOC: <strong className="text-slate-700">{t.nocCertNo}</strong></div>
                      {t.gate3Status === 'HELD_FOR_NOC' ? (
                        <button
                          type="button"
                          onClick={() => handleAuthorizeGate3(t.id)}
                          className="w-full mt-1.5 py-1 rounded-lg bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] font-bold text-[11px] transition cursor-pointer shadow-xs"
                        >
                          Release 20% Delivery NOC
                        </button>
                      ) : (
                        <div className="text-emerald-700 font-semibold">Settled &amp; Closed</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Official Voucher Preview Modal */}
      {showVoucherModal && selectedTranche && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#DDE3DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between border-b-2 border-[#C8A96A]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C8A96A]" />
                <div>
                  <h3 className="text-base font-bold font-['Montserrat']">
                    Official Escrow Split Payment Voucher
                  </h3>
                  <p className="text-xs text-white/70">
                    ArielMC Enterprise Commercial Finance Directorate
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="font-mono text-xs font-bold text-[#8A6D3B]">
                    TRANCHE VOUCHER #{selectedTranche.id}
                  </span>
                  <div className="text-sm font-bold text-[#1F3A2E] mt-0.5">
                    {selectedTranche.buyerCompany} &bull; {selectedTranche.soNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Settlement Bank</span>
                  <span className="font-semibold text-slate-800">{selectedTranche.gate1Bank}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Stage 1 (30%)</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">${selectedTranche.gate1AmountUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">DISBURSED</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Stage 2 (50%)</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">${selectedTranche.gate2AmountUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-blue-700 block mt-0.5 font-semibold">{selectedTranche.gate2Status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Stage 3 (20%)</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">${selectedTranche.gate3AmountUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5 font-semibold">{selectedTranche.gate3Status}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40 space-y-1 text-slate-700">
                <div className="font-bold text-[#1F3A2E]">Legal Beneficiary &amp; Traceability Warranty:</div>
                <p className="text-[11px] leading-relaxed">
                  Funds held in escrow strictly disburse according to ArielMC Sourcing Agreement Clause 3 &amp; 4. Pre-Shipment Inspection (PSI) passed under AQL 1.5/2.5 requirements prior to Stage 2 Clean B/L release.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Print Official Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

