'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CommercialProformaInvoice,
  CurrencyCode,
  BuyerSalesOrder,
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
  ArrowRight,
  ShieldCheck,
  Check,
  DollarSign,
  Repeat,
  Sparkles,
} from 'lucide-react';

interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  proformaInvoice: CommercialProformaInvoice | null;
  onConvertToSalesOrder?: (pi: CommercialProformaInvoice) => void;
  onUpdateStatus?: (piId: string, newStatus: CommercialProformaInvoice['status']) => void;
  bdtRate?: number;
  gbpRate?: number;
  eurRate?: number;
  audRate?: number;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({
  isOpen,
  onClose,
  proformaInvoice,
  onConvertToSalesOrder,
  onUpdateStatus,
  bdtRate = 124.38,
  gbpRate = 0.77,
  eurRate = 0.92,
  audRate = 1.52,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<'QUOTED' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'BDT'>('QUOTED');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (proformaInvoice) {
      setActiveCurrency('QUOTED');
      setIsConverted(proformaInvoice.status === 'CONVERTED_TO_SO');
    }
  }, [proformaInvoice]);

  if (!isOpen || !mounted || !proformaInvoice) return null;

  // Currency Converter Helper
  const getConvertedPrice = (amountInQuoted: number): { amount: number; symbol: string; code: string } => {
    const quotedCurr = proformaInvoice.currency;
    if (activeCurrency === 'QUOTED' || activeCurrency === quotedCurr) {
      const symbol = quotedCurr === 'GBP' ? '£' : quotedCurr === 'EUR' ? '€' : quotedCurr === 'AUD' ? 'A$' : quotedCurr === 'BDT' ? '৳' : '$';
      return { amount: amountInQuoted, symbol, code: quotedCurr };
    }

    // Convert from Quoted to USD
    let amountUsd = amountInQuoted;
    if (quotedCurr === 'GBP') amountUsd = amountInQuoted / gbpRate;
    else if (quotedCurr === 'EUR') amountUsd = amountInQuoted / eurRate;
    else if (quotedCurr === 'AUD') amountUsd = amountInQuoted / audRate;
    else if (quotedCurr === 'BDT') amountUsd = amountInQuoted / bdtRate;

    // Convert from USD to target
    if (activeCurrency === 'USD') return { amount: Math.round(amountUsd * 100) / 100, symbol: '$', code: 'USD' };
    if (activeCurrency === 'GBP') return { amount: Math.round(amountUsd * gbpRate * 100) / 100, symbol: '£', code: 'GBP' };
    if (activeCurrency === 'EUR') return { amount: Math.round(amountUsd * eurRate * 100) / 100, symbol: '€', code: 'EUR' };
    if (activeCurrency === 'AUD') return { amount: Math.round(amountUsd * audRate * 100) / 100, symbol: 'A$', code: 'AUD' };
    if (activeCurrency === 'BDT') return { amount: Math.round(amountUsd * bdtRate), symbol: '৳', code: 'BDT' };

    return { amount: amountInQuoted, symbol: '$', code: 'USD' };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `ArielMC Official Commercial Proforma Invoice: ${proformaInvoice.piNumber} for ${proformaInvoice.buyerCompany}. Net Value: ${proformaInvoice.currency} ${proformaInvoice.netPayableAmount.toLocaleString()} (${proformaInvoice.incoterm}). Verified by ArielMC Central Merchandising.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/documents/pi/${proformaInvoice.piNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConvertOrder = () => {
    if (onConvertToSalesOrder) {
      onConvertToSalesOrder(proformaInvoice);
      setIsConverted(true);
      onUpdateStatus?.(proformaInvoice.id, 'CONVERTED_TO_SO');
    }
  };

  const displaySubtotal = getConvertedPrice(proformaInvoice.subtotalAmount);
  const displayNetPayable = getConvertedPrice(proformaInvoice.netPayableAmount);
  const displaySampleCredit = proformaInvoice.sampleAdjustmentFeeQuoteCurrency 
    ? getConvertedPrice(proformaInvoice.sampleAdjustmentFeeQuoteCurrency)
    : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[100000] my-auto">
        {/* Top Control Bar (Non-Printable) */}
        <div className="p-4 bg-[#1F3A2E] text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#C8A96A] print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
              PROFORMA INVOICE
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-heading">
                {proformaInvoice.piNumber}
              </h2>
              <span className="text-[11px] text-emerald-200">
                Issued for {proformaInvoice.buyerCompany} ({proformaInvoice.targetMarket} Station)
              </span>
            </div>
          </div>

          {/* Interactive Multi-Currency Toggle */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/20">
            <span className="text-[10px] font-mono text-[#C8A96A] font-bold uppercase px-2 hidden sm:inline">
              Currency View:
            </span>
            {(['QUOTED', 'USD', 'EUR', 'GBP', 'AUD', 'BDT'] as const).map((curr) => {
              const isSelected = activeCurrency === curr;
              const label = curr === 'QUOTED' ? `${proformaInvoice.currency} (Quoted)` : curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setActiveCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C8A96A] text-[#1F3A2E] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              title="Print or Save Official Vector PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all cursor-pointer"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white text-[#1A1A1A] text-xs font-sans print:p-0 print:m-0">
          
          {/* Document Header with Official ArielMC Brand & Government EPB Credentials */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-[#1F3A2E]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tight text-[#1F3A2E]">
                  ArielMC
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-bold border border-[#C8A96A]">
                  GLOBAL EXPORT HEADQUARTERS
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                Ariel Marketing &amp; Communications Limited
              </div>
              <div className="text-[11px] text-slate-600 max-w-md leading-relaxed">
                House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh<br />
                Tel: +880 2410 811 91 • Trade Mobile &amp; WhatsApp: +8801819273458 • Email: info@arielmc.com
              </div>
              <div className="text-[10px] font-mono text-slate-500 pt-1">
                Customs 13-Digit BIN: <strong>001892837-0101</strong> • TIN: <strong>8492817291</strong> • EPB Reg: <strong>EPB-REG-EXP-2026</strong>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-[#F8FAF8] p-3 rounded-xl border border-[#DDE3DD] min-w-[240px]">
              <span className="font-mono text-base font-bold text-[#1F3A2E] block">
                {proformaInvoice.piNumber}
              </span>
              <div className="text-[11px] text-slate-600">
                Date of Issue: <strong className="font-mono text-slate-900">{proformaInvoice.issueDate}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Quotation Valid Until: <strong className="font-mono text-slate-900">{proformaInvoice.validUntil}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Production Lead Time: <strong className="text-[#1F3A2E]">{proformaInvoice.productionLeadTimeWeeks} Weeks</strong>
              </div>
              <div className="pt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  proformaInvoice.status === 'ACCEPTED_CONFIRMED' || isConverted
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : proformaInvoice.status === 'LC_PENDING'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {isConverted ? 'CONVERTED TO BULK SO' : proformaInvoice.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Consignee & Shipping Particulars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF5EC]/50 border border-[#C8A96A]/30">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block font-heading">
                Consignee / Buyer Particulars:
              </span>
              <div className="text-sm font-bold text-[#1F3A2E]">{proformaInvoice.buyerCompany}</div>
              <div className="text-xs font-semibold text-slate-700">Attn: {proformaInvoice.buyerContactPerson}</div>
              <div className="text-[11px] text-slate-600 leading-relaxed">{proformaInvoice.buyerAddress}</div>
              {proformaInvoice.buyerVatEoriNumber && (
                <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                  Buyer VAT / EORI / EIN: <strong>{proformaInvoice.buyerVatEoriNumber}</strong>
                </div>
              )}
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block font-heading">
                Trade Logistics &amp; Shipping Route:
              </span>
              <div className="text-xs text-slate-800">
                Incoterm: <strong className="font-mono text-sm text-[#1F3A2E]">{proformaInvoice.incoterm}</strong> ({proformaInvoice.portOfLoading})
              </div>
              <div className="text-[11px] text-slate-600">
                Port of Loading: <strong>{proformaInvoice.portOfLoading}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Port of Discharge: <strong>{proformaInvoice.portOfDischarge}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Target Ex-Factory / Shipment: <strong className="font-mono text-slate-900">{proformaInvoice.estimatedShipmentDate}</strong>
              </div>
            </div>
          </div>

          {/* Itemized Commercial Product Schedule */}
          <div className="rounded-xl border border-[#DDE3DD] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1F3A2E] text-white text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Style Code &amp; Description</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">HS Code</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price ({displaySubtotal.symbol})</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-xs">
                {proformaInvoice.items.map((item, idx) => {
                  const convertedUnit = getConvertedPrice(item.unitPrice);
                  const convertedTotal = getConvertedPrice(item.totalPrice);

                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAF8] transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#1F3A2E] font-heading">{item.styleName}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">{item.description}</div>
                        <div className="font-mono text-[10px] text-[#8A6D3B] font-semibold mt-0.5">SKU: {item.sku}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F4F6F4] text-slate-700 font-semibold border border-slate-200">
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{item.hsCode}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                        {convertedUnit.symbol}{convertedUnit.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#1F3A2E]">
                        {convertedTotal.symbol}{convertedTotal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Sample Fee Deduction Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            {/* Special Instructions & Sample Policy Guarantee */}
            <div className="flex-1 space-y-2.5">
              <span className="text-[10px] font-bold text-[#1F3A2E] uppercase tracking-wider block font-heading">
                Special Export Terms &amp; Quality Stipulations:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {proformaInvoice.specialTerms.map((term, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14512C] shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>

              {/* Sample Fee Credit Guarantee Notice */}
              {proformaInvoice.sampleAdjustmentApplied && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Official Sample Adjustment Guarantee (SOP-B2B-SMP-2026-V1):</span>
                  </div>
                  <p className="leading-relaxed text-emerald-900">
                    {proformaInvoice.sampleAdjustmentNotes || 'Sample Development & Courier Fee is 100% credited against this Bulk Commercial PO meeting minimum order quantity (MOQ).'}
                  </p>
                  <div className="font-mono text-[10px] text-emerald-800 font-semibold">
                    Adjustment Ref: {proformaInvoice.sampleAdjustmentReference || 'SDO-CREDIT-APPLIED'}
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Summary Card */}
            <div className="w-full sm:w-80 space-y-2 p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Product Quantity:</span>
                <span className="font-mono font-bold text-slate-900">
                  {proformaInvoice.totalQuantity.toLocaleString()} pcs
                </span>
              </div>

              <div className="flex justify-between text-slate-700">
                <span>Subtotal Value:</span>
                <span className="font-mono font-bold text-slate-900">
                  {displaySubtotal.symbol}{displaySubtotal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {proformaInvoice.freightInsuranceCharges ? (
                <div className="flex justify-between text-slate-700">
                  <span>Ocean Freight &amp; Insurance ({proformaInvoice.incoterm}):</span>
                  <span className="font-mono font-bold text-slate-900">
                    +{displaySubtotal.symbol}{getConvertedPrice(proformaInvoice.freightInsuranceCharges).amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ) : null}

              {/* Sample Fee Deduction Line Item */}
              {proformaInvoice.sampleAdjustmentApplied && displaySampleCredit ? (
                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-emerald-100/70 border border-emerald-300 text-emerald-900">
                  <div>
                    <span className="font-bold block text-[11px]">Less: Sample Fee Credit</span>
                    <span className="text-[9px] font-mono block text-emerald-700">Ref: {proformaInvoice.sampleAdjustmentReference}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    -{displaySampleCredit.symbol}{displaySampleCredit.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ) : null}

              <div className="pt-2 border-t border-[#DDE3DD] flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#1F3A2E] font-heading block">Total Net Payable:</span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Incoterm: {proformaInvoice.incoterm}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#1F3A2E] block">
                    {displayNetPayable.symbol}{displayNetPayable.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {activeCurrency !== 'USD' && (
                    <span className="text-[10px] font-mono text-slate-500 block">
                      ~${proformaInvoice.netPayableAmountUsd.toLocaleString()} USD
                    </span>
                  )}
                  {activeCurrency !== 'BDT' && (
                    <span className="text-[10px] font-mono text-emerald-800 font-bold block">
                      ৳{Math.round(proformaInvoice.netPayableAmountUsd * bdtRate).toLocaleString('en-IN')} BDT
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms & Authorized Beneficiary Banking Box */}
          <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A6D3B] font-heading uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#8A6D3B]" />
                <span>Authorized Dealer Remittance Channel (Bangladesh Bank Foreign Exchange Guidelines):</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#8A6D3B] font-bold border border-[#C8A96A]/40">
                AD BRANCH CODE: {proformaInvoice.beneficiaryBank.adBranchCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Beneficiary Name:</span>
                <span className="font-bold text-[#1F3A2E]">{proformaInvoice.beneficiaryBank.accountName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Beneficiary Bank:</span>
                <span className="font-bold text-[#1F3A2E]">{proformaInvoice.beneficiaryBank.bankName}</span>
                <span className="text-[10px] text-slate-600 block">{proformaInvoice.beneficiaryBank.branchName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Account Number &amp; Routing:</span>
                <span className="font-mono font-bold text-slate-900 block">{proformaInvoice.beneficiaryBank.accountNumber}</span>
                <span className="text-[10px] font-mono text-slate-500 block">Routing: {proformaInvoice.beneficiaryBank.routingNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SWIFT / BIC Code:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm block">{proformaInvoice.beneficiaryBank.swiftCode}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#C8A96A]/30 text-[11px] text-[#8A6D3B] flex items-center justify-between flex-wrap gap-2">
              <div>
                Commercial Terms: <strong className="text-[#1F3A2E]">{proformaInvoice.paymentTerms}</strong>
              </div>
              <div className="text-[10px] font-mono">
                Wire instructions: All banking remittance charges outside Bangladesh are for Buyer&apos;s account.
              </div>
            </div>
          </div>

          {/* Official Signatory & Seal Verification Box */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#DDE3DD]">
            <div className="space-y-1 text-[11px] text-slate-500 max-w-sm">
              <span className="font-bold text-slate-700 block">Corporate Export Undertaking:</span>
              <p>
                We hereby certify that this Proforma Invoice shows the bona fide price and specification of the goods described, and that our production schedule has been committed under verified back-to-back manufacturing capacity.
              </p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-48 border-b-2 border-slate-400 pb-8 flex items-end justify-center">
                <span className="font-heading italic text-sm text-[#1F3A2E] font-bold">
                  Syed Akramul Hassan
                </span>
              </div>
              <span className="text-xs font-bold text-[#1F3A2E] block">Authorized Export Signatory</span>
              <span className="text-[10px] text-slate-500 block">Managing Director &amp; Head of Trade Finance</span>
              <span className="text-[9px] font-mono text-[#8A6D3B] block">Ariel Marketing &amp; Communications Ltd</span>
            </div>
          </div>

        </div>

        {/* Modal Action Footer (Non-Printable) */}
        <div className="p-4 bg-[#F8FAF8] border-t border-[#DDE3DD] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDE3DD] hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] text-[#1F3A2E] text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Export Official PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isConverted && onConvertToSalesOrder ? (
              <button
                onClick={handleConvertOrder}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-all shadow-md border-b-2 border-[#C8A96A] cursor-pointer"
                title="Buyer approved PI - Convert directly to active commercial Sales Order (SO)"
              >
                <Repeat className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Convert to Bulk Sales Order (SO)</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Converted to Sales Order</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDE3DD] hover:bg-white text-slate-700 font-semibold text-xs transition-colors"
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

