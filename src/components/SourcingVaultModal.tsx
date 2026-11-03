'use client';

import React from "react";
import { ProductItem } from "@/types/erp";
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  Image,
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  Factory,
  Camera,
} from "lucide-react";

interface SourcingVaultModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourcingVaultModal: React.FC<SourcingVaultModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const vault = product.sourcingVault || {
    signedMouName: "Deed of Sourcing Agreement (Factory Direct MoU)",
    signedMouDate: "2026-01-15",
    hasIncentiveWaiverClause: true,
    factoryRatingGrade: "A",
    factoryRatingScore: 94.0,
    factoryAuditReportName: "ArielMC Merchant Factory Visit & Compliance Rating",
    studioPhotoZipName: `${product.sku}-Studio-HiRes-Pack.zip`,
    highResPhotoCount: 14,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#DDE3DD] overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DDE3DD] bg-[#1F3A2E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/40 flex items-center justify-center text-[#C8A96A]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  {product.sku}
                </span>
                <span className="text-xs text-[#C8A96A] font-semibold">
                  Department 1: Sourcing Documents & Asset Vault
                </span>
              </div>
              <h2 className="text-base font-bold font-heading truncate max-w-[400px]">
                {product.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs bg-[#FAF9F5]">
          {/* Supplier Link Bar */}
          <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Factory className="w-5 h-5 text-[#8A6D3B]" />
              <div>
                <span className="text-[10px] text-[#6B7269] uppercase font-bold block">
                  Enlisted Manufacturing Partner
                </span>
                <span className="text-xs font-bold text-[#1F3A2E]">
                  {product.partnerFactory.factoryName}
                </span>
                <span className="text-[11px] text-[#6B7269] block">
                  {product.partnerFactory.location} • Lead Time: {product.partnerFactory.leadTimeDays}d • MOQ: {product.partnerFactory.moq}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#E4F3E9] text-[#14512C] font-bold text-xs border border-[#BBE3C7]">
              ★ {product.partnerFactory.rating.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Document 1: Signed MoU */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAF5EC] border border-[#C8A96A]/40 flex items-center justify-center text-[#8A6D3B] shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">
                    Document 1 • Legal Agreement
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs">
                    {vault.signedMouName || "Deed of Sourcing & Manufacturing Agreement"}
                  </h4>
                  <span className="text-[11px] text-[#6B7269] block">
                    Executed on {vault.signedMouDate || "2026-01-15"} • Printed on Tk. 300 Non-Judicial Stamp
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] text-[10px] font-bold border border-[#BBE3C7] shrink-0">
                ACTIVE & EXECUTED
              </span>
            </div>

            {/* Clause 3 Benefit Check */}
            <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-[#14512C] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#14512C]" />
                Clause 3: Export Cash Incentive Sole Beneficiary Waiver
              </span>
              <span className="font-bold text-[#14512C]">VERIFIED ON FILE</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => alert("Opening official signed MoU PDF document...")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-xs font-semibold text-[#1F3A2E] transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#8A6D3B]" />
                <span>View Stamped MoU</span>
              </button>
            </div>
          </div>

          {/* Document 2: Factory Rating & Visit Scorecard */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E4F3E9] border border-[#BBE3C7] flex items-center justify-center text-[#14512C] shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#14512C] block">
                    Document 2 • Quality Audit
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs">
                    {vault.factoryAuditReportName || "ArielMC On-Site Factory Visit & Quality Scorecard"}
                  </h4>
                  <span className="text-[11px] text-[#6B7269] block">
                    Physical inspection of machinery, artisan working conditions, and AQL tolerances.
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded bg-[#1F3A2E] text-[#C8A96A] text-xs font-mono font-bold block">
                  Grade {vault.factoryRatingGrade || "A"} ({vault.factoryRatingScore || 94.5}%)
                </span>
                <span className="text-[10px] text-[#14512C] font-semibold block mt-0.5">
                  PASSED AUDIT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#DDE3DD]">
                <span className="text-[10px] text-[#6B7269] block">Artisan Wage Audit</span>
                <span className="text-xs font-bold text-[#14512C]">100% Living Wage</span>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#DDE3DD]">
                <span className="text-[10px] text-[#6B7269] block">Machinery & Lines</span>
                <span className="text-xs font-bold text-[#1F3A2E]">Clean & Certified</span>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#DDE3DD]">
                <span className="text-[10px] text-[#6B7269] block">AQL 1.5 FRI History</span>
                <span className="text-xs font-bold text-[#14512C]">99.2% Pass Rate</span>
              </div>
            </div>
          </div>

          {/* Document 3: Studio High-Res Photos Zip */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F0FA] border border-[#C5D7ED] flex items-center justify-center text-[#17456F] shrink-0 mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#17456F] block">
                    Document 3 • Studio Visual Assets
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs">
                    {vault.studioPhotoZipName || `${product.sku}-Studio-300DPI-Pack.zip`}
                  </h4>
                  <span className="text-[11px] text-[#6B7269] block">
                    {vault.highResPhotoCount || 16} High-Resolution Studio Photos (Front, Flat, Lifestyle, Macro Weave, Packaging)
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] text-[10px] font-bold border border-[#C5D7ED] shrink-0">
                300 DPI EXPORT
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#6B7269]">
                Format: Clean White Background & Living Interior Setup
              </span>
              <button
                type="button"
                onClick={() => alert(`Downloading ${vault.studioPhotoZipName || "Studio Pack"}...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs font-bold transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Download Studio ZIP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DDE3DD] bg-white flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F3A2E] text-[#C8A96A] text-xs font-bold hover:bg-[#162B22] transition"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
