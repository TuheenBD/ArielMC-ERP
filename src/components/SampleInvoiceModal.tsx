'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  SampleDevelopmentOrder,
  CurrencyCode,
} from '@/types/erp';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  FileCheck2,
  Building2,
  Globe2,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  DollarSign,
  Repeat,
  Sparkles,
  Plane,
  Truck,
  ExternalLink,
  Award,
} from 'lucide-react';

interface SampleInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: SampleDevelopmentOrder | null;
  onMarkPaid?: (sdoId: string) => void;
  bdtRate?: number;
  gbpRate?: number;
  eurRate?: number;
  audRate?: number;
}

export const SampleInvoiceModal: React.FC<SampleInvoiceModalProps> = ({
  isOpen,
  onClose,
  sample,
  onMarkPaid,
  bdtRate = 124.38,
  gbpRate = 0.77,
  eurRate = 0.92,
  audRate = 1.52,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<'QUOTED' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'BDT'>('QUOTED');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sample) {
      setActiveCurrency('QUOTED');
    }
  }, [sample]);

  if (!isOpen || !mounted || !sample) return null;

  // Currency Converter Helper
  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'GBP': return '£';
      case 'EUR': return '€';
      case 'AUD': return 'A$';
      case 'BDT': return '৳';
      case 'USD':
      default: return '$';
    }
  };

  const getEffectiveCurrency = (): 'USD' | 'EUR' | 'GBP' | 'AUD' | 'BDT' => {
    if (activeCurrency === 'QUOTED') {
      if (sample.targetMarket === 'UK') return 'GBP';
      if (sample.targetMarket === 'EU') return 'EUR';
      if (sample.targetMarket === 'AU') return 'AUD';
      return 'USD';
    }
    return activeCurrency;
  };

  const effCurr = getEffectiveCurrency();
  const effSymbol = getCurrencySymbol(effCurr);

  // Rate from USD to effective currency
  const getRateFromUsd = (curr: string): number => {
    switch (curr) {
      case 'GBP': return gbpRate;
      case 'EUR': return eurRate;
      case 'AUD': return audRate;
      case 'BDT': return bdtRate;
      case 'USD':
      default: return 1.0;
    }
  };

  const currRate = getRateFromUsd(effCurr);
  const totalCostUsd = sample.costing.totalCostUsd || (sample.costing.developmentCostUsd + (sample.costing.courierCostUsd || 0));
  const devCostUsd = sample.costing.developmentCostUsd || 60;
  const courierCostUsd = sample.costing.courierCostUsd || 65;

  const displayDevCost = Math.round(devCostUsd * currRate * 100) / 100;
  const displayCourierCost = Math.round(courierCostUsd * currRate * 100) / 100;
  const displayTotal = Math.round(totalCostUsd * currRate * 100) / 100;
  const displayBdt = Math.round(totalCostUsd * bdtRate);

  const marketFlag =
    sample.targetMarket === 'UK'
      ? '🇬🇧 UK Station (GBP)'
      : sample.targetMarket === 'US'
      ? '🇺🇸 US Station (USD)'
      : sample.targetMarket === 'EU'
      ? '🇪🇺 EU Station (EUR)'
      : sample.targetMarket === 'AU'
      ? '🇦🇺 AU Station (AUD)'
      : '🇧🇩 Dhaka HQ (BDT)';

  const spiNumber = `SPI-2026-${sample.sdoNumber.replace('SDO-2026-', '')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `*ArielMC OFFICIAL SAMPLE PROFORMA INVOICE (SPI)*
Document Ref: ${spiNumber}
SDO Ref: ${sample.sdoNumber}
Buyer: ${sample.buyerCompany} (${sample.buyerContact})
Style: ${sample.styleName} (${sample.styleCode})
Sector: ${sample.sector}
Stage: ${sample.stage} (Round ${sample.roundNumber})

Sample Dev Fee: ${effSymbol}${displayDevCost}
Priority Air Courier (${sample.courier?.courier || 'DHL Express'}): ${effSymbol}${displayCourierCost}
Total Payable: ${effSymbol}${displayTotal} (${displayBdt.toLocaleString()} BDT / $${totalCostUsd} USD)

