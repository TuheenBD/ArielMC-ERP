'use client';

import React, { useState } from 'react';
import {
  Landmark,
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
  Sparkles,
  ExternalLink,
  Plus,
  Percent,
  Check,
  Info
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';

interface SubsidyClaim {
  id: string;
  claimRef: string;
  expNumber: string;
  ciNumber: string;
  blNumber: string;
  buyerCompany: string;
  destinationPort: string;
  productSector: 'LEATHER' | 'JUTE' | 'TEXTILE';
  sectorLabel: string;
  hsCode: string;
  realizedUsd: number;
  conversionRateBdt: number;
  realizedBdt: number;
  incentiveRatePct: number; // 10%, 7%, or 4%
  grossIncentiveBdt: number;
  aitSourceTaxPct: number; // 5%
  aitSourceTaxBdt: number;
  netPayoutBdt: number;
  adBankName: string;
  adBranch: string;
  realizationDate: string;
  claimFilingDate: string;
  associationCertNo: string;
  associationBody: string; // BJGEA / LFMEAB
  prcNumber: string;
  status: 'PROCEEDS_REALIZED' | 'SUBMITTED_TO_AD_BANK' | 'AUDIT_FIRM_VERIFIED' | 'SUBSIDY_CREDITED';
}

const INITIAL_CLAIMS: SubsidyClaim[] = [
  {
    id: 'CLM-2026-001',
    claimRef: 'BB-EXP-2026-001-LTH',
    expNumber: 'EXP-CTG-2026-00491',
    ciNumber: 'CI-2026-UK-001',
    blNumber: 'MSC-CTG-SOU-882194',
    buyerCompany: 'Harrods London',
    destinationPort: 'Southampton (SOU), UK',
    productSector: 'LEATHER',
    sectorLabel: 'Finished Leather Goods & Travel Duffles',
    hsCode: '4202.92.00',
    realizedUsd: 14200,
    conversionRateBdt: 121.50,
    realizedBdt: 1725300,
    incentiveRatePct: 10.0,
    grossIncentiveBdt: 172530,
    aitSourceTaxPct: 5.0,
    aitSourceTaxBdt: 8626.50,
    netPayoutBdt: 163903.50,
    adBankName: 'BRAC Bank PLC',
    adBranch: 'Gulshan Corporate Branch, Dhaka',
    realizationDate: '2026-10-25',
    claimFilingDate: '2026-11-01',
    associationCertNo: 'LFMEAB-EXP-CERT-2026-0941',
    associationBody: 'LFMEAB (Leathergoods & Footwear Mfrs & Exporters Assoc)',
    prcNumber: 'PRC-BRAC-2026-881920',
    status: 'AUDIT_FIRM_VERIFIED',
  },
  {
    id: 'CLM-2026-002',
    claimRef: 'BB-EXP-2026-002-JUT',
    expNumber: 'EXP-CTG-2026-00512',
    ciNumber: 'CI-2026-EU-002',
    blNumber: 'HLCU-CTG-LEH-291840',
    buyerCompany: 'Galeries Lafayette Paris',
    destinationPort: 'Le Havre (LEH), France',
    productSector: 'JUTE',
    sectorLabel: 'Diversified Jute Braided Rugs & Shoppers',
    hsCode: '5702.20.00',
    realizedUsd: 18500,
    conversionRateBdt: 121.50,
    realizedBdt: 2247750,
    incentiveRatePct: 7.0,
    grossIncentiveBdt: 157342.50,
    aitSourceTaxPct: 5.0,
    aitSourceTaxBdt: 7867.13,
    netPayoutBdt: 149475.37,
    adBankName: 'BRAC Bank PLC',
    adBranch: 'Gulshan Corporate Branch, Dhaka',
    realizationDate: '2026-10-28',
    claimFilingDate: '2026-11-02',
    associationCertNo: 'BJGEA-JUT-CERT-2026-0418',
    associationBody: 'BJGEA (Bangladesh Jute Goods Exporters Association)',
    prcNumber: 'PRC-BRAC-2026-881944',
    status: 'SUBMITTED_TO_AD_BANK',
  },
  {
    id: 'CLM-2026-003',
    claimRef: 'BB-EXP-2026-003-JUT',
    expNumber: 'EXP-CTG-2026-00530',
    ciNumber: 'CI-2026-US-003',
    blNumber: 'MSKU-CTG-LAX-481920',
    buyerCompany: 'Williams-Sonoma USA',
    destinationPort: 'Long Beach (LAX), USA',
    productSector: 'JUTE',
    sectorLabel: 'Hand-Tufted Jute Mandala & Botanical Rugs',
    hsCode: '5705.00.00',
    realizedUsd: 26800,
    conversionRateBdt: 121.50,
    realizedBdt: 3256200,
    incentiveRatePct: 7.0,
    grossIncentiveBdt: 227934,
    aitSourceTaxPct: 5.0,
    aitSourceTaxBdt: 11396.70,
    netPayoutBdt: 216537.30,
    adBankName: 'BRAC Bank PLC',
    adBranch: 'Gulshan Corporate Branch, Dhaka',
    realizationDate: '2026-10-30',
    claimFilingDate: '2026-11-03',
    associationCertNo: 'BJGEA-JUT-CERT-2026-0429',
    associationBody: 'BJGEA (Bangladesh Jute Goods Exporters Association)',
    prcNumber: 'PRC-BRAC-2026-882012',
    status: 'PROCEEDS_REALIZED',
  },
  {
    id: 'CLM-2026-004',
    claimRef: 'BB-EXP-2026-004-LTH',
    expNumber: 'EXP-CTG-2026-00420',
    ciNumber: 'CI-2026-UK-000',
    blNumber: 'CMA-CTG-FEL-551029',
    buyerCompany: 'Fortnum & Mason UK',
    destinationPort: 'Felixstowe (FXT), UK',
    productSector: 'LEATHER',
    sectorLabel: 'Artisan Vegetable-Tanned Bifolds & Folios',
    hsCode: '4202.31.00',
    realizedUsd: 9600,
    conversionRateBdt: 120.00,
    realizedBdt: 1152000,
    incentiveRatePct: 10.0,
    grossIncentiveBdt: 115200,
    aitSourceTaxPct: 5.0,
    aitSourceTaxBdt: 5760,
    netPayoutBdt: 109440,
    adBankName: 'BRAC Bank PLC',
    adBranch: 'Gulshan Corporate Branch, Dhaka',
    realizationDate: '2026-09-15',
    claimFilingDate: '2026-09-22',
    associationCertNo: 'LFMEAB-EXP-CERT-2026-0771',
    associationBody: 'LFMEAB',
    prcNumber: 'PRC-BRAC-2026-771920',
    status: 'SUBSIDY_CREDITED',
  },
];

export const BangladeshBankCashIncentiveEngine: React.FC = () => {
  const [claims, setClaims] = useState<SubsidyClaim[]>(INITIAL_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<SubsidyClaim | null>(INITIAL_CLAIMS[0]);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showDeedModal, setShowDeedModal] = useState(false);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  // New claim form state
  const [newClaim, setNewClaim] = useState<Partial<SubsidyClaim>>({
    expNumber: '',
    ciNumber: '',
    blNumber: '',
    buyerCompany: '',
    destinationPort: 'Southampton (SOU), UK',
    productSector: 'JUTE',
    realizedUsd: 10000,
    conversionRateBdt: 121.50,
  });

  // Aggregated totals
  const totalRealizedUsd = claims.reduce((sum, c) => sum + c.realizedUsd, 0);
  const totalRealizedBdt = claims.reduce((sum, c) => sum + c.realizedBdt, 0);
  const totalGrossIncentiveBdt = claims.reduce((sum, c) => sum + c.grossIncentiveBdt, 0);
  const totalNetPayoutBdt = claims.reduce((sum, c) => sum + c.netPayoutBdt, 0);
  const creditedSubsidyBdt = claims
    .filter((c) => c.status === 'SUBSIDY_CREDITED')
    .reduce((sum, c) => sum + c.netPayoutBdt, 0);
  const pendingSubsidyBdt = claims
    .filter((c) => c.status !== 'SUBSIDY_CREDITED')
    .reduce((sum, c) => sum + c.netPayoutBdt, 0);

  const handleAdvanceStatus = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        let nextStatus: SubsidyClaim['status'] = c.status;
        if (c.status === 'PROCEEDS_REALIZED') nextStatus = 'SUBMITTED_TO_AD_BANK';
        else if (c.status === 'SUBMITTED_TO_AD_BANK') nextStatus = 'AUDIT_FIRM_VERIFIED';
        else if (c.status === 'AUDIT_FIRM_VERIFIED') nextStatus = 'SUBSIDY_CREDITED';
        return { ...c, status: nextStatus };
      })
    );
    if (selectedClaim?.id === claimId) {
      setSelectedClaim((prev) => {
        if (!prev) return null;
        let nextStatus: SubsidyClaim['status'] = prev.status;
        if (prev.status === 'PROCEEDS_REALIZED') nextStatus = 'SUBMITTED_TO_AD_BANK';
        else if (prev.status === 'SUBMITTED_TO_AD_BANK') nextStatus = 'AUDIT_FIRM_VERIFIED';
        else if (prev.status === 'AUDIT_FIRM_VERIFIED') nextStatus = 'SUBSIDY_CREDITED';
        return { ...prev, status: nextStatus };
      });
    }
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.expNumber || !newClaim.ciNumber) return;

    const usd = Number(newClaim.realizedUsd) || 0;
    const rate = Number(newClaim.conversionRateBdt) || 121.50;
    const bdt = usd * rate;
    const isLeather = newClaim.productSector === 'LEATHER';
    const isJute = newClaim.productSector === 'JUTE';
    const incentivePct = isLeather ? 10.0 : isJute ? 7.0 : 4.0;
    const grossBdt = bdt * (incentivePct / 100);
    const aitBdt = grossBdt * 0.05;
    const netBdt = grossBdt - aitBdt;

    const item: SubsidyClaim = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      claimRef: `BB-EXP-2026-${Date.now().toString().slice(-3)}-${newClaim.productSector?.slice(0, 3)}`,
      expNumber: newClaim.expNumber,
      ciNumber: newClaim.ciNumber,
      blNumber: newClaim.blNumber || `BL-${Date.now().toString().slice(-6)}`,
      buyerCompany: newClaim.buyerCompany || 'International Buyer',
      destinationPort: newClaim.destinationPort || 'Felixstowe, UK',
      productSector: newClaim.productSector || 'JUTE',
      sectorLabel: isLeather ? 'Finished Leather Goods' : isJute ? 'Diversified Jute Products' : 'Ethical Textiles',
      hsCode: isLeather ? '4202.92.00' : isJute ? '5702.20.00' : '6302.10.00',
      realizedUsd: usd,
      conversionRateBdt: rate,
      realizedBdt: bdt,
      incentiveRatePct: incentivePct,
      grossIncentiveBdt: grossBdt,
      aitSourceTaxPct: 5.0,
      aitSourceTaxBdt: aitBdt,
      netPayoutBdt: netBdt,
      adBankName: 'BRAC Bank PLC',
      adBranch: 'Gulshan Corporate Branch, Dhaka',
      realizationDate: new Date().toISOString().split('T')[0],
      claimFilingDate: new Date().toISOString().split('T')[0],
      associationCertNo: `${isLeather ? 'LFMEAB' : 'BJGEA'}-CERT-2026-${Date.now().toString().slice(-4)}`,
      associationBody: isLeather ? 'LFMEAB' : 'BJGEA',
      prcNumber: `PRC-BRAC-2026-${Date.now().toString().slice(-6)}`,
      status: 'SUBMITTED_TO_AD_BANK',
    };

    setClaims([item, ...claims]);
    setSelectedClaim(item);
    setShowNewClaimModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Institutional Top Header */}
      <div className="p-6 rounded-2xl bg-[#1F3A2E] text-white border-b-[3px] border-[#C8A96A] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] text-[10px] font-mono font-bold uppercase tracking-wider">
              Statutory Export Subsidies
            </span>
            <span className="text-xs text-emerald-200 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>FE Circular No. 02/2024 Governed</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat'] tracking-tight">
            {ArielMC.name} Bangladesh Bank Cash Incentive Claims Directorate
          </h2>
          <p className="text-xs text-white/80 max-w-2xl font-['Open_Sans'] mt-1">
            Filing, tracking, and realizing the official <strong>10.0% Finished Leather</strong> and <strong>7.0% Diversified Jute</strong> alternative cash export subsidies via Authorized Dealer (AD) BRAC Bank PLC.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowNewClaimModal(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-['Montserrat'] flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#1F3A2E]" />
            <span>File New Subsidy Claim</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Realized Foreign Currency</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-xl font-bold font-mono text-[#1F3A2E] block mt-1">
            ${totalRealizedUsd.toLocaleString()} USD
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            ৳{(totalRealizedBdt / 100000).toFixed(2)} Lakh BDT Realized
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#C8A96A]/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A6D3B] uppercase">Gross Cash Incentive</span>
            <Percent className="w-4 h-4 text-[#C8A96A]" />
          </div>
          <span className="text-xl font-bold font-mono text-[#8A6D3B] block mt-1">
            ৳{Math.round(totalGrossIncentiveBdt).toLocaleString()} BDT
          </span>
          <span className="text-[10px] text-[#8A6D3B] font-medium mt-0.5 block">
            10% Leather &bull; 7% Jute
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Subsidy Credited to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-xl font-bold font-mono text-emerald-900 block mt-1">
            ৳{Math.round(creditedSubsidyBdt).toLocaleString()} BDT
          </span>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            Deposited to BRAC Bank A/C
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-800 uppercase">Claims Under Audit / In-Process</span>
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-xl font-bold font-mono text-blue-900 block mt-1">
            ৳{Math.round(pendingSubsidyBdt).toLocaleString()} BDT
          </span>
          <span className="text-[10px] text-blue-700 font-medium mt-0.5 block">
            Less 5% AIT Tax Deducted
          </span>
        </div>
      </div>

      {/* Statutory Rules Matrix Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs">
        <h4 className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C8A96A]" />
          <span>Statutory Rates &amp; Merchant-Exporter Legal Framework</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40 space-y-1">
            <span className="font-bold text-[#8A6D3B] block">10.0% Finished Leather (HS 4202/4205)</span>
            <p className="text-[11px] text-slate-600">
              Eligible for finished bovine leather bags, travel duffles, wallets &amp; small leather goods sourced from Savar CETP / LWG certified units.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 block">7.0% Diversified Jute (HS 5702/5705)</span>
            <p className="text-[11px] text-slate-600">
              Eligible for non-traditional diversified jute items: hand-braided rugs, storage baskets, placemats, and fashion totes.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-900 block">Clause 3 Sole Beneficiary Waiver</span>
            <p className="text-[11px] text-slate-600">
              Executed on Tk. 300 non-judicial stamp paper. Factory waives export subsidy claims in favor of ArielMC as the exporting merchant.
            </p>
          </div>
        </div>
      </div>

      {/* Main Claims Ledger Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
              Live Bangladesh Bank Cash Incentive Claims Dossier
            </h3>
            <p className="text-xs text-slate-500">
              Track realization dates, EXP numbers, association audit clearance, and net BRAC Bank payouts.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-2xl border border-[#DDE3DD] hover:border-[#C8A96A] bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#1F3A2E] text-[#C8A96A] font-bold">
                    {claim.claimRef}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2">
                      <span>{claim.sectorLabel}</span>
                      <span className="text-xs font-mono text-slate-500 font-normal">({claim.hsCode})</span>
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Buyer: <strong className="text-slate-800">{claim.buyerCompany}</strong></span>
                      <span>&bull;</span>
                      <span>EXP: <strong className="font-mono text-slate-800">{claim.expNumber}</strong></span>
                      <span>&bull;</span>
                      <span>PRC: <strong className="font-mono text-slate-800">{claim.prcNumber}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                    claim.status === 'SUBSIDY_CREDITED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : claim.status === 'AUDIT_FIRM_VERIFIED'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {claim.status.replace(/_/g, ' ')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClaim(claim);
                      setShowLetterModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5EC] hover:bg-[#f3ebd9] text-[#8A6D3B] border border-[#C8A96A]/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>BRAC Bank Letter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClaim(claim);
                      setShowDeedModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sourcing Deed</span>
                  </button>
                </div>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Realized Foreign Currency</span>
                  <span className="font-mono font-bold text-[#1F3A2E] text-sm mt-0.5 block">
                    ${claim.realizedUsd.toLocaleString()} USD
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    @ ৳{claim.conversionRateBdt.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Export Realized (BDT)</span>
                  <span className="font-mono font-bold text-[#1F3A2E] text-sm mt-0.5 block">
                    ৳{Math.round(claim.realizedBdt).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Dated: {claim.realizationDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40">
                  <span className="text-[10px] text-[#8A6D3B] block uppercase font-medium">Gross Cash Incentive</span>
                  <span className="font-mono font-bold text-[#8A6D3B] text-sm mt-0.5 block">
                    ৳{Math.round(claim.grossIncentiveBdt).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#8A6D3B] font-semibold">
                    {claim.incentiveRatePct}% Statutory Rate
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200">
                  <span className="text-[10px] text-rose-700 block uppercase font-medium">Less 5% AIT Source Tax</span>
                  <span className="font-mono font-bold text-rose-800 text-sm mt-0.5 block">
                    -৳{Math.round(claim.aitSourceTaxBdt).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono">
                    Section 52(B) ITA
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9]">
                  <span className="text-[10px] text-emerald-800 block uppercase font-medium">Net Subsidy Payout</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm mt-0.5 block">
                    ৳{Math.round(claim.netPayoutBdt).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Net Direct Yield
                  </span>
                </div>
              </div>

              {/* Status progression footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Assoc. Body: <strong className="text-slate-800">{claim.associationBody}</strong></span>
                  <span>&bull;</span>
                  <span>Cert No: <strong className="font-mono text-slate-800">{claim.associationCertNo}</strong></span>
                </div>

                {claim.status !== 'SUBSIDY_CREDITED' && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(claim.id)}
                    className="px-3 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-[11px] font-bold transition cursor-pointer shadow-xs self-end sm:self-auto"
                  >
                    Advance to Next Stage &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: BRAC Bank Trade Desk Submission Letter */}
      {showLetterModal && selectedClaim && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#DDE3DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between border-b-2 border-[#C8A96A]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C8A96A]" />
                <div>
                  <h3 className="text-base font-bold font-['Montserrat']">
                    BRAC Bank Trade Desk Application Letter
                  </h3>
                  <p className="text-xs text-white/70">
                    Claim Ref: {selectedClaim.claimRef}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLetterModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-['Open_Sans'] max-h-[75vh] overflow-y-auto">
              <div className="text-slate-800 space-y-2 leading-relaxed">
                <div><strong>To:</strong> The Head of Trade Finance Desk / Branch Manager</div>
                <div>BRAC Bank PLC, Gulshan Corporate Branch, Dhaka, Bangladesh</div>
                <div><strong>Date:</strong> {selectedClaim.claimFilingDate}</div>
                <div className="pt-2">
                  <strong>Subject: Application for {selectedClaim.incentiveRatePct}% Export Cash Incentive against Realized Export of {selectedClaim.sectorLabel} (FE Circular No. 02/2024)</strong>
                </div>

                <p className="pt-2">Dear Sir/Madam,</p>
                <p>
                  We are pleased to inform you that our company, <strong>Ariel Marketing &amp; Communications Limited ({ArielMC.name})</strong>, holding valid ERC, Trade License, and BJGEA/LFMEAB membership, has successfully executed the export consignment and foreign currency proceeds have been 100% realized into our corporate account with your branch.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div>&bull; EXP Form No: <strong>{selectedClaim.expNumber}</strong></div>
                  <div>&bull; Commercial Invoice No: <strong>{selectedClaim.ciNumber}</strong></div>
                  <div>&bull; Bill of Lading (B/L) No: <strong>{selectedClaim.blNumber}</strong></div>
                  <div>&bull; Net Realized Value: <strong>${selectedClaim.realizedUsd.toLocaleString()} USD (BDT {selectedClaim.realizedBdt.toLocaleString()} @ {selectedClaim.conversionRateBdt})</strong></div>
                  <div>&bull; Gross Cash Incentive ({selectedClaim.incentiveRatePct}%): <strong>BDT {selectedClaim.grossIncentiveBdt.toLocaleString()}</strong></div>
                  <div>&bull; Less: 5% Advance Income Tax (AIT): <strong>BDT {selectedClaim.aitSourceTaxBdt.toLocaleString()}</strong></div>
                  <div>&bull; <strong>Net BRAC Bank Disbursable Payout: BDT {selectedClaim.netPayoutBdt.toLocaleString()}</strong></div>
                </div>

                <p className="pt-1">
                  Enclosed please find the following statutory audit dossier for onward submission to Bangladesh Bank:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                  <li>Original Proceed Realization Certificate (PRC) issued by BRAC Bank</li>
                  <li>Customs-certified Bill of Export &amp; Bill of Lading</li>
                  <li>{selectedClaim.associationBody} Official Export Verification Certificate ({selectedClaim.associationCertNo})</li>
                  <li>Registered Deed of Sourcing &amp; Manufacturing Agreement (Tk. 300 Non-Judicial Stamp)</li>
                  <li>Manufacturer Factory License &amp; DIFE Compliance Certificate</li>
                </ul>

                <div className="pt-4 flex justify-between items-end">
                  <div>
                    <div className="font-bold text-[#1F3A2E]">Syed Akramul Hassan</div>
                    <div className="text-[11px] text-slate-500">Managing Director &amp; Head of Trade Operations</div>
                    <div className="text-[11px] text-slate-500">Ariel Marketing &amp; Communications Limited</div>
                  </div>
                  <div className="p-2 border border-dashed border-slate-300 rounded text-center text-[10px] text-slate-400 font-mono">
                    [Corporate Seal &amp; Signature]
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
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
                  <span>Print Formal Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Deed of Sourcing (Tk 300 Non-Judicial Stamp) */}
      {showDeedModal && selectedClaim && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#DDE3DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between border-b-2 border-[#C8A96A]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C8A96A]" />
                <div>
                  <h3 className="text-base font-bold font-['Montserrat']">
                    Statutory Deed of Sourcing &amp; Manufacturing Agreement
                  </h3>
                  <p className="text-xs text-white/70">
                    Executed on Tk. 300 Non-Judicial Stamp Paper (Mandatory Bangladesh Bank Requirement)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeedModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-['Open_Sans'] max-h-[75vh] overflow-y-auto">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-mono tracking-widest text-[#8A6D3B] uppercase font-bold block">
                  GOVERNMENT OF THE PEOPLE&apos;S REPUBLIC OF BANGLADESH
                </span>
                <h4 className="text-sm font-bold text-[#1F3A2E] mt-0.5">
                  DEED OF SOURCING &amp; MANUFACTURING CONTRACT
                </h4>
              </div>

              <div className="space-y-3 leading-relaxed text-slate-800">
                <p>
                  <strong>BETWEEN:</strong> Ariel Marketing &amp; Communications Limited ({ArielMC.name}), House 12, Road 4, Banani, Dhaka, Bangladesh (hereinafter referred to as the <strong>&quot;FIRST PARTY / EXPORTER&quot;</strong>).
                </p>
                <p>
                  <strong>AND:</strong> Certified Partner Factory holding valid DIFE License and Industry Registration (hereinafter referred to as the <strong>&quot;SECOND PARTY / MANUFACTURER&quot;</strong>).
                </p>

                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#C8A96A]/50 space-y-1.5 text-[11.5px]">
                  <strong className="text-[#1F3A2E] block">CLAUSE 3: EXPORT CASH INCENTIVES &amp; SOLE BENEFICIARY WAIVER (AUDIT CRITICAL)</strong>
                  <p className="text-slate-700">
                    &quot;Both parties explicitly agree and covenant that the First Party (ArielMC Limited) is the <strong>SOLE OWNER AND BENEFICIARY</strong> of any and all Export Cash Incentives, alternative export subsidies, or promotional currency benefits granted by the Government of Bangladesh or Bangladesh Bank under FE Circular No. 02/2024. The Second Party hereby unconditionally waives and surrenders any claim over such incentives and undertakes to sign all bank certificates, certificates of manufacture, and association dockets as required by Bangladesh Bank appointed audit firms.&quot;
                  </p>
                </div>

                <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#DDE3DD] space-y-1.5 text-[11.5px]">
                  <strong className="text-[#1F3A2E] block">CLAUSE 4: PRODUCTION &amp; SPLIT PAYMENT SCHEDULE</strong>
                  <p className="text-slate-700">
                    Payment shall be disbursed strictly in three milestone tranches: 30% upon raw material lock, 50% upon original Clean On-Board Bill of Lading and Passed PSI certificate, and 20% upon destination delivery NOC.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeedModal(false)}
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
                  <span>Print Deed Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: File New Claim */}
      {showNewClaimModal && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-[#DDE3DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between border-b-2 border-[#C8A96A]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C8A96A]" />
                <h3 className="text-base font-bold font-['Montserrat']">
                  File New Bangladesh Bank Subsidy Claim
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewClaimModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">EXP Form No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EXP-CTG-2026-00588"
                    value={newClaim.expNumber}
                    onChange={(e) => setNewClaim({ ...newClaim, expNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">Commercial Invoice *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CI-2026-UK-005"
                    value={newClaim.ciNumber}
                    onChange={(e) => setNewClaim({ ...newClaim, ciNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">Buyer Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Selfridges London"
                    value={newClaim.buyerCompany}
                    onChange={(e) => setNewClaim({ ...newClaim, buyerCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">Product Sector</label>
                  <select
                    value={newClaim.productSector}
                    onChange={(e) => setNewClaim({ ...newClaim, productSector: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg font-medium"
                  >
                    <option value="LEATHER">Finished Leather (10.0%)</option>
                    <option value="JUTE">Diversified Jute (7.0%)</option>
                    <option value="TEXTILE">Ethical RMG / Linens (4.0%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">Realized USD ($)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newClaim.realizedUsd}
                    onChange={(e) => setNewClaim({ ...newClaim, realizedUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1 uppercase">Exchange Rate (BDT)</label>
                  <input
                    type="number"
                    step="any"
                    value={newClaim.conversionRateBdt}
                    onChange={(e) => setNewClaim({ ...newClaim, conversionRateBdt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#C8A96A]/40 text-slate-700 space-y-1">
                <span className="font-bold text-[#8A6D3B] block">Automated Net Subsidy Estimation:</span>
                <div className="flex justify-between text-[11px]">
                  <span>Gross Incentive ({newClaim.productSector === 'LEATHER' ? '10%' : newClaim.productSector === 'JUTE' ? '7%' : '4%'}):</span>
                  <span className="font-mono font-bold">
                    ৳{Math.round((Number(newClaim.realizedUsd) || 0) * (Number(newClaim.conversionRateBdt) || 121.5) * (newClaim.productSector === 'LEATHER' ? 0.1 : newClaim.productSector === 'JUTE' ? 0.07 : 0.04)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-rose-700">
                  <span>Less 5% AIT Source Tax:</span>
                  <span className="font-mono">
                    -৳{Math.round((Number(newClaim.realizedUsd) || 0) * (Number(newClaim.conversionRateBdt) || 121.5) * (newClaim.productSector === 'LEATHER' ? 0.1 : newClaim.productSector === 'JUTE' ? 0.07 : 0.04) * 0.05).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Record Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

