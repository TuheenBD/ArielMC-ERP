'use client';

import React, { useState } from 'react';
import {
  Daily3PlDispatchManifest,
  DispatchManifestItem,
} from '@/types/erp';
import {
  Truck,
  Ship,
  Package,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Printer,
  Send,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Store,
  ShoppingBag,
  Barcode,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  INITIAL_DAILY_MANIFESTS,
  INITIAL_DISPATCH_ITEMS_UK,
  INITIAL_DISPATCH_ITEMS_DE,
} from '@/data/initialDispatchManifests';

export function DailyDispatchManifestSection() {
  const [manifests, setManifests] = useState<Daily3PlDispatchManifest[]>(INITIAL_DAILY_MANIFESTS);
  const [selectedHub, setSelectedHub] = useState<'WH-UK' | 'WH-DE'>('WH-UK');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<string | null>(null);

  // Webhook Simulator State
  const [isSimulatingTracking, setIsSimulatingTracking] = useState(false);
  const [webhookLog, setWebhookLog] = useState<{
    id: string;
    timestamp: string;
    orderRef: string;
    carrier: string;
    trackingNumber: string;
    status: string;
    message: string;
  }[]>([]);

  // Active Manifest
  const activeManifest = manifests.find((m) => m.hubCode === selectedHub) || manifests[0];

  // Filter Items
  const filteredItems = activeManifest.items.filter((item) => {
    const matchesSearch =
      item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'ALL' || item.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  // Handle Transmit EDI
  const handleTransmitEdi = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      const ediRef = `EDI-940-${selectedHub === 'WH-UK' ? 'DT' : 'DCH'}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;
      
      setManifests((prev) =>
        prev.map((m) =>
          m.hubCode === selectedHub
            ? { ...m, exportStatus: 'TRANSMITTED_EDI', ediTransmissionId: ediRef }
            : m
        )
      );

      setIsTransmitting(false);
      setTransmissionSuccess(
        `Manifest for ${selectedHub === 'WH-UK' ? 'Davies Turner (UK)' : 'Dachser (DE)'} successfully transmitted to SFTP! Transmission ID: ${ediRef}`
      );

      setTimeout(() => setTransmissionSuccess(null), 8000);
    }, 900);
  };

  // Handle Download CSV
  const handleDownloadCsv = () => {
    const headers = [
      'OrderNumber',
      'Channel',
      'RecipientName',
      'RecipientAddress',
      'CountryCode',
      'SKU',
      'ProductName',
      'Quantity',
      'Carrier',
      'ServiceCode',
      'WeightKg',
      'PackagingType',
      'TrackingNumber',
      'Status',
    ];

    const rows = activeManifest.items.map((it) => [
      it.orderNumber,
      it.channel,
      `"${it.recipientName}"`,
      `"${it.recipientAddress}"`,
      it.countryCode,
      it.sku,
      `"${it.productName}"`,
      it.quantity,
      it.carrier,
      it.serviceCode,
      it.declaredWeightKg.toFixed(2),
      it.packagingType,
      it.trackingNumber || '',
      it.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeManifest.manifestReference}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update status to DOWNLOADED_CSV if currently draft
    setManifests((prev) =>
      prev.map((m) =>
        m.hubCode === selectedHub && m.exportStatus === 'DRAFT'
          ? { ...m, exportStatus: 'DOWNLOADED_CSV' }
          : m
      )
    );
  };

  // Trigger Inbound Webhook Simulator Event
  const handleSimulateWebhook = async (
    orderRef: string,
    carrier: string,
    trackingNo: string,
    status: 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  ) => {
    setIsSimulatingTracking(true);

    try {
      const response = await fetch('/api/orders/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-arielmc-topic': 'tracking/update',
        },
        body: JSON.stringify({
          event: '3PL_DISPATCH_CONFIRMATION',
          orderNumber: orderRef,
          carrier,
          trackingNumber: trackingNo,
          status,
          hubCode: selectedHub,
          trackingUrl: carrier.includes('Royal Mail')
            ? `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNo}`
            : `https://www.dhl.de/en/privatkunden/pakete-empfangen/verfolgen.html?piececode=${trackingNo}`,
        }),
      });

      const resData = await response.json();

      // Update item status in active manifest
      setManifests((prev) =>
        prev.map((m) => ({
          ...m,
          items: m.items.map((it) =>
            it.orderNumber === orderRef || it.trackingNumber === trackingNo
              ? { ...it, status: status === 'SHIPPED' ? 'DISPATCHED' : status === 'DELIVERED' ? 'DELIVERED' : 'PACKED' }
              : it
          ),
        }))
      );

      // Add to log
      setWebhookLog((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          orderRef,
          carrier,
          trackingNumber: trackingNo,
          status,
          message: resData.message || `Order ${orderRef} updated to ${status}. Customer notification dispatched.`,
        },
        ...prev.slice(0, 7),
      ]);
    } catch (err) {
      console.error('Webhook error:', err);
    } finally {
      setIsSimulatingTracking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1f18] via-[#1a382b] to-[#12281f] text-white shadow-xl relative overflow-hidden border border-[#2b5944]">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Operational Handbook Part 8
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                $0 SaaS vs Odoo/Linnworks
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              3PL Daily Dispatch Manifest &amp; Tracking Feedback Loop
            </h2>
            <p className="text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Automated daily manifest generation (CSV / EDI 940) for <strong>Davies Turner (WH-UK)</strong> and <strong>Dachser (WH-DE)</strong>. 
              Paired with real-time inbound courier tracking ingestion updating Shopify, Amazon FBM, and buyer notifications.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download 3PL CSV
            </button>
            <button
              onClick={handleTransmitEdi}
              disabled={isTransmitting}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isTransmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Transmitting EDI to SFTP...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Transmit EDI 940 to 3PL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hub Cutoff Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-emerald-300 uppercase tracking-wider text-[10px] block">Active 3PL Hub</span>
            <span className="text-base font-bold text-white font-mono">{activeManifest.hubName.split('(')[0]}</span>
            <span className="text-[11px] text-emerald-200/80 block mt-0.5">Code: {activeManifest.hubCode}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-emerald-300 uppercase tracking-wider text-[10px] block">Daily Courier Cutoff</span>
            <span className="text-base font-bold text-amber-300 font-mono">{activeManifest.cutoffTime}</span>
            <span className="text-[11px] text-slate-300 block mt-0.5">Manifest Ref: {activeManifest.manifestReference}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-emerald-300 uppercase tracking-wider text-[10px] block">Orders / Total Weight</span>
            <span className="text-base font-bold text-white font-mono">
              {activeManifest.totalOrders} Orders ({activeManifest.totalWeightKg.toFixed(1)} kg)
            </span>
            <span className="text-[11px] text-slate-300 block mt-0.5">{activeManifest.totalParcels} Pick &amp; Pack Parcels</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-emerald-300 uppercase tracking-wider text-[10px] block">Hub Transmission Status</span>
            <span className="text-base font-bold text-emerald-300 font-mono flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              {activeManifest.exportStatus}
            </span>
            <span className="text-[11px] text-slate-300 block truncate mt-0.5">
              {activeManifest.ediTransmissionId || 'Ready for batch trigger'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {transmissionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{transmissionSuccess}</span>
          </div>
          <button
            onClick={() => setTransmissionSuccess(null)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hub Selector Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Hub:</span>
          <button
            onClick={() => setSelectedHub('WH-UK')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              selectedHub === 'WH-UK'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            WH-UK: Davies Turner (Dartford)
          </button>
          <button
            onClick={() => setSelectedHub('WH-DE')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              selectedHub === 'WH-DE'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            WH-DE: Dachser SE (Hamburg)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order, recipient, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Channels</option>
            <option value="SHOPIFY">Shopify D2C</option>
            <option value="AMAZON_FBM">Amazon FBM</option>
            <option value="ETSY">Etsy</option>
            <option value="B2B_WHOLESALE">B2B Wholesale</option>
          </select>
        </div>
      </div>

      {/* Main Dispatch Manifest Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Manifest Batch Orders ({filteredItems.length} items ready for pick &amp; pack)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct integration format for Davies Turner and Dachser warehouse management systems (WMS).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Labels / Slips
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Recipient &amp; Destination</th>
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-4">Carrier &amp; SLA</th>
                <th className="py-3 px-4">Packaging &amp; Weight</th>
                <th className="py-3 px-4">Tracking AWB</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredItems.map((it) => (
                <tr key={it.orderId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold font-mono text-slate-900 dark:text-white block">
                      {it.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {it.orderId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        it.channel === 'SHOPIFY'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : it.channel === 'AMAZON_FBM'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : it.channel === 'ETSY'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {it.channel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {it.recipientName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {it.recipientAddress}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="font-medium text-slate-900 dark:text-white truncate">
                      {it.productName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {it.sku} (x{it.quantity})
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {it.carrier}
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Code: {it.serviceCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-900 dark:text-white">
                      {it.declaredWeightKg.toFixed(2)} kg
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {it.packagingType.replace('_', ' ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {it.trackingNumber ? (
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                        {it.trackingNumber}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Pending pickup</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold ${
                        it.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : it.status === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRACKING FEEDBACK LOOP SIMULATOR PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inbound Tracking Event Simulator */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isSimulatingTracking ? 'animate-spin' : ''}`} />
                Inbound 3PL Tracking Webhook Loop Simulator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate inbound carrier scan updates from Royal Mail or DHL Paket to verify autonomous order status advancement.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-300/40">
              Webhook: /api/orders/webhook
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Event Preset 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  Royal Mail Scan
                </span>
                <Truck className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                SO-2026-UK-0842
              </div>
              <p className="text-[11px] text-slate-500">
                Hub Dartford scan → Updates status to <strong>DISPATCHED</strong>
              </p>
              <button
                onClick={() =>
                  handleSimulateWebhook(
                    'SO-2026-UK-0842',
                    'Royal Mail Tracked 48',
                    'RM48-GB-948210492',
                    'SHIPPED'
                  )
                }
                disabled={isSimulatingTracking}
                className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                Fire Carrier Scan
              </button>
            </div>

            {/* Event Preset 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  DHL Paket Delivery
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                SO-2026-DE-1194
              </div>
              <p className="text-[11px] text-slate-500">
                Munich doorstep drop → Updates status to <strong>DELIVERED</strong>
              </p>
              <button
                onClick={() =>
                  handleSimulateWebhook(
                    'SO-2026-DE-1194',
                    'DHL Paket National',
                    'DHL-DE-3948201948',
                    'DELIVERED'
                  )
                }
                disabled={isSimulatingTracking}
                className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                Fire Delivery Scan
              </button>
            </div>

            {/* Event Preset 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                  Palletways B2B Proof
                </span>
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                B2B-PO-2026-LON-02
              </div>
              <p className="text-[11px] text-slate-500">
                Liberty London dock signature → Marks <strong>DELIVERED</strong>
              </p>
              <button
                onClick={() =>
                  handleSimulateWebhook(
                    'B2B-PO-2026-LON-02',
                    'Palletways UK',
                    'PLW-UK-88492019',
                    'DELIVERED'
                  )
                }
                disabled={isSimulatingTracking}
                className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                Fire Dock Delivery
              </button>
            </div>
          </div>

          {/* Webhook Activity Stream */}
          {webhookLog.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Real-Time Ingestion Activity Stream:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
                {webhookLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">[{log.timestamp}]</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {log.orderRef}
                      </span>
                      <span>({log.carrier})</span>
                      <span className="text-blue-500">{log.status}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      AWB: {log.trackingNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Cost Comparison vs Odoo Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white space-y-4 border border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Zap className="w-4 h-4" />
            Handbook Part 8 Odoo Replacement
          </div>
          <h4 className="font-bold text-base text-white leading-snug">
            $0 Recurring SaaS Overhead
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Odoo Enterprise charges <strong>$37/user/mo</strong> plus <strong>$800</strong> one-time for third-party connector apps that break on version upgrades. 
            ArielMC ERP provides native SFTP EDI 940 transmission and automated webhook listeners with zero license fees.
          </p>

          <div className="space-y-2 pt-2 text-xs border-t border-white/10">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Odoo Year 1 Total:</span>
              <span className="font-mono text-rose-400 font-bold">$4,500 – $6,200</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Odoo Year 2+ Recurring:</span>
              <span className="font-mono text-rose-400 font-bold">$2,000 – $2,600 / yr</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-emerald-300">
              <span>ArielMC ERP Running Cost:</span>
              <span className="font-mono text-base text-emerald-400">$0.00 / yr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
