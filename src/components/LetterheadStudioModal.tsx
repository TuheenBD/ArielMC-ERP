'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArielMC } from '@/lib/brand';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  Maximize2,
  RefreshCw,
  Building2,
  Send
} from 'lucide-react';

interface LetterheadStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterheadStudioModal: React.FC<LetterheadStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logoSize, setLogoSize] = useState<'32mm' | '38mm' | '44mm'>('38mm');
  const [templateType, setTemplateType] = useState<'TRADE_INVITE' | 'PROPOSAL' | 'LOOKBOOK_RELEASE' | 'BLANK'>('TRADE_INVITE');
  const [isCopied, setIsCopied] = useState(false);

  // Editable correspondence state
  const [refCode, setRefCode] = useState('AMC-B2B-EXP-2026-892');
  const [letterDate, setLetterDate] = useState('19 October 2026');
  const [recipient, setRecipient] = useState(
    'Head of International Procurement & Sourcing\nEnterprise Retail & Hospitality Group\nLondon / New York / Frankfurt Hub'
  );
  const [subject, setSubject] = useState('OFFICIAL DISPATCH & COMMERCIAL PROSPECTUS');
  const [letterBody, setLetterBody] = useState(`Dear Procurement Partner,

We are pleased to submit this official technical dossier and sampling framework on behalf of ArielMC (Ariel Marketing & Communications Limited). As Bangladesh's premier export sourcing gateway, our operations bridge international retail brands directly with sovereign, audit-certified industrial manufacturing across our five national pride sectors.

Under our strict export governance framework (SOP-B2B-SMP-2026-V1), all product development and custom tooling adhere to bilateral intellectual property safeguards. Physical prototypes are expedited via DHL Express direct from Dhaka (DAC) within 5–7 business days, with 100% of sampling fees fully credited against your first bulk production order.

Key Institutional Guarantees:
• Zero Tooling Risk: All molds, dies, and CAD specifications remain 100% client-owned.
• Defect SLA Guarantee: Free remake at $0 fee if dimensions deviate > ±2 mm or ΔE > 1.5 color drift.
• Sovereign Compliance: Sedex / BSCI audited living wages, LWG gold/silver tanneries, and FDA / LFGB certifications.

Our executive sourcing team remains at your disposal to coordinate factory inspections, dispatch custom swatch cards, or finalize container FOB schedules from Chittagong Sea Port (BDCGP).

Yours sincerely,
Executive Sourcing Directorate
Ariel Marketing & Communications Limited (ArielMC)`);

  if (!isOpen) return null;

  const handleSelectTemplate = (type: 'TRADE_INVITE' | 'PROPOSAL' | 'LOOKBOOK_RELEASE' | 'BLANK') => {
    setTemplateType(type);
    if (type === 'TRADE_INVITE') {
      setSubject('INVITATION: VIP SOURCING PREVIEW AT AMBIENTE FRANKFURT 2027');
      setLetterBody(`Dear Procurement Partner,

On behalf of ArielMC (Ariel Marketing & Communications Limited), we cordially invite your executive buying delegation to visit our Sovereign Showcase at Ambiente Frankfurt 2027 (Hall 12.1, Stand D48).

We will be unveiling our AW26 / SS27 Master Lookbooks across:
1. Fine Bone China & Reactive Glaze Hospitality Tableware (FDA Food Contact Certified)
2. Artisan Vegetable-Tanned Leather Goods (100% LWG Audited Tannery in Savar)
3. 100% Biodegradable Bengal Golden Jute (Sonali Aash) Retail Bags

Private executive conference slots are available to review custom molds, pre-cleared freight logistics, and in-country legal contracting through ArielMC EU Entity.

Yours sincerely,
Executive Commercial Directorate
Ariel Marketing & Communications Limited`);
    } else if (type === 'PROPOSAL') {
      setSubject('OFFICIAL B2B SOURCING PROPOSAL & TWO-WAY OMS TERMS');
      setLetterBody(`Dear Sourcing Directorate,

Following our recent technical review, ArielMC submits this formal B2B production proposal for your seasonal retail program.

Our dual-hub operational architecture delivers direct manufacturer pricing from our audited facilities in Savar, Gazipur, and Dhamrai, paired with local sovereign contract invoicing through ArielMC UK Ltd / ArielMC USA LLC.

All shipments are backed by our mandatory ISO 2859-1 Level II / AQL 2.5 final random inspection (FRI) protocol and guaranteed port cut-off delivery.

Yours sincerely,
Global Trade Operations
Ariel Marketing & Communications Limited`);
    } else if (type === 'LOOKBOOK_RELEASE') {
      setSubject('ANNOUNCEMENT: RELEASE OF 2026/2027 MASTER SECTOR LOOKBOOKS');
      setLetterBody(`Dear Retail Buying Partner,

ArielMC has officially released our 2026/2027 Master Digital Lookbooks and Technical Spec Sheets covering all five Bangladesh manufacturing sectors:
• Leathergoods & Travel Accessories (LWG Gold)
• Golden Jute Eco-Shoppers & Planters (OEKO-TEX)
• Fine Tableware & Bone China Dining (FDA / LFGB Safe)
• Architectural Terracotta Pottery & Wall Reliefs
• GOTS Certified Organic Cotton Home Linens

Digital downloads, CAD die-lines, and express sample dispatch requests are now accessible directly through our global portal (www.arielmc.com).

Yours sincerely,
Marketing & Brand Communications
Ariel Marketing & Communications Limited`);
    } else {
      setSubject('OFFICIAL MEMORANDUM');
      setLetterBody(`[Type your official correspondence here...]`);
    }
  };

  const handleCopyText = () => {
    const fullText = `${subject}\nRef: ${refCode} | Date: ${letterDate}\n\n${recipient}\n\n${letterBody}\n\nAriel Marketing & Communications Limited\nHouse 30, Road 07, Block C, Niketon, Gulshan-1, Dhaka-1212\ninfo@arielmc.com | www.arielmc.com`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden text-[#1A1A1A]">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 z-20 p-2 rounded-xl bg-black/30 hover:bg-black/60 text-white/90 hover:text-white border border-white/20 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 pr-16 py-3.5 bg-gradient-to-r from-[#1F3A2E] to-[#12231B] border-b border-[#C8A96A]/30 shrink-0 gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-heading">
                <span>ArielMC Stationery &amp; Letterhead Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8A96A] text-[#12231B] font-bold">
                  A4 Calibrated
                </span>
              </h3>
              <p className="text-[11px] text-gray-300">
                Draft official correspondence with 38mm Golden Ratio logo &amp; 4-pillar institutional footer
              </p>
            </div>
          </div>

          {/* Logo Size Calibration Pills */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/20 text-xs">
            <span className="text-gray-300 px-2 font-medium">Logo:</span>
            {(['32mm', '38mm', '44mm'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setLogoSize(size)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  logoSize === size
                    ? 'bg-[#C8A96A] text-[#12231B] shadow-xs font-bold'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {size === '38mm' ? 'Standard (38mm) ✓' : size === '32mm' ? 'Compact (32mm)' : 'Executive (44mm)'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              title="Copy letter text to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C8A96A]" />}
              <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#12231B] shadow-md transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Workspace Body: Left controls + Right A4 Paper Stage */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DDE3DD]">
          
          {/* Left Configuration Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-5 overflow-y-auto space-y-4 bg-[#F8FAF8]">
            <div>
              <span className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider block mb-2 font-heading">
                Pre-Loaded Letter Templates
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'TRADE_INVITE' as const, label: 'Trade Show VIP Invite' },
                  { id: 'PROPOSAL' as const, label: 'B2B Sourcing Proposal' },
                  { id: 'LOOKBOOK_RELEASE' as const, label: 'Lookbook Release' },
                  { id: 'BLANK' as const, label: 'Custom / Blank' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition cursor-pointer ${
                      templateType === tpl.id
                        ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white shadow-xs'
                        : 'bg-white border-[#DDE3DD] text-[#1A1A1A] hover:bg-slate-50'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#DDE3DD]">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7269] uppercase tracking-wider mb-1 font-heading">
                  Reference Code &amp; Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs font-mono"
                  />
                  <input
                    type="text"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7269] uppercase tracking-wider mb-1 font-heading">
                  Recipient Address Block
                </label>
                <textarea
                  rows={2}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-sans shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7269] uppercase tracking-wider mb-1 font-heading">
                  Subject Heading
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7269] uppercase tracking-wider mb-1 font-heading">
                  Letter Body (Markdown / Plain Text)
                </label>
                <textarea
                  rows={8}
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-sans leading-relaxed shadow-2xs"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-[#8A6D3B]">
              💡 <strong>Pro-Tip:</strong> The paper preview on the right renders in genuine <strong>A4 dimensions (210mm x 297mm)</strong>. Clicking Print will trigger high-definition borderless vector PDF generation.
            </div>
          </div>

          {/* Right A4 Paper Stage (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto flex justify-center bg-[#F1F3EE]">
            {/* Real Simulated A4 Sheet */}
            <div 
              id="printable-a4-letterhead"
              className="relative bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden select-text"
              style={{
                width: '100%',
                maxWidth: '680px',
                minHeight: '880px',
                padding: '24px 32px 36px 32px',
                boxSizing: 'border-box',
              }}
            >
              {/* Top-Right Curved Vector Waves (Exact SVG from letterhead.html) */}
              <svg 
                className="absolute top-0 right-0 w-[42%] h-auto pointer-events-none" 
                viewBox="0 0 125 45" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 0,0 C 38,5 82,23 125,43 L 125,0 Z" fill="#EAA023" />
                <path d="M 8,0 C 44,5 86,20 125,37 L 125,0 Z" fill="#0A1A2F" />
              </svg>

              {/* Top-Left Official ArielMC Logo */}
              <div 
                className="relative z-10 transition-all duration-200"
                style={{
                  width: logoSize === '32mm' ? '120px' : logoSize === '44mm' ? '165px' : '142px'
                }}
              >
                <Image
                  src="/images/marketing/ArielMC_Logo.png"
                  alt="ArielMC"
                  width={180}
                  height={60}
                  className="w-full h-auto object-contain block drop-shadow-sm"
                  priority
                />
              </div>

              {/* Central Letter Content */}
              <div className="mt-8 mb-16 text-[11px] leading-relaxed text-slate-800 space-y-4">
                {/* Reference Code & Date Header */}
                <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs tracking-tight uppercase">
                      {subject}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      REF: {refCode} | GOVERNANCE: SOP-B2B-SMP-2026-V1
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 font-medium">
                    <p>Date: {letterDate}</p>
                    <p className="text-slate-400">Dhaka Operations Hub</p>
                  </div>
                </div>

                {/* Recipient Block */}
                <div className="text-[10px] font-medium text-slate-700 whitespace-pre-line">
                  {recipient}
                </div>

                {/* Main Body */}
                <div className="text-[10.5px] text-slate-800 leading-relaxed whitespace-pre-line pt-2">
                  {letterBody}
                </div>
              </div>

              {/* Bottom Institutional Corporate Footer (Exact 4-Pillar Layout) */}
              <div className="absolute left-8 right-8 bottom-6 border-t border-slate-200 pt-3">
                <h4 className="text-sm font-extrabold text-[#003B73] tracking-tight mb-2">
                  Ariel Marketing &amp; Communications Limited
                </h4>

                <div className="grid grid-cols-4 gap-2 text-[8px] text-slate-700 leading-tight">
                  <div>
                    <span className="font-bold text-slate-900 block">Headquarters:</span>
                    House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan-1, Dhaka-1212
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Telephony:</span>
                    +880 2410 811 91<br />+880 1818273458
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Corporate Email:</span>
                    info@arielmc.com<br />arielmc.bd@gmail.com
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Global Portal:</span>
                    http://www.arielmc.com<br />Chittagong Port (BDCGP)
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
