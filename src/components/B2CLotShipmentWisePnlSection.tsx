'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Ship,
  Plane,
  Truck,
  TrendingUp,
  Percent,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Boxes,
  ShieldCheck,
  Globe2,
  Calendar,
  Landmark,
  ExternalLink,
  Package,
  Layers,
  ArrowRight,
  Store
} from 'lucide-react';
import {
  B2C_LOT_SHIPMENT_PNL_DATA,
  getB2cLotShipmentPnlSummary,
  B2CLotShipmentPnl,
  B2cLotStatus,
  B2cFreightType
} from '@/data/pnlCalculationData';

export const B2CLotShipmentWisePnlSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hubFilter, setHubFilter] = useState<'ALL' | 'UK' | 'US' | 'EU'>('ALL');
  const [freightFilter, setFreightFilter] = useState<'ALL' | B2cFreightType>('ALL');
  const [expandedLotId, setExpandedLotId] = useState<string | null>(null);

  // Filtered Lots
  const filteredLots = useMemo(() => {
    return B2C_LOT_SHIPMENT_PNL_DATA.filter((lot) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lot.lotNumber.toLowerCase().includes(q) ||
        lot.consignmentNumber.toLowerCase().includes(q) ||
        lot.destinationHub.toLowerCase().includes(q) ||
        lot.carrierVessel.toLowerCase().includes(q);

      const matchesHub = hubFilter === 'ALL' || lot.hubLocation === hubFilter;
      const matchesFreight = freightFilter === 'ALL' || lot.freightType === freightFilter;

      return matchesSearch && matchesHub && matchesFreight;
    });
  }, [searchQuery, hubFilter, freightFilter]);

  const summary = useMemo(() => getB2cLotShipmentPnlSummary(filteredLots), [filteredLots]);

  const toggleExpand = (id: string) => {
    setExpandedLotId(expandedLotId === id ? null : id);
  };

  const getStatusBadge = (status: B2cLotStatus) => {
    switch (status) {
      case 'SOLD_OUT':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">SOLD OUT / SETTLED</span>;
      case 'FULFILLING':
      case 'ARRIVED_HUB':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">AT 3PL HUB / FULFILLING</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">ON VESSEL TRANSIT</span>;
    }
  };

  const getFreightBadge = (type: B2cFreightType) => {
    switch (type) {
      case 'OCEAN_40HC':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            <Ship className="w-3 h-3 text-blue-600" />
            Ocean 40HC Container
          </span>
        );
      case 'OCEAN_40FT':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            <Ship className="w-3 h-3 text-blue-600" />
            Ocean 40FT Container
          </span>
        );
      case 'AIR_EXPRESS':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
            <Plane className="w-3 h-3 text-purple-600" />
            Air Express Cargo
          </span>
        );
    }
  };

  const getHubFlag = (hub: string) => {
    switch (hub) {
      case 'UK': return '🇬🇧';
      case 'US': return '🇺🇸';
      case 'EU': return '🇪🇺';
      default: return '🌐';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Card & Commercial Policy Rule */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#17456F] via-[#12231B] to-[#1F3A2E] border-2 border-cyan-400/40 text-white shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-[#12231B] font-mono text-xs font-bold">
                COMMERCIAL POLICY
              </span>
              <span className="text-xs text-cyan-200 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                B2C P&amp;L Method: Lot / Shipment-Wise
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono">
                Postponed VAT Accounting (PVA) Shielded
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-['Montserrat'] tracking-tight flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5 text-cyan-300" />
              <span>B2C Retail Profit &amp; Loss Statement (Lot / Shipment-Wise)</span>
            </h2>
            <p className="text-xs text-white/80 max-w-4xl font-['Open_Sans'] leading-relaxed">
              Every production lot and shipping consignment is tracked as an autonomous profit center: Gross Retail GMV vs. Less VAT, Landed FOB Factory Cost, Ocean/Air Freight, 3PL Intake, Amazon FBA Fulfillment, and Allocated Performance CAC.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-center font-mono">
              <span className="text-[10px] text-gray-300 uppercase block">Blended Lot Margin</span>
              <span className="text-lg font-bold text-cyan-300">{summary.blendedMarginPct.toFixed(2)}%</span>
              <span className="text-[9px] text-emerald-300 block">Target: ≥25.0%</span>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-white/10 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Shipped Lots</span>
            <span className="text-base font-bold text-white">{summary.totalLots}</span>
            <span className="text-[10px] text-gray-400 block">{summary.totalUnitsShipped.toLocaleString()} units</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Gross GMV</span>
            <span className="text-base font-bold text-cyan-300">${summary.totalGrossSalesUsd.toLocaleString()}</span>
            <span className="text-[10px] text-rose-300 block">-${summary.totalVatRemittanceUsd.toLocaleString()} VAT</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Net Turnover</span>
            <span className="text-base font-bold text-[#C8A96A]">${summary.totalNetTurnoverUsd.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">100% Net Realized</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Landed COGS</span>
            <span className="text-base font-bold text-gray-200">${summary.totalFactoryCogsUsd.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">{((summary.totalFactoryCogsUsd / summary.totalNetTurnoverUsd) * 100).toFixed(1)}% of net</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Fulfillment &amp; Ads</span>
            <span className="text-base font-bold text-purple-300">${(summary.totalFbaPickPackUsd + summary.totalMarketingAdSpendUsd).toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">FBA + Paid CAC</span>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-400/40">
            <span className="text-[10px] text-cyan-300 block uppercase font-bold">Lot Net Profit</span>
            <span className="text-base font-bold text-emerald-400">${summary.totalNetProfitUsd.toLocaleString()}</span>
            <span className="text-[10px] text-cyan-300 block">{summary.blendedMarginPct.toFixed(1)}% Net Margin</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Controls */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Lot No (LOT-2026-...), Consignment No, Destination Hub, Carrier Vessel..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#17456F] outline-none font-mono text-gray-900"
          />
        </div>

        {/* Hub Filter */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          {(['ALL', 'UK', 'US', 'EU'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHubFilter(h)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                hubFilter === h
                  ? 'bg-[#17456F] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {h === 'ALL' ? 'All Hubs' : `${getHubFlag(h)} ${h} Hub`}
            </button>
          ))}
        </div>

        {/* Freight Mode Filter */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          {(['ALL', 'OCEAN_40HC', 'OCEAN_40FT', 'AIR_EXPRESS'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFreightFilter(f)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                freightFilter === f
                  ? 'bg-[#17456F] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f === 'ALL' ? 'All Freight' : f.replace('OCEAN_', 'Ocean ').replace('AIR_EXPRESS', 'Air Express')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Lot / Shipment-Wise Interactive Cards Ledger */}
      <div className="space-y-3">
        {filteredLots.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
            No B2C consignment lots matching the selected filter criteria.
          </div>
        ) : (
          filteredLots.map((lot) => {
            const isExpanded = expandedLotId === lot.id;
            return (
              <div
                key={lot.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-white border-[#17456F] shadow-md ring-1 ring-[#17456F]/20'
                    : 'bg-white border-[#DDE3DD] hover:border-gray-400 shadow-xs'
                }`}
              >
                {/* Lot Summary Row */}
                <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Lot & Consignment Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{getHubFlag(lot.hubLocation)}</span>
                      <span className="font-bold font-mono text-sm text-[#17456F]">
                        {lot.lotNumber}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-bold text-gray-900 text-sm font-['Montserrat']">
                        {lot.destinationHub}
                      </span>
                      {getStatusBadge(lot.status)}
                      {getFreightBadge(lot.freightType)}
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                      <span>Carrier: <strong className="text-gray-700">{lot.carrierVessel}</strong></span>
                      <span>Consignment: <strong className="font-mono text-gray-700">{lot.consignmentNumber}</strong></span>
                      <span>Shipped: <strong className="text-gray-900 font-mono">{lot.totalUnits.toLocaleString()} units</strong></span>
                      <span>Sold: <strong className="text-emerald-700 font-mono">{lot.unitsSold.toLocaleString()} ({((lot.unitsSold / lot.totalUnits) * 100).toFixed(0)}%)</strong></span>
                      <span>ETD: {lot.departureDate}</span>
                      <span>ETA: {lot.etaArrivalDate}</span>
                    </div>

                    {/* Sales Channels Distribution */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 font-mono uppercase">Sales Mix:</span>
                      {lot.channels.map((ch, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700">
                          {ch.channel}: <strong>{ch.unitsSold} pcs</strong> (${ch.grossSalesUsd.toLocaleString()})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Key Financial Indicators */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 font-mono text-right">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-sans">Net Turnover</span>
                      <span className="text-sm font-bold text-gray-900 block">
                        ${lot.netCommercialTurnoverUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        Gross: ${lot.grossSalesUsd.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-sans">Total Lot Costs</span>
                      <span className="text-sm font-bold text-gray-700 block">
                        ${lot.totalLotCostUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        Landed: ${lot.landedCostPerUnitUsd.toFixed(2)}/u
                      </span>
                    </div>

                    <div className="pl-3 border-l border-gray-200">
                      <span className="text-[10px] text-emerald-800 uppercase block font-sans font-bold">Lot Net Profit</span>
                      <span className="text-sm font-bold text-emerald-700 block">
                        +${lot.lotNetProfitUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        +${lot.profitPerUnitUsd.toFixed(2)}/u
                      </span>
                    </div>

                    <div className="pl-3 border-l border-gray-200 min-w-[90px] text-center">
                      <span className="text-[10px] text-gray-500 uppercase block font-sans font-bold">Lot Margin</span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          lot.isPolicyCompliant
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {lot.lotProfitMarginPct.toFixed(1)}%
                      </span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">
                        {lot.isPolicyCompliant ? '✓ Policy Passed' : '⚠️ Near Target'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(lot.id)}
                      className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 cursor-pointer"
                      title="Inspect Landed Unit Costing & Detailed Cost Breakdown"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Itemized Cost Sheet Drawer */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200 space-y-3 font-mono text-xs animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#17456F]" />
                        <span className="font-bold text-gray-800 uppercase text-[11px]">
                          Landed Unit Economics &amp; Expense Breakdown [{lot.lotNumber}]
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 font-sans">
                        <span>Vessel Tracking Status: <strong className="text-gray-900">{lot.vesselTrackingNote}</strong></span>
                      </div>
                    </div>

                    {/* Cost Breakdown Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#17456F] text-white text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Expense Line Item &amp; Operational Category</th>
                            <th className="py-2.5 px-3">Amount (USD)</th>
                            <th className="py-2.5 px-3">% of Net Turnover</th>
                            <th className="py-2.5 px-3">Operational Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700">
                          {lot.costBreakdown.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-2.5 px-3 font-bold text-gray-900">{item.name}</td>
                              <td className="py-2.5 px-3 font-bold text-gray-900">${item.amountUsd.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-gray-600 font-mono">
                                {item.pctOfNetRevenue.toFixed(2)}%
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 font-sans text-[11px]">{item.description}</td>
                            </tr>
                          ))}
                          <tr className="bg-cyan-50/60 font-bold text-gray-900 border-t-2 border-cyan-500">
                            <td className="py-2.5 px-3 text-cyan-950 font-bold">TOTAL LOT COSTS</td>
                            <td className="py-2.5 px-3 text-gray-900 font-bold">${lot.totalLotCostUsd.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-gray-800 font-mono">
                              {((lot.totalLotCostUsd / lot.netCommercialTurnoverUsd) * 100).toFixed(2)}%
                            </td>
                            <td className="py-2.5 px-3 text-cyan-900 font-sans text-[11px]">
                              Lot Net Profit: ${lot.lotNetProfitUsd.toLocaleString()} ({lot.lotProfitMarginPct.toFixed(1)}% net margin)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Per-Unit Unit Economics & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">Realized RRP / Unit</span>
                        <strong className="text-gray-900 text-xs">${lot.grossRrpPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">Net Revenue / Unit</span>
                        <strong className="text-gray-900 text-xs">${lot.netRevenuePerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">Landed COGS / Unit</span>
                        <strong className="text-gray-900 text-xs">${lot.landedCostPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">FBA &amp; Ad CAC / Unit</span>
                        <strong className="text-gray-900 text-xs">${lot.fulfillmentAndAdPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-800 block uppercase text-[10px]">Net Profit / Unit</span>
                        <strong className="text-emerald-900 text-xs">+${lot.profitPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
