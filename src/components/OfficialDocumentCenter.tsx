'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BuyerSalesOrder,
  CompanyEntity,
  CurrencyRate
} from '@/types/erp';
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
  Info
} from 'lucide-react';

export type DocumentType = 
  | 'COMMERCIAL_INVOICE' 
  | 'PROFORMA_INVOICE' 
  | 'MUSHAK_6_3' 
  | 'PURCHASE_ORDER';

interface OfficialDocumentCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentType?: DocumentType;
  initialOrderId?: string;
  activeEntity?: CompanyEntity;
  activeCurrency?: CurrencyRate;
}

export const OfficialDocumentCenter: React.FC<OfficialDocumentCenterProps> = ({
  isOpen,
  onClose,
  initialDocumentType = 'COMMERCIAL_INVOICE',
  initialOrderId,
  activeEntity = INITIAL_COMPANIES[0],
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

  // Active Order Data
  const activeOrder = INITIAL_ORDERS.find((o) => o.id === selectedOrderId) || INITIAL_ORDERS[0];

  // Editable fields state (synced to active order)
  const [customDocNumber, setCustomDocNumber] = useState('');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customVessel, setCustomVessel] = useState('Maersk Aras (Voy 2614E)');
  const [customBlNumber, setCustomBlNumber] = useState('MSKU-98214-7');
  const [customFormExp, setCustomFormExp] = useState('BB-EXP-CTG-2026-94812');
  const [customVehicleNo, setCustomVehicleNo] = useState('Covered Van (Dhaka Metro-U-14-9821)');

  if (!isOpen) return null;

  // Document Number generator
  const getDocNumber = () => {
    if (customDocNumber.trim()) return customDocNumber.trim();
    switch (docType) {
      case 'COMMERCIAL_INVOICE':
        return `CI-AMC-2026-${activeOrder.soNumber.replace(/[^0-9]/g, '').slice(-3) || '081'}`;
      case 'PROFORMA_INVOICE':
        return `PI-AMC-2026-${activeOrder.soNumber.replace(/[^0-9]/g, '').slice(-3) || '402'}`;
      case 'MUSHAK_6_3':
        return `MUSHAK-6.3-AMC-2026-${activeOrder.soNumber.replace(/[^0-9]/g, '').slice(-3) || '0914'}`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/20 w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#1F3A2E] border-b-2 border-[#C8A96A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-[#C8A96A]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
                  OFFICIAL DOCUMENT ENGINE
                </span>
                <span className="text-xs text-[#CFE0D5] font-medium">A4 Vector Calibration</span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white mt-0.5">
                Official ArielMC Export &amp; Statutory PDF Generator
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-heading shadow-md transition-all active:scale-95"
              title="Print directly or Save as PDF with exact vector colors"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print Official PDF</span>
            </button>

            <button
              onClick={handleCopyHtml}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all"
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
          <div className="w-full lg:w-96 bg-[#172D24] p-5 border-r border-white/10 overflow-y-auto shrink-0 space-y-5 text-xs">
            
            {/* Document Type Selector */}
            <div>
              <label className="block text-[#C8A96A] font-heading font-bold uppercase tracking-wider text-[11px] mb-2">
                1. Select Document Template:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDocType('COMMERCIAL_INVOICE')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'COMMERCIAL_INVOICE'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">Commercial Invoice</div>
                  <div className="text-[10px] opacity-80">Export Shipping (CI)</div>
                </button>

                <button
                  onClick={() => setDocType('PROFORMA_INVOICE')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'PROFORMA_INVOICE'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">Proforma Invoice</div>
                  <div className="text-[10px] opacity-80">Sales Agreement (PI)</div>
                </button>

                <button
                  onClick={() => setDocType('MUSHAK_6_3')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'MUSHAK_6_3'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">Mushak 6.3 (কর চালান)</div>
                  <div className="text-[10px] opacity-80">Bangladesh NBR VAT</div>
                </button>

                <button
                  onClick={() => setDocType('PURCHASE_ORDER')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    docType === 'PURCHASE_ORDER'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">Factory Purchase Order</div>
                  <div className="text-[10px] opacity-80">Vendor PO &amp; BOM</div>
                </button>
              </div>
            </div>

            {/* Order Data Source */}
            <div>
              <label className="block text-[#C8A96A] font-heading font-bold uppercase tracking-wider text-[11px] mb-2">
                2. Load Client Order Data:
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#C8A96A]"
              >
                {INITIAL_ORDERS.map((ord) => (
                  <option key={ord.id} value={ord.id} className="bg-[#1F3A2E] text-white">
                    {ord.buyerCompany} ({ord.soNumber} - {ord.currency} {ord.totalAmountBuyerCurrency.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Editable Fields */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-[#C8A96A] font-heading font-bold uppercase tracking-wider text-[11px]">
                3. Document Meta Overrides:
              </label>

              <div>
                <span className="text-[11px] text-[#CFE0D5]">Document / Invoice Ref No:</span>
                <input
                  type="text"
                  placeholder={getDocNumber()}
                  value={customDocNumber}
                  onChange={(e) => setCustomDocNumber(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <span className="text-[11px] text-[#CFE0D5]">Document Issue Date:</span>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {docType === 'COMMERCIAL_INVOICE' && (
                <>
                  <div>
                    <span className="text-[11px] text-[#CFE0D5]">Vessel &amp; Voyage:</span>
                    <input
                      type="text"
                      value={customVessel}
                      onChange={(e) => setCustomVessel(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#CFE0D5]">Bill of Lading (B/L) No:</span>
                    <input
                      type="text"
                      value={customBlNumber}
                      onChange={(e) => setCustomBlNumber(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#CFE0D5]">Bangladesh Bank Form EXP No:</span>
                    <input
                      type="text"
                      value={customFormExp}
                      onChange={(e) => setCustomFormExp(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </>
              )}

              {docType === 'MUSHAK_6_3' && (
                <div>
                  <span className="text-[11px] text-[#CFE0D5]">যানবাহন নম্বর (Vehicle Reg):</span>
                  <input
                    type="text"
                    value={customVehicleNo}
                    onChange={(e) => setCustomVehicleNo(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              )}
            </div>

            {/* Letterhead & Security Toggles */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <label className="block text-[#C8A96A] font-heading font-bold uppercase tracking-wider text-[11px]">
                4. Letterhead &amp; Security Toggles:
              </label>

              <label className="flex items-center gap-2 text-xs text-[#CFE0D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLetterhead}
                  onChange={(e) => setShowLetterhead(e.target.checked)}
                  className="rounded border-white/20 text-[#1F3A2E] focus:ring-[#C8A96A]"
                />
                <span>Include Official ArielMC Letterhead Header</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#CFE0D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCorporateSeal}
                  onChange={(e) => setShowCorporateSeal(e.target.checked)}
                  className="rounded border-white/20 text-[#1F3A2E] focus:ring-[#C8A96A]"
                />
                <span>Include Digital Corporate Seal &amp; Signature</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#CFE0D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className="rounded border-white/20 text-[#1F3A2E] focus:ring-[#C8A96A]"
                />
                <span>Include Anti-Tamper QR Verification Badge</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#CFE0D5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBankDetails}
                  onChange={(e) => setShowBankDetails(e.target.checked)}
                  className="rounded border-white/20 text-[#1F3A2E] focus:ring-[#C8A96A]"
                />
                <span>Include Eastern Bank PLC Wire Coordinates</span>
              </label>
            </div>

            <div className="p-3 rounded-lg bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[11px] text-[#C8A96A] flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Clicking <strong>Download / Print Official PDF</strong> opens the browser print preview, pre-scaled to A4 portrait with crisp vector graphics and exact margins.
              </span>
            </div>
          </div>

          {/* RIGHT: Live High-Resolution A4 Canvas */}
          <div className="flex-1 bg-[#262626] p-4 sm:p-8 overflow-y-auto flex justify-center items-start">
            
            {/* The Actual Printable Canvas Container */}
            <div
              id="official-printable-canvas"
              className="bg-white text-[#1A1A1A] w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col justify-between font-sans text-xs"
              style={{
                padding: '12mm 14mm',
                boxSizing: 'border-box',
              }}
            >
              {/* TOP: Official ArielMC Letterhead */}
              <div>
                {showLetterhead && (
                  <div className="relative pb-4 mb-4 border-b-2 border-[#1F3A2E]">
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
                            src="/images/ArielMC_Logo.png"
                            alt="ArielMC Logo"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                        <div>
                          <div className="text-xl font-bold font-heading text-[#1F3A2E] tracking-tight">
                            ArielMC
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
                    <div className="mt-2.5 pt-1.5 border-t border-gray-200 flex items-center justify-between text-[8px] text-gray-500 font-medium">
                      <span>OPERATING STATIONS: 🇧🇩 Dhaka (HQ) &bull; 🇬🇧 London &bull; 🇺🇸 New York &bull; 🇪🇺 Hamburg &bull; 🇦🇺 Sydney</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">ISO 9001:2015 &bull; SEDEX &bull; LWG &bull; GOTS CERTIFIED</span>
                    </div>
                  </div>
                )}

                {/* DOCUMENT TEMPLATE 1: COMMERCIAL INVOICE */}
                {docType === 'COMMERCIAL_INVOICE' && (
                  <div className="space-y-3.5">
                    {/* Document Title Banner */}
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide">
                        COMMERCIAL INVOICE
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        ORIGINAL / INTERNATIONAL EXPORT
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

                {/* DOCUMENT TEMPLATE 2: PROFORMA INVOICE */}
                {docType === 'PROFORMA_INVOICE' && (
                  <div className="space-y-3.5">
                    {/* Document Title Banner */}
                    <div className="bg-[#1F3A2E] text-white p-2 rounded flex items-center justify-between">
                      <div className="font-heading font-bold text-sm tracking-wide">
                        PROFORMA INVOICE
                      </div>
                      <div className="text-[9px] font-mono text-[#C8A96A] font-bold">
                        COMMERCIAL QUOTATION &amp; SPECIFICATION
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

                    {/* Table */}
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

                {/* DOCUMENT TEMPLATE 3: BANGLADESH NBR MUSHAK 6.3 */}
                {docType === 'MUSHAK_6_3' && (
                  <div className="space-y-3">
                    {/* Official NBR Header */}
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

                    {/* Supplier & Challan Metadata Grid */}
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

                    {/* NBR 10-Column Challan Table */}
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

                {/* DOCUMENT TEMPLATE 4: FACTORY PURCHASE ORDER */}
                {docType === 'PURCHASE_ORDER' && (
                  <div className="space-y-3.5">
                    {/* Document Title Banner */}
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

                    {/* Items & BOM Specs Table */}
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

                    {/* Strict Quality & Delay Clauses */}
                    <div className="p-2 border border-gray-300 bg-gray-50 rounded text-[8px] text-gray-700 space-y-1">
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
              <div className="mt-6 pt-3 border-t border-gray-300 text-[8.5px]">
                
                {/* Bank Wire Routing Coordinates */}
                {showBankDetails && docType !== 'MUSHAK_6_3' && (
                  <div className="p-2 mb-3 bg-[#F8F6F2] border border-[#DDE3DD] rounded text-[8.5px] leading-tight">
                    <div className="font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                      OFFICIAL BANK WIRE &amp; SETTLEMENT COORDINATES:
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
                <div className="flex items-end justify-between pt-2">
                  
                  {/* Left: Client / Vendor Acceptance */}
                  <div className="text-center w-48">
                    <div className="h-10 border-b border-dashed border-gray-400 flex items-end justify-center pb-1 text-gray-400 italic">
                      [ Counter-Signature &amp; Date ]
                    </div>
                    <div className="mt-1 font-bold text-[#1A1A1A]">
                      {docType === 'PURCHASE_ORDER' ? 'Factory Managing Representative' : 'Authorized Buyer Signatory'}
                    </div>
                    <div className="text-[7.5px] text-gray-500">
                      {docType === 'PURCHASE_ORDER' ? activeOrder.linkedPo?.factoryName : activeOrder.buyerCompany}
                    </div>
                  </div>

                  {/* Center: Anti-Tamper QR Verification */}
                  {showQrCode && (
                    <div className="text-center flex flex-col items-center">
                      <div className="w-12 h-12 border border-gray-300 rounded p-1 bg-white shadow-sm flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-[#1F3A2E]" />
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
                          ArielMC &bull; DHAKA
                        </div>
                        <div className="text-[5.5px] font-mono text-emerald-700">COMMERCIAL DIV</div>
                        <div className="text-[6.5px] font-bold text-emerald-800">APPROVED</div>
                      </div>
                    )}

                    <div className="h-10 border-b border-dashed border-gray-400 flex items-end justify-center pb-1 font-heading font-bold text-[#1F3A2E] text-sm">
                      Syed Akramul Hassan
                    </div>
                    <div className="mt-1 font-bold text-[#1F3A2E]">
                      Syed Akramul Hassan
                    </div>
                    <div className="text-[7.5px] text-gray-600">
                      Managing Director &bull; ArielMC Limited
                    </div>
                  </div>
                </div>

                {/* Footer disclaimer line */}
                <div className="mt-4 pt-2 border-t border-gray-200 text-center text-[7.5px] text-gray-400">
                  This is an official commercial document generated by ArielMC ERP &bull; Verified under EPB Bangladesh and International Chamber of Commerce (ICC) Incoterms 2020.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
