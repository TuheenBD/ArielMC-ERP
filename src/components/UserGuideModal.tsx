'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Download,
  Printer,
  ExternalLink,
  Search,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Package,
  Factory,
  FlaskConical,
  Repeat,
  Landmark,
  Boxes,
  Users2,
  Database,
  Bot,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { ThemeProfile } from '@/components/Sidebar';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeProfile;
}

interface Chapter {
  id: string;
  title: string;
  badge: string;
  icon: any;
  content: React.ReactNode;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  theme = 'crm-green'
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('chapter-1');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  const modalHeaderBg = isRoyal
    ? 'bg-[#0F172A] border-b border-[#1E293B] text-white'
    : isHeritage
    ? 'bg-[#183124] border-b border-[#2A4837] text-white'
    : 'bg-[#1F3A2E] border-b border-[#2C5240] text-white';

  const chapters: Chapter[] = [
    {
      id: 'chapter-1',
      title: '1. Multi-Station Architecture & Entities',
      badge: '5 Stations',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              1. Multi-Station Architecture &amp; Global Footprint
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Cross-border operational framework across 5 statutory jurisdictions.
            </p>
          </div>

          <p className="text-xs leading-relaxed text-gray-700">
            <strong>ArielMC</strong> functions as a unified multi-entity sourcing and manufacturing powerhouse. All operations across factory contracting, tech pack development, international freight, and multi-currency billing flow through five dedicated stations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>🇧🇩 ArielMC BD (Dhaka, Bangladesh)</span>
                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">BDT (৳)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">NBR BIN: <code>001928374-0101</code> &bull; Chattogram Port Depot A-4</div>
              <p className="text-[11px] text-gray-600 mt-2">
                Factory supply agreements, ETP &amp; social audits, sample prototyping, and bonded customs clearance.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>🇬🇧 ArielMC UK (London, UK)</span>
                <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">GBP (£)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">HMRC VAT: <code>GB-982-1049-22</code> &bull; High Street Accounts</div>
              <p className="text-[11px] text-gray-600 mt-2">
                Tier-1 UK buyer management (Marks &amp; Spencer, Harrods), UK customs declarations, sterling hedging.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>🇺🇸 ArielMC US (New York, USA)</span>
                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">USD ($)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">IRS EIN: <code>13-8472910</code> &bull; North American SCM</div>
              <p className="text-[11px] text-gray-600 mt-2">
                US retail partnerships (Ralph Lauren, Crate &amp; Barrel), bonded warehousing, FDA tableware compliance.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>🇪🇺 ArielMC EU (Frankfurt, Germany)</span>
                <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">EUR (€)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">USt-IdNr: <code>DE-304918274</code> &bull; Schengen Logistics</div>
              <p className="text-[11px] text-gray-600 mt-2">
                EU continental buyers (Zara Home, H&amp;M Home), REACH chemical certification, CE standard auditing.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-2',
      title: '2. Sector Product Master & Costing Engine',
      badge: '12 SKUs',
      icon: Package,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              2. Sector Product Master &amp; Sourcing Margin Engine
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Standardized master product definitions, international HS customs codes, and locked margin formulas.
            </p>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed">
            The Product Master manages 12 registered export SKUs spanning Leather Goods, Jute Crafts, Apparel Textiles, and Artisan Ceramics.
          </p>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <div className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
              Costing &amp; Margin Mathematical Protocol
            </div>
            <div className="font-mono text-[11px] mt-1.5 bg-white p-2 rounded border border-amber-200 text-slate-800">
              FOB_Target_USD = Factory_ExWorks_USD + (Factory_ExWorks_USD &times; Ariel_Sourcing_Margin_Pct) + Inland_Bonded_Freight_USD
            </div>
            <p className="mt-2 text-[11px]">
              All <strong>ArielMC</strong> margins are fixed between <strong>18.0% and 35.0%</strong>. Landed CIF prices incorporate insurance, marine freight, and bonded port handling charges.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-3',
      title: '3. Bangladesh Factory Compliance Auditing',
      badge: '8 Facilities',
      icon: Factory,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              3. Bangladesh Factory Network &amp; Compliance Auditing
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Vetting protocol for partner manufacturing facilities across Savar, Gazipur, Dhamrai, and Narsingdi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
              <thead className="bg-[#1F3A2E] text-white">
                <tr>
                  <th className="p-2.5">Certification</th>
                  <th className="p-2.5">Scope &amp; Standards</th>
                  <th className="p-2.5">Audit Cadence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold">LWG Gold / Silver</td>
                  <td className="p-2">Effluent Treatment Plant (ETP), chromium recovery, water consumption.</td>
                  <td className="p-2">Biannual</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold">amfori BSCI (Grade A)</td>
                  <td className="p-2">Fair wage compensation, non-discrimination, occupational safety.</td>
                  <td className="p-2">Annual</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold">SEDEX SMETA 4-Pillar</td>
                  <td className="p-2">Labor rights, health, environmental management, business ethics.</td>
                  <td className="p-2">Annual</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold">OEKO-TEX / GOTS</td>
                  <td className="p-2">Organic fiber integrity, harmful substance clearance (REACH).</td>
                  <td className="p-2">Per Batch</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-4',
      title: '4. R&D, Tech Packs & SDO Sampling',
      badge: '5 Stages',
      icon: FlaskConical,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              4. R&amp;D, Tech Packs &amp; SDO Sampling Protocol
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Five-stage sampling methodology from initial Lab Dip to official Golden Seal Counter-Sample.
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
              <div>
                <div className="font-bold text-[#1F3A2E]">Stage 1: Lab Dip &amp; Swatch Approval</div>
                <div className="text-[11px] text-gray-500">Color fastness and Pantone swatches tested under D65 standard light boxes.</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
              <div>
                <div className="font-bold text-[#1F3A2E]">Stage 2: Proto Sample (Prototype)</div>
                <div className="text-[11px] text-gray-500">First dimensional execution verifying ergonomic pattern and stitching tolerances.</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
              <div>
                <div className="font-bold text-[#1F3A2E]">Stage 3: Fit / Size Set Sample</div>
                <div className="text-[11px] text-gray-500">Full sizing validation ensuring grading accuracy across international size runs.</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-bold text-[11px] shrink-0">4</span>
              <div>
                <div className="font-bold text-[#1F3A2E]">Stage 4: Pre-Production (PP) Sample</div>
                <div className="text-[11px] text-gray-500">Machined on commercial manufacturing lines using bulk-approved raw hides/yarns.</div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border-2 border-[#C8A96A] bg-amber-50/50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center font-bold text-[11px] shrink-0">5</span>
              <div>
                <div className="font-bold text-[#8A6D3B]">Stage 5: Golden Seal Counter-Sample (Approved)</div>
                <div className="text-[11px] text-gray-700">Contractual reference standard stamped and countersigned by buyer and <strong>ArielMC</strong>.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-5',
      title: '5. Two-Way Order Management System (OMS)',
      badge: 'Back-to-Back',
      icon: Repeat,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              5. Two-Way Order Management System (OMS) &amp; Back-to-Back POs
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              End-to-end synchronization between buyer export sales contracts and factory manufacturing purchase orders.
            </p>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed">
            In <strong>ArielMC</strong>, order management is fundamentally bidirectional. When a sales order is accepted:
          </p>
          <ul className="text-xs space-y-1.5 list-disc pl-5 text-gray-700">
            <li><strong>L/C Verification</strong>: Buyer Letter of Credit or wire transfer commitment is confirmed with <strong>ArielMC UK/US/EU/AU</strong>.</li>
            <li><strong>Back-to-Back Factory PO</strong>: <strong>ArielMC BD</strong> instantly generates an official factory purchase order with locked delivery timelines and penalty clauses for delayed shipment.</li>
            <li><strong>Quality Assurance Gates</strong>: Inline inspection at 30% production, and final random inspection (AQL 1.5 standard) prior to commercial release.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'chapter-6',
      title: '6. Logistics, Customs & Mushak 6.3 VAT',
      badge: 'NBR Tax',
      icon: Boxes,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              6. Logistics, Bonded Warehousing &amp; Bangladesh Customs (Mushak 6.3)
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Statutory NBR VAT compliance, Chattogram Port customs clearance, and Bill of Lading workflows.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
            <div className="font-bold uppercase tracking-wider text-[10px] text-blue-800">
              National Board of Revenue (NBR) Mushak 6.3 Standards
            </div>
            <p className="text-[11px] leading-relaxed">
              Under Bangladesh Value Added Tax and Supplementary Duty Act 2012, <strong>ArielMC BD</strong> (BIN: <code>001928374-0101</code>) issues official <strong>Mushak 6.3</strong> tax invoices:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li><strong>Zero-Rated Exports (0% VAT)</strong>: Directly tied to export L/Cs, shipping bills, and EPB Certificates of Origin.</li>
              <li><strong>Domestic Institutional Supply (15% VAT)</strong>: Automated withholding and tax deduction at source.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-7',
      title: '7. Enterprise Security, User Profiles & 2SA',
      badge: 'Security',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              7. Enterprise Security, User Profiles &amp; Two-Step Authentication (2SA)
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Account administration, password management, TOTP authenticator setup, and WhatsApp OTP verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800">Two-Step Authentication (2SA)</div>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Staff can enable 2SA via standard TOTP Authenticator apps (Google Authenticator, Microsoft Authenticator) or encrypted WhatsApp OTP sent to verified mobile numbers.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800">Role-Based Access Control (RBAC)</div>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Granular permissions restrict costing edits, factory compliance overrides, and financial exports strictly to authorized roles (Managing Director, VP SCM, Chief Auditor).
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'chapter-8',
      title: '8. Autonomous AI Copilot — ArielMC',
      badge: 'AI Assistant',
      icon: Bot,
      content: (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-lg font-heading font-bold text-[#1F3A2E]">
              8. The ArielMC AI Operational Copilot Reference
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Autonomous AI agent integrated directly inside the ERP for real-time operational guidance.
            </p>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed">
            The <strong>ArielMC</strong> AI Copilot resides in the bottom-right floating launcher. It continuously ingests current ERP state, allowing instant operational queries:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-mono font-bold text-[#1F3A2E] text-[11px]">Q: "Show highest margin leather products"</div>
              <div className="text-[11px] text-gray-600 mt-1">Calculates SKU margins, displays factory Ex-Works vs. FOB target rates, and links directly to the Product Master.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-mono font-bold text-[#1F3A2E] text-[11px]">Q: "List LWG Gold compliant factories"</div>
              <div className="text-[11px] text-gray-600 mt-1">Filters audited facilities in Savar/Gazipur, showing audit ratings and compliance officer contacts.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-mono font-bold text-[#1F3A2E] text-[11px]">Q: "How do I generate an official Mushak 6.3 VAT invoice?"</div>
              <div className="text-[11px] text-gray-600 mt-1">Explains NBR statutory guidelines and triggers the 1-click Document Engine modal.</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChapter = chapters.find(c => c.id === activeSectionId) || chapters[0];

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/docs/ArielMC_ERP_User_Guide.pdf';
    link.download = 'ArielMC_ERP_User_Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdfNewTab = () => {
    window.open('/docs/ArielMC_ERP_User_Guide.pdf', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${modalHeaderBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#C8A96A] p-1 flex items-center justify-center shadow-md">
              <Image
                src="/images/ArielMC_Emblem_Square.png"
                alt="ArielMC Logo Emblem"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-white">
                  ArielMC <span className="text-[#C8A96A]">ERP User Guide</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold">
                  OFFICIAL PDF READY
                </span>
              </div>
              <p className="text-[11px] text-[#C8A96A]">
                Comprehensive Operational Handbook &bull; Publication Ref: ArielMC-ERP-UG-2026-V1
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#d6b778] text-[#1F3A2E] font-bold text-xs shadow-md transition-colors"
              title="Download ArielMC ERP User Guide PDF (841 KB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleOpenPdfNewTab}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
              title="Open Official PDF in New Browser Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Chapters Sidebar + Right Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-slate-50 flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user guide chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C8A96A] text-gray-800"
                />
              </div>
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredChapters.map((ch) => {
                const Icon = ch.icon;
                const isSelected = activeSectionId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveSectionId(ch.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-[#1F3A2E] text-white font-bold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
                      <span className="truncate">{ch.title}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-[#C8A96A]'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {ch.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick PDF Download Box in Sidebar Bottom */}
            <div className="p-3 border-t border-gray-200 bg-white text-xs">
              <div className="flex items-center justify-between text-gray-600 mb-2 text-[11px]">
                <span className="font-semibold text-gray-800">ArielMC_ERP_User_Guide.pdf</span>
                <span className="font-mono text-[10px] text-gray-400">841 KB</span>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#172D24] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Save Offline PDF</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Viewer */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Active Chapter Content */}
              {activeChapter.content}

              {/* Bottom Navigation Prompt */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Document Certified by <strong>ArielMC</strong> Executive Board</span>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="text-[#1F3A2E] hover:text-[#C8A96A] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Download Full PDF</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
