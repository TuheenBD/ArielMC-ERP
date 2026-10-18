'use client';

import React, { useState } from 'react';
import {
  BuyerSalesOrder,
  OrderFulfillmentRouting,
  HubLocation,
} from '@/types/erp';
import {
  Globe2,
  Truck,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Copy,
  Check,
  Send,
  Building2,
  FileText,
  Boxes,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Package,
  Layers,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DualHubGeoRoutingSectionProps {
  orders: BuyerSalesOrder[];
  onUpdateOrderRouting?: (orderId: string, routing: OrderFulfillmentRouting) => void;
  onSelectOrder?: (order: BuyerSalesOrder) => void;
}

export const DualHubGeoRoutingSection: React.FC<DualHubGeoRoutingSectionProps> = ({
  orders,
  onUpdateOrderRouting,
  onSelectOrder,
}) => {
  const [selectedHubFilter, setSelectedHubFilter] = useState<'ALL' | 'WH-UK' | 'WH-DE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'PENDING_ROUTING' | 'PICK_SLIP_READY' | 'DISPATCHED_TO_3PL' | 'DELIVERED'>('ALL');
  const [activeManifestHub, setActiveManifestHub] = useState<HubLocation | null>(null);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [dispatchedOrders, setDispatchedOrders] = useState<Record<string, { carrier: string; tracking: string }>>({});

  // Helper to resolve or derive routing for any order
  const getOrderRouting = (order: BuyerSalesOrder): OrderFulfillmentRouting => {
    if (order.fulfillmentRouting) return order.fulfillmentRouting;

    // Derived rule-based geographic routing (Odoo replacement engine)
    const isUk = order.targetMarket === 'UK';
    const isEu = order.targetMarket === 'EU';

    if (isUk) {
      return {
        assignedHub: 'WH-UK',
        hubName: 'WH-UK (Felixstowe / Northampton)',
        shippingCountry: 'GB',
        deliveryCarrier: order.totalQuantity > 500 ? 'Palletline UK Freight' : 'Royal Mail Tracked 48',
        dispatchStatus: 'PICK_SLIP_READY',
        taxRegime: 'UK_VAT_20',
        preferentialTariffRatePct: 0,
      };
    } else if (isEu) {
      return {
        assignedHub: 'WH-DE',
        hubName: 'WH-DE (Hamburg Waltershof)',
        shippingCountry: 'DE',
        deliveryCarrier: order.totalQuantity > 500 ? 'Dachser European Logistics' : 'DHL Paket National',
        dispatchStatus: 'PICK_SLIP_READY',
        taxRegime: 'EU_OSS_19',
        preferentialTariffRatePct: 0,
      };
    } else {
      return {
        assignedHub: 'WH-US',
        hubName: 'WH-US (Torrance / Long Beach)',
        shippingCountry: 'US',
        deliveryCarrier: 'FedEx Ground / Priority',
        dispatchStatus: 'PENDING_ROUTING',
        taxRegime: 'US_NEXUS',
        preferentialTariffRatePct: 0,
      };
    }
  };

  // Filter orders
  const routedOrders = orders.map((o) => {
    const routing = getOrderRouting(o);
    // Apply local dispatched override if user clicked 1-click dispatch
    if (dispatchedOrders[o.id]) {
      return {
        ...o,
        fulfillmentRouting: {
          ...routing,
          dispatchStatus: 'DISPATCHED_TO_3PL' as const,
          trackingNumber: dispatchedOrders[o.id].tracking,
          deliveryCarrier: dispatchedOrders[o.id].carrier,
        },
      };
    }
    return { ...o, fulfillmentRouting: routing };
  });

  const filteredOrders = routedOrders.filter((order) => {
    const routing = order.fulfillmentRouting!;
    const matchesHub = selectedHubFilter === 'ALL' || routing.assignedHub === selectedHubFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || routing.dispatchStatus === selectedStatusFilter;
    const matchesSearch =
      order.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routing.shippingCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routing.hubName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesHub && matchesStatus && matchesSearch;
  });

  // KPI calculations
  const ukOrders = routedOrders.filter((o) => o.fulfillmentRouting?.assignedHub === 'WH-UK');
  const deOrders = routedOrders.filter((o) => o.fulfillmentRouting?.assignedHub === 'WH-DE');
  const ukTotalUnits = ukOrders.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const deTotalUnits = deOrders.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const ukTotalValuation = ukOrders.reduce((acc, curr) => acc + curr.totalAmountUsd, 0);
  const deTotalValuation = deOrders.reduce((acc, curr) => acc + curr.totalAmountUsd, 0);

  // 1-Click Dispatch to 3PL Action
  const handleDispatchTo3pl = (order: BuyerSalesOrder) => {
    const routing = getOrderRouting(order);
    const trackingNo =
      routing.assignedHub === 'WH-UK'
        ? `RM48-GB-${Math.floor(100000 + Math.random() * 900000)}`
        : `DHL-DE-${Math.floor(100000 + Math.random() * 900000)}`;

    setDispatchedOrders((prev) => ({
      ...prev,
      [order.id]: {
        carrier: routing.deliveryCarrier,
        tracking: trackingNo,
      },
    }));

    if (onUpdateOrderRouting) {
      onUpdateOrderRouting(order.id, {
        ...routing,
        dispatchStatus: 'DISPATCHED_TO_3PL',
        trackingNumber: trackingNo,
      });
    }
  };

  // Generate 3PL Manifest CSV Content
  const generateManifestCsv = (hub: HubLocation) => {
    const hubOrders = routedOrders.filter((o) => o.fulfillmentRouting?.assignedHub === hub);
    const headers = [
      'DISPATCH_DATE',
      'ORDER_REFERENCE',
      'CUSTOMER_COMPANY',
      'DESTINATION_COUNTRY',
      'CARRIER_SERVICE',
      'SKU',
      'STYLE_NAME',
      'QUANTITY_PCS',
      'HS_CUSTOMS_CODE',
      'DECLARED_VALUE_USD',
      'ORIGIN_REX_CERTIFIED',
      'TAX_REGIME',
    ];

    const rows = hubOrders.flatMap((order) =>
      order.items.map((item) => [
        new Date().toISOString().slice(0, 10),
        order.soNumber,
        `"${order.buyerCompany}"`,
        order.fulfillmentRouting?.shippingCountry || 'GB',
        `"${order.fulfillmentRouting?.deliveryCarrier || 'Standard 3PL'}"`,
        item.sku,
        `"${item.styleName}"`,
        item.quantity,
        item.sector === 'LEATHER' ? '4202.21' : item.sector === 'JUTE' ? '6305.10' : '4202.92',
        item.totalPrice,
        'YES_REX_EBA_DCTS_0_DUTY',
        order.fulfillmentRouting?.taxRegime || 'UK_VAT_20',
      ])
    );

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Strategic Header & Odoo Replacement Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#1F3A2E] via-[#244537] to-[#1F3A2E] border border-white/10 shadow-lg text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold">
                SOVEREIGN OMS • 100% ODOO REPLACEMENT
              </span>
              <span className="text-xs text-[#CFE0D5] font-mono">
                Automated Dual 3PL Hub Geographic Order Routing
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 font-montserrat">
              <Globe2 className="w-5 h-5 text-[#C8A96A]" />
              Dual-Hub Order Routing &amp; 3PL Dispatch Center
            </h2>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed">
              Directs customer orders across the UK and Continental Europe automatically based on delivery destination. Eliminates generic Odoo licenses, manual server action scripts, and middleware fees with native <strong>WH-UK (Felixstowe / Northampton)</strong> and <strong>WH-DE (Hamburg / Ruhr)</strong> execution.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveManifestHub('WH-UK')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>UK 3PL Manifest (CSV)</span>
            </button>
            <button
              onClick={() => setActiveManifestHub('WH-DE')}
              className="px-3.5 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#DEBE80] text-[#1F3A2E] font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>German 3PL Manifest (CSV)</span>
            </button>
          </div>
        </div>

        {/* Dual Hub Command Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* UK Hub Card */}
          <div className="p-4 rounded-xl bg-black/20 border border-white/15 backdrop-blur-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <span className="font-bold text-sm text-white">United Kingdom Hub (WH-UK)</span>
                </div>
                <div className="text-[11px] text-[#A0B9A8] mt-0.5">
                  Davies Turner Logistics PLC • Felixstowe Port &amp; Northampton
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-mono font-bold">
                HMRC 20% VAT • GB EORI
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
              <div>
                <div className="text-[10px] text-white/60 uppercase">Routed Orders</div>
                <div className="text-base font-bold font-mono text-[#C8A96A]">{ukOrders.length}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/60 uppercase">Allocated Stock</div>
                <div className="text-base font-bold font-mono text-white">{ukTotalUnits.toLocaleString()} pcs</div>
              </div>
              <div>
                <div className="text-[10px] text-white/60 uppercase">Landed Value</div>
                <div className="text-base font-bold font-mono text-emerald-400">${ukTotalValuation.toLocaleString()}</div>
              </div>
            </div>

            <div className="text-[11px] text-white/80 flex items-center justify-between pt-1">
              <span>Primary Carriers: <strong>Royal Mail Tracked 48 / Palletline</strong></span>
              <span className="text-emerald-300 font-semibold">0% Tariff (DCTS Scheme)</span>
            </div>
          </div>

          {/* Germany / EU Hub Card */}
          <div className="p-4 rounded-xl bg-black/20 border border-white/15 backdrop-blur-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇺</span>
                  <span className="font-bold text-sm text-white">Germany &amp; Continental EU Hub (WH-DE)</span>
                </div>
                <div className="text-[11px] text-[#A0B9A8] mt-0.5">
                  Dachser European Logistics SE • Hamburg Waltershof &amp; Ruhr
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-mono font-bold">
                German USt-IdNr • EU OSS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
              <div>
                <div className="text-[10px] text-white/60 uppercase">Routed Orders</div>
                <div className="text-base font-bold font-mono text-[#C8A96A]">{deOrders.length}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/60 uppercase">Allocated Stock</div>
                <div className="text-base font-bold font-mono text-white">{deTotalUnits.toLocaleString()} pcs</div>
              </div>
              <div>
                <div className="text-[10px] text-white/60 uppercase">Landed Value</div>
                <div className="text-base font-bold font-mono text-emerald-400">${deTotalValuation.toLocaleString()}</div>
              </div>
            </div>

            <div className="text-[11px] text-white/80 flex items-center justify-between pt-1">
              <span>Primary Carriers: <strong>DHL Paket National / Dachser Pan-EU</strong></span>
              <span className="text-emerald-300 font-semibold">0% Tariff (EBA Preference)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SO number, buyer company, destination country..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#DDE3DD] bg-slate-50 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E]/20"
            />
          </div>

          {/* Hub Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['ALL', 'WH-UK', 'WH-DE'] as const).map((hub) => (
              <button
                key={hub}
                onClick={() => setSelectedHubFilter(hub)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedHubFilter === hub
                    ? 'bg-[#1F3A2E] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {hub === 'ALL' ? 'All Hubs' : hub === 'WH-UK' ? '🇬🇧 WH-UK' : '🇪🇺 WH-DE'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-white text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Dispatch Statuses</option>
            <option value="PICK_SLIP_READY">Pick Slip Ready</option>
            <option value="DISPATCHED_TO_3PL">Dispatched to 3PL</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing <strong>{filteredOrders.length}</strong> routed orders
        </div>
      </div>

      {/* Geographic Order Routing Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#DDE3DD] text-[#6B7269] font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Order / SO Ref</th>
                <th className="py-3 px-4 font-semibold">Buyer &amp; Destination</th>
                <th className="py-3 px-4 font-semibold">Items &amp; Volume</th>
                <th className="py-3 px-4 font-semibold">Assigned 3PL Hub</th>
                <th className="py-3 px-4 font-semibold">Carrier Route</th>
                <th className="py-3 px-4 font-semibold">Tax &amp; 0% Tariff</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold text-right">3PL Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No orders match the selected geographic criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const routing = order.fulfillmentRouting!;
                  const isUk = routing.assignedHub === 'WH-UK';
                  const isDe = routing.assignedHub === 'WH-DE';
                  const isDispatched = routing.dispatchStatus === 'DISPATCHED_TO_3PL' || routing.dispatchStatus === 'DELIVERED';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => onSelectOrder && onSelectOrder(order)}
                    >
                      {/* SO Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1F3A2E]">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                          <span>{order.soNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {order.orderDate}
                        </div>
                      </td>

                      {/* Buyer & Destination */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{isUk ? '🇬🇧' : isDe ? '🇩🇪' : '🇺🇸'}</span>
                          <span>{order.buyerCompany}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {order.buyerContact} • {routing.shippingCountry}
                        </div>
                      </td>

                      {/* Items & Volume */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">
                          {order.totalQuantity.toLocaleString()} pcs
                        </div>
                        <div className="text-[11px] text-emerald-800 font-mono font-semibold">
                          ${order.totalAmountUsd.toLocaleString()}
                        </div>
                      </td>

                      {/* Assigned 3PL Hub */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
                            isUk
                              ? 'bg-blue-50 text-blue-900 border-blue-200'
                              : isDe
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Building2 className="w-3 h-3" />
                          <span>{routing.assignedHub}</span>
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                          {routing.hubName.split('(')[1]?.replace(')', '') || routing.hubName}
                        </div>
                      </td>

                      {/* Carrier Route */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{routing.deliveryCarrier}</span>
                        </div>
                        {routing.trackingNumber && (
                          <div className="text-[10px] font-mono font-bold text-blue-700 mt-0.5">
                            AWB: {routing.trackingNumber}
                          </div>
                        )}
                      </td>

                      {/* Tax & Tariff */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {routing.taxRegime === 'UK_VAT_20' ? '20% UK VAT' : routing.taxRegime === 'EU_OSS_19' ? '19% EU OSS' : 'US Nexus'}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>0% Preferential Duty</span>
                        </div>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isDispatched
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isDispatched ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{routing.dispatchStatus.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      {/* 3PL Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {!isDispatched ? (
                            <button
                              onClick={() => handleDispatchTo3pl(order)}
                              title="1-Click: Release Picking Order to 3PL WMS"
                              className="px-2.5 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <Send className="w-3 h-3" />
                              <span>Dispatch 3PL</span>
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
                              In 3PL Transit
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: 3PL Daily Dispatch Manifest Preview & Download */}
      {activeManifestHub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#DDE3DD] bg-[#FAF9F5] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  3PL WMS Automated EDI / CSV Interface
                </span>
                <h3 className="font-heading font-bold text-base text-[#1F3A2E] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C8A96A]" />
                  <span>
                    Daily Dispatch Manifest: {activeManifestHub === 'WH-UK' ? 'Davies Turner UK (WH-UK)' : 'Dachser European Logistics (WH-DE)'}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveManifestHub(null);
                  setCopiedManifest(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px]">
                    This manifest conforms to Davies Turner &amp; Dachser WMS ingestion standards. Pre-configured with HS Codes, declared values, and REX 0% preferential duty tags.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                  Generated Manifest Payload (CSV Format):
                </span>
                <textarea
                  readOnly
                  rows={10}
                  value={generateManifestCsv(activeManifestHub)}
                  className="w-full p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800 select-all focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#DDE3DD] bg-slate-50 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-mono">
                Hub: {activeManifestHub} • Format: UTF-8 CSV / WMS Direct
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateManifestCsv(activeManifestHub));
                    setCopiedManifest(true);
                    setTimeout(() => setCopiedManifest(false), 2000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DDE3DD] hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedManifest ? 'Copied!' : 'Copy Manifest'}</span>
                </button>
                <button
                  onClick={() => {
                    const csvContent = generateManifestCsv(activeManifestHub);
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `ArielMC_3PL_Manifest_${activeManifestHub}_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
