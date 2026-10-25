'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BuyerSalesOrder,
  CompanyEntity,
  CurrencyRate
} from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import { INITIAL_ORDERS } from '@/data/initialOrders';
import { INITIAL_COMPANIES } from '@/data/initialData';
import {
  FileText,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  X,
  Building2,
  Calendar,
  Globe2,
  ShieldCheck,
  CreditCard,
  Anchor,
  Ship,
  Truck,
  Sparkles,
  QrCode,
  Check,
  Sliders,
  ChevronDown,
  Info,
  Package,
  Award,
  Stamp,
  Layers,
  Scale,
  FileCheck,
  Share2
} from 'lucide-react';
import { ArielMC, renderBrandText } from '@/lib/brand';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

export type DocumentType = 
  | 'COMMERCIAL_INVOICE' 
  | 'PROFORMA_INVOICE' 
  | 'PACKING_LIST'
  | 'CERTIFICATE_OF_ORIGIN'
  | 'FORM_EXP'
  | 'MUSHAK_6_3' 
  | 'PURCHASE_ORDER';

export type WatermarkType = 'NONE' | 'ORIGINAL' | 'OFFICIAL EXPORT' | 'BANK NEGOTIABLE' | 'DUPLICATE';

interface OfficialDocumentCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentType?: DocumentType;
  initialOrderId?: string;
  activeEntity?: CompanyEntity;
  activeCurrency?: CurrencyRate;
  theme?: ThemeProfile;
}

