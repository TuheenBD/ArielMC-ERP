'use client';

import React, { useRef, useState } from 'react';
import { CompanyEntity } from '@/types/erp';
import { OfficialDocument } from '@/types/documentPortal';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { ThemeProfile } from '@/components/Sidebar';
import Image from 'next/image';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  BadgeCheck,
  ShieldCheck,
  QrCode,
  Building2,
  CreditCard,
  Users,
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StationComplianceDossierModalProps {
  station: CompanyEntity | null;
  documents: OfficialDocument[];
  isOpen: boolean;
  onClose: () => void;
  onShareDossier?: (station: CompanyEntity) => void;
  theme?: ThemeProfile;
}

export const StationComplianceDossierModal: React.FC<StationComplianceDossierModalProps> = ({
  station,
  documents,
  isOpen,
  onClose,
  onShareDossier,
  theme = 'crm-green',
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen || !station) return null;

  const dossierDoc: OfficialDocument = {
    id: `DOSSIER-${station.code}`,
    docCode: `AMC-DOS-${station.code}-2026`,
    documentNumber: `AMC-DOS-${station.code}-2026`,
    title: `ArielMC Official Station Statutory Dossier - ${station.legalName}`,
    category: 'STATION_STATUTORY',
    section: 'STATION_STATUTORY',
    issuingAuthority: 'ArielMC Executive Governance & Sovereign Trade Engine',
    station: station.code as any,
    countryCode: station.country,
    entityCode: station.code,
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-12-31',
    status: 'ACTIVE',
    verificationUrl: `https://erp.arielmc.com/verify-doc?code=AMC-DOS-${station.code}-2026&ack=true`,
    qrCodeData: `AMC-DOS-${station.code}-2026|${station.legalName}|VERIFIED`,
    fileUrl: '/docs/ArielMC_Compliance_Dossier.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    version: '2026.1',
    tags: ['Station Dossier', 'Statutory', 'Compliance', 'Audit Verified'],
    notes: `Official corporate compliance, RJSC/tax filings, bank mandates, and international trade credentials for ${station.legalName}.`,
    isStatutoryRequirement: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const stationDocs = documents.filter((d) => d.station === station.code);
  const activeDocs = stationDocs.filter((d) => d.status === 'ACTIVE');
  const criticalDocs = stationDocs.filter((d) => {
    const days = Math.ceil(
      (new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days >= 0 && days <= 7;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(station, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArielMC_${station.code}_Corporate_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200" data-theme={theme}>
      <div className="w-full max-w-5xl max-h-[96vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="p-4 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/60 shadow-md">
              {station.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[9px] font-bold">
                  {station.code}
                </span>
                <span className="text-[10px] text-gray-300">
                  {station.legalStatus}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Audit Verified Dossier
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold font-heading text-white truncate max-w-lg mt-0.5">
                Executive Station Statutory Dossier: {station.legalName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Dossier Button */}
            <button
              type="button"
              onClick={() => {
                if (onShareDossier) {
                  onShareDossier(station);
                } else {
                  setIsShareModalOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Station Dossier for Verification & Acknowledgement"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share (Verify / Ack)</span>
            </button>

            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print Dossier or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Download JSON */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download Data JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">JSON</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0C1712]">
          <div
            ref={printRef}
            className="printable-content max-w-4xl mx-auto bg-[#FFFDF9] text-slate-900 rounded-xl p-6 md:p-10 border-4 border-[#C8A96A] shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <BadgeCheck className="w-[32rem] h-[32rem] text-[#1F3A2E]" />
            </div>

            {/* Header: Corporate Banner & Crest */}
            <div className="text-center pb-5 border-b-2 border-[#C8A96A]/60 space-y-1.5 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">{station.flag}</span>
                <span className="px-3 py-0.5 rounded-full bg-[#FAF5EC] border border-[#C8A96A] text-[#8A6D3B] text-[10px] font-bold uppercase tracking-widest">
                  Official Station Regulatory Dossier
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black font-serif text-[#1F3A2E] uppercase tracking-wide">
                {station.legalName}
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                {station.role}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] font-mono text-gray-500">
                <span>Station: <strong>{station.code}</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong>{station.country}</strong></span>
                <span>•</span>
                <span>Tax ID: <strong>{station.taxIdentifier.number}</strong></span>
              </div>
            </div>

            {/* SECTION 1: Corporate Profile & Registered Office */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-200 text-[#1F3A2E] font-bold text-xs uppercase tracking-wider font-heading">
                <Building2 className="w-4 h-4 text-[#8A6D3B]" />
                <span>1. Sovereign Entity Profile &amp; Commercial Office</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Registered Legal Address:</span>
                  <p className="font-semibold text-slate-800 leading-snug">{station.address}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Corporate Status &amp; Currency:</span>
                  <p className="font-semibold text-slate-800">{station.legalStatus}</p>
                  <p className="text-[11px] text-gray-600">Base Accounting Currency: <strong>{station.baseCurrency}</strong></p>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-200 md:col-span-2">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Physical Operating Facilities:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {station.activeFacilities.map((fac, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                        📍 {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Multi-Account Banking Mandate & ERQ Reserves */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                <div className="flex items-center gap-2 text-[#1F3A2E] font-bold text-xs uppercase tracking-wider font-heading">
                  <CreditCard className="w-4 h-4 text-[#8A6D3B]" />
                  <span>2. Multi-Account Banking &amp; Foreign Exchange Roster</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {station.bankAccounts.length} Verified Accounts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {station.bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border relative space-y-1.5 ${
                      acc.isErq
                        ? 'bg-amber-50/60 border-amber-300'
                        : acc.isPrimary
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {acc.bankName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 font-mono text-[9px] font-bold border border-slate-200">
                        {acc.currency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-800 font-mono text-[10px] font-bold">
                        {acc.accountNumberMask}
                      </span>
                      {acc.isPrimary && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                          Primary Operating
                        </span>
                      )}
                      {acc.isErq && (
                        <span className="px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] text-[9px] font-bold">
                          BB Circular 48/31 ERQ
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-600 font-medium">
                      {acc.type}
                    </p>

                    {acc.purpose && (
                      <p className="text-[10px] text-gray-500 italic pt-1 border-t border-black/5 leading-relaxed">
                        Purpose: {acc.purpose}
                      </p>
                    )}

                    <div className="text-[9.5px] font-mono text-gray-500 flex flex-wrap gap-2 pt-0.5">
                      {acc.branch && <span>Branch: {acc.branch}</span>}
                      {acc.swiftBic && <span>SWIFT: {acc.swiftBic}</span>}
                      {acc.routingOrSortCode && <span>{acc.routingOrSortCode}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Statutory Officers & Authorized Signatories */}
            {station.statutoryOfficers && station.statutoryOfficers.length > 0 && (
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[#1F3A2E] font-bold text-xs uppercase tracking-wider font-heading">
                    <Users className="w-4 h-4 text-[#8A6D3B]" />
                    <span>3. Statutory Corporate Officers &amp; Authorized Signatories</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {station.statutoryOfficers.length} Officers Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {station.statutoryOfficers.map((officer) => (
                    <div
                      key={officer.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="font-bold text-slate-900 text-xs">
                        {officer.name}
                      </div>
                      <div className="text-[10px] text-[#8A6D3B] font-semibold">
                        {officer.designation}
                      </div>
                      <div className="pt-1 border-t border-slate-200">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            officer.signingAuthority === 'SOLO_A_SIGNATORY'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : officer.signingAuthority === 'JOINT_SIGNATORY'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {officer.signingAuthority.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {officer.nationalIdOrTin && (
                        <p className="text-[9.5px] font-mono text-gray-500 pt-0.5">
                          {officer.nationalIdOrTin}
                        </p>
                      )}
                      {officer.notes && (
                        <p className="text-[10px] text-gray-600 italic pt-0.5 leading-snug">
                          {officer.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: Inter-Entity Consignment & Customs Routing */}
            {station.interEntityRoute && (
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2 pb-1 border-b border-gray-200 text-[#1F3A2E] font-bold text-xs uppercase tracking-wider font-heading">
                  <Compass className="w-4 h-4 text-[#8A6D3B]" />
                  <span>4. Inter-Entity Supply Chain Route &amp; Consignment Framework</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A] text-xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Origin ({station.interEntityRoute.sourceStation.replace('ARIEL_', '')})
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span className="font-bold text-[#1F3A2E] text-xs">
                        Consignee ({station.interEntityRoute.destinationStation.replace('ARIEL_', '')})
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-[#1F3A2E] text-[#C8A96A] font-mono text-[10px] font-bold">
                      Incoterms: {station.interEntityRoute.incoterm}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px] text-slate-800 pt-1 border-t border-[#C8A96A]/30">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#8A6D3B] block">Freight Corridor:</span>
                      <span className="font-semibold">{station.interEntityRoute.freightCorridor}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#8A6D3B] block">Customs &amp; Tariffs:</span>
                      <span className="font-semibold">{station.interEntityRoute.customsRegime}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#8A6D3B] block">Destination 3PL Hub:</span>
                      <span className="font-semibold">{station.interEntityRoute.destination3PL}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-[#8A6D3B] block">Currency Repatriation:</span>
                      <span className="font-semibold">{station.interEntityRoute.currencyRepatriation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: Active Statutory Trade Licenses & Expiry Audit */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                <div className="flex items-center gap-2 text-[#1F3A2E] font-bold text-xs uppercase tracking-wider font-heading">
                  <FileText className="w-4 h-4 text-[#8A6D3B]" />
                  <span>5. Statutory License Roster &amp; Expiration Audit Trail</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {stationDocs.length} Total Registered
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-heading">
                      <th className="p-2.5 font-bold">Document Title</th>
                      <th className="p-2.5 font-bold">Registration / Ref #</th>
                      <th className="p-2.5 font-bold">Issuing Authority</th>
                      <th className="p-2.5 font-bold">Effective</th>
                      <th className="p-2.5 font-bold">Renewal Date</th>
                      <th className="p-2.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {stationDocs.map((doc) => {
                      const days = Math.ceil(
                        (new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      );
                      const isCrit = days >= 0 && days <= 7;
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#1F3A2E]">{doc.title}</td>
                          <td className="p-2.5 font-mono text-slate-800">{doc.documentNumber}</td>
                          <td className="p-2.5 text-gray-600">{doc.issuingAuthority}</td>
                          <td className="p-2.5 text-gray-600">{doc.issueDate}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{doc.expiryDate}</td>
                          <td className="p-2.5 text-right">
                            {isCrit ? (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[9px]">
                                🚨 &le;7d Alert
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                                Active ({days}d)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Certification, Seal & Signatures */}
            <div className="pt-6 mt-6 border-t-2 border-slate-300 grid grid-cols-3 items-end gap-4 text-center relative z-10">
              {/* QR Verification Seal */}
              <div className="space-y-1 text-left">
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-14 h-14 text-[#1F3A2E]" />
                </div>
                <div className="text-[9px] font-mono text-gray-500 leading-tight">
                  Cryptographic Ledger:<br />
                  <span className="font-bold text-slate-800">
                    SHA256:A7B9C381E4{station.code}
                  </span>
                </div>
              </div>

              {/* Gold Embossed Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-double border-[#C8A96A] bg-[#FAF5EC] flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-[#8A6D3B]">
                    ArielMC ERP
                  </span>
                  <span className="text-[9px] font-black text-[#1F3A2E]">
                    SOVEREIGN
                  </span>
                  <span className="text-[7px] font-mono text-gray-600">
                    DOSSIER
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Corporate Pack
                </span>
              </div>

              {/* Authorized Managing Director Signature */}
              <div className="space-y-1 text-right">
                <div className="h-10 w-36 ml-auto relative">
                  <Image
                    src="/images/syed_akramul_hassan_signature.png"
                    alt="Syed Akramul Hassan Signature"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="h-0.5 w-36 ml-auto bg-slate-800"></div>
                <p className="text-[10px] font-bold text-slate-900 uppercase">
                  Syed Akramul Hassan
                </p>
                <p className="text-[9px] text-gray-500">
                  Managing Director, Ariel Marketing &amp; Communications Ltd
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#162B22] border-t border-[#2C5240] flex items-center justify-between shrink-0">
          <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
            <span>ArielMC Sovereign Trade &amp; Statutory Compliance Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onShareDossier) {
                  onShareDossier(station);
                } else {
                  setIsShareModalOpen(true);
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Station Dossier for Verification & Acknowledgement"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share (Verify / Ack)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={dossierDoc}
      />
    </div>
  );
};
