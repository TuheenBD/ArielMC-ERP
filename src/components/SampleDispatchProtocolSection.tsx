'use client';

import React, { useState } from 'react';
import {
  SampleStockBufferItem,
  SampleDispatchOrder,
  SampleDispatchTierType,
  CrmLead,
  ProductSector,
} from '@/types/erp';
import {
  Truck,
  Plane,
  Package,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Search,
  Printer,
  X,
  Sparkles,
  ArrowRight,
  Globe2,
  Barcode,
  Layers,
  MapPin,
  Send,
  Zap,
  Mail,
} from 'lucide-react';
import { INITIAL_SAMPLE_BUFFER_ITEMS, INITIAL_SAMPLE_DISPATCHES } from '@/data/initialSampleDispatches';
import { dispatchErpEmail } from '@/lib/emailService';


interface SampleDispatchProtocolSectionProps {
  crmLeads?: CrmLead[];
  onOpenSampleOrder?: (sdoId: string) => void;
}

export function SampleDispatchProtocolSection({
  crmLeads = [],
  onOpenSampleOrder,
}: SampleDispatchProtocolSectionProps) {
  const [buffers, setBuffers] = useState<SampleStockBufferItem[]>(INITIAL_SAMPLE_BUFFER_ITEMS);
  const [dispatches, setDispatches] = useState<SampleDispatchOrder[]>(INITIAL_SAMPLE_DISPATCHES);
  const [selectedHubFilter, setSelectedHubFilter] = useState<'ALL' | 'WH-UK' | 'WH-DE'>('ALL');
  const [activeTab, setActiveTab] = useState<'DISPATCH_CONSOLE' | 'BUFFER_INVENTORY' | 'DISPATCH_LOG'>('DISPATCH_CONSOLE');
  const [selectedInvoice, setSelectedInvoice] = useState<SampleDispatchOrder | null>(null);

  // New Dispatch Form State
  const [dispatchTier, setDispatchTier] = useState<SampleDispatchTierType>('TIER_1_3PL_BUFFER');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [buyerCompany, setBuyerCompany] = useState<string>('');
  const [buyerContact, setBuyerContact] = useState<string>('');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [buyerAddress, setBuyerAddress] = useState<string>('');
  const [buyerCountry, setBuyerCountry] = useState<'UK' | 'Germany' | 'France' | 'Netherlands' | 'USA' | 'Australia' | 'Other'>('UK');
  const [selectedBufferSku, setSelectedBufferSku] = useState<string>(buffers[0]?.sku || '');
  const [customStyleName, setCustomStyleName] = useState<string>('Bespoke Heritage Leather Shopper - Gold Foil Monogram');
  const [customSector, setCustomSector] = useState<ProductSector>('LEATHER');
  const [selectedCourier, setSelectedCourier] = useState<string>('Royal Mail Tracked 24');
  const [costBearer, setCostBearer] = useState<'ARIEL_MARKETING_BUFFER' | 'BUYER_PAID' | 'REIMBURSABLE_ON_BULK_PO'>('ARIEL_MARKETING_BUFFER');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle CRM Lead Selection
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = crmLeads.find((l) => l.id === leadId);
    if (lead) {
      setBuyerCompany(lead.company);
      setBuyerContact(lead.contact || 'Senior Category Buyer');
      setBuyerEmail(lead.email || `procurement@${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
      
      const isUk = lead.market === 'UK' || lead.country?.toLowerCase().includes('uk') || lead.country?.toLowerCase().includes('united kingdom');
      const isDe = lead.country?.toLowerCase().includes('germany') || lead.country?.toLowerCase().includes('deutschland');
      const isFr = lead.country?.toLowerCase().includes('france');

      if (isUk) {
        setBuyerCountry('UK');
        setBuyerAddress(lead.address || `87 High Street, Central Logistics Dock, London, United Kingdom`);
        if (dispatchTier === 'TIER_1_3PL_BUFFER') {
          setSelectedCourier('Royal Mail Tracked 24');
        }
      } else if (isDe) {
        setBuyerCountry('Germany');
        setBuyerAddress(lead.address || `Kurfürstendamm 182, 10707 Berlin, Germany`);
        if (dispatchTier === 'TIER_1_3PL_BUFFER') {
          setSelectedCourier('DHL Paket National');
        }
      } else if (isFr) {
        setBuyerCountry('France');
        setBuyerAddress(lead.address || `Rue de Rivoli 42, 75001 Paris, France`);
      } else {
        setBuyerCountry('Other');
        setBuyerAddress(lead.address || `Logistics Hub, Trade Bay 4`);
      }
    }
  };

  // Submit New Sample Dispatch
  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const isTier1 = dispatchTier === 'TIER_1_3PL_BUFFER';
      const hubCode = isTier1 ? (buyerCountry === 'UK' ? 'WH-UK' : 'WH-DE') : 'DHAKA_RND_LAB';
      const awbPrefix = isTier1 
        ? (buyerCountry === 'UK' ? 'RM-2026-UK-' : 'DHL-DE-') 
        : 'DHL-DAC-';
      const randomAwb = `${awbPrefix}${Math.floor(10000000 + Math.random() * 90000000)}`;

      let items = [];
      if (isTier1) {
        const buffItem = buffers.find((b) => b.sku === selectedBufferSku) || buffers[0];
        items.push({
          sku: buffItem.sku,
          styleName: buffItem.name,
          sector: buffItem.sector,
          quantity: 1,
          declaredValueUsd: 15.00,
          notes: 'Buffer stock unit from domestic 3PL fulfillment hub',
        });

        // Deduct 1 unit from buffer
        setBuffers((prev) =>
          prev.map((b) =>
            b.sku === buffItem.sku
              ? { ...b, availableUnits: Math.max(0, b.availableUnits - 1), reservedUnits: b.reservedUnits + 1 }
              : b
          )
        );
      } else {
        items.push({
          sku: `OEM-DHAKA-${Date.now().toString().slice(-4)}`,
          styleName: customStyleName,
          sector: customSector,
          quantity: 1,
          declaredValueUsd: 15.00,
          notes: 'Direct R&D Dhaka Lab prototype with debossed sample mark',
        });
      }

      const newDispatch: SampleDispatchOrder = {
        id: `dsp-${Date.now()}`,
        dispatchNumber: `SMP-DSP-2026-${String(dispatches.length + 1).padStart(3, '0')}`,
        dispatchTier,
        buyerCompany: buyerCompany || 'Target Prospective Buyer',
        buyerContact: buyerContact || 'Head of Merchandising',
        buyerEmail,
        buyerAddress: buyerAddress || 'Central Procurement Receiving Bay',
        buyerCountry,
        hubOrOrigin: hubCode,
        courier: selectedCourier as any,
        awbTrackingNumber: randomAwb,
        trackingUrl: selectedCourier.includes('Royal Mail')
          ? `https://www.royalmail.com/track-your-item#/tracking-results/${randomAwb}`
          : `https://www.dhl.com/en/express/tracking.html?AWB=${randomAwb}`,
        dispatchDate: new Date().toISOString().split('T')[0],
        estimatedDeliveryDate: new Date(Date.now() + (isTier1 ? 2 : 4) * 86400000).toISOString().split('T')[0],
        transitStatus: 'LABEL_GENERATED',
        sampleItems: items,
        customsDeclaration: !isTier1
          ? {
              statement: 'Mutilated Samples — Not for Resale. Commercial value nil.',
              incoterm: 'DDP',
              eoriNumber: buyerCountry === 'UK' ? 'GB382910482000' : 'DE847291038472',
              hsCode: customSector === 'LEATHER' ? '4202.21.00' : '6305.10.10',
              customsValueUsd: 15.00,
              invoiceNumber: `INV-SMP-EXP-2026-${String(dispatches.length + 1).padStart(3, '0')}`,
            }
          : undefined,
        totalCostUsd: isTier1 ? 8.50 : 145.00,
        costBearer,
        notes: notes || (isTier1 ? 'Domestic 3PL buffer dispatch' : 'Dhaka R&D DDP express sample dispatch'),
      };

      setDispatches([newDispatch, ...dispatches]);
      setIsSubmitting(false);

      // Automated Asynchronous Email Pipeline Ingestion
      if (buyerEmail && buyerEmail.includes('@')) {
        dispatchErpEmail({
          to: buyerEmail,
          recipientName: buyerContact || buyerCompany,
          subject: `[Sample Dispatch #${newDispatch.dispatchNumber}] ${items[0]?.styleName || 'Export Prototype'} — Dispatched via ${newDispatch.courier}`,
          templateId: 'SAMPLE_DISPATCH',
          variables: {
            sampleCode: newDispatch.dispatchNumber,
            buyerName: buyerCompany,
            sku: items[0]?.sku || 'SKU-001',
            productName: items[0]?.styleName || 'Export Prototype',
            tier: dispatchTier,
            carrier: newDispatch.courier,
            trackingNumber: newDispatch.awbTrackingNumber,
            originHub: isTier1 ? (hubCode === 'WH-UK' ? 'Davies Turner UK Hub (Dartford DA2)' : 'Dachser European Logistics Hub (Hamburg DE)') : 'Dhaka OEM Artisan R&D Facility',
            destinationAddress: newDispatch.buyerAddress,
            estimatedDeliveryDate: newDispatch.estimatedDeliveryDate,
          },
          provider: 'RESEND',
        }).catch((err) => console.warn('Sample email dispatch notice:', err));
      }

      setSuccessMessage(`Sample Dispatch ${newDispatch.dispatchNumber} prepared! Tracking AWB: ${newDispatch.awbTrackingNumber}`);
      setActiveTab('DISPATCH_LOG');

      setTimeout(() => setSuccessMessage(null), 8000);
    }, 600);
  };

  const filteredBuffers = buffers.filter((b) =>
    selectedHubFilter === 'ALL' ? true : b.warehouseHub === selectedHubFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Operational Handbook Part 7
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Zero Customs Hold Guaranteed
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Two-Tier B2B Sample Dispatch Protocol
            </h2>
            <p className="text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Systematic domestic 24–48h buffer dispatch for off-the-shelf samples via <strong>WH-UK</strong> &amp; <strong>WH-DE</strong>, 
              paired with Dhaka R&amp;D direct prototype air-express on <strong>DDP terms</strong> with <em>&quot;Mutilated Samples — Not for Resale&quot;</em> customs invoices.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
              <div className="text-xs uppercase tracking-wider text-blue-200">Active Buffer Stock</div>
              <div className="text-xl font-bold text-white">
                {buffers.reduce((acc, b) => acc + b.availableUnits, 0)} Units
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
              <div className="text-xs uppercase tracking-wider text-blue-200">Total Dispatches</div>
              <div className="text-xl font-bold text-emerald-300">
                {dispatches.length} Orders
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('DISPATCH_CONSOLE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'DISPATCH_CONSOLE'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            1-Click Dispatch Studio
          </button>
          <button
            onClick={() => setActiveTab('BUFFER_INVENTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'BUFFER_INVENTORY'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3PL Buffer Inventory ({buffers.reduce((acc, b) => acc + b.availableUnits, 0)} pcs)
          </button>
          <button
            onClick={() => setActiveTab('DISPATCH_LOG')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'DISPATCH_LOG'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Courier Tracking &amp; Invoices ({dispatches.length})
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: 1-CLICK DISPATCH STUDIO */}
      {activeTab === 'DISPATCH_CONSOLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Prepare New B2B Sample Dispatch
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select between Tier 1 domestic buffer dispatch (24–48h SLA) or Tier 2 custom R&amp;D sample room air-express.
              </p>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-6">
              {/* Tier Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Select Dispatch Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setDispatchTier('TIER_1_3PL_BUFFER');
                      if (buyerCountry === 'UK') setSelectedCourier('Royal Mail Tracked 24');
                      else setSelectedCourier('DHL Paket National');
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      dispatchTier === 'TIER_1_3PL_BUFFER'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                        Tier 1: 3PL Hub Buffer
                      </span>
                      <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Off-the-Shelf Production Sample
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Fulfillment: <strong>WH-UK</strong> (Dartford) or <strong>WH-DE</strong> (Hamburg). 24–48h transit via Royal Mail / DHL Paket. Zero customs.
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setDispatchTier('TIER_2_DHAKA_OEM');
                      setSelectedCourier('DHL Express Worldwide');
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      dispatchTier === 'TIER_2_DHAKA_OEM'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                        Tier 2: Dhaka R&amp;D OEM
                      </span>
                      <Plane className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Custom Prototype / Tech-Pack Sample
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Fulfillment: Dhaka R&amp;D Lab via DHL/FedEx on DDP terms. Auto-includes <em>&quot;Mutilated Samples&quot;</em> invoice with EORI link.
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick CRM Lead Autocomplete */}
              {crmLeads && crmLeads.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>1-Click Buyer Linkage from CRM</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400">
                      {crmLeads.length} Prospective Retailers Available
                    </span>
                  </label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => handleSelectLead(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Buyer / Retailer Lead --</option>
                    {crmLeads.slice(0, 30).map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.company} ({lead.country || lead.market}) — {lead.contact || 'Buyer'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Buyer Company
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="e.g. Harrods London or Galeries Lafayette"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Buyer Contact / Recipient
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    placeholder="e.g. Eleanor Vance (Senior Buyer)"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g. procurement@harrods.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Destination Country
                  </label>
                  <select
                    value={buyerCountry}
                    onChange={(e) => {
                      const c = e.target.value as any;
                      setBuyerCountry(c);
                      if (dispatchTier === 'TIER_1_3PL_BUFFER') {
                        setSelectedCourier(c === 'UK' ? 'Royal Mail Tracked 24' : 'DHL Paket National');
                      }
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="UK">United Kingdom (WH-UK Davies Turner)</option>
                    <option value="Germany">Germany (WH-DE Dachser)</option>
                    <option value="France">France (WH-DE Dachser)</option>
                    <option value="Netherlands">Netherlands (WH-DE Dachser)</option>
                    <option value="USA">United States (Direct Dhaka Express)</option>
                    <option value="Australia">Australia (Direct Dhaka Express)</option>
                    <option value="Other">Other International</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Street, Dock / Receiving Bay, Postal Code, City"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* Sample Product Selection */}
              {dispatchTier === 'TIER_1_3PL_BUFFER' ? (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Select Buffer Stock SKU ({buyerCountry === 'UK' ? 'WH-UK Hub' : 'WH-DE Hub'})
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      Deducted immediately upon dispatch
                    </span>
                  </div>
                  <select
                    value={selectedBufferSku}
                    onChange={(e) => setSelectedBufferSku(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {buffers
                      .filter((b) => (buyerCountry === 'UK' ? b.warehouseHub === 'WH-UK' : b.warehouseHub === 'WH-DE'))
                      .map((b) => (
                        <option key={b.id} value={b.sku}>
                          {b.name} [{b.warehouseHub}] — {b.availableUnits} units available (Lead: {b.typicalLeadTimeHours}h)
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                      <Plane className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Dhaka R&amp;D Sample Room Details
                    </span>
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                      DDP Incoterm with EORI
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs text-slate-600 dark:text-slate-400">Prototype Name / Style</label>
                      <input
                        type="text"
                        value={customStyleName}
                        onChange={(e) => setCustomStyleName(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-slate-400">Sector</label>
                      <select
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-sm rounded-xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="LEATHER">LEATHER</option>
                        <option value="JUTE">JUTE</option>
                        <option value="TEXTILE">TEXTILE (Denim)</option>
                        <option value="CERAMICS">CERAMICS</option>
                        <option value="POTTERY">POTTERY</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Courier & Cost Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Carrier &amp; Service SLA
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {dispatchTier === 'TIER_1_3PL_BUFFER' ? (
                      <>
                        <option value="Royal Mail Tracked 24">Royal Mail Tracked 24 (Next-Day UK)</option>
                        <option value="Royal Mail Tracked 48">Royal Mail Tracked 48 (48h UK)</option>
                        <option value="DHL Paket National">DHL Paket National (24–48h EU)</option>
                      </>
                    ) : (
                      <>
                        <option value="DHL Express Worldwide">DHL Express Worldwide (3–4 Days DDP)</option>
                        <option value="FedEx International Priority">FedEx International Priority (3–5 Days DDP)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cost Bearer Terms
                  </label>
                  <select
                    value={costBearer}
                    onChange={(e) => setCostBearer(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ARIEL_MARKETING_BUFFER">ArielMC Marketing Investment ($0 to Buyer)</option>
                    <option value="REIMBURSABLE_ON_BULK_PO">Reimbursable on Qualifying Bulk PO ($50–$150 credit)</option>
                    <option value="BUYER_PAID">Buyer Invoiced Upfront</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Generating Shipping Label &amp; Customs Docket...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Dispatch Sample &amp; Generate Waybill ({dispatchTier === 'TIER_1_3PL_BUFFER' ? 'Domestic £6–£8' : 'DDP Air $145'})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Col: Protocol Guidelines & Highlights */}
          <div className="space-y-6">
            {/* Quick Rules Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Dual-Tier Protocol Rules
              </h4>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-blue-600 dark:text-blue-400">Tier 1: 3PL Hub Buffer</div>
                  <p>
                    Stores 5–15 pristine units of bestseller SKUs at Davies Turner (UK) and Dachser (DE). Dispatched instantly to high-intent buyer leads without airfreight expenses.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">Tier 2: Dhaka R&amp;D Lab</div>
                  <p>
                    For bespoke shapes, custom leather textures, or private label branding. Shipped DDP via DHL/FedEx with perforated sample punch and nil commercial value disclaimer.
                  </p>
                </div>
              </div>
            </div>

            {/* Customs & EORI Badges */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3 border border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Barcode className="w-4 h-4" />
                Active Customs Declarations
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">UK EORI Number:</span>
                  <span className="font-mono font-bold text-white">GB382910482000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">EU EORI Number:</span>
                  <span className="font-mono font-bold text-white">DE847291038472</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Sample Statement:</span>
                  <span className="text-emerald-400 font-medium">Mutilated Samples — Not for Resale</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Max Nominal Value:</span>
                  <span className="font-semibold text-white">&lt; $20.00 USD (Exempt)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUFFER INVENTORY */}
      {activeTab === 'BUFFER_INVENTORY' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Warehouse:</span>
              {(['ALL', 'WH-UK', 'WH-DE'] as const).map((hub) => (
                <button
                  key={hub}
                  onClick={() => setSelectedHubFilter(hub)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedHubFilter === hub
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {hub === 'ALL' ? 'All Hubs' : hub === 'WH-UK' ? 'WH-UK (Davies Turner)' : 'WH-DE (Dachser)'}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredBuffers.length} buffer SKUs ready for immediate dispatch
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBuffers.map((item) => {
              const isLow = item.availableUnits <= item.reorderThreshold;
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                >
                  {isLow && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                      Reorder Threshold Reached
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.warehouseHub}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {item.sku}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Available</div>
                      <div className={`text-base font-bold ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {item.availableUnits} pcs
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Reserved</div>
                      <div className="text-base font-bold text-slate-700 dark:text-slate-300">
                        {item.reservedUnits} pcs
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-semibold">Lead Time</div>
                      <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {item.typicalLeadTimeHours}h
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.hubLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.domesticCarrier}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBufferSku(item.sku);
                      setDispatchTier('TIER_1_3PL_BUFFER');
                      setActiveTab('DISPATCH_CONSOLE');
                    }}
                    className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch This Buffer SKU
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH LOG & COURIER TRACKING */}
      {activeTab === 'DISPATCH_LOG' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Sample Dispatch Orders &amp; Live Tracking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time status of all domestic 3PL and international air-express sample shipments.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Dispatch Order</th>
                    <th className="py-3 px-4">Tier &amp; Hub</th>
                    <th className="py-3 px-4">Recipient Buyer</th>
                    <th className="py-3 px-4">Item &amp; Sector</th>
                    <th className="py-3 px-4">Carrier &amp; AWB</th>
                    <th className="py-3 px-4">Transit Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {dispatches.map((dsp) => {
                    const isTier1 = dsp.dispatchTier === 'TIER_1_3PL_BUFFER';
                    return (
                      <tr key={dsp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold font-mono text-slate-900 dark:text-white">
                            {dsp.dispatchNumber}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {dsp.dispatchDate}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isTier1
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
                            }`}
                          >
                            {isTier1 ? <Truck className="w-3 h-3" /> : <Plane className="w-3 h-3" />}
                            {isTier1 ? 'Tier 1 (3PL)' : 'Tier 2 (Dhaka)'}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {dsp.hubOrOrigin}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {dsp.buyerCompany}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {dsp.buyerContact} • {dsp.buyerCountry}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="truncate font-medium">
                            {dsp.sampleItems[0]?.styleName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Sector: {dsp.sampleItems[0]?.sector}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {dsp.courier}
                          </div>
                          <a
                            href={dsp.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {dsp.awbTrackingNumber}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              dsp.transitStatus === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : dsp.transitStatus === 'OUT_FOR_DELIVERY'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {dsp.transitStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                const targetEmail = dsp.buyerEmail || `procurement@${dsp.buyerCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
                                await dispatchErpEmail({
                                  to: targetEmail,
                                  recipientName: dsp.buyerContact || dsp.buyerCompany,
                                  subject: `[Sample Dispatch #${dsp.dispatchNumber}] ${dsp.sampleItems[0]?.styleName || 'Export Sample'} — Courier Tracking`,
                                  templateId: 'SAMPLE_DISPATCH',
                                  variables: {
                                    sampleCode: dsp.dispatchNumber,
                                    buyerName: dsp.buyerCompany,
                                    sku: dsp.sampleItems[0]?.sku || 'SKU-001',
                                    productName: dsp.sampleItems[0]?.styleName || 'Export Prototype',
                                    tier: dsp.dispatchTier,
                                    carrier: dsp.courier,
                                    trackingNumber: dsp.awbTrackingNumber,
                                    originHub: dsp.hubOrOrigin,
                                    destinationAddress: dsp.buyerAddress || `${dsp.buyerCountry} Receiving Depot`,
                                    estimatedDeliveryDate: dsp.estimatedDeliveryDate,
                                  },
                                  provider: 'RESEND',
                                });
                                alert(`Dispatched tracking protocol for ${dsp.dispatchNumber} to ${dsp.buyerCompany} (${targetEmail})!`);
                              } catch (e: any) {
                                alert(`Error: ${e.message}`);
                              }
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-all inline-flex items-center gap-1 border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                            title="Dispatch branded sample tracking email to buyer"
                          >
                            <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Email Tracking
                          </button>

                          <button
                            onClick={() => setSelectedInvoice(dsp)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            Invoice / Docket
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Commercial Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Sample Commercial Invoice &amp; Waybill Declaration
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Header */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    ArielMC Enterprise Ltd.
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Dhaka R&amp;D Sample Center / Global Logistics Operations
                  </div>
                  <div className="text-slate-500 font-mono mt-1">
                    Invoice Ref: {selectedInvoice.customsDeclaration?.invoiceNumber || selectedInvoice.dispatchNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    NON-COMMERCIAL VALUE
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Date: {selectedInvoice.dispatchDate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">Consignee:</div>
                  <div className="text-slate-900 dark:text-white font-medium">{selectedInvoice.buyerCompany}</div>
                  <div className="text-slate-500">{selectedInvoice.buyerContact}</div>
                  <div className="text-slate-500">{selectedInvoice.buyerAddress}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">Carrier &amp; Waybill:</div>
                  <div className="text-slate-900 dark:text-white font-medium">{selectedInvoice.courier}</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">{selectedInvoice.awbTrackingNumber}</div>
                  <div className="text-slate-500 mt-1">
                    Incoterm: {selectedInvoice.customsDeclaration?.incoterm || 'Domestic Free Delivery'}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Statement Banner */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Customs Exemption Endorsement (Part 7 Compliance):
              </div>
              <p className="italic">
                &quot;{selectedInvoice.customsDeclaration?.statement || 'Mutilated Samples — Not for Resale. Commercial value nil. Shipped solely for buyer inspection and order placement.'}&quot;
              </p>
              {selectedInvoice.customsDeclaration?.eoriNumber && (
                <div className="font-mono text-[11px] pt-1">
                  Importer of Record EORI: <strong>{selectedInvoice.customsDeclaration.eoriNumber}</strong>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">HS Code</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Nominal Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedInvoice.sampleItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900 dark:text-white">{item.styleName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.sku}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {selectedInvoice.customsDeclaration?.hsCode || '4202.21.00'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">${item.declaredValueUsd.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Verified zero-duty customs route per ArielMC Standard Operating Procedures.
              </div>
              <button
                onClick={() => window.print()}
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
