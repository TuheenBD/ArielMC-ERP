'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
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

  const handleOpenExternalPrintWindow = () => {
    const printEl = printRef.current;
    if (!printEl) return;

    const printWin = window.open(
      '',
      '_blank',
      'width=1120,height=920,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes'
    );

    if (!printWin) {
      alert('Please allow pop-ups for this site to open the external print preview window.');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${document.title} - ArielMC Official Statutory Document Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --bg-stage: #06130D;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
      --text-toolbar: #ffffff;
      --accent-gold: #C8A96A;
      --accent-emerald: #10B981;
    }
    body.theme-emerald {
      --bg-stage: #06130D;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
    }
    body.theme-light {
      --bg-stage: #E6ECE8;
      --bg-toolbar: #12231B;
      --border-toolbar: #2C5240;
    }
    body.theme-dark {
      --bg-stage: #040906;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
    }
    body.theme-parchment {
      --bg-stage: #14211A;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
    }
    body {
      background-color: var(--bg-stage);
      color: #0f172a;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.25s ease;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-toolbar);
      color: var(--text-toolbar);
      border-bottom: 1px solid var(--border-toolbar);
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.5);
      transition: all 0.25s ease;
    }
    .print-toolbar .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .print-toolbar .toolbar-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 13.5px;
      color: #ffffff;
    }
    .print-toolbar .toolbar-ref {
      font-family: monospace;
      font-size: 11px;
      background: #064e3b;
      color: #6ee7b7;
      border: 1px solid #059669;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .screen-color-picker {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-toolbar);
      padding: 4px 8px;
      border-radius: 10px;
    }
    .picker-label {
      font-size: 10.5px;
      font-weight: 700;
      color: #C8A96A;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .picker-group {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .theme-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }
    .theme-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }
    .theme-btn.active {
      background: rgba(44, 82, 64, 0.7);
      border-color: #C8A96A;
      color: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .color-swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .swatch-emerald { background: #06130D; border-color: #2C5240; }
    .swatch-light { background: #E6ECE8; border-color: #94A3B8; }
    .swatch-dark { background: #0C1A14; border-color: #C8A96A; }
    .swatch-parchment { background: #FFFDF9; border-color: #C8A96A; }
    .print-toolbar .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 15px;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #059669, #0d9488);
      color: #ffffff;
      border: 1px solid #34D399;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.45);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #10b981, #14b8a6);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.6);
    }
    .btn-secondary {
      background: #162B22;
      color: #E2E8F0;
      border: 1px solid #2C5240;
    }
    .btn-secondary:hover {
      background: #1F3A2E;
      color: #FFFFFF;
      border-color: #C8A96A;
    }
    .paper-stage {
      padding: 30px 16px 60px;
      display: flex;
      justify-content: center;
      background: var(--bg-stage);
      min-height: calc(100vh - 65px);
      transition: background-color 0.25s ease;
    }
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      background: #FFFDF9 !important;
      color: #0f172a !important;
      padding: 16mm 14mm;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      border: 4px solid #C8A96A;
      position: relative;
    }
    .a4-sheet svg {
      display: inline-block;
      vertical-align: middle;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .paper-stage {
        padding: 0 !important;
        background: transparent !important;
      }
      .a4-sheet {
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
        border: 4px solid #C8A96A !important;
        padding: 8mm !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body class="theme-emerald">
  <div class="print-toolbar no-print">
    <div class="toolbar-left">
      <div style="font-size: 20px;">📜</div>
      <div>
        <div class="toolbar-title">${document.title}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
          <span class="toolbar-ref">${document.docCode}</span>
          <span style="font-size: 11px; color: #9ca3af; font-family: monospace;">Station: ${document.station} • Authority: ${document.issuingAuthority}</span>
        </div>
      </div>
    </div>
    <div class="screen-color-picker no-print">
      <span class="picker-label">🎨 Screen Color:</span>
      <div class="picker-group">
        <button type="button" class="theme-btn active" id="btn-theme-emerald" onclick="setScreenColor('theme-emerald')" title="ArielMC Signature Deep Emerald Canvas">
          <span class="color-swatch swatch-emerald"></span>
          <span>Emerald Dark</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-light" onclick="setScreenColor('theme-light')" title="Soft Light Studio Drafting Canvas">
          <span class="color-swatch swatch-light"></span>
          <span>Soft Light</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-dark" onclick="setScreenColor('theme-dark')" title="Executive Dark Mode Dossier">
          <span class="color-swatch swatch-dark"></span>
          <span>Dark Mode</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-parchment" onclick="setScreenColor('theme-parchment')" title="Ivory Parchment & Gold Borders">
          <span class="color-swatch swatch-parchment"></span>
          <span>Ivory / Gold</span>
        </button>
      </div>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-secondary" onclick="window.close()">
        <span>✕ Close Window</span>
      </button>
      <button class="btn btn-primary" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
    </div>
  </div>
  <div class="paper-stage">
    <div class="a4-sheet">
      ${printEl.innerHTML}
    </div>
  </div>
  <script>
    function setScreenColor(theme) {
      document.body.className = theme;
      var buttons = document.querySelectorAll('.theme-btn');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }
      var activeBtn = document.getElementById('btn-' + theme);
      if (activeBtn) activeBtn.classList.add('active');
      try {
        localStorage.setItem('arielmc_print_screen_theme', theme);
      } catch (e) {}
    }
    try {
      var savedTheme = localStorage.getItem('arielmc_print_screen_theme');
      if (savedTheme) {
        setScreenColor(savedTheme);
      }
    } catch (e) {}
  </script>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
    printWin.focus();
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
        <div className="p-4 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between gap-3 shrink-0 no-print">
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
            {/* External Window Print Version */}
            <button
              type="button"
              onClick={handleOpenExternalPrintWindow}
              className="px-3 py-1.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-emerald-300 hover:text-white font-bold text-xs border border-[#C8A96A]/60 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open document preview in an external window formatted for standard A4 printing"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">External Window (Print)</span>
              <span className="sm:hidden">External ↗</span>
            </button>

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
            className="printable-content max-w-3xl mx-auto bg-[#FFFDF9] text-slate-900 rounded-xl p-6 md:p-10 border-4 border-[#C8A96A] shadow-2xl relative overflow-hidden"
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
            {/* External Window Print Version */}
            <button
              type="button"
              onClick={handleOpenExternalPrintWindow}
              className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] border border-emerald-500/60 text-emerald-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Preview document in dedicated external window as print version"
            >
              <ExternalLink className="w-4 h-4 text-[#C8A96A]" />
              <span>External Window (Print) ↗</span>
            </button>

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