export const OfficialDocumentCenter: React.FC<OfficialDocumentCenterProps> = ({
  isOpen,
  onClose,
  initialDocumentType = 'COMMERCIAL_INVOICE',
  initialOrderId,
  activeEntity = INITIAL_COMPANIES[0],
  theme = 'crm-green',
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialDocumentType);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || INITIAL_ORDERS[0].id
  );
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Document customizer toggles
  const [showLetterhead, setShowLetterhead] = useState(true);
  const [showCorporateSeal, setShowCorporateSeal] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [watermark, setWatermark] = useState<WatermarkType>('ORIGINAL');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Active Order Data
  const activeOrder = INITIAL_ORDERS.find((o) => o.id === selectedOrderId) || INITIAL_ORDERS[0];

  // Editable fields state (synced to active order)
  const [customDocNumber, setCustomDocNumber] = useState('');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customVessel, setCustomVessel] = useState('Maersk Aras (Voy 2614E)');
  const [customBlNumber, setCustomBlNumber] = useState('MSKU-98214-7');
  const [customContainerNo, setCustomContainerNo] = useState('MSKU-821941-2 / SEAL: BD-CTG-98412');
  const [customFormExp, setCustomFormExp] = useState('BB-EXP-CTG-2026-94812');
  const [customVehicleNo, setCustomVehicleNo] = useState('Covered Van (Dhaka Metro-U-14-9821)');
  
  // Packing List specific editable overrides
  const autoCartons = Math.max(1, Math.ceil(activeOrder.totalQuantity / 10));
  const autoNetWeight = Math.round(activeOrder.totalQuantity * 1.1);
  const autoGrossWeight = Math.round(activeOrder.totalQuantity * 1.25);
  const autoCbm = (autoCartons * 0.084).toFixed(2);

  const [customCtnCount, setCustomCtnCount] = useState<number>(autoCartons);
  const [customNetWeight, setCustomNetWeight] = useState<number>(autoNetWeight);
  const [customGrossWeight, setCustomGrossWeight] = useState<number>(autoGrossWeight);
  const [customCbm, setCustomCbm] = useState<string>(autoCbm);
  const [customCartonDims, setCustomCartonDims] = useState<string>('60 x 40 x 35 cm');

  // Certificate of Origin specific editable overrides
  const [customCooNumber, setCustomCooNumber] = useState<string>('DCCI/EXP/COO-2026-08419');
  const [customIssuingChamber, setCustomIssuingChamber] = useState<string>('Dhaka Chamber of Commerce & Industry (DCCI)');

  // Form EXP specific overrides
  const [customAdBranchCode, setCustomAdBranchCode] = useState<string>('0142 (Eastern Bank PLC, Principal Branch)');
  const [customShippingBillNo, setCustomShippingBillNo] = useState<string>('SB-CTG-2026-38192');

  if (!isOpen) return null;

  // Document Number generator
  const getDocNumber = () => {
    if (customDocNumber.trim()) return customDocNumber.trim();
    const orderSuffix = activeOrder.soNumber.replace(/[^0-9]/g, '').slice(-3) || '081';
    switch (docType) {
      case 'COMMERCIAL_INVOICE':
        return `CI-AMC-2026-${orderSuffix}`;
      case 'PROFORMA_INVOICE':
        return `PI-AMC-2026-${orderSuffix}`;
      case 'PACKING_LIST':
        return `PL-AMC-2026-${orderSuffix}`;
      case 'CERTIFICATE_OF_ORIGIN':
        return customCooNumber;
      case 'FORM_EXP':
        return customFormExp;
      case 'MUSHAK_6_3':
        return `MUSHAK-6.3-AMC-2026-${orderSuffix}`;
      case 'PURCHASE_ORDER':
        return activeOrder.linkedPo?.poNumber || 'PO-AMC-2026-FAC-001';
    }
  };

  // One-click Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy Printable HTML
  const handleCopyHtml = () => {
    const canvas = document.getElementById('official-printable-canvas');
    if (canvas) {
      navigator.clipboard.writeText(canvas.outerHTML);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    }
  };

  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';
  const isHeritage = isHydrangea;

  // Shell
  const docShell = isRoyal
    ? 'bg-[#0B132B] border-slate-700/80 text-slate-100'
    : isHeritage
    ? 'bg-[#1C160C] border-[#8A6D3B]/60 text-[#F5EEDC]'
    : 'bg-[#12231B] border-[#2C5240] text-white';

  // Header Bar
  const docHeaderBg = isRoyal
    ? 'bg-[#0F172A] border-b border-slate-800'
    : isHeritage
    ? 'bg-[#261E10] border-b-2 border-[#C8A96A]'
    : 'bg-[#162B22] border-b-2 border-[#C8A96A]';

  const docIconBox = isRoyal
    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
    : 'bg-[#C8A96A]/15 border-[#C8A96A]/30 text-[#C8A96A]';

  const docBadge = isRoyal
    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    : 'bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/30';

  const printBtn = isRoyal
    ? 'bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#0B132B]'
    : 'bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1F3A2E]';

  const copyHtmlBtn = isRoyal
    ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
    : isHeritage
    ? 'bg-[#2A2012] hover:bg-[#382B18] border-[#8A6D3B]/50 text-[#F5EEDC]'
    : 'bg-[#1F3A2E] hover:bg-[#2C5240] border-[#2C5240] text-white';

  // Sidebar (Control panel)
  const sidebarBg = isRoyal
    ? 'bg-[#070D18] border-r border-slate-800/90 text-slate-300'
    : isHeritage
    ? 'bg-[#181208] border-r border-[#8A6D3B]/30 text-[#E5D5B3]'
    : 'bg-[#172D24] border-r border-[#2C5240] text-[#CFE0D5]';

  // Template active / inactive
  const templateActive = isRoyal
    ? 'bg-slate-800/90 border-2 border-[#C8A96A] text-white ring-1 ring-[#C8A96A]/30'
    : isHeritage
    ? 'bg-[#2E2211] border-2 border-[#C8A96A] text-white ring-1 ring-[#C8A96A]/30'
    : 'bg-[#1F3A2E] border-2 border-[#C8A96A] text-white ring-1 ring-[#C8A96A]/30';

  const templateInactive = isRoyal
    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
    : isHeritage
    ? 'bg-[#22180C] border-[#8A6D3B]/30 hover:border-[#8A6D3B]/60 hover:bg-[#2E2211]/50 text-[#CFE0D5]'
    : 'bg-[#12231B]/70 border-[#2C5240] hover:border-[#3A6B54] hover:bg-[#1F3A2E]/50 text-[#CFE0D5]';

  const templateSubtitleActive = isRoyal
    ? 'text-[#E5D5B3]'
    : 'text-[#C8A96A]';

  const templateSubtitleInactive = isRoyal
    ? 'text-slate-400'
    : isHeritage
    ? 'text-[#B8A382]'
    : 'text-[#8FA89B]';

  // Order select dropdown
  const orderSelectBg = isRoyal
    ? 'bg-slate-900/90 border-slate-700 text-slate-100 focus:border-blue-500'
    : isHeritage
    ? 'bg-[#22180C] border-[#8A6D3B]/50 text-[#F5EEDC] focus:border-[#C8A96A]'
    : 'bg-[#12231B] border-[#2C5240] text-white focus:border-[#C8A96A]';

  const optionBg = isRoyal ? 'bg-[#0F172A]' : isHeritage ? 'bg-[#261E10]' : 'bg-[#1F3A2E]';

  // Box containers (Meta overrides & Toggles)
  const metaBoxBg = isRoyal
    ? 'bg-slate-900/50 border-slate-800/80'
    : isHeritage
    ? 'bg-[#22180C]/80 border-[#8A6D3B]/30'
    : 'bg-[#12231B]/80 border-[#2C5240]';

  const inputFieldBg = isRoyal
    ? 'bg-slate-950/80 border-slate-700/80 text-slate-100 placeholder-slate-600 focus:border-blue-500'
    : isHeritage
    ? 'bg-[#150E06] border-[#8A6D3B]/40 text-[#F5EEDC] placeholder-amber-700/60 focus:border-[#C8A96A]'
    : 'bg-[#0D1913] border-[#2C5240] text-white placeholder-[#5A7A6A] focus:border-[#C8A96A]';

  const checkboxClass = isRoyal
    ? 'rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4'
    : isHeritage
    ? 'rounded border-[#8A6D3B]/50 bg-[#150E06] text-[#C8A96A] focus:ring-[#C8A96A] w-4 h-4'
    : 'rounded border-[#2C5240] bg-[#0D1913] text-[#1E6B3A] focus:ring-[#C8A96A] w-4 h-4';

  const canvasStudioFloor = isRoyal
    ? 'bg-[#050811]'
    : isHeritage
    ? 'bg-[#120D06]'
    : 'bg-[#0A140F]';

  const activeOfficialDoc: OfficialDocument = {
    id: `doc-${docType}-${activeOrder.id}`,
    title: `${docType.replace(/_/g, ' ')} — Order #${activeOrder.soNumber} (${activeOrder.buyerCompany})`,
    docCode: customDocNumber || `${docType.substring(0, 3)}-${activeOrder.soNumber}`,
    documentNumber: activeOrder.soNumber,
    issuingAuthority: 'Ariel Marketing & Communications Limited',
    station: 'ARIEL_BD',
    section: 'COMMERCIAL_ORDERS',
    category: 'Export Commercial Trade Document',
    issueDate: customDate || new Date().toISOString().split('T')[0],
    expiryDate: '2027-12-31',
    renewalLeadDays: 30,
    status: 'ACTIVE',
    fileFormat: 'PDF',
    fileSize: '180 KB (Vector A4 Commercial)',
    downloadUrl: '#',
    verified: true,
    uploadedBy: 'Tuheen (Commercial & Trade Operations)',
    uploadedAt: new Date().toISOString(),
    notes: `Official export commercial documentation (${docType}) generated under Bangladesh Bank foreign exchange guidelines and ASYCUDA customs clearance for Order #${activeOrder.soNumber}. Shared for bank negotiation, customs clearance, and buyer verification/acknowledgement.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`${docShell} rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden`}>
        
        {/* Header Bar */}
        <div className={`px-6 py-4 ${docHeaderBg} flex items-center justify-between shrink-0 no-print`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${docIconBox} shadow-xs`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md ${docBadge} font-bold uppercase tracking-wider`}>
                  OFFICIAL EXPORT ENGINE
                </span>
                <span className="text-xs text-[#CFE0D5] font-medium">A4 Vector Print &amp; PDF Calibration</span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white mt-0.5 flex items-center gap-1.5">
                <span>Official</span>
                <ArielMC />
                <span>Export Commercial &amp; Statutory Document Engine</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${printBtn} text-xs font-bold font-heading shadow-md transition-all active:scale-95`}
              title="Print directly or Save as PDF with exact vector colors"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print Official PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-heading shadow-md transition-all active:scale-95 border border-emerald-400/30 cursor-pointer"
              title="Share Document for Verification & Acknowledgement via Email/WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Share (Verify / Ack)</span>
            </button>

            <button
              onClick={handleCopyHtml}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl ${copyHtmlBtn} text-xs font-semibold transition-all`}
              title="Copy formatted HTML for email or archiving"
            >
              {copiedHtml ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C8A96A]" />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body: Left Controls & Right A4 Canvas */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT: Controls & Customizer Sidebar */}
          <div className={`w-full lg:w-96 ${sidebarBg} p-5 overflow-y-auto shrink-0 space-y-4 text-xs no-print`}>
            
            {/* Document Type Selector */}
            <div>
              <label className="block text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
                <span>1. Select Document Template:</span>
                <span className="text-[10px] text-gray-400 font-normal">7 Templates Available</span>
              </label>

              {/* International Export Core Docs */}
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                International Export Suite
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button
                  onClick={() => setDocType('COMMERCIAL_INVOICE')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'COMMERCIAL_INVOICE'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Commercial Inv</span>
                    {docType === 'COMMERCIAL_INVOICE' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'COMMERCIAL_INVOICE' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    Export Shipping (CI)
                  </div>
                </button>

                <button
                  onClick={() => setDocType('PROFORMA_INVOICE')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'PROFORMA_INVOICE'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Proforma Inv</span>
                    {docType === 'PROFORMA_INVOICE' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'PROFORMA_INVOICE' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    Quotation &amp; PI
                  </div>
                </button>

                <button
                  onClick={() => setDocType('PACKING_LIST')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'PACKING_LIST'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Packing List</span>
                    {docType === 'PACKING_LIST' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'PACKING_LIST' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    Weight &amp; CBM Spec
                  </div>
                </button>

                <button
                  onClick={() => setDocType('CERTIFICATE_OF_ORIGIN')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'CERTIFICATE_OF_ORIGIN'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Certificate Origin</span>
                    {docType === 'CERTIFICATE_OF_ORIGIN' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'CERTIFICATE_OF_ORIGIN' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    DCCI / EPB CoO
                  </div>
                </button>

                <button
                  onClick={() => setDocType('FORM_EXP')}
                  className={`col-span-2 p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'FORM_EXP'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Bangladesh Bank Form EXP</span>
                    </span>
                    {docType === 'FORM_EXP' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'FORM_EXP' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    Foreign Exchange Regulation Act (FERA 1947) Export Declaration
                  </div>
                </button>
              </div>

              {/* Domestic Statutory & Factory Contracts */}
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Statutory VAT &amp; Procurement
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setDocType('MUSHAK_6_3')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'MUSHAK_6_3'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Mushak 6.3</span>
                    {docType === 'MUSHAK_6_3' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'MUSHAK_6_3' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    NBR কর চালানপত্র
                  </div>
                </button>

                <button
                  onClick={() => setDocType('PURCHASE_ORDER')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'PURCHASE_ORDER'
                      ? templateActive
                      : templateInactive
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Factory PO</span>
                    {docType === 'PURCHASE_ORDER' && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]" />}
                  </div>
                  <div className={`text-[9.5px] mt-0.5 ${docType === 'PURCHASE_ORDER' ? templateSubtitleActive : templateSubtitleInactive}`}>
                    Vendor PO &amp; BOM
                  </div>
                </button>
              </div>
            </div>

            {/* Order Data Source */}
            <div>
              <label className="block text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px] mb-1.5">
                2. Load Client Order Data:
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl ${orderSelectBg} text-xs focus:outline-none transition-all`}
              >
                {INITIAL_ORDERS.map((ord) => (
                  <option key={ord.id} value={ord.id} className={`${optionBg} text-white`}>
                    {ord.buyerCompany} ({ord.soNumber} - {ord.currency} {ord.totalAmountBuyerCurrency.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Editable Fields */}
            <div className={`p-3.5 rounded-xl ${metaBoxBg} space-y-2.5`}>
              <label className="block text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px]">
                3. Dynamic Document Overrides:
              </label>

              <div>
                <span className="text-[10px] text-[#CFE0D5] font-medium">Document / Invoice Ref No:</span>
                <input
                  type="text"
                  placeholder={getDocNumber()}
                  value={customDocNumber}
                  onChange={(e) => setCustomDocNumber(e.target.value)}
                  className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                />
              </div>

              <div>
                <span className="text-[10px] text-[#CFE0D5] font-medium">Document Issue Date:</span>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs focus:outline-none transition-all`}
                />
              </div>

              {/* Vessel & BL fields for Shipping Docs */}
              {(docType === 'COMMERCIAL_INVOICE' || docType === 'PACKING_LIST' || docType === 'FORM_EXP' || docType === 'CERTIFICATE_OF_ORIGIN') && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Vessel &amp; Voyage:</span>
                      <input
                        type="text"
                        value={customVessel}
                        onChange={(e) => setCustomVessel(e.target.value)}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs focus:outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Bill of Lading (B/L):</span>
                      <input
                        type="text"
                        value={customBlNumber}
                        onChange={(e) => setCustomBlNumber(e.target.value)}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">Container &amp; Seal Number:</span>
                    <input
                      type="text"
                      value={customContainerNo}
                      onChange={(e) => setCustomContainerNo(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                    />
                  </div>
                </>
              )}

              {/* Packing List specific overrides */}
              {docType === 'PACKING_LIST' && (
                <div className="space-y-2 pt-1 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Total Master Cartons:</span>
                      <input
                        type="number"
                        value={customCtnCount}
                        onChange={(e) => setCustomCtnCount(Number(e.target.value))}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Total CBM (m³):</span>
                      <input
                        type="text"
                        value={customCbm}
                        onChange={(e) => setCustomCbm(e.target.value)}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Net Weight (KG):</span>
                      <input
                        type="number"
                        value={customNetWeight}
                        onChange={(e) => setCustomNetWeight(Number(e.target.value))}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#CFE0D5] font-medium">Gross Weight (KG):</span>
                      <input
                        type="number"
                        value={customGrossWeight}
                        onChange={(e) => setCustomGrossWeight(Number(e.target.value))}
                        className={`w-full mt-0.5 px-2 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate of Origin Overrides */}
              {docType === 'CERTIFICATE_OF_ORIGIN' && (
                <div className="space-y-2 pt-1 border-t border-gray-700/50">
                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">Chamber Serial Number:</span>
                    <input
                      type="text"
                      value={customCooNumber}
                      onChange={(e) => setCustomCooNumber(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">Issuing Chamber / Authority:</span>
                    <input
                      type="text"
                      value={customIssuingChamber}
                      onChange={(e) => setCustomIssuingChamber(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs focus:outline-none transition-all`}
                    />
                  </div>
                </div>
              )}

              {/* Form EXP Overrides */}
              {docType === 'FORM_EXP' && (
                <div className="space-y-2 pt-1 border-t border-gray-700/50">
                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">BB Form EXP Number:</span>
                    <input
                      type="text"
                      value={customFormExp}
                      onChange={(e) => setCustomFormExp(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">AD Bank &amp; Branch Code:</span>
                    <input
                      type="text"
                      value={customAdBranchCode}
                      onChange={(e) => setCustomAdBranchCode(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs focus:outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#CFE0D5] font-medium">Customs Shipping Bill No:</span>
                    <input
                      type="text"
                      value={customShippingBillNo}
                      onChange={(e) => setCustomShippingBillNo(e.target.value)}
                      className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs font-mono focus:outline-none transition-all`}
                    />
                  </div>
                </div>
              )}

              {docType === 'MUSHAK_6_3' && (
                <div>
                  <span className="text-[10px] text-[#CFE0D5] font-medium">যানবাহন নম্বর (Vehicle Reg):</span>
                  <input
                    type="text"
                    value={customVehicleNo}
                    onChange={(e) => setCustomVehicleNo(e.target.value)}
                    className={`w-full mt-0.5 px-2.5 py-1.5 rounded-lg ${inputFieldBg} text-xs focus:outline-none transition-all`}
                  />
                </div>
              )}
            </div>

            {/* Document Watermark Selection */}
            <div>
              <label className="block text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px] mb-1.5">
                4. Document Watermark Stamp:
              </label>
              <select
                value={watermark}
                onChange={(e) => setWatermark(e.target.value as WatermarkType)}
                className={`w-full px-3 py-2 rounded-xl ${orderSelectBg} text-xs focus:outline-none transition-all`}
              >
                <option value="NONE" className={`${optionBg} text-white`}>No Watermark</option>
                <option value="ORIGINAL" className={`${optionBg} text-white`}>ORIGINAL (Bank / Customs)</option>
                <option value="OFFICIAL EXPORT" className={`${optionBg} text-white`}>OFFICIAL EXPORT</option>
                <option value="BANK NEGOTIABLE" className={`${optionBg} text-white`}>BANK NEGOTIABLE COPY</option>
                <option value="DUPLICATE" className={`${optionBg} text-white`}>DUPLICATE / ARCHIVE</option>
              </select>
            </div>

            {/* Letterhead & Security Toggles */}
            <div className={`p-3.5 rounded-xl ${metaBoxBg} space-y-2`}>
              <label className="block text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px]">
                5. Statutory &amp; Security Toggles:
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CFE0D5] hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={showLetterhead}
                  onChange={(e) => setShowLetterhead(e.target.checked)}
                  className={checkboxClass}
                />
                <span className="flex items-center gap-1">
                  <span>Include</span>
                  <ArielMC />
                  <span>Official Letterhead</span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CFE0D5] hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={showCorporateSeal}
                  onChange={(e) => setShowCorporateSeal(e.target.checked)}
                  className={checkboxClass}
                />
                <span>Include MD Digital Seal &amp; Signature</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CFE0D5] hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className={checkboxClass}
                />
                <span>Include Anti-Tamper QR Verification</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CFE0D5] hover:text-white cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={showBankDetails}
                  onChange={(e) => setShowBankDetails(e.target.checked)}
                  className={checkboxClass}
                />
                <span>Include Eastern Bank PLC Wire &amp; SWIFT</span>
              </label>
            </div>

            <div className="p-3 rounded-xl bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[11px] text-[#C8A96A] flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#C8A96A]" />
              <span>
                Standard vector print engine with exact <strong>A4 Portrait</strong> dimensions (210mm × 297mm). Approved by Bangladesh EPB, DCCI &amp; ICC Incoterms.
              </span>
            </div>
          </div>

          {/* RIGHT: Live High-Resolution A4 Canvas */}
          <div className={`flex-1 ${canvasStudioFloor} p-4 sm:p-8 overflow-y-auto flex justify-center items-start`}>
            
            {/* The Actual Printable Canvas Container */}
            <div
              id="official-printable-canvas"
              className="bg-white text-[#1A1A1A] w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col justify-between font-sans text-xs overflow-hidden"
              style={{
                padding: '12mm 14mm',
                boxSizing: 'border-box',
              }}
            >
              {/* Optional Diagonal Watermark */}
              {watermark !== 'NONE' && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-0"
                  style={{ opacity: 0.045 }}
                >
                  <span
                    className="text-[90px] font-black uppercase text-gray-900 border-8 border-gray-900 px-12 py-4 tracking-widest"
                    style={{ transform: 'rotate(-32deg)' }}
                  >
                    {watermark}
                  </span>
                </div>
              )}

              {/* TOP: Official ArielMC Letterhead */}
              <div className="relative z-10">
                {showLetterhead && (
                  <div className="relative pb-3 mb-3 border-b-2 border-[#1F3A2E]">
                    {/* Top Decorative Swooshes */}
                    <div className="absolute -top-[12mm] -right-[14mm] w-[80mm] h-[18mm] overflow-hidden pointer-events-none">
                      <svg viewBox="0 0 200 45" className="w-full h-full">
                        <path d="M 0,0 C 60,10 120,30 200,45 L 200,0 Z" fill="#EAA023" />
                        <path d="M 20,0 C 75,10 135,28 200,40 L 200,0 Z" fill="#1F3A2E" />
                      </svg>
                    </div>

                    <div className="flex items-start justify-between relative z-10">
                      {/* Logo & Corporate Identity */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 shrink-0">
                          <Image
                            src="/images/ArielMC_Emblem_Square.png"
                            alt="ArielMC Logo Emblem"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                        <div>
                          <div className="text-xl font-bold font-heading text-[#1F3A2E] tracking-tight">
                            <ArielMC />
                          </div>
                          <div className="text-[10px] font-bold text-[#8A6D3B] tracking-wider uppercase">
                            Ariel Marketing &amp; Communications Limited
                          </div>
                          <div className="text-[8.5px] text-gray-500 mt-0.5">
                            Global Sourcing Headquarters &bull; Bangladesh Holding Company
                          </div>
                        </div>
                      </div>

                      {/* Head Office & Legal Compliance Strip */}
                      <div className="text-right text-[8.5px] text-gray-600 leading-tight">
                        <div className="font-semibold text-[#1F3A2E]">
                          House 30 (1st Floor), Road 07, Block C, Niketon, Gulshan-1, Dhaka-1212
                        </div>
                        <div>Tel: +880 2410 811 91 | Mobile &amp; WhatsApp: +8801819273458</div>
                        <div>Email: info@arielmc.com | Web: www.arielmc.com</div>
                        <div className="font-mono text-[#8A6D3B] mt-1 font-bold">
                          BIN: 003892714-0102 | TIN: 4819283719 | EPB: EPB-EXP-2026-8819
                        </div>
                      </div>
                    </div>

                    {/* Global Station Footprint Sub-header */}
                    <div className="mt-2 pt-1 border-t border-gray-200 flex items-center justify-between text-[8px] text-gray-500 font-medium">
                      <span>OPERATING STATIONS: 🇧🇩 Dhaka (HQ) &bull; 🇬🇧 London &bull; 🇺🇸 New York &bull; 🇪🇺 Hamburg &bull; 🇦🇺 Sydney</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">ISO 9001:2015 &bull; SEDEX &bull; LWG GOLD &bull; GOTS CERTIFIED</span>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 1: COMMERCIAL INVOICE
                    ======================================================== */}
                {docType === 'COMMERCIAL_INVOICE' && (
                  <div className="space-y-3">
                    {/* Document Title Banner */}
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide">
                        COMMERCIAL INVOICE
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        ORIGINAL / INTERNATIONAL EXPORT SHIPPING
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-3 text-[9.5px] p-2.5 rounded border border-gray-300 bg-gray-50/70">
                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Invoice No:</strong>{' '}
                          <span className="font-mono font-bold text-[#1F3A2E]">{getDocNumber()}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Invoice Date:</strong>{' '}
                          <span className="font-mono">{customDate}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Buyer SO / Contract:</strong>{' '}
                          <span className="font-mono font-bold">{activeOrder.soNumber}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Letter of Credit (L/C):</strong>{' '}
                          <span className="font-mono">{activeOrder.masterLcNumber || 'CONFIRMED L/C AT SIGHT'}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Authorized Dealer Bank:</strong>{' '}
                          <span>Eastern Bank PLC, Dhaka Corporate Branch (AD Code: 0142)</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Consignee / Buyer:</strong>{' '}
                          <strong className="text-[#1F3A2E]">{activeOrder.buyerCompany}</strong>
                        </div>
                        <div>
                          <strong className="text-gray-600">Destination Market:</strong>{' '}
                          <span>{activeOrder.targetMarket} ({activeOrder.incoterm})</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Port of Loading:</strong>{' '}
                          <span>Chattogram Seaport (CTG), Bangladesh</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Vessel &amp; Voyage:</strong>{' '}
                          <span className="font-mono">{customVessel}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">B/L &amp; Form EXP:</strong>{' '}
                          <span className="font-mono">{customBlNumber} | {customFormExp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Itemized Commercial Table */}
                    <table className="w-full border-collapse border border-gray-300 text-[9.5px]">
                      <thead>
                        <tr className="bg-[#F4F6F4] text-[#1F3A2E] font-bold border-b border-gray-300 text-left">
                          <th className="p-1.5 border-r border-gray-300 text-center w-8">Item</th>
                          <th className="p-1.5 border-r border-gray-300">Description of Merchandise</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">HS Code</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Unit</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Quantity</th>
                          <th className="p-1.5 border-r border-gray-300 text-right">Unit Price ({activeOrder.currency})</th>
                          <th className="p-1.5 text-right">Total Amount ({activeOrder.currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => (
                          <tr key={it.id} className="border-b border-gray-200">
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono">{idx + 1}</td>
                            <td className="p-1.5 border-r border-gray-300">
                              <div className="font-bold text-[#1A1A1A]">{it.styleName}</div>
                              <div className="text-[8.5px] text-gray-500">
                                SKU: {it.sku} | Sector: {it.sector} | 100% Export Grade Bangladesh
                              </div>
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                              {it.sector === 'LEATHER' ? '4202.21.00' : it.sector === 'JUTE' ? '6305.10.00' : '6304.92.00'}
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center">PCS</td>
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono font-bold">
                              {it.quantity.toLocaleString()}
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-right font-mono">
                              {it.unitPrice.toFixed(2)}
                            </td>
                            <td className="p-1.5 text-right font-mono font-bold">
                              {it.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold border-t border-gray-300 text-[10px]">
                          <td colSpan={4} className="p-1.5 border-r border-gray-300 text-right">
                            TOTAL COMMERCIAL VALUE:
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                            {activeOrder.totalQuantity.toLocaleString()} PCS
                          </td>
                          <td className="p-1.5 border-r border-gray-300"></td>
                          <td className="p-1.5 text-right font-mono text-[#1F3A2E] text-xs">
                            {activeOrder.currency} {activeOrder.totalAmountBuyerCurrency.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Duty & Trade Declaration */}
                    <div className="p-2 border border-emerald-200 bg-emerald-50/40 rounded text-[8.5px] text-emerald-900 leading-normal">
                      <strong>PREFERENTIAL TRADE CERTIFICATION:</strong> We hereby declare that the merchandise described above originates in Bangladesh and complies with origin criteria under Developing Countries Trading Scheme (DCTS) / Everything But Arms (EBA). Customs Duty: 0%. Bangladesh Bank Form EXP verified.
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 2: PROFORMA INVOICE
                    ======================================================== */}
                {docType === 'PROFORMA_INVOICE' && (
                  <div className="space-y-3">
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide">
                        PROFORMA INVOICE
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        COMMERCIAL QUOTATION &amp; SALES AGREEMENT
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[9.5px] p-2.5 rounded border border-gray-300 bg-gray-50/70">
                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Proforma No:</strong>{' '}
                          <span className="font-mono font-bold text-[#1F3A2E]">{getDocNumber()}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Date of Issue:</strong>{' '}
                          <span className="font-mono">{customDate}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Quotation Validity:</strong>{' '}
                          <span>30 Days from date of issuance</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Payment Terms:</strong>{' '}
                          <span>30% Advance T/T Deposit, 70% against BL Copy / Sight LC</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Issued To (Buyer):</strong>{' '}
                          <strong className="text-[#1F3A2E]">{activeOrder.buyerCompany}</strong>
                        </div>
                        <div>
                          <strong className="text-gray-600">Attention:</strong>{' '}
                          <span>{activeOrder.buyerContact}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Production Lead Time:</strong>{' '}
                          <span>45-60 Days from Advance Payment / L/C receipt</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Shipment Terms:</strong>{' '}
                          <span>{activeOrder.incoterm}</span>
                        </div>
                      </div>
                    </div>

                    <table className="w-full border-collapse border border-gray-300 text-[9.5px]">
                      <thead>
                        <tr className="bg-[#F4F6F4] text-[#1F3A2E] font-bold border-b border-gray-300 text-left">
                          <th className="p-1.5 border-r border-gray-300 text-center w-8">#</th>
                          <th className="p-1.5 border-r border-gray-300">Style Description &amp; Technical Specs</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Packaging</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Quantity</th>
                          <th className="p-1.5 border-r border-gray-300 text-right">FOB Price ({activeOrder.currency})</th>
                          <th className="p-1.5 text-right">Total Price ({activeOrder.currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => (
                          <tr key={it.id} className="border-b border-gray-200">
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono">{idx + 1}</td>
                            <td className="p-1.5 border-r border-gray-300">
                              <div className="font-bold text-[#1A1A1A]">{it.styleName}</div>
                              <div className="text-[8.5px] text-gray-500">
                                SKU: {it.sku} | Sector: {it.sector} | AQL 1.5 Inspection Guaranteed
                              </div>
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center text-[8.5px]">
                              Individual Dustbag + Master Carton
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono font-bold">
                              {it.quantity.toLocaleString()}
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-right font-mono">
                              {it.unitPrice.toFixed(2)}
                            </td>
                            <td className="p-1.5 text-right font-mono font-bold">
                              {it.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold border-t border-gray-300 text-[10px]">
                          <td colSpan={3} className="p-1.5 border-r border-gray-300 text-right">
                            TOTAL ORDER VALUE:
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                            {activeOrder.totalQuantity.toLocaleString()} PCS
                          </td>
                          <td className="p-1.5 border-r border-gray-300"></td>
                          <td className="p-1.5 text-right font-mono text-[#1F3A2E] text-xs">
                            {activeOrder.currency} {activeOrder.totalAmountBuyerCurrency.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 3: EXPORT PACKING LIST & WEIGHT CERT
                    ======================================================== */}
                {docType === 'PACKING_LIST' && (
                  <div className="space-y-3">
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C8A96A]" />
                        <span>EXPORT PACKING LIST &amp; WEIGHT CERTIFICATE</span>
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        CONTAINER STUFFING SPECIFICATION
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[9.5px] p-2.5 rounded border border-gray-300 bg-gray-50/70">
                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Packing List No:</strong>{' '}
                          <span className="font-mono font-bold text-[#1F3A2E]">{getDocNumber()}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Issue Date:</strong>{' '}
                          <span className="font-mono">{customDate}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Commercial Invoice Ref:</strong>{' '}
                          <span className="font-mono font-bold">CI-AMC-2026-{activeOrder.soNumber.replace(/[^0-9]/g, '').slice(-3) || '081'}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Port of Loading:</strong>{' '}
                          <span>Chattogram Seaport (Off-Dock ICD, CTG)</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Port of Discharge / Market:</strong>{' '}
                          <span>Port of London Gateway / Southampton ({activeOrder.targetMarket})</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Consignee:</strong>{' '}
                          <strong className="text-[#1F3A2E]">{activeOrder.buyerCompany}</strong>
                        </div>
                        <div>
                          <strong className="text-gray-600">Vessel &amp; Voyage:</strong>{' '}
                          <span className="font-mono">{customVessel}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Bill of Lading (B/L):</strong>{' '}
                          <span className="font-mono">{customBlNumber}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Container &amp; Seal No:</strong>{' '}
                          <span className="font-mono">{customContainerNo}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Bangladesh Bank Form EXP:</strong>{' '}
                          <span className="font-mono">{customFormExp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Marks Box */}
                    <div className="p-2 border border-dashed border-gray-400 bg-amber-50/40 rounded text-[9px] flex items-center justify-between">
                      <div>
                        <strong className="text-[#8A6D3B] uppercase">Shipping Marks &amp; Numbers:</strong>
                        <div className="font-mono text-gray-800 font-bold mt-0.5">
                          ArielMC / {activeOrder.buyerCompany.toUpperCase()} / {activeOrder.targetMarket} / CTN 1-{customCtnCount}
                        </div>
                        <div className="text-[8px] text-gray-500">
                          Order Ref: {activeOrder.soNumber} | MADE IN BANGLADESH
                        </div>
                      </div>
                      <div className="text-right text-[8.5px] font-mono text-gray-600">
                        <div>Dimensions: {customCartonDims}</div>
                        <div>Total Cartons: <strong>{customCtnCount} CTNS</strong></div>
                      </div>
                    </div>

                    {/* Packing Breakdown Table */}
                    <table className="w-full border-collapse border border-gray-300 text-[9px]">
                      <thead>
                        <tr className="bg-[#F4F6F4] text-[#1F3A2E] font-bold border-b border-gray-300 text-center">
                          <th className="p-1 border-r border-gray-300 w-20">Carton Range</th>
                          <th className="p-1 border-r border-gray-300 text-left">Description of Goods &amp; SKU</th>
                          <th className="p-1 border-r border-gray-300">Pcs/Ctn</th>
                          <th className="p-1 border-r border-gray-300">Total Pcs</th>
                          <th className="p-1 border-r border-gray-300">Net Wt (Kg)</th>
                          <th className="p-1 border-r border-gray-300">Gross Wt (Kg)</th>
                          <th className="p-1">Measurements &amp; CBM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => {
                          const ctns = Math.max(1, Math.ceil(it.quantity / 10));
                          const itemNet = Math.round(it.quantity * 1.1);
                          const itemGross = Math.round(it.quantity * 1.25);
                          const itemCbm = (ctns * 0.084).toFixed(2);
                          return (
                            <tr key={it.id} className="border-b border-gray-200 text-center">
                              <td className="p-1.5 border-r border-gray-300 font-mono font-bold text-[#1F3A2E]">
                                CTN {String(1 + idx * ctns).padStart(3, '0')} - {String((idx + 1) * ctns).padStart(3, '0')}
                              </td>
                              <td className="p-1.5 border-r border-gray-300 text-left">
                                <div className="font-bold text-[#1A1A1A]">{it.styleName}</div>
                                <div className="text-[8px] text-gray-500">
                                  SKU: {it.sku} &bull; Polybag + Anti-Mold Silica Gel &bull; 5-Ply Export Carton
                                </div>
                              </td>
                              <td className="p-1.5 border-r border-gray-300 font-mono">10 PCS</td>
                              <td className="p-1.5 border-r border-gray-300 font-mono font-bold">
                                {it.quantity.toLocaleString()}
                              </td>
                              <td className="p-1.5 border-r border-gray-300 font-mono">
                                {itemNet.toLocaleString()}.00
                              </td>
                              <td className="p-1.5 border-r border-gray-300 font-mono">
                                {itemGross.toLocaleString()}.00
                              </td>
                              <td className="p-1.5 font-mono text-[8px]">
                                {customCartonDims} ({itemCbm} m³)
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold border-t border-gray-300 text-[9.5px]">
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono text-[#1F3A2E]">
                            TOTAL:
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-left">
                            {customCtnCount} MASTER CORRUGATED CARTONS
                          </td>
                          <td className="p-1.5 border-r border-gray-300"></td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                            {activeOrder.totalQuantity.toLocaleString()} PCS
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                            {customNetWeight.toLocaleString()}.00 KG
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono text-[#1F3A2E]">
                            {customGrossWeight.toLocaleString()}.00 KG
                          </td>
                          <td className="p-1.5 text-center font-mono text-emerald-800">
                            {customCbm} CBM
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Packaging & Anti-Mold Certification */}
                    <div className="p-2 border border-gray-300 bg-gray-50 rounded text-[8px] text-gray-700 space-y-0.5">
                      <div>
                        <strong>PACKAGING SPECIFICATION:</strong> Packed in export quality 5-ply double-wall corrugated craft cartons, strapped with heavy polypropylene bands. Each piece enclosed in non-woven breathable dustbag with non-toxic silica gel moisture absorber.
                      </div>
                      <div>
                        <strong>WEIGHT CERTIFICATE:</strong> We certify that the total gross weight ({customGrossWeight.toLocaleString()} KG) and tare weights stated above have been verified on electronic calibrated platform scales prior to container loading at factory premises.
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 4: CERTIFICATE OF ORIGIN (DCCI / EPB)
                    ======================================================== */}
                {docType === 'CERTIFICATE_OF_ORIGIN' && (
                  <div className="space-y-3">
                    {/* Chamber Authority Header */}
                    <div className="text-center pb-2 border-b-2 border-[#1F3A2E] leading-tight">
                      <div className="text-[11px] font-bold text-gray-800 tracking-wider uppercase flex items-center justify-center gap-1.5">
                        <Award className="w-4 h-4 text-[#C8A96A]" />
                        <span>{customIssuingChamber}</span>
                      </div>
                      <div className="text-[9px] text-gray-600 font-medium">
                        AFFILIATED WITH FEDERATION OF BANGLADESH CHAMBERS OF COMMERCE AND INDUSTRY (FBCCI)
                      </div>
                      <div className="text-sm font-bold text-[#1F3A2E] mt-1 font-heading">
                        CERTIFICATE OF ORIGIN (NON-PREFERENTIAL &amp; DCTS)
                      </div>
                      <div className="text-[8px] font-mono text-[#8A6D3B] font-bold">
                        CERTIFICATE SERIAL NO: {customCooNumber}
                      </div>
                    </div>

                    {/* Geneva 8-Box Standard Grid */}
                    <div className="border border-gray-400 divide-y divide-gray-400 text-[9px]">
                      {/* Row 1: Exporter & Consignee */}
                      <div className="grid grid-cols-2 divide-x divide-gray-400">
                        <div className="p-2 space-y-0.5">
                          <strong className="text-gray-500 uppercase text-[8px]">1. Goods Consigned From (Exporter):</strong>
                          <div className="font-bold text-[#1F3A2E]">Ariel Marketing &amp; Communications Ltd.</div>
                          <div>House 30 (1st Floor), Road 07, Block C, Niketon, Gulshan-1, Dhaka-1212, Bangladesh</div>
                          <div className="text-[8px] text-gray-500">BIN: 003892714-0102 | EPB Reg: EPB-EXP-2026-8819</div>
                        </div>

                        <div className="p-2 space-y-0.5">
                          <strong className="text-gray-500 uppercase text-[8px]">2. Goods Consigned To (Consignee):</strong>
                          <div className="font-bold text-[#1F3A2E]">{activeOrder.buyerCompany}</div>
                          <div>Attention: {activeOrder.buyerContact}</div>
                          <div>Destination Country: <strong>{activeOrder.targetMarket}</strong></div>
                        </div>
                      </div>

                      {/* Row 2: Transport & Invoice References */}
                      <div className="grid grid-cols-2 divide-x divide-gray-400">
                        <div className="p-2 space-y-0.5">
                          <strong className="text-gray-500 uppercase text-[8px]">3. Means of Transport &amp; Route:</strong>
                          <div>Mode: Ocean Freight (FCL Vessel)</div>
                          <div>Port of Loading: <strong>Chattogram Seaport (CTG), Bangladesh</strong></div>
                          <div>Vessel &amp; Voyage: <span className="font-mono">{customVessel}</span></div>
                          <div>Bill of Lading: <span className="font-mono font-bold">{customBlNumber}</span></div>
                        </div>

                        <div className="p-2 space-y-0.5">
                          <strong className="text-gray-500 uppercase text-[8px]">4. For Official Use / Commercial Ref:</strong>
                          <div>Commercial Invoice No: <span className="font-mono font-bold">{getDocNumber()}</span></div>
                          <div>Invoice Date: <span className="font-mono">{customDate}</span></div>
                          <div>L/C Ref: <span className="font-mono">{activeOrder.masterLcNumber || 'SIGHT L/C'}</span></div>
                          <div>Form EXP No: <span className="font-mono">{customFormExp}</span></div>
                        </div>
                      </div>

                      {/* Row 3: Goods Description & HS Codes */}
                      <div className="p-2">
                        <strong className="text-gray-500 uppercase text-[8px]">
                          5. Item Number, Marks &amp; Numbers, Number &amp; Kind of Packages, Description of Goods:
                        </strong>
                        <div className="mt-1 space-y-1">
                          <div className="font-bold text-gray-800">
                            SHIPPING MARKS: ArielMC / {activeOrder.buyerCompany.toUpperCase()} / {customCtnCount} CARTONS / MADE IN BANGLADESH
                          </div>
                          <div className="text-[8.5px] text-gray-700 leading-relaxed">
                            {activeOrder.items.map((it) => `${it.styleName} (${it.quantity.toLocaleString()} PCS - HS ${it.sector === 'LEATHER' ? '4202.21' : '6305.10'})`).join(', ')}. Total {activeOrder.totalQuantity.toLocaleString()} PCS packed in {customCtnCount} master corrugated cartons. 100% manufactured in Bangladesh using certified indigenous raw materials.
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Origin Criteria, Gross Weight & Invoiced Value */}
                      <div className="grid grid-cols-3 divide-x divide-gray-400 text-center">
                        <div className="p-2">
                          <strong className="text-gray-500 uppercase text-[8px] block">6. Origin Criterion:</strong>
                          <span className="font-mono font-bold text-emerald-800 text-xs mt-0.5 block">&quot;P&quot;</span>
                          <span className="text-[7.5px] text-gray-500">Wholly Produced in Bangladesh</span>
                        </div>
                        <div className="p-2">
                          <strong className="text-gray-500 uppercase text-[8px] block">7. Gross Weight:</strong>
                          <span className="font-mono font-bold text-[#1F3A2E] text-xs mt-0.5 block">{customGrossWeight.toLocaleString()} KG</span>
                          <span className="text-[7.5px] text-gray-500">Net Wt: {customNetWeight.toLocaleString()} KG</span>
                        </div>
                        <div className="p-2">
                          <strong className="text-gray-500 uppercase text-[8px] block">8. Invoice Value:</strong>
                          <span className="font-mono font-bold text-[#8A6D3B] text-xs mt-0.5 block">
                            {activeOrder.currency} {activeOrder.totalAmountBuyerCurrency.toLocaleString()}
                          </span>
                          <span className="text-[7.5px] text-gray-500">{activeOrder.incoterm}</span>
                        </div>
                      </div>

                      {/* Row 5: Declarations & Chamber Certification */}
                      <div className="grid grid-cols-2 divide-x divide-gray-400">
                        <div className="p-2.5 space-y-1">
                          <strong className="text-gray-600 uppercase text-[8px] font-bold">9. Declaration by the Exporter:</strong>
                          <p className="text-[7.5px] text-gray-600 leading-tight">
                            The undersigned hereby declares that the above details and statements are correct; that all the goods were produced in Bangladesh and that they comply with the origin requirements specified for those goods.
                          </p>
                          <div className="pt-2 text-[8px] font-bold text-[#1F3A2E]">
                            Syed Akramul Hassan &bull; Managing Director
                          </div>
                        </div>

                        <div className="p-2.5 space-y-1 relative bg-gray-50/50">
                          <strong className="text-gray-600 uppercase text-[8px] font-bold">10. Certificate by Chamber / Authority:</strong>
                          <p className="text-[7.5px] text-gray-600 leading-tight">
                            It is hereby certified, on the basis of documentation and verification carried out, that the declaration by the exporter is correct and origin verified.
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <div className="text-[7.5px] text-gray-500 font-mono">
                              DHAKA, BANGLADESH<br />{customDate}
                            </div>
                            <div className="border border-red-700/50 rounded-full px-2 py-1 text-[7px] text-red-800 font-bold uppercase tracking-tighter text-center transform -rotate-6">
                              DCCI SEAL &amp; CERTIFIED
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 5: BANGLADESH BANK FORM EXP
                    ======================================================== */}
                {docType === 'FORM_EXP' && (
                  <div className="space-y-3">
                    {/* Central Bank Header */}
                    <div className="text-center pb-2 border-b-2 border-[#1F3A2E] leading-tight">
                      <div className="text-[11px] font-bold text-gray-800 tracking-wider uppercase">
                        BANGLADESH BANK
                      </div>
                      <div className="text-[8.5px] text-gray-600 font-medium">
                        FOREIGN EXCHANGE REGULATION ACT, 1947 (ACT NO. VII OF 1947)
                      </div>
                      <div className="text-sm font-bold text-[#1F3A2E] mt-0.5 font-heading">
                        FORM EXP (ORIGINAL - FOR BANGLADESH BANK)
                      </div>
                      <div className="text-[8px] text-gray-500">
                        [Declaration to be furnished by Exporter under Section 12 before Dispatch of Goods]
                      </div>
                      <div className="mt-1 font-mono text-[9px] font-bold text-[#8A6D3B]">
                        EXP NUMBER: {customFormExp} | AD CODE: {customAdBranchCode}
                      </div>
                    </div>

                    {/* EXP Particulars Table */}
                    <table className="w-full border-collapse border border-gray-400 text-[9px]">
                      <tbody>
                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold w-1/3">
                            1. Name &amp; Full Address of Exporter:
                          </td>
                          <td className="p-1.5">
                            <strong className="text-[#1F3A2E]">Ariel Marketing &amp; Communications Ltd. (<ArielMC />)</strong><br />
                            House 30 (1st Floor), Road 07, Block C, Niketon, Gulshan-1, Dhaka-1212<br />
                            <span className="font-mono text-gray-600 text-[8px]">
                              ERC No: ERC-0091823 | BIN: 003892714-0102 | TIN: 4819283719
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold">
                            2. Authorized Dealer (AD) Bank &amp; Branch:
                          </td>
                          <td className="p-1.5 font-medium">
                            Eastern Bank PLC, Principal Corporate Branch, 10 Dilkusha C/A, Dhaka-1000<br />
                            <span className="font-mono text-[8px] text-[#1F3A2E] font-bold">
                              AD Code: 0142 | SWIFT: EBLNBDDH | AD Serial No: EBL-DHK-EXP-2026-0814
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold">
                            3. Name &amp; Address of Consignee:
                          </td>
                          <td className="p-1.5 font-medium">
                            <strong className="text-[#1A1A1A]">{activeOrder.buyerCompany}</strong><br />
                            Destination Country: <strong>{activeOrder.targetMarket}</strong> (Contract Ref: {activeOrder.soNumber})
                          </td>
                        </tr>

                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold">
                            4. Commodity, Quantity &amp; HS Classification:
                          </td>
                          <td className="p-1.5">
                            {activeOrder.items.map((it) => it.styleName).join(', ')}<br />
                            <strong>Total Quantity:</strong> {activeOrder.totalQuantity.toLocaleString()} PCS &bull; 
                            <strong> HS Code:</strong> {activeOrder.items[0]?.sector === 'LEATHER' ? '4202.21.00' : '6305.10.00'} (100% Export Grade)
                          </td>
                        </tr>

                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold">
                            5. Invoice Value &amp; Terms of Sale:
                          </td>
                          <td className="p-1.5 font-mono">
                            <strong>{activeOrder.currency} {activeOrder.totalAmountBuyerCurrency.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> ({activeOrder.incoterm})<br />
                            <span className="text-[8px] text-gray-500 font-sans">
                              Approximate Freight / Insurance included where applicable. Payment Terms: {activeOrder.paymentTerms}
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-400">
                          <td className="p-1.5 border-r border-gray-400 bg-gray-50 font-bold">
                            6. Port of Shipment &amp; Vessel Details:
                          </td>
                          <td className="p-1.5">
                            Port: <strong>Chattogram Seaport (CTG), Bangladesh</strong><br />
                            Vessel: <span className="font-mono">{customVessel}</span> &bull; B/L: <span className="font-mono">{customBlNumber}</span> &bull; Shipping Bill: <span className="font-mono">{customShippingBillNo}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Exporter Undertaking Clause under FERA 1947 */}
                    <div className="p-2 border border-amber-300 bg-amber-50/50 rounded text-[8px] text-gray-800 leading-relaxed">
                      <strong>UNDERTAKING BY EXPORTER UNDER SECTION 12:</strong> I/We hereby declare that I/we am/are the seller/consignor of the goods in respect of which this declaration is made and that the particulars given above are true and that the value declared is the full export value. I/We undertake to surrender to the Authorized Dealer the foreign exchange proceeds within <strong>120 days</strong> from the date of shipment as mandated by Bangladesh Bank Foreign Exchange Guidelines.
                    </div>

                    {/* Dual Certification Boxes */}
                    <div className="grid grid-cols-2 gap-3 pt-1 text-[8.5px]">
                      <div className="p-2 border border-gray-300 rounded bg-gray-50/50 text-center">
                        <div className="h-9 border-b border-dashed border-gray-400 flex items-center justify-center pb-0.5">
                          <Image
                            src="/images/syed_akramul_hassan_signature.png"
                            alt="Syed Akramul Hassan Signature"
                            width={110}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="mt-1 font-bold text-[#1F3A2E]">Syed Akramul Hassan</div>
                        <div className="text-[7.5px] text-gray-500">Managing Director &bull; ArielMC Ltd</div>
                      </div>

                      <div className="p-2 border border-gray-300 rounded bg-gray-50/50 text-center">
                        <div className="h-7 border-b border-dashed border-gray-400 flex items-end justify-center pb-0.5 font-bold text-gray-700">
                          Manager &bull; Foreign Trade Division
                        </div>
                        <div className="mt-1 font-bold text-[#1F3A2E]">Eastern Bank PLC (AD Code: 0142)</div>
                        <div className="text-[7.5px] text-gray-500">Certified Bonafide Transaction Verified</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 6: BANGLADESH NBR MUSHAK 6.3
                    ======================================================== */}
                {docType === 'MUSHAK_6_3' && (
                  <div className="space-y-3">
                    <div className="text-center pb-2 border-b border-gray-300 leading-tight">
                      <div className="text-[10px] font-bold text-gray-700">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
                      <div className="text-[10px] font-bold text-gray-700">জাতীয় রাজস্ব বোর্ড (National Board of Revenue)</div>
                      <div className="text-sm font-bold text-[#1F3A2E] mt-0.5">
                        কর চালানপত্র (TAX INVOICE)
                      </div>
                      <div className="text-[8px] text-gray-500">
                        [মূল্য সংযোজন কর ও সম্পূরক শুল্ক বিধিমালা, ২০১৬ এর বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) ও দফা (চ) দ্রষ্টব্য]
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px] p-2 rounded border border-gray-300 bg-gray-50/70">
                      <div className="space-y-0.5">
                        <div>
                          <strong>নিবন্ধিত ব্যক্তির নাম:</strong>{' '}
                          <span className="font-bold text-[#1F3A2E]">Ariel Marketing &amp; Communications Ltd.</span>
                        </div>
                        <div>
                          <strong>নিবন্ধিত ব্যক্তির বিআইএন:</strong>{' '}
                          <span className="font-mono font-bold">003892714-0102</span>
                        </div>
                        <div>
                          <strong>চালানপত্র ইস্যুর ঠিকানা:</strong>{' '}
                          <span>হাউজ-৩০, রোড-০৭, ব্লক-সি, নিকেতন, গুলশান-১, ঢাকা-১২১২</span>
                        </div>
                        <div>
                          <strong>গন্তব্যস্থল:</strong>{' '}
                          <span>চট্টগ্ৰাম সমুদ্র বন্দর অফ-ডক আইসিডি / রপ্তানি করিডোর</span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div>
                          <strong>চালান নম্বর (Challan No):</strong>{' '}
                          <span className="font-mono font-bold text-[#1F3A2E]">{getDocNumber()}</span>
                        </div>
                        <div>
                          <strong>ইস্যুর তারিখ ও সময়:</strong>{' '}
                          <span className="font-mono">{customDate} | 11:30 AM</span>
                        </div>
                        <div>
                          <strong>ক্রেতার নাম / বিআইএন:</strong>{' '}
                          <span className="font-bold">{activeOrder.buyerCompany}</span> / BIN: 001928472-0101
                        </div>
                        <div>
                          <strong>যানবাহনের প্রকৃতি ও নম্বর:</strong>{' '}
                          <span className="font-mono font-bold text-[#8A6D3B]">{customVehicleNo}</span>
                        </div>
                      </div>
                    </div>

                    <table className="w-full border-collapse border border-gray-400 text-[8.5px]">
                      <thead>
                        <tr className="bg-[#E8F0EA] text-[#1F3A2E] font-bold border-b border-gray-400 text-center">
                          <th className="p-1 border-r border-gray-400">ক্রমিক</th>
                          <th className="p-1 border-r border-gray-400 text-left">পণ্য বা সেবার বিবরণ</th>
                          <th className="p-1 border-r border-gray-400">একক</th>
                          <th className="p-1 border-r border-gray-400">পরিমাণ</th>
                          <th className="p-1 border-r border-gray-400">একক মূল্য (BDT)</th>
                          <th className="p-1 border-r border-gray-400">মোট মূল্য (BDT)</th>
                          <th className="p-1 border-r border-gray-400">সম্পূরক শুল্ক</th>
                          <th className="p-1 border-r border-gray-400">মূসক হার</th>
                          <th className="p-1 border-r border-gray-400">মূসক পরিমাণ</th>
                          <th className="p-1">সর্বমোট মূল্য (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => {
                          const bdtUnit = it.factoryUnitCost || it.unitPrice * 120;
                          const bdtTotal = bdtUnit * it.quantity;
                          return (
                            <tr key={it.id} className="border-b border-gray-300 text-center">
                              <td className="p-1 border-r border-gray-400 font-mono">{idx + 1}</td>
                              <td className="p-1 border-r border-gray-400 text-left font-medium">
                                {it.styleName} (১০০% রপ্তানিমুখী)
                              </td>
                              <td className="p-1 border-r border-gray-400">PCS</td>
                              <td className="p-1 border-r border-gray-400 font-mono font-bold">
                                {it.quantity.toLocaleString()}
                              </td>
                              <td className="p-1 border-r border-gray-400 font-mono">{bdtUnit.toLocaleString()}</td>
                              <td className="p-1 border-r border-gray-400 font-mono font-bold">{bdtTotal.toLocaleString()}</td>
                              <td className="p-1 border-r border-gray-400 font-mono">০.০০</td>
                              <td className="p-1 border-r border-gray-400 font-bold text-emerald-800">০% (রপ্তানি)</td>
                              <td className="p-1 border-r border-gray-400 font-mono">০.০০</td>
                              <td className="p-1 font-mono font-bold text-[#1F3A2E]">{bdtTotal.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold border-t border-gray-400 text-[9px]">
                          <td colSpan={3} className="p-1 border-r border-gray-400 text-right">সর্বমোট:</td>
                          <td className="p-1 border-r border-gray-400 text-center font-mono">
                            {activeOrder.totalQuantity.toLocaleString()}
                          </td>
                          <td className="p-1 border-r border-gray-400"></td>
                          <td className="p-1 border-r border-gray-400 font-mono">
                            BDT {(activeOrder.linkedPo?.totalCostBdt || 6900000).toLocaleString()}
                          </td>
                          <td className="p-1 border-r border-gray-400">০.০০</td>
                          <td className="p-1 border-r border-gray-400">০%</td>
                          <td className="p-1 border-r border-gray-400">০.০০</td>
                          <td className="p-1 font-mono text-[#1F3A2E]">
                            BDT {(activeOrder.linkedPo?.totalCostBdt || 6900000).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="text-[8px] text-gray-500 italic">
                      * শতভাগ রপ্তানিমুখী শিল্পের জন্য মূসক ও সম্পূরক শুল্ক অব্যাহতিপ্রাপ্ত (VAT Exemption for Direct Export under Section 14).
                    </div>
                  </div>
                )}

                {/* ========================================================
                    DOCUMENT TEMPLATE 7: FACTORY PURCHASE ORDER
                    ======================================================== */}
                {docType === 'PURCHASE_ORDER' && (
                  <div className="space-y-3">
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide">
                        OFFICIAL FACTORY PURCHASE ORDER
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        VENDOR PROCUREMENT CONTRACT
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[9.5px] p-2.5 rounded border border-gray-300 bg-gray-50/70">
                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">PO Number:</strong>{' '}
                          <span className="font-mono font-bold text-[#1F3A2E]">{getDocNumber()}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Order Issue Date:</strong>{' '}
                          <span className="font-mono">{customDate}</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Sourcing Hub:</strong>{' '}
                          <span>ArielMC BD Merchandising Hub (Niketon)</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Back-to-Back L/C:</strong>{' '}
                          <span className="font-mono">{activeOrder.linkedPo?.backToBackLcNumber || 'EBL-DHK-B2B-339102'}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <strong className="text-gray-600">Contracted Factory:</strong>{' '}
                          <strong className="text-[#1F3A2E]">
                            {activeOrder.linkedPo?.factoryName || 'Apex Footwear Ltd - Leathercraft Division'}
                          </strong>
                        </div>
                        <div>
                          <strong className="text-gray-600">Target Ex-Factory Date:</strong>{' '}
                          <span className="font-mono font-bold text-rose-700">
                            {activeOrder.linkedPo?.targetExFactoryDate || '2026-11-08'}
                          </span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Inspection AQL Mandate:</strong>{' '}
                          <span className="font-bold text-emerald-800">Level II / AQL 1.5 Major / 2.5 Minor</span>
                        </div>
                        <div>
                          <strong className="text-gray-600">Export Buyer Reference:</strong>{' '}
                          <span className="font-mono">{activeOrder.buyerCompany} ({activeOrder.soNumber})</span>
                        </div>
                      </div>
                    </div>

                    <table className="w-full border-collapse border border-gray-300 text-[9.5px]">
                      <thead>
                        <tr className="bg-[#F4F6F4] text-[#1F3A2E] font-bold border-b border-gray-300 text-left">
                          <th className="p-1.5 border-r border-gray-300 text-center w-8">#</th>
                          <th className="p-1.5 border-r border-gray-300">Merchandise Style &amp; Bill of Materials (BOM)</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Batch Lot #</th>
                          <th className="p-1.5 border-r border-gray-300 text-center">Order Qty</th>
                          <th className="p-1.5 border-r border-gray-300 text-right">Factory Cost (BDT)</th>
                          <th className="p-1.5 text-right">Total Payable (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => (
                          <tr key={it.id} className="border-b border-gray-200">
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono">{idx + 1}</td>
                            <td className="p-1.5 border-r border-gray-300">
                              <div className="font-bold text-[#1A1A1A]">{it.styleName}</div>
                              <div className="text-[8.5px] text-gray-500">
                                LWG Gold Cowhide &bull; Heavy-duty bonded nylon thread &bull; Antique brass YKK hardware
                              </div>
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono text-[8.5px]">
                              LOT-2026-BD-{idx + 1}
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-center font-mono font-bold">
                              {it.quantity.toLocaleString()} PCS
                            </td>
                            <td className="p-1.5 border-r border-gray-300 text-right font-mono">
                              {(it.factoryUnitCost || 4600).toLocaleString()}
                            </td>
                            <td className="p-1.5 text-right font-mono font-bold">
                              {(it.factoryTotalCost || 6900000).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold border-t border-gray-300 text-[10px]">
                          <td colSpan={3} className="p-1.5 border-r border-gray-300 text-right">
                            TOTAL FACTORY COMMITMENT:
                          </td>
                          <td className="p-1.5 border-r border-gray-300 text-center font-mono">
                            {activeOrder.totalQuantity.toLocaleString()} PCS
                          </td>
                          <td className="p-1.5 border-r border-gray-300"></td>
                          <td className="p-1.5 text-right font-mono text-[#1F3A2E] text-xs">
                            BDT {(activeOrder.linkedPo?.totalCostBdt || 6900000).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="p-2 border border-gray-300 bg-gray-50 rounded text-[8px] text-gray-700 space-y-0.5">
                      <div>
                        <strong>1. Quality Guarantee:</strong> Factory must pass Midline &amp; Final FRI inspections under AQL 1.5/2.5 before dispatch authorization.
                      </div>
                      <div>
                        <strong>2. Anti-Mold Protocol:</strong> 4 Calcium chloride poles required per container; carton moisture content must register &lt;12%.
                      </div>
                      <div>
                        <strong>3. Ex-Factory Delay Penalty:</strong> 1.5% deduction per calendar week of unexcused delay beyond agreed handover date.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM: Banking, Corporate Seal & Signatures */}
              <div className="mt-4 pt-2.5 border-t border-gray-300 text-[8.5px] relative z-10">
                
                {/* Bank Wire Routing Coordinates */}
                {showBankDetails && docType !== 'MUSHAK_6_3' && (
                  <div className="p-2 mb-2.5 bg-[#F8F6F2] border border-[#DDE3DD] rounded text-[8.5px] leading-tight">
                    <div className="font-bold text-[#1F3A2E] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>OFFICIAL BANK WIRE &amp; SETTLEMENT COORDINATES:</span>
                      <span className="font-mono text-[#8A6D3B] text-[8px]">AD BRANCH CODE: 0142</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                      <div>
                        <strong>Beneficiary:</strong> Ariel Marketing &amp; Communications Limited<br />
                        <strong>Bank Name:</strong> Eastern Bank PLC (Principal Corporate Branch, Dhaka)<br />
                        <strong>Branch Address:</strong> 10 Dilkusha C/A, Jiban Bima Bhaban, Dhaka-1000
                      </div>
                      <div>
                        <strong>SWIFT Code:</strong> <span className="font-mono font-bold text-[#1F3A2E]">EBLNBDDH</span><br />
                        <strong>Routing Number:</strong> 090271420<br />
                        <strong>Account No:</strong> <span className="font-mono font-bold">1041060289412</span> ({activeOrder.currency} Export Clearing)
                      </div>
                    </div>
                  </div>
                )}

                {/* Signatures & Corporate Seal */}
                <div className="flex items-end justify-between pt-1">
                  
                  {/* Left: Client / Vendor Acceptance */}
                  <div className="text-center w-48">
                    <div className="h-8 border-b border-dashed border-gray-400 flex items-end justify-center pb-0.5 text-gray-400 italic text-[8px]">
                      [ Counter-Signature &amp; Date ]
                    </div>
                    <div className="mt-1 font-bold text-[#1A1A1A]">
                      {docType === 'PURCHASE_ORDER' ? 'Factory Managing Representative' : 'Authorized Buyer / Consignee'}
                    </div>
                    <div className="text-[7.5px] text-gray-500">
                      {docType === 'PURCHASE_ORDER' ? activeOrder.linkedPo?.factoryName : activeOrder.buyerCompany}
                    </div>
                  </div>

                  {/* Center: Anti-Tamper QR Verification */}
                  {showQrCode && (
                    <div className="text-center flex flex-col items-center">
                      <div className="w-11 h-11 border border-gray-300 rounded p-0.5 bg-white shadow-xs flex items-center justify-center">
                        <QrCode className="w-9 h-9 text-[#1F3A2E]" />
                      </div>
                      <span className="text-[7px] text-gray-500 font-mono mt-0.5">
                        VERIFY: AMC-{activeOrder.soNumber}
                      </span>
                    </div>
                  )}

                  {/* Right: ArielMC Authorized Seal & Signature */}
                  <div className="text-center w-52 relative">
                    {showCorporateSeal && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-[#1E6B3A]/40 flex flex-col items-center justify-center text-center p-1 pointer-events-none transform -rotate-12 bg-emerald-50/10">
                        <div className="text-[6.5px] font-bold text-emerald-800 uppercase tracking-tighter">
                          <ArielMC /> &bull; DHAKA
                        </div>
                        <div className="text-[5.5px] font-mono text-emerald-700">COMMERCIAL DIV</div>
                        <div className="text-[6.5px] font-bold text-emerald-800">APPROVED</div>
                      </div>
                    )}

                    <div className="h-9 border-b border-dashed border-gray-400 flex items-center justify-center pb-0.5">
                      <Image
                        src="/images/syed_akramul_hassan_signature.png"
                        alt="Syed Akramul Hassan Signature"
                        width={120}
                        height={34}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-1 font-bold text-[#1F3A2E]">
                      Syed Akramul Hassan
                    </div>
                    <div className="text-[7.5px] text-gray-600 flex items-center justify-center gap-1">
                      <span>Managing Director &bull;</span>
                      <ArielMC />
                      <span>Limited</span>
                    </div>
                  </div>
                </div>

                {/* Footer disclaimer line */}
                <div className="mt-3 pt-1.5 border-t border-gray-200 text-center text-[7.5px] text-gray-500 flex flex-col items-center justify-center gap-0.5">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    <span>This official statutory export document is generated by</span>
                    <strong className="font-bold text-[#003177] inline-flex items-baseline">
                      ArielMC<sup className="font-bold text-[#003177] ml-[1px]">™</sup>
                    </strong>
                    <span className="font-bold text-gray-800">Enterprise Resource Planning System</span>
                    <span>&bull; Verified under EPB Bangladesh and ICC Incoterms 2020.</span>
                  </div>
                  <div className="text-[7px] text-gray-400">
                    © Ariel Marketing &amp; Communications Limited | All Right Reserve
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Verification & Acknowledgement Share Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={activeOfficialDoc}
      />
    </div>
  );
};
