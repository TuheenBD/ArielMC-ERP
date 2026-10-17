'use client';

import React, { useRef } from 'react';
import { OfficialDocument } from '@/types/documentPortal';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Trash2,
  RefreshCw,
  X,
  BadgeCheck,
  ShieldCheck,
  QrCode,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { ArielMC, renderBrandText, sanitizeBrandString } from '@/lib/brand';

interface OfficialDocumentViewerModalProps {
  document: OfficialDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (doc: OfficialDocument) => void;
  onDelete: (doc: OfficialDocument) => void;
  onRenewOneYear: (docId: string) => void;
}

export const OfficialDocumentViewerModal: React.FC<OfficialDocumentViewerModalProps> = ({
  document,
  isOpen,
  onClose,
  onShare,
  onDelete,
  onRenewOneYear,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !document) return null;

  const daysLeft = Math.ceil(
    (new Date(document.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handlePrint = () => {
    window.print();
  };

  // Get Authority Emblem
  const getAuthorityEmblem = () => {
    const auth = document.issuingAuthority.toLowerCase();
    if (auth.includes('rjsc') || auth.includes('registrar')) {
      return { crest: '⚖️', title: 'REGISTRAR OF JOINT STOCK COMPANIES & FIRMS', country: "PEOPLE'S REPUBLIC OF BANGLADESH" };
    }
    if (auth.includes('nbr') || auth.includes('vat') || auth.includes('tax')) {
      return { crest: '🏛️', title: 'NATIONAL BOARD OF REVENUE (NBR)', country: 'CUSTOMS, EXCISE & VAT COMMISSIONERATE' };
    }
    if (auth.includes('lfmeab') || auth.includes('leather')) {
      return { crest: '💼', title: 'LEATHERGOODS & FOOTWEAR MANUFACTURERS ASSOCIATION', country: 'RECOGNIZED EXPORT PROMOTION TRADE BODY' };
    }
    if (auth.includes('jute') || auth.includes('bjma')) {
      return { crest: '🌿', title: 'DIRECTORATE GENERAL OF JUTE & BJMA', country: 'MINISTRY OF TEXTILES AND JUTE' };
    }
    if (auth.includes('chamber') || auth.includes('dcci') || auth.includes('mcci')) {
      return { crest: '🏢', title: 'DHAKA CHAMBER OF COMMERCE & INDUSTRY (DCCI)', country: 'FEDERATION OF BANGLADESH CHAMBERS OF COMMERCE' };
    }
    if (auth.includes('cci&e') || auth.includes('import') || auth.includes('export')) {
      return { crest: '🚢', title: 'OFFICE OF THE CHIEF CONTROLLER OF IMPORTS & EXPORTS', country: 'MINISTRY OF COMMERCE, BANGLADESH' };
    }
    if (auth.includes('bank') || auth.includes('bb')) {
      return { crest: '🏦', title: 'BANGLADESH BANK / AUTHORIZED DEALER FOREIGN EXCHANGE', country: 'CENTRAL BANK OF BANGLADESH' };
    }
    if (auth.includes('companies house')) {
      return { crest: '🇬🇧', title: 'COMPANIES HOUSE - REGISTRAR OF COMPANIES', country: 'UNITED KINGDOM OF GREAT BRITAIN' };
    }
    if (auth.includes('delaware')) {
      return { crest: '🇺🇸', title: 'DELAWARE DIVISION OF CORPORATIONS', country: 'STATE OF DELAWARE, USA' };
    }
    if (auth.includes('arielmc') || auth.includes('investment committee') || auth.includes('strategic board') || auth.includes('export intelligence')) {
      return {
        crest: '✨',
        title: sanitizeBrandString(document.issuingAuthority),
        country: 'GLOBAL SOURCING & PRIVATE-LABEL TRADE BOARD'
      };
    }
    return { crest: '📜', title: sanitizeBrandString(document.issuingAuthority), country: 'STATUTORY REGULATORY AUTHORITY' };
  };

  const emblem = getAuthorityEmblem();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/60 flex items-center justify-center text-[#C8A96A] text-lg font-bold shadow-md">
              {document.fileFormat}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[9px] font-bold">
                  {document.docCode}
                </span>
                <span className="text-[10px] text-gray-300">
                  Station: {document.station.replace('ARIEL_', '')}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Statutory Document
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold font-heading text-white truncate max-w-md mt-0.5">
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Document Button */}
            <button
              type="button"
              onClick={() => onShare(document)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Document for Verification & Acknowledgement via Communication Hub"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share (Verify / Ack)</span>
            </button>

            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print Certificate or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0C1712]">
          <div
            ref={printRef}
            className="max-w-3xl mx-auto bg-[#FFFDF9] text-slate-900 rounded-xl p-6 md:p-10 border-4 border-[#C8A96A] shadow-2xl relative overflow-hidden"
          >
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <BadgeCheck className="w-96 h-96 text-[#1F3A2E]" />
            </div>

            {/* Certificate Header */}
            <div className="text-center pb-5 border-b-2 border-[#C8A96A]/60 space-y-1.5 relative z-10">
              <div className="text-3xl mb-1">{emblem.crest}</div>
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8A6D3B]">
                {emblem.country}
              </p>
              <h3 className="text-base md:text-lg font-black font-serif tracking-wider text-[#1F3A2E]">
                {renderBrandText(emblem.title)}
              </h3>
              <p className="text-[11px] font-mono text-gray-500 font-bold uppercase tracking-widest pt-1">
                Official Regulatory Instrument &amp; Compliance Dossier
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-6 space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#C8A96A] text-[#8A6D3B] text-[10px] font-bold uppercase tracking-widest inline-block">
                {document.category}
              </span>
              <h1 className="text-xl md:text-2xl font-bold font-serif text-[#1F3A2E] leading-tight">
                {renderBrandText(document.title)}
              </h1>
              <div className="inline-block p-1 px-4 rounded bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-800">
                OFFICIAL REGISTRATION / PERMIT NO: {renderBrandText(document.documentNumber)}
              </div>
            </div>

            {/* Legal Statement */}
            <div className="space-y-4 py-4 text-xs md:text-sm text-slate-700 leading-relaxed relative z-10">
              <p className="text-center italic font-serif text-slate-600">
                This is to certify that the business entity specified herein has complied with all statutory requirements,
                regulatory inspections, and foreign trade provisions under applicable laws and schedules:
              </p>

              {/* Entity Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Registered Entity Name:</span>
                    <span className="font-bold text-[#1F3A2E] text-sm block">
                      Ariel Marketing &amp; Communications Limited
                    </span>
                    <span className="text-[11px] text-gray-600">
                      Station: {document.station.replace('ARIEL_', '')} Operating Entity
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Registered Commercial Address:</span>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      House 32, Road 11, Block D, Banani / Gulshan Commercial Zone
                    </span>
                    <span className="text-[10px] text-gray-500">Dhaka-1213, Bangladesh</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Effective Date:</span>
                    <span className="font-bold text-slate-900">{document.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Renewal Due Date:</span>
                    <span className="font-bold text-slate-900">{document.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Status / Validity:</span>
                    <span className="font-bold text-emerald-700">
                      Active ({daysLeft}d left)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Section Classification:</span>
                    <span className="font-bold text-slate-900">{document.section.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Description / Scope */}
              {document.notes && (
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">
                    Statutory Scope &amp; Regulatory Privileges:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {renderBrandText(document.notes)}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Signatures & Seal */}
            <div className="pt-8 mt-6 border-t border-slate-300 grid grid-cols-3 items-end gap-4 text-center relative z-10">
              {/* QR Verification Seal */}
              <div className="space-y-1 text-left">
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-14 h-14 text-[#1F3A2E]" />
                </div>
                <div className="text-[9px] font-mono text-gray-500 leading-tight">
                  Cryptographic Hash:<br />
                  <span className="font-bold text-slate-800">
                    SHA256:{document.id.replace(/-/g, '').substring(0, 10).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Official Gold Embossed Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-double border-[#C8A96A] bg-[#FAF5EC] flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <span className="text-[7.5px] font-bold tracking-wider text-[#8A6D3B]">
                    <ArielMC /> ERP
                  </span>
                  <span className="text-[9px] font-black text-[#1F3A2E]">
                    VERIFIED
                  </span>
                  <span className="text-[7px] font-mono text-gray-600">
                    STATUTORY
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Audit Certified
                </span>
              </div>

              {/* Authorized Signature */}
              <div className="space-y-1 text-right">
                <div className="font-serif italic font-bold text-base text-[#1F3A2E]">
                  Syed Akramul Hassan
                </div>
                <div className="h-0.5 w-36 ml-auto bg-slate-800"></div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">
                  Managing Director
                </p>
                <p className="text-[9px] text-gray-500">
                  Ariel Marketing &amp; Communications Ltd
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Toolbar Actions */}
        <div className="p-4 border-t border-[#2C5240] bg-[#162B22] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onDelete(document)}
            className="px-3 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-950/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Document</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Renew for 1 Year */}
            <button
              type="button"
              onClick={() => onRenewOneYear(document.id)}
              className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] border border-[#C8A96A]/60 text-[#C8A96A] hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renew for 1 Year (+12 Months)</span>
            </button>

            {/* Share via Communication Hub */}
            <button
              type="button"
              onClick={() => onShare(document)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share (Email/WhatsApp)</span>
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={() => {
                alert(`Simulating secure download of ${document.title} (${document.fileSize})`);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