*SOP-B2B-SMP-2026-V1 GUARANTEE:*
100% of this sample investment ($${totalCostUsd} USD) is credited back on your first qualifying bulk Purchase Order (MOQ: ${sample.reimbursementTerms?.qualifyingBulkMoq || 1000} pcs).

Remittance Bank: Eastern Bank PLC, Principal Branch, Dhaka
AD Code: 0902 | SWIFT: EBLDBDDH | Routing: 090261842`;

    navigator.clipboard.writeText(summaryText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[100000]">
        
        {/* Top Operational Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center font-bold shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-['Montserrat'] tracking-wide">
                  Sample Proforma Invoice (SPI) Desk
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-semibold">
                  SOP-B2B-SMP-2026-V1
                </span>
              </div>
              <p className="text-[11px] text-[#DDE3DD] font-mono mt-0.5">
                Ref: {spiNumber} • {sample.buyerCompany}
              </p>
            </div>
          </div>

          {/* Currency Toggle & Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Currency Switcher */}
            <div className="bg-[#162B22] p-1 rounded-xl border border-white/20 flex items-center gap-1 text-[11px]">
              {(['QUOTED', 'USD', 'GBP', 'EUR', 'AUD', 'BDT'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setActiveCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-colors ${
                    activeCurrency === curr
                      ? 'bg-[#C8A96A] text-[#1F3A2E] shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {curr === 'QUOTED' ? 'Quoted' : curr}
                </button>
              ))}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Vector PDF Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Print PDF</span>
            </button>

            {/* Share WhatsApp / Summary */}
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy formatted quotation for WhatsApp or Email"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>WhatsApp Share</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="printable-content p-6 sm:p-10 overflow-y-auto flex-1 bg-[#FAF9F5] text-[#1A1A1A] font-sans space-y-6">
          
          {/* Official Letterhead Header */}
          <div className="border-b-[2px] border-[#C8A96A] pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-['Montserrat'] tracking-tight text-[#1F3A2E]">
                  ARIEL MARKETING &amp; COMMUNICATIONS LIMITED
                </span>
              </div>
              <p className="text-xs text-[#6B7269] mt-0.5 font-medium">
                Global Sourcing • Export Management • Rapid Physical Prototyping &amp; Studio
              </p>
              <div className="text-[11px] text-[#6B7269] space-y-0.5 mt-2">
                <p><strong>Dhaka Central Studio:</strong> House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh</p>
                <p><strong>Contact Desk:</strong> +880 2410 811 91 / +8801819273458 (WhatsApp) • Email: info@arielmc.com / ArielMC.BD@gmail.com</p>
                <p><strong>Corporate Registration:</strong> C-179821/2022 • BIN: 004128912-0101 • Export Registration Certificate: ERC #26081290</p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-xs">
              <span className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#C8A96A] block">
                SAMPLE PROFORMA INVOICE (SPI)
              </span>
              <span className="text-sm font-mono font-bold text-[#1F3A2E] block mt-0.5">
                {spiNumber}
              </span>
              <span className="text-[10px] text-slate-500 block">Date: {sample.requestDate}</span>
              <span className="text-[10px] text-slate-500 block">SDO Ref: <strong className="font-mono text-slate-800">{sample.sdoNumber}</strong></span>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                Stage: {sample.stage} (Round {sample.roundNumber})
              </span>
            </div>
          </div>

          {/* Statutory Customs Declaration Banner */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>STATUTORY CUSTOMS DECLARATION:</strong> Mutilated Commercial Sample for Technical Evaluation &amp; Fitment Only. Not for Resale. Zero Commercial Resale Value. Customs Nominal Value: $10.00 USD.
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-200/60 rounded text-amber-900 font-bold shrink-0">
              CUSTOMS PROTOCOL
            </span>
          </div>

          {/* Consignee & Shipping Particulars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Consignee Box */}
            <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1F3A2E] font-['Montserrat'] uppercase text-[10px] tracking-wider">
                  CONSIGNEE / PROSPECTIVE BUYER
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{marketFlag}</span>
              </div>
              <p className="font-bold text-[#1A1A1A] text-sm">{sample.buyerCompany}</p>
              <p className="text-slate-600">Attn: <strong>{sample.buyerContact}</strong></p>
              <p className="text-slate-500">Destination Hub: {sample.courier?.destinationAirport || 'Direct Headquarters Desk'}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Buyer Import Courier Account: <strong className="text-slate-800">{sample.courier?.courier || 'DHL Express'} Priority Import Desk</strong>
              </p>
            </div>

            {/* Fabrication Hub & Courier Flight Info */}
            <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white shadow-xs space-y-1">
              <span className="font-bold text-[#1F3A2E] font-['Montserrat'] uppercase text-[10px] tracking-wider block">
                FABRICATION STUDIO &amp; PRIORITY AIR COURIER
              </span>
              <p className="text-slate-700">Studio Origin: <strong>{sample.factoryName}</strong> ({sample.sector} Guild)</p>
              <p className="text-slate-700">Origin Airport: <strong>{sample.courier?.originAirport || 'DAC (Hazrat Shahjalal Intl, Dhaka)'}</strong></p>
              <p className="text-slate-700">Courier Provider: <strong>{sample.courier?.courier || 'DHL Express Priority Air'}</strong></p>
              <p className="font-mono text-[11px] text-[#1F3A2E] font-bold">
                AWB Tracking #: {sample.courier?.awbNumber || 'PENDING DISPATCH'}
              </p>
              {sample.courier?.transitStatus && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Status: {sample.courier.transitStatus.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Itemized Prototype Specifications Table */}
          <div className="rounded-xl border border-[#DDE3DD] bg-white shadow-xs overflow-hidden">
            <div className="bg-[#1F3A2E] text-white p-3 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider font-['Montserrat']">
                Prototype Engineering &amp; Specimen Development Details
              </span>
              <span className="text-[10px] font-mono text-[#C8A96A]">
                HS: {sample.sector === 'JUTE' ? '5705.00.00' : sample.sector === 'LEATHER' ? '4202.21.00' : sample.sector === 'CERAMICS' ? '6911.10.00' : '6912.00.00'}
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF8] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Line Description &amp; Technical Scope</th>
                  <th className="py-3 px-4 text-center">Qty / Sets</th>
                  <th className="py-3 px-4 text-right">Unit Fee ({effSymbol})</th>
                  <th className="py-3 px-4 text-right">Total ({effSymbol})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {/* Line 1: Pattern Engineering & Physical Fabrication */}
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1A1A1A] block">{sample.styleName} ({sample.styleCode})</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Pattern drafting, master CAD cutting, hand-crafting or kiln bisque firing in Dhaka studio.
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      Specs: {sample.techPack.dimensions} • Material: {sample.techPack.primaryMaterial}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">1 Specimen</td>
                  <td className="py-3.5 px-4 text-right font-mono">{effSymbol}{displayDevCost.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1F3A2E]">
                    {effSymbol}{displayDevCost.toFixed(2)}
                  </td>
                </tr>

                {/* Line 2: Priority International Courier Freight */}
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1A1A1A] block">
                      Priority International Air Courier Freight ({sample.courier?.courier || 'DHL Express'})
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Direct door-to-door air freight dispatch from Dhaka DAC to consignee commercial office.
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      AWB #{sample.courier?.awbNumber || 'PENDING'} • Includes shock-proof export spec packaging &amp; silica desiccant.
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">1 Shipment</td>
                  <td className="py-3.5 px-4 text-right font-mono">{effSymbol}{displayCourierCost.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1F3A2E]">
                    {effSymbol}{displayCourierCost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-[#F8FAF8] border-t-2 border-[#1F3A2E] font-bold text-xs">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-[#1F3A2E]">
                    TOTAL SAMPLE DEVELOPMENT &amp; COURIER INVESTMENT
                  </td>
                  <td colSpan={2} className="py-3 px-4 text-right font-mono text-base text-[#1F3A2E]">
                    {effSymbol}{displayTotal.toFixed(2)} {effCurr}
                    <span className="block text-[10px] text-emerald-800 font-semibold">
                      ({displayBdt.toLocaleString()} BDT / ${totalCostUsd.toLocaleString()} USD)
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* SOP-B2B-SMP-2026-V1 100% BULK ORDER REIMBURSEMENT GUARANTEE BOX */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] border-2 border-[#C8A96A] text-white shadow-md relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <Sparkles className="w-28 h-28 text-[#C8A96A]" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A96A] font-['Montserrat']">
                  SOP-B2B-SMP-2026-V1: 100% BULK PURCHASE ORDER CREDIT GUARANTEE
                </h4>
              </div>

              <p className="text-xs text-[#DDE3DD] leading-relaxed">
                In strict compliance with <strong>ArielMC Corporate Standard Operating Procedure SOP-B2B-SMP-2026-V1</strong>, 
                this total sample investment of <strong className="text-white font-mono">{effSymbol}{displayTotal.toFixed(2)} ({displayBdt.toLocaleString()} BDT / ${totalCostUsd} USD)</strong> is 
                a refundable development deposit. It shall be <strong className="text-[#C8A96A]">100% credited and deducted directly from the final payment balance</strong> of the Buyer&apos;s first qualifying bulk Purchase Order (PO) meeting the agreed MOQ of <strong className="text-white">{sample.reimbursementTerms?.qualifyingBulkMoq || 1000} units</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/20 text-[11px] font-mono">
                <div>
                  <span className="text-[#C8A96A] block text-[9px] uppercase">Reimbursement Target</span>
                  <span className="font-semibold text-white">Less: 50% Clean B/L Balance</span>
                </div>
                <div>
                  <span className="text-[#C8A96A] block text-[9px] uppercase">Qualifying Bulk MOQ</span>
                  <span className="font-semibold text-white">{sample.reimbursementTerms?.qualifyingBulkMoq || 1000} pcs / sets</span>
                </div>
                <div>
                  <span className="text-[#C8A96A] block text-[9px] uppercase">Voucher Validity</span>
                  <span className="font-semibold text-white">90 Calendar Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Authorized Beneficiary Bank Remittance Directives */}
          <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1F3A2E]" />
                <span className="font-bold text-[#1F3A2E] font-['Montserrat'] uppercase text-[11px] tracking-wider">
                  Official Remittance Directives (Bangladesh Bank Authorized Dealer Branch)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                AD CODE: 0902
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700">
              <div>
                <p><strong>Beneficiary Name:</strong> Ariel Marketing &amp; Communications Limited</p>
                <p><strong>Account Number:</strong> 1041060291841 (Export Proceeds &amp; Remittance)</p>
                <p><strong>Bank Name:</strong> Eastern Bank PLC</p>
                <p><strong>Branch:</strong> Principal Branch, 10 Dilkusha C/A, Dhaka-1000, Bangladesh</p>
              </div>
              <div className="font-mono">
                <p><strong>SWIFT Code:</strong> EBLDBDDH</p>
                <p><strong>Routing Number:</strong> 090261842</p>
                <p><strong>AD Branch Code:</strong> 0902</p>
                <p className="text-slate-500 text-[10px] mt-1">
                  * Buyer may also provide their own DHL/FedEx Express Import Account Number to reverse-bill courier freight directly.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Signoff & Signatures */}
          <div className="pt-6 border-t border-[#DDE3DD] grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-slate-300 flex items-end">
                <span className="font-['Montserrat'] font-bold text-[#1F3A2E] text-xs">Syed Akramul Hassan</span>
              </div>
              <p className="mt-1 font-semibold text-[#1A1A1A]">Managing Director &amp; Founder</p>
              <p className="text-[10px] text-slate-400">Ariel Marketing &amp; Communications Ltd (Dhaka Central)</p>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-slate-300 flex items-end justify-end">
                <span className="font-mono text-slate-400 text-xs italic">[Buyer Sign &amp; Counter-Stamp]</span>
              </div>
              <p className="mt-1 font-semibold text-[#1A1A1A]">{sample.buyerContact}</p>
              <p className="text-[10px] text-slate-400">{sample.buyerCompany}</p>
            </div>
          </div>

        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="no-print p-4 border-t border-[#DDE3DD] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Payment Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              sample.costing.paymentStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {sample.costing.paymentStatus}
            </span>
            <span>•</span>
            <span>Bulk Credit:</span>
            <span className="text-purple-700 font-bold">
              {sample.reimbursementTerms?.status.replace(/_/g, ' ') || 'CREDIT APPROVED'}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {sample.costing.paymentStatus !== 'PAID' && onMarkPaid && (
              <button
                type="button"
                onClick={() => onMarkPaid(sample.id)}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Sample Fee Paid</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#B39355] text-[#1F3A2E] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official SPI</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDE3DD] text-[#4A5568] hover:bg-[#F4F6F4] text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
