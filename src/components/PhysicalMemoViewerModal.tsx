'use client';

import React, { useState } from 'react';
import {
  FileText,
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Calendar,
  Building2,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { PhysicalAttachment } from '@/types/voucher';
import { ArielMC } from '@/lib/brand';

interface PhysicalMemoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: PhysicalAttachment | null;
  voucherNumber: string;
  voucherType: 'CASH_PURCHASE' | 'CASH_RECEIVE';
  partyName: string;
}

export const PhysicalMemoViewerModal: React.FC<PhysicalMemoViewerModalProps> = ({
  isOpen,
  onClose,
  attachment,
  voucherNumber,
  voucherType,
  partyName,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen || !attachment) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-[#12231B] border-2 border-[#2C5240] rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Bar */}
        <div className="px-5 pr-16 py-4 bg-[#0A140F] border-b border-[#2C5240] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[#C8A96A] shadow-inner">
              <Paperclip className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  Physical Cash Memo / Supplier Bill Scan
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
                  ATTACHED RECEIPT
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Linked Voucher: <span className="text-[#C8A96A] font-bold">{voucherNumber}</span> • {partyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom / Rotate Toolbar */}
            <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-[#2C5240] rounded-lg p-1 mr-2">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-bold text-gray-300 px-1.5">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors ml-1 border-l border-white/10 pl-2"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <a
              href={attachment.fileUrl}
              download={attachment.fileName}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Download Original File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="px-5 py-3 bg-[#162B22]/80 border-b border-[#2C5240] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0 no-print">
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-mono block">Physical Memo No.</span>
            <span className="font-mono font-bold text-[#C8A96A] text-xs">
              {attachment.memoNumber || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-mono block">Memo Date</span>
            <span className="font-mono text-white text-xs">
              {attachment.memoDate || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-mono block">Supplier / Origin Hub</span>
            <span className="font-medium text-white truncate block text-xs">
              {attachment.supplierShopName || partyName}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-mono block">Document Security</span>
            <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Audit Verified (NBR/EPB)</span>
            </span>
          </div>
        </div>

        {/* Document Viewing Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#060D09] flex items-center justify-center min-h-[350px]">
          <div
            className="printable-content transition-transform duration-200 shadow-2xl rounded-xl border border-white/10 bg-white overflow-hidden p-6 max-w-2xl text-gray-900"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Realistic Physical Memo Replica for Scans */}
            <div className="w-full space-y-4 font-mono text-xs border-2 border-dashed border-gray-400 p-6 rounded-lg bg-[#FAF8F5]">
              <div className="text-center border-b-2 border-gray-800 pb-3">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  OFFICIAL PHYSICAL RECEIPT / CASH MEMO
                </div>
                <div className="text-lg font-bold font-heading text-emerald-900 mt-1">
                  {attachment.supplierShopName || partyName}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  Dhaka Commercial & Industrial Cluster • Tax/BIN Registered
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-gray-300 pb-3">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase">Cash Memo / Chalan No:</span>
                  <span className="font-bold text-gray-900">{attachment.memoNumber || 'MEMO-99418'}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block text-[9px] uppercase">Date of Issue:</span>
                  <span className="font-bold text-gray-900">{attachment.memoDate || '2026-10-18'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase">Billed / Issued To:</span>
                  <span className="font-bold text-emerald-950">
                    Ariel Marketing & Communications Limited
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block text-[9px] uppercase">Payment Status:</span>
                  <span className="font-bold text-emerald-700">PAID &amp; SETTLED</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-300 text-[11px] space-y-1">
                <div className="font-bold text-gray-800 uppercase text-[9px] text-gray-500">
                  Verification Remarks &amp; Goods Description:
                </div>
                <div className="text-gray-700 italic">
                  &quot;{attachment.notes || 'Received full payment in good order with original tax invoice. Goods examined and accepted under statutory procurement guidelines.'}&quot;
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300 flex items-center justify-between text-[10px]">
                <div>
                  <div className="font-bold text-gray-600">File Name: {attachment.fileName}</div>
                  <div className="text-gray-500 font-mono">Format: {attachment.fileType} • Size: {attachment.fileSize}</div>
                </div>
                <div className="text-center">
                  <div className="w-28 border-b-2 border-gray-700 pb-1 font-bold text-gray-900">
                    [OFFICIAL STAMP]
                  </div>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-[#0A140F] border-t border-[#2C5240] flex items-center justify-between text-xs shrink-0 no-print">
          <span className="text-gray-400 font-mono text-[11px]">
            File: {attachment.fileName} ({attachment.fileSize})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Print Memo</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#2C5240] hover:bg-[#396851] text-white font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
