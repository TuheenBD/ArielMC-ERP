'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { SupplierFactory } from '@/types/erp';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Stamp,
  Layers,
  Scale,
  Check,
  AlertOctagon,
  Factory
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

interface FactoryRatingModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory?: SupplierFactory | null;
}

export const FactoryRatingModelModal: React.FC<FactoryRatingModelModalProps> = ({
  isOpen,
  onClose,
  factory = null,
}) => {
  const printCanvasRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Determine tier display if a factory is provided
  const factoryScore = factory ? factory.scorecard.ratingScore * 20 : null; // scale 5.0 to 100%
  const assignedTier = factory
    ? factory.tier === 'TIER_1_PREFERRED'
      ? 'Tier 1 (Gold)'
      : factory.tier === 'TIER_2_QUALIFIED'
        ? 'Tier 2 (Silver)'
        : factory.tier === 'TIER_3_PROBATIONARY'
          ? 'Tier 3 (Bronze)'
          : 'Tier 4 (Critical)'
    : null;

  // Official Document representation for verification and acknowledgement
  const ratingModelDoc: OfficialDocument = {
    id: `doc-frm-${factory?.id || 'standard'}`,
    title: `ArielMC Factory Rating Model & Supply Chain Matrix${factory ? ` — ${factory.name}` : ''}`,
    docCode: 'AMC-FRM-2026',
    documentNumber: `FRM-${factory?.code || 'GEN'}-2026`,
    issuingAuthority: 'ArielMC Global Compliance & Evaluation Board',
    station: 'ARIEL_DHAKA',
    section: 'FACTORY_COMPLIANCE',
    category: 'Supply Chain Audit Matrix',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2027-12-31',
    status: 'ACTIVE',
    fileFormat: 'PDF',
    fileSize: '142 KB (Vector A4)',
    downloadUrl: '/docs/ArielMC_Factory_Rating_Model.html',
    uploadedBy: 'Chief Procurement Officer (CPO)',
    notes: `Official Standardized Global B2B Supply Chain Evaluation Matrix assessing Social Governance & Labor Compliance (25%), Technical Capacity & Automation (25%), Material, Chemical & Safety Compliance (20%), and Logistics, Security & Trade Stability (30%). Shared for official verification and formal supplier/partner acknowledgement.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden text-white">
        
        {/* Top Control Header Bar */}
        <div className="px-6 py-4 bg-[#162B22] border-b-2 border-[#C8A96A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] shadow-md">
              <Award className="w-6 h-6 text-[#C8A96A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 font-bold uppercase tracking-wider">
                  GLOBAL COMPLIANCE MATRIX
                </span>
                <span className="text-xs text-[#CFE0D5] font-medium">Standardized Vector Evaluation Form (A4)</span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white mt-0.5 flex items-center gap-1.5">
                <ArielMC className="text-[#C8A96A]" />
                <span>Factory Rating Model &bull; B2B Supply Chain Evaluation Matrix</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#d4b576] text-[#12231B] font-bold font-heading text-xs shadow-md transition-all active:scale-95"
              title="Print directly or save as vector PDF"
            >
              <Printer className="w-4 h-4 text-[#12231B]" />
              <span>Download / Print Matrix (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-heading text-xs shadow-md transition-all active:scale-95 border border-emerald-400/40 cursor-pointer"
              title="Share Matrix for Official Verification & Acknowledgement via Email or WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Share (Verify / Ack)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Canvas Container */}
        <div className="flex-1 bg-[#0A1410] p-4 sm:p-8 overflow-y-auto flex flex-col items-center">
          
          {/* ========================================================
              PAGE 1: ArielMC FACTORY RATING MODEL (A4 DIMENSIONS)
              ======================================================== */}
          <div
            id="factory-rating-model-page"
            ref={printCanvasRef}
            className="bg-white text-[#1A1A1A] w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col justify-between font-sans text-xs p-8"
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              {/* Top Dual Accent Stripe matching official branding */}
              <div className="w-full h-1.5 flex mb-3">
                <div className="w-2/3 h-full bg-[#0F2C59]" />
                <div className="w-1/3 h-full bg-[#E87722]" />
              </div>

              {/* Official Corporate Letterhead */}
              <div className="pb-3 mb-3 border-b border-gray-300">
                <div className="flex items-start justify-between">
                  {/* Left: ArielMC Logo & Identity */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 shrink-0">
                      <Image
                        src="/images/ArielMC_Emblem_Square.png"
                        alt="ArielMC Emblem"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-heading tracking-tight leading-none text-[#0F2C59]">
                        <ArielMC className="text-[#0F2C59]" />
                      </div>
                      <div className="text-[9px] font-bold text-[#E87722] uppercase tracking-wider mt-0.5">
                        Ariel Marketing &amp; Communications Limited
                      </div>
                      <div className="text-[8px] text-gray-500 font-mono mt-0.5">
                        Global B2B Sourcing, Compliance &amp; Supply Chain Management
                      </div>
                    </div>
                  </div>

                  {/* Right: Corporate HQ Contact Details */}
                  <div className="text-right text-[8px] text-gray-600 leading-tight">
                    <div className="font-semibold text-[#0F2C59]">House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh</div>
                    <div>Tel: +880 2410 811 91 | Mob: +880 1818273458</div>
                    <div>Email: info@arielmc.com | Web: www.arielmc.com</div>
                    <div className="mt-1 font-mono text-[7px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block uppercase">
                      CONFIDENTIAL EVALUATION SYSTEM &bull; DOC REF: AMC-FRM-2026
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Title Header */}
              <div className="text-center py-2 border-b-2 border-[#0F2C59] mb-3">
                <h1 className="text-xl font-bold font-heading text-[#0F2C59] tracking-wider flex items-center justify-center gap-2">
                  <ArielMC className="text-[#0F2C59]" />
                  <span>FACTORY RATING MODEL</span>
                </h1>
                <div className="text-[9.5px] font-semibold text-[#E87722] tracking-wide uppercase mt-0.5">
                  Standardized Global B2B Supply Chain Evaluation Matrix
                </div>
              </div>

              {/* 1. STRATEGIC EVALUATION PILLARS & WEIGHTS */}
              <div className="space-y-1.5 mb-4">
                <div className="bg-[#0F2C59] text-white px-3 py-1.5 text-[9.5px] font-bold font-heading tracking-wide uppercase rounded-xs flex items-center justify-between">
                  <span>1. STRATEGIC EVALUATION PILLARS &amp; WEIGHTS</span>
                  <span className="text-[8px] text-[#E87722] font-mono font-bold">TOTAL CUMULATIVE: 100%</span>
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8.5px]">
                  <thead>
                    <tr className="bg-[#0F2C59] text-white font-bold text-left border-b border-gray-400">
                      <th className="p-2 border-r border-blue-900 w-[28%] text-white">Evaluation Pillar</th>
                      <th className="p-2 border-r border-blue-900 w-[12%] text-center text-white">Weight</th>
                      <th className="p-2 w-[60%] text-white">Core Verification Criteria &amp; Global Standards Aligned</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300 hover:bg-slate-50">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#0F2C59] bg-gray-50/60">
                        Social Governance &amp; Labor Compliance
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] bg-blue-50/40 text-[9.5px]">
                        25%
                      </td>
                      <td className="p-2 text-gray-700 leading-snug">
                        <strong className="text-gray-900">Sedex (SMETA) &amp; Amfori BSCI standards.</strong> Evaluation of child labor elimination, fair compensation, structural safety, safe working hours, and operational employee welfare infrastructure.
                      </td>
                    </tr>

                    <tr className="border-b border-gray-300 hover:bg-slate-50">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#0F2C59] bg-gray-50/60">
                        Technical Capacity &amp; Automation
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] bg-blue-50/40 text-[9.5px]">
                        25%
                      </td>
                      <td className="p-2 text-gray-700 leading-snug">
                        <strong className="text-gray-900">Raw material throughput capabilities</strong>, factory floor equipment inventory (modern ceramic kilns, automated textile looms), in-house quality labs, and supply reliability history.
                      </td>
                    </tr>

                    <tr className="border-b border-gray-300 hover:bg-slate-50">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#0F2C59] bg-gray-50/60">
                        Material, Chemical &amp; Safety Compliance
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] bg-blue-50/40 text-[9.5px]">
                        20%
                      </td>
                      <td className="p-2 text-gray-700 leading-snug">
                        <strong className="text-gray-900">Sector global certifications:</strong> Leather Working Group (LWG) environmental checks, GOTS / OEKO-TEX Standard 100 for textiles, and food-grade heavy-metal leaching tests for ceramics.
                      </td>
                    </tr>

                    <tr className="border-b border-gray-400 hover:bg-slate-50">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#0F2C59] bg-gray-50/60">
                        Logistics, Security &amp; Trade Stability
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] bg-blue-50/40 text-[9.5px]">
                        30%
                      </td>
                      <td className="p-2 text-gray-700 leading-snug">
                        <strong className="text-gray-900">CTPAT supply chain safety alignment</strong>, international export scaling readiness, customs tracking capability (ASYCUDA World), and Bangladesh Bank foreign currency monitoring system clearance.
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold text-[#0F2C59]">
                      <td className="p-1.5 border-r border-gray-300 text-right uppercase text-[8px]">
                        Cumulative Total Weight:
                      </td>
                      <td className="p-1.5 border-r border-gray-300 font-mono text-center text-[#E87722] text-[10px]">
                        100%
                      </td>
                      <td className="p-1.5 text-[8px] text-gray-500 italic">
                        Combined multi-pillar evaluation index for global supply chain qualification.
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* 2. PERFORMANCE CLASSIFICATION & RATING TIERS (FIXED COLOR & HIGH CONTRAST) */}
              <div className="space-y-1.5 mb-4">
                <div className="bg-[#0F2C59] text-white px-3 py-1.5 text-[9.5px] font-bold font-heading tracking-wide uppercase rounded-xs flex items-center justify-between">
                  <span>2. PERFORMANCE CLASSIFICATION &amp; RATING TIERS</span>
                  <span className="text-[8px] text-gray-200 font-mono">B2B ONBOARDING PRIVILEGES</span>
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8.5px]">
                  <thead>
                    <tr className="bg-[#0F2C59] text-white font-bold text-left border-b border-gray-400">
                      <th className="p-2 border-r border-blue-900 w-[22%] text-white">Tier Rank</th>
                      <th className="p-2 border-r border-blue-900 w-[18%] text-center text-white">Score Band</th>
                      <th className="p-2 w-[60%] text-white">Operational Status &amp; Procurement Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* TIER 1 (GOLD) */}
                    <tr className="border-b border-gray-300 bg-[#FCF8EE] hover:bg-[#F9F2DC] transition-colors">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#785412]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#E87722] text-white flex items-center justify-center text-[9px] font-extrabold shadow-xs">
                            ★
                          </span>
                          <span className="text-[9.5px] text-[#855D10]">Tier 1 (Gold)</span>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] text-[9.5px] bg-[#FAF5E6]">
                        90% – 100%
                      </td>
                      <td className="p-2 text-gray-800 leading-snug">
                        <strong className="text-emerald-800 font-bold">Approved Preferred Partner.</strong> Unrestricted export volume onboarding; automatic purchase order execution privileges.
                      </td>
                    </tr>

                    {/* TIER 2 (SILVER) */}
                    <tr className="border-b border-gray-300 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#334155]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#64748B] text-white flex items-center justify-center text-[9px] font-extrabold shadow-xs">
                            ✓
                          </span>
                          <span className="text-[9.5px] text-[#1E293B]">Tier 2 (Silver)</span>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] text-[9.5px] bg-[#EEF2F6]">
                        75% – 89%
                      </td>
                      <td className="p-2 text-gray-800 leading-snug">
                        <strong className="text-blue-900 font-bold">Approved Regular Vendor.</strong> Standard operational volume placement; minor process gaps managed via a conditional Corrective Action Plan (CAP).
                      </td>
                    </tr>

                    {/* TIER 3 (BRONZE) */}
                    <tr className="border-b border-gray-300 bg-[#FFFBEB] hover:bg-[#FEF3C7] transition-colors">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#92400E]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[9px] font-extrabold shadow-xs">
                            !
                          </span>
                          <span className="text-[9.5px] text-[#9A3412]">Tier 3 (Bronze)</span>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#0F2C59] text-[9.5px] bg-[#FEF3C7]/60">
                        60% – 74%
                      </td>
                      <td className="p-2 text-gray-800 leading-snug">
                        <strong className="text-amber-800 font-bold">Restricted Supplier Status.</strong> Micro trial orders only; strict 90-day physical remediation verification window to avoid offboarding.
                      </td>
                    </tr>

                    {/* TIER 4 (CRITICAL) */}
                    <tr className="border-b border-gray-400 bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors">
                      <td className="p-2 border-r border-gray-300 font-bold text-[#991B1B]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[9px] font-extrabold shadow-xs">
                            ✕
                          </span>
                          <span className="text-[9.5px] text-[#991B1B]">Tier 4 (Critical)</span>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-300 font-mono font-bold text-center text-[#991B1B] text-[9.5px] bg-[#FEE2E2]">
                        Below 60%
                      </td>
                      <td className="p-2 text-gray-800 leading-snug">
                        <strong className="text-red-700 font-bold">Blacklisted / Onboarding Barred.</strong> Immediate cessation of all commercial engagement; current active orders suspended.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3. MANDATORY ZERO-TOLERANCE CRITERIA (CLEAR BOLD LABELS & CONTRAST) */}
              <div className="space-y-1.5 mb-4">
                <div className="bg-[#991B1B] text-white px-3 py-1.5 text-[9.5px] font-bold font-heading tracking-wide uppercase rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-white" />
                    <span>3. MANDATORY ZERO-TOLERANCE CRITERIA (IMMEDIATE TIER 4 FAILURE)</span>
                  </div>
                  <span className="text-[7.5px] bg-white text-[#991B1B] px-1.5 py-0.2 rounded font-extrabold uppercase">
                    NON-NEGOTIABLE
                  </span>
                </div>

                <div className="p-2.5 rounded border border-red-200 bg-red-50/40 text-[8px] text-gray-700 space-y-2">
                  <p className="italic text-gray-600 font-medium">
                    Certain compliance breaches bypass numerical scores and trigger an instant blacklisting to safeguard international supply chain channels against standard liability claims:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-0.5">
                    {/* Item 1 */}
                    <div className="p-2 rounded bg-white border border-red-200 flex items-start gap-2 shadow-xs">
                      <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        ⛔
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[#991B1B] text-[8.5px]">Child or Forced Labor</div>
                        <div className="text-gray-700 text-[8px] mt-0.5">
                          Any identified instance of underage workers or forced labor environments.
                        </div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-2 rounded bg-white border border-red-200 flex items-start gap-2 shadow-xs">
                      <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        ⛔
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[#991B1B] text-[8.5px]">Environmental Bypass</div>
                        <div className="text-gray-700 text-[8px] mt-0.5">
                          Deliberate avoidance or complete absence of an active Effluent Treatment Plant (ETP) for heavy industrial waste.
                        </div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-2 rounded bg-white border border-red-200 flex items-start gap-2 shadow-xs">
                      <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        ⛔
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[#991B1B] text-[8.5px]">Shadow Subcontracting</div>
                        <div className="text-gray-700 text-[8px] mt-0.5">
                          Outsourcing active product runs to unauthorized, un-audited shadow workshops.
                        </div>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-2 rounded bg-white border border-red-200 flex items-start gap-2 shadow-xs">
                      <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        ⛔
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[#991B1B] text-[8.5px]">Unauthorized Transparency</div>
                        <div className="text-gray-700 text-[8px] mt-0.5">
                          Falsifying structural safety reports, regulatory certificates, or facility logs.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. REMEDIATION ROADMAP & AUTHORIZED PANEL SIGN-OFF (CLEAN STRUCTURED PRESENTATION) */}
              <div className="space-y-2">
                <div className="bg-[#0F2C59] text-white px-3 py-1.5 text-[9.5px] font-bold font-heading tracking-wide uppercase rounded-xs flex items-center justify-between">
                  <span>4. REMEDIATION ROADMAP &amp; AUTHORIZED PANEL SIGN-OFF</span>
                  <span className="text-[8px] text-[#E87722] font-mono font-bold">OFFICIAL VALIDATION</span>
                </div>

                {/* Audit Context Bar */}
                <div className="p-2.5 rounded border border-gray-300 bg-gray-50/80 text-[8px] text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="font-bold text-gray-600 block uppercase text-[7.5px]">Audited Facility Name:</span>
                    <div className="font-bold text-[#0F2C59] text-[9px] font-mono border-b border-gray-400 pb-0.5 mt-0.5 truncate">
                      {factory?.name || '________________________________________________'}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-gray-600 block uppercase text-[7.5px]">Audit Date (DD/MM/YYYY):</span>
                    <div className="font-mono text-gray-800 text-[9px] border-b border-gray-400 pb-0.5 mt-0.5">
                      {factory ? '15 / 10 / 2026' : '______ / ______ / 2026'}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-gray-600 block uppercase text-[7.5px]">Final Score / Verified Tier:</span>
                    <div className="font-bold font-mono text-[#E87722] text-[9px] border-b border-gray-400 pb-0.5 mt-0.5">
                      {factoryScore ? `${factoryScore}%  (${assignedTier})` : '_________ %  /  Tier: _________'}
                    </div>
                  </div>
                </div>

                {/* 3 Authorized Panel Sign-off Signature Blocks */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {/* Auditor 1 */}
                  <div className="p-2.5 rounded border border-gray-300 bg-white flex flex-col justify-between h-28 text-center">
                    <div className="text-[7.5px] text-gray-500 uppercase font-semibold">
                      Primary Field Audit
                    </div>
                    
                    <div className="border-b-2 border-dashed border-gray-400 my-auto mx-2 pt-6">
                      {factory && (
                        <div className="font-serif italic text-[11px] text-[#0F2C59] -mb-1">
                          Shafiqur Rahman
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-[#0F2C59] text-[8.5px]">Lead Supply Chain Auditor</div>
                      <div className="text-[7.5px] text-gray-500">Social, Labor &amp; Technical Audits</div>
                    </div>
                  </div>

                  {/* Auditor 2 */}
                  <div className="p-2.5 rounded border border-gray-300 bg-white flex flex-col justify-between h-28 text-center">
                    <div className="text-[7.5px] text-gray-500 uppercase font-semibold">
                      Technical Assurance
                    </div>
                    
                    <div className="border-b-2 border-dashed border-gray-400 my-auto mx-2 pt-6">
                      {factory && (
                        <div className="font-serif italic text-[11px] text-[#0F2C59] -mb-1">
                          Nusrat Jahan, Ph.D.
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-[#0F2C59] text-[8.5px]">Head of Quality &amp; Operations</div>
                      <div className="text-[7.5px] text-gray-500">Capacity &amp; Compliance Engineering</div>
                    </div>
                  </div>

                  {/* Auditor 3 */}
                  <div className="p-2.5 rounded border border-gray-300 bg-white flex flex-col justify-between h-28 text-center">
                    <div className="text-[7.5px] text-gray-500 uppercase font-semibold">
                      Executive Approval
                    </div>
                    
                    <div className="border-b-2 border-dashed border-gray-400 my-auto mx-2 pt-6">
                      {factory && (
                        <div className="font-serif italic text-[11px] text-[#E87722] -mb-1">
                          Syed A. Hassan
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-[#0F2C59] text-[8.5px]">Chief Procurement Officer (CPO)</div>
                      <div className="text-[7.5px] text-gray-500">Global Executive Sourcing Board</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-4 pt-2.5 border-t border-gray-300 flex items-center justify-between text-[7.5px] text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-[#0F2C59]">
                <ArielMC />
                <span>Marketing &amp; Communications Limited &bull; Standardized Global B2B Supply Chain Evaluation Matrix</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono">Form Ref: AMC-FRM-2026-V1</span>
                <span className="font-mono font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Verification & Acknowledgement Share Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={ratingModelDoc}
      />
    </div>
  );
};
