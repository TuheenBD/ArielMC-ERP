'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CommercialProformaInvoice,
  ProformaInvoiceLineItem,
  ProductItem,
  ProductSector,
} from '@/types/erp';
import {
  X,
  Plus,
  Trash2,
  FileCheck2,
  DollarSign,
  Building2,
  Ship,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CreateProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onCreatePI: (newPI: CommercialProformaInvoice) => void;
  bdtRate?: number;
  gbpRate?: number;
  eurRate?: number;
  audRate?: number;
}

export const CreateProformaInvoiceModal: React.FC<CreateProformaInvoiceModalProps> = ({
  isOpen,
  onClose,
  products,
  onCreatePI,
  bdtRate = 124.38,
  gbpRate = 0.77,
  eurRate = 0.92,
  audRate = 1.52,
}) => {
  const [mounted, setMounted] = useState(false);

  // Buyer Form States
  const [selectedBuyerPreset, setSelectedBuyerPreset] = useState<string>('HARRODS');
  const [buyerCompany, setBuyerCompany] = useState('Harrods London');
  const [buyerContactPerson, setBuyerContactPerson] = useState('Eleanor Vance (Senior Accessories Buyer)');
  const [buyerEmail, setBuyerEmail] = useState('eleanor.vance@harrods.com');
  const [buyerAddress, setBuyerAddress] = useState('87–135 Brompton Road, Knightsbridge, London SW1X 7XL, UK');
  const [buyerVatEoriNumber, setBuyerVatEoriNumber] = useState('GB 239 8812 44');
  const [targetMarket, setTargetMarket] = useState<'UK' | 'US' | 'EU' | 'AU' | 'BD'>('UK');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AUD' | 'BDT'>('GBP');

  // Trade Terms
  const [incoterm, setIncoterm] = useState<'FOB' | 'FCA' | 'CIF' | 'CFR' | 'EXW'>('FOB');
  const [portOfLoading, setPortOfLoading] = useState('Chittagong Sea Port, Bangladesh (BDCGP)');
  const [portOfDischarge, setPortOfDischarge] = useState('Port of Felixstowe / London Gateway, UK');
  const [productionLeadTimeWeeks, setProductionLeadTimeWeeks] = useState(6);
  const [paymentTerms, setPaymentTerms] = useState('50% Advance Wire Deposit upon PI sign-off, 50% Against Clean Bill of Lading (B/L) copy');

  // Sample Fee Deduction (SOP-B2B-SMP-2026-V1)
  const [sampleAdjustmentApplied, setSampleAdjustmentApplied] = useState(true);
  const [sampleAdjustmentFee, setSampleAdjustmentFee] = useState(95);
  const [sampleAdjustmentReference, setSampleAdjustmentReference] = useState('SDO-2026-SMP-01');

  // Line Items
  const [lineItems, setLineItems] = useState<ProformaInvoiceLineItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepopulate first product on open
  useEffect(() => {
    if (products.length > 0 && lineItems.length === 0) {
      const p1 = products[0];
      const fobPrice = p1.costing?.b2bFobPriceUsd || 15;
      const factoryCost = p1.costing?.factoryCostBdt || 850;
      setLineItems([
        {
          id: `item-${Date.now()}-1`,
          productId: p1.id,
          sku: p1.sku,
          styleName: p1.name,
          description: p1.description || 'Export grade artisan Bengali handicraft',
          hsCode: p1.hsCode || '5705.00.00',
          sector: p1.sector,
          quantity: 1000,
          unit: 'pcs',
          unitPrice: Math.round(fobPrice * 0.77 * 100) / 100,
          totalPrice: Math.round(fobPrice * 0.77 * 1000),
          factoryAskingCostBdt: factoryCost,
        },
      ]);
    }
  }, [products, isOpen]);

  // Buyer Preset Handler
  const handleBuyerPresetChange = (preset: string) => {
    setSelectedBuyerPreset(preset);
    if (preset === 'HARRODS') {
      setBuyerCompany('Harrods London');
      setBuyerContactPerson('Eleanor Vance (Senior Accessories Buyer)');
      setBuyerEmail('eleanor.vance@harrods.com');
      setBuyerAddress('87–135 Brompton Road, Knightsbridge, London SW1X 7XL, UK');
      setBuyerVatEoriNumber('GB 239 8812 44');
      setTargetMarket('UK');
      setCurrency('GBP');
      setPortOfDischarge('Port of Felixstowe / London Gateway, UK');
      setSampleAdjustmentFee(95);
    } else if (preset === 'RALPH_LAUREN') {
      setBuyerCompany('Ralph Lauren Corporation');
      setBuyerContactPerson('Marcus Thorne (Global Procurement VP)');
      setBuyerEmail('marcus.thorne@ralphlauren.com');
      setBuyerAddress('650 Madison Avenue, New York, NY 10022, USA');
      setBuyerVatEoriNumber('US-EIN-13-2618491');
      setTargetMarket('US');
      setCurrency('USD');
      setPortOfDischarge('Port of New York / Newark & Long Beach, USA');
      setSampleAdjustmentFee(45);
    } else if (preset === 'MARKS_SPENCER') {
      setBuyerCompany('Marks & Spencer PLC');
      setBuyerContactPerson('Gareth Jenkins (Head of Ethical Sourcing)');
      setBuyerEmail('gareth.jenkins@marksandspencer.com');
      setBuyerAddress('Waterside House, 35 North Wharf Road, London W2 1NW, UK');
      setBuyerVatEoriNumber('GB 232 1289 01');
      setTargetMarket('UK');
      setCurrency('GBP');
      setPortOfDischarge('Southampton Container Port, UK');
      setSampleAdjustmentFee(35);
    } else if (preset === 'INDITEX') {
      setBuyerCompany('Inditex (Zara & Massimo Dutti)');
      setBuyerContactPerson('Sofia Alvarez (Materials Lead)');
      setBuyerEmail('sofia.alvarez@inditex.com');
      setBuyerAddress('Avenida de la Diputación, Edificio Inditex, 15142 Arteixo, Spain');
      setBuyerVatEoriNumber('ES-A-15075062');
      setTargetMarket('EU');
      setCurrency('EUR');
      setPortOfDischarge('Port of Valencia / Rotterdam Gateway, EU');
      setSampleAdjustmentFee(50);
    } else if (preset === 'COUNTRY_ROAD') {
      setBuyerCompany('Country Road Group');
      setBuyerContactPerson('Liam Henderson (Brand Sourcing Director)');
      setBuyerEmail('liam.henderson@countryroadgroup.com.au');
      setBuyerAddress('Building 2, 572 Swan Street, Burnley, Melbourne VIC 3121, Australia');
      setBuyerVatEoriNumber('AU-ABN-78-006-759-182');
      setTargetMarket('AU');
      setCurrency('AUD');
      setPortOfDischarge('Port of Melbourne, Victoria, Australia');
      setSampleAdjustmentFee(55);
    }
  };

  // Add Product from Master
  const handleAddProductFromCatalog = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    let unitInCurr = prod.costing?.b2bFobPriceUsd || 20;
    if (currency === 'GBP') unitInCurr = Math.round(unitInCurr * gbpRate * 100) / 100;
    else if (currency === 'EUR') unitInCurr = Math.round(unitInCurr * eurRate * 100) / 100;
    else if (currency === 'AUD') unitInCurr = Math.round(unitInCurr * audRate * 100) / 100;
    else if (currency === 'BDT') unitInCurr = Math.round(unitInCurr * bdtRate);

    const qty = 500;

    const newItem: ProformaInvoiceLineItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: prod.id,
      sku: prod.sku,
      styleName: prod.name,
      description: prod.description || 'Export grade artisan Bangladeshi merchandise',
      hsCode: prod.hsCode || '5705.00.00',
      sector: prod.sector,
      quantity: qty,
      unit: 'pcs',
      unitPrice: unitInCurr,
      totalPrice: unitInCurr * qty,
      factoryAskingCostBdt: prod.costing?.factoryCostBdt || 800,
    };

    setLineItems((prev) => [...prev, newItem]);
  };

  // Update item
  const handleUpdateItem = (id: string, updates: Partial<ProformaInvoiceLineItem>) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        updated.totalPrice = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Totals
  const subtotal = lineItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalQty = lineItems.reduce((acc, i) => acc + i.quantity, 0);
  const deduction = sampleAdjustmentApplied ? sampleAdjustmentFee : 0;
  const netPayable = Math.max(0, subtotal - deduction);

  // Convert Net Payable to USD
  let netPayableUsd = netPayable;
  if (currency === 'GBP') netPayableUsd = Math.round(netPayable / gbpRate);
  else if (currency === 'EUR') netPayableUsd = Math.round(netPayable / eurRate);
  else if (currency === 'AUD') netPayableUsd = Math.round(netPayable / audRate);
  else if (currency === 'BDT') netPayableUsd = Math.round(netPayable / bdtRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Please add at least one line item to the Proforma Invoice.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const shipment = new Date(Date.now() + productionLeadTimeWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const piNumber = `PI-2026-AMC-${buyerCompany.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${randomSuffix}`;

    const newPI: CommercialProformaInvoice = {
      id: `pi-${Date.now()}`,
      piNumber,
      buyerCompany,
      buyerContactPerson,
      buyerEmail,
      buyerAddress,
      buyerVatEoriNumber,
      targetMarket,
      operatingEntity: targetMarket === 'UK' ? 'ARIEL_UK' : targetMarket === 'US' ? 'ARIEL_US' : targetMarket === 'EU' ? 'ARIEL_EU' : 'ARIEL_AU',
      currency,
      exchangeRateToUsd: currency === 'GBP' ? gbpRate : currency === 'EUR' ? eurRate : currency === 'AUD' ? audRate : 1.0,
      issueDate: today,
      validUntil: expiry,
      estimatedShipmentDate: shipment,
      productionLeadTimeWeeks,
      incoterm,
      portOfLoading,
      portOfDischarge,
      items: lineItems,
      subtotalAmount: subtotal,
      sampleAdjustmentApplied,
      sampleAdjustmentFeeQuoteCurrency: deduction,
      sampleAdjustmentFeeUsd: Math.round(deduction * (currency === 'GBP' ? 1.3 : currency === 'EUR' ? 1.09 : 1.0)),
      sampleAdjustmentReference: sampleAdjustmentReference || 'SDO-2026-SMP-01',
      sampleAdjustmentNotes: '100% credited against qualifying Bulk PO meeting MOQ per official SOP-B2B-SMP-2026-V1.',
      netPayableAmount: netPayable,
      netPayableAmountUsd: netPayableUsd,
      totalQuantity: totalQty,
      paymentTerms,
      specialTerms: [
        `Incoterms: ${incoterm} (${portOfLoading}). Maritime export packing with moisture desiccants.`,
        'Quality Standard: Strict AQL 1.0/1.5 with full final random inspection (FRI) pass before dispatch.',
        sampleAdjustmentApplied
          ? `Sample Policy: ${currency} ${deduction.toFixed(2)} sample development fee is 100% credited on this invoice.`
          : 'Standard commercial bulk terms apply.',
        'Shipment tolerance: +/- 5% in total quantity and value acceptable.',
      ],
      beneficiaryBank: {
        bankName: 'Eastern Bank PLC',
        branchName: 'Principal Branch, Dhaka (Authorized Dealer)',
        swiftCode: 'EBLDBDDH',
        routingNumber: '090261842',
        adBranchCode: '0902',
        accountName: 'Ariel Marketing & Communications Limited',
        accountNumber: '1041060291841',
        bankAddress: '10 Dilkusha Commercial Area, Dhaka-1000, Bangladesh',
      },
      status: 'ISSUED',
      internalNotes: `Generated via Department 3 Commercial Sales PI Engine on ${today}.`,
    };

    onCreatePI(newPI);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[100000] my-auto">
        {/* Modal Header */}
        <div className="p-5 bg-[#1F3A2E] text-white border-b-2 border-[#C8A96A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">
                1-Click Export Proforma Invoice (PI) Engine
              </h2>
              <p className="text-xs text-emerald-200">
                Official Bangladesh Bank compliant sales quotation with sample credit clause
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-[#1A1A1A]">
          {/* Buyer Preset Selector */}
          <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A6D3B] uppercase tracking-wider font-heading">
                Strategic Buyer Quick Preset:
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Auto-populates banking and trade details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'HARRODS', label: '🇬🇧 Harrods', curr: 'GBP (£)' },
                { id: 'RALPH_LAUREN', label: '🇺🇸 Ralph Lauren', curr: 'USD ($)' },
                { id: 'MARKS_SPENCER', label: '🇬🇧 Marks & Spencer', curr: 'GBP (£)' },
                { id: 'INDITEX', label: '🇪🇺 Zara Home', curr: 'EUR (€)' },
                { id: 'COUNTRY_ROAD', label: '🇦🇺 Country Road', curr: 'AUD (A$)' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleBuyerPresetChange(b.id)}
                  className={`p-2 rounded-lg text-xs font-semibold text-left transition-all border ${
                    selectedBuyerPreset === b.id
                      ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
                      : 'bg-white text-slate-800 hover:bg-slate-100 border-[#DDE3DD]'
                  }`}
                >
                  <div className="font-bold truncate">{b.label}</div>
                  <div className={`text-[10px] font-mono ${selectedBuyerPreset === b.id ? 'text-[#C8A96A]' : 'text-slate-500'}`}>
                    {b.curr}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buyer Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Buyer Company Name:</label>
              <input
                type="text"
                required
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Attention (Key Decision Maker):</label>
              <input
                type="text"
                required
                value={buyerContactPerson}
                onChange={(e) => setBuyerContactPerson(e.target.value)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Buyer Email:</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Quote Currency:</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-bold font-mono text-[#1F3A2E]"
              >
                <option value="USD">USD ($) - Global Standard</option>
                <option value="GBP">GBP (£) - UK Station</option>
                <option value="EUR">EUR (€) - European Union</option>
                <option value="AUD">AUD (A$) - Australia Station</option>
                <option value="BDT">BDT (৳) - Domestic Factory Clearing</option>
              </select>
            </div>
          </div>

          {/* Trade Terms & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Incoterms 2020:</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value as any)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-bold"
              >
                <option value="FOB">FOB - Free on Board (Default)</option>
                <option value="FCA">FCA - Free Carrier (Air Cargo)</option>
                <option value="CIF">CIF - Cost, Insurance &amp; Freight</option>
                <option value="CFR">CFR - Cost &amp; Freight</option>
                <option value="EXW">EXW - Ex-Works Factory</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Port of Loading:</label>
              <input
                type="text"
                value={portOfLoading}
                onChange={(e) => setPortOfLoading(e.target.value)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Port of Discharge / Destination:</label>
              <input
                type="text"
                value={portOfDischarge}
                onChange={(e) => setPortOfDischarge(e.target.value)}
                className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg"
              />
            </div>
          </div>

          {/* Line Items Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-heading">
                Proforma Line Items ({lineItems.length}):
              </span>

              {/* Add from Catalog Dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddProductFromCatalog(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="p-1.5 bg-[#1F3A2E] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                <option value="">+ Add Product from Master...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} (${p.costing?.b2bFobPriceUsd || 15})
                  </option>
                ))}
              </select>
            </div>

            {lineItems.map((item, idx) => (
              <div key={item.id} className="p-3 rounded-xl border border-[#DDE3DD] bg-white space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-500 block">Style Name &amp; SKU:</span>
                      <input
                        type="text"
                        value={item.styleName}
                        onChange={(e) => handleUpdateItem(item.id, { styleName: e.target.value })}
                        className="w-full p-1.5 border border-[#DDE3DD] rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Quantity ({item.unit}):</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                        className="w-full p-1.5 border border-[#DDE3DD] rounded font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Unit Price ({currency}):</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.1"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                        className="w-full p-1.5 border border-[#DDE3DD] rounded font-mono font-bold text-xs text-[#1F3A2E]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  <span>HS Code: {item.hsCode} • Sector: {item.sector}</span>
                  <span className="font-mono font-bold text-[#1F3A2E]">
                    Total: {currency} {item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Official Sample Fee Deduction Clause (SOP-B2B-SMP-2026-V1) */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-3">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="sampleAdjustment"
                checked={sampleAdjustmentApplied}
                onChange={(e) => setSampleAdjustmentApplied(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="flex-1">
                <label htmlFor="sampleAdjustment" className="font-bold text-emerald-950 text-xs block cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Enforce SOP-B2B-SMP-2026-V1 Sample Fee Bulk Credit Guarantee:</span>
                </label>
                <p className="text-[11px] text-emerald-900 mt-0.5 leading-relaxed">
                  Automatically deduct the upfront Sample Development Fee &amp; Courier costs paid by the buyer from this bulk invoice total.
                </p>
              </div>
            </div>

            {sampleAdjustmentApplied && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200">
                <div>
                  <label className="text-[10px] font-bold text-emerald-950 uppercase block mb-1">
                    Sample Fee Deduction ({currency}):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sampleAdjustmentFee}
                    onChange={(e) => setSampleAdjustmentFee(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-950 uppercase block mb-1">
                    Sample SDO Reference Code:
                  </label>
                  <input
                    type="text"
                    value={sampleAdjustmentReference}
                    onChange={(e) => setSampleAdjustmentReference(e.target.value)}
                    className="w-full p-2 bg-white border border-emerald-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Terms & Commercial Conditions */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Commercial Payment Terms:</label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-semibold"
            />
          </div>

          {/* Net Calculation Summary */}
          <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-600 block">Total Quantity: <strong>{totalQty.toLocaleString()} pcs</strong></span>
              <span className="text-[11px] text-slate-600 block">
                Gross Subtotal: {currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {sampleAdjustmentApplied && (
                <span className="text-[11px] text-emerald-800 font-bold block">
                  Less Sample Fee Credit: -{currency} {deduction.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block">
                Net Invoice Amount Payable:
              </span>
              <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                {currency} {netPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                (~${netPayableUsd.toLocaleString()} USD • ৳{Math.round(netPayableUsd * bdtRate).toLocaleString('en-IN')} BDT)
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#DDE3DD] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDE3DD] text-slate-700 hover:bg-slate-50 font-semibold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-all shadow-md border-b-2 border-[#C8A96A] cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#C8A96A]" />
              <span>Issue Official Proforma Invoice (PI)</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
