'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DigitalCollateral } from '@/types/marketing';
import { ArielMC } from '@/lib/brand';
import {
  X,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Sparkles,
  Check,
  Calendar,
  Layers,
  ZoomIn,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';

interface LookbookViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  collateral: DigitalCollateral | null;
  onNavigateToSamples?: () => void;
}

export const LookbookViewerModal: React.FC<LookbookViewerModalProps> = ({
  isOpen,
  onClose,
  collateral,
  onNavigateToSamples,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || !collateral) return null;

  const pages = collateral.previewPages && collateral.previewPages.length > 0
    ? collateral.previewPages
    : [{ pageNumber: 1, title: collateral.title, image: collateral.coverImage, caption: collateral.subtitle }];

  const activePage = pages[currentPageIndex] || pages[0];

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      setIsZoomed(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      setIsZoomed(false);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.arielmc.com'}/collateral/${collateral.code}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E293B] border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 shrink-0">
              {collateral.code}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate flex items-center gap-2">
                {collateral.title}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {collateral.sector} Sector • {collateral.season} • {collateral.pages} Pages • {collateral.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
              title="Copy buyer shareable link"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-300" />}
              <span>{isCopied ? 'Link Copied!' : 'Share Link'}</span>
            </button>

            <a
              href={collateral.downloadUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area (Preview + Side Spec Drawer) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Main Visual Carousel (Left 2 Columns) */}
          <div className="lg:col-span-2 relative flex flex-col justify-between bg-black/50 p-4 sm:p-6 overflow-hidden">
            {/* Image Stage */}
            <div className="relative flex-1 flex items-center justify-center min-h-[380px] max-h-[58vh] overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div 
                className={`relative w-full h-full transition-transform duration-300 cursor-zoom-in flex items-center justify-center ${isZoomed ? 'scale-125' : 'scale-100'}`}
                onClick={() => setIsZoomed(!isZoomed)}
                title="Click to toggle zoom"
              >
                <Image
                  src={activePage.image}
                  alt={activePage.title}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>

              {/* Prev / Next Page Overlays */}
              {pages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/10 shadow-lg"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex === pages.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/10 shadow-lg"
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Zoom hint badge */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur text-[10px] text-slate-300 flex items-center gap-1 border border-white/10">
                <ZoomIn className="w-3 h-3" />
                <span>{isZoomed ? 'Click to Fit' : 'Click to Zoom'}</span>
              </div>
            </div>

            {/* Bottom Carousel Controls & Captions */}
            <div className="mt-4 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#C8A96A] uppercase tracking-wider block">
                  Page {currentPageIndex + 1} of {pages.length}: {activePage.title}
                </span>
                {activePage.caption && (
                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    {activePage.caption}
                  </p>
                )}
              </div>

              {/* Thumbnail Dots / Mini Previews */}
              <div className="flex items-center gap-1.5 shrink-0">
                {pages.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentPageIndex ? 'w-6 bg-[#C8A96A]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Info & Technical Spec Drawer (1 Column) */}
          <div className="p-5 flex flex-col justify-between overflow-y-auto space-y-5 bg-[#0F172A]">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Procurement Audience
                </span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">
                  {collateral.targetAudience}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Executive Overview
                </span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {collateral.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Key Attributes & Compliance
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {collateral.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Institutional Assurance */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ArielMC Sovereign Safeguards</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  All designs and technical parameters featured in this dossier are audited against BSCI, Sedex, and LWG/FDA standards with verified AQL 2.5 pass guarantee.
                </p>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSamples?.();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003B73] hover:bg-[#002D59] text-white text-xs font-bold shadow-md transition-colors border border-blue-400/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Sample Development (SDO)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Downloads: {collateral.downloadCount}</span>
                <span>Views: {collateral.viewsCount}</span>
                <span>Updated: {collateral.lastUpdated}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
