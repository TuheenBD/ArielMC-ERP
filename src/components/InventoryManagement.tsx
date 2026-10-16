'use client';

import React, { useState } from 'react';
import {
  WarehouseLocation,
  InventoryItem,
  StockTransferOrder,
  CurrencyRate,
  ProductSector,
  InventoryHealthStatus,
  StockAllocation
} from '@/types/erp';
import {
  INITIAL_WAREHOUSES,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STOCK_TRANSFERS
} from '@/data/initialInventory';
import {
  Boxes,
  Building2,
  Ship,
  Truck,
  ArrowRight,
  ArrowUpRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ShoppingBag,
  Store,
  DollarSign,
  Barcode,
  Sparkles,
  Download,
  Plus,
  RefreshCw,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Calendar,
  X,
  FileText,
  Anchor,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

interface InventoryManagementProps {
  activeCurrency: CurrencyRate;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  activeCurrency,
}) => {
  // Master state
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>(INITIAL_WAREHOUSES);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [transfers, setTransfers] = useState<StockTransferOrder[]>(INITIAL_STOCK_TRANSFERS);

  // View & Filter states
  const [activeSubTab, setActiveSubTab] = useState<'LEDGER' | 'WAREHOUSES' | 'TRANSFERS' | 'ALLOCATIONS'>('LEDGER');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string>('ALL');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<InventoryHealthStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [inspectItem, setInspectItem] = useState<InventoryItem | null>(null);
  const [editingAllocationItem, setEditingAllocationItem] = useState<InventoryItem | null>(null);
  const [allocationForm, setAllocationForm] = useState<StockAllocation>({
    amazonFbaQty: 0,
    shopifyD2cQty: 0,
    b2bWholesaleReservedQty: 0,
    showroomDisplayQty: 0,
  });

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFormData, setTransferFormData] = useState({
    sku: 'AMC-LEA-1612',
    sourceWarehouseCode: 'WH-BD-DAC',
    destinationWarehouseCode: 'WH-UK-FLX',
    unitsToTransfer: 300,
    channelDestination: 'AMAZON_FBA' as const,
    modeOfTransport: 'OCEAN_FREIGHT' as const,
    carrier: 'Maersk Line / Ocean Escort',
    trackingOrContainerNumber: 'MSKU-781920-5',
    departureDate: new Date().toISOString().split('T')[0],
    estimatedArrivalDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
    notes: 'Replenishment for Amazon UK & direct e-commerce buffer.',
  });

  // Price formatter in active currency
  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * activeCurrency.rateToUsd;
    return `${activeCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filtered Inventory calculation
  const filteredItems = inventoryItems.filter((item) => {
    const matchesWarehouse =
      selectedWarehouseFilter === 'ALL' || item.warehouseCode === selectedWarehouseFilter;
    const matchesSector =
      selectedSectorFilter === 'ALL' || item.sector === selectedSectorFilter;
    const matchesStatus =
      selectedStatusFilter === 'ALL' || item.healthStatus === selectedStatusFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provenance.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.warehouseName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesWarehouse && matchesSector && matchesStatus && matchesSearch;
  });

  // Aggregate Metrics
  const totalPhysicalOnHand = inventoryItems.reduce((acc, curr) => acc + curr.onHandQty, 0);
  const totalAvailableQty = inventoryItems.reduce((acc, curr) => acc + curr.availableQty, 0);
  const totalReservedQty = inventoryItems.reduce((acc, curr) => acc + curr.reservedQty, 0);
  const totalInTransitQty = inventoryItems.reduce((acc, curr) => acc + curr.inTransitQty, 0);
  const totalValuationUsd = inventoryItems.reduce((acc, curr) => acc + curr.totalValuationUsd, 0);

  const totalAmazonFbaUnits = inventoryItems.reduce(
    (acc, curr) => acc + curr.allocations.amazonFbaQty,
    0
  );
  const totalShopifyD2cUnits = inventoryItems.reduce(
    (acc, curr) => acc + curr.allocations.shopifyD2cQty,
    0
  );
  const totalB2bWholesaleUnits = inventoryItems.reduce(
    (acc, curr) => acc + curr.allocations.b2bWholesaleReservedQty,
    0
  );
  const totalShowroomUnits = inventoryItems.reduce(
    (acc, curr) => acc + curr.allocations.showroomDisplayQty,
    0
  );

  const criticalReorderCount = inventoryItems.filter(
    (i) => i.healthStatus === 'CRITICAL_REORDER' || i.healthStatus === 'LOW_STOCK'
  ).length;

  // Status Badge Helper
  const getHealthStatusBadge = (status: InventoryHealthStatus) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          label: 'Optimal Stock',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'LOW_STOCK':
        return {
          label: 'Low Buffer Warning',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'CRITICAL_REORDER':
        return {
          label: 'Critical Re-Order',
          color: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
          dot: 'bg-rose-500',
        };
      case 'OVERSTOCKED':
        return {
          label: 'Surplus Holding',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'IN_TRANSIT':
        return {
          label: 'En Route',
          color: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
        };
    }
  };

  const getSectorBadge = (sector: ProductSector) => {
    switch (sector) {
      case 'LEATHER':
        return {
          label: 'Leather Goods',
          color: 'bg-[#FBEED7] text-[#8A5A00] border-[#E8CD96]',
        };
      case 'JUTE':
        return {
          label: 'Jute & Fiber',
          color: 'bg-[#EAF3DE] text-[#2E6B18] border-[#BEDDA0]',
        };
      case 'TEXTILE':
        return {
          label: 'Handloom & Textiles',
          color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]',
        };
      case 'CERAMICS':
        return {
          label: 'Ceramics & Tableware',
          color: 'bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]',
        };
      default:
        return {
          label: 'Other Sector',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  // Open Allocation Edit Modal
  const handleOpenAllocationModal = (item: InventoryItem) => {
    setEditingAllocationItem(item);
    setAllocationForm({ ...item.allocations });
  };

  // Save Allocation
  const handleSaveAllocation = () => {
    if (!editingAllocationItem) return;
    const totalAllocated =
      allocationForm.amazonFbaQty +
      allocationForm.shopifyD2cQty +
      allocationForm.b2bWholesaleReservedQty +
      allocationForm.showroomDisplayQty;

    if (totalAllocated > editingAllocationItem.onHandQty) {
      alert(
        `Total allocated units (${totalAllocated.toLocaleString()}) cannot exceed total physical On-Hand units (${editingAllocationItem.onHandQty.toLocaleString()}).`
      );
      return;
    }

    setInventoryItems((prev) =>
      prev.map((i) =>
        i.id === editingAllocationItem.id
          ? {
              ...i,
              allocations: { ...allocationForm },
              reservedQty:
                allocationForm.b2bWholesaleReservedQty + allocationForm.amazonFbaQty,
              availableQty:
                i.onHandQty -
                (allocationForm.b2bWholesaleReservedQty + allocationForm.amazonFbaQty),
            }
          : i
      )
    );
    setEditingAllocationItem(null);
  };

  // Submit Stock Transfer
  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransfer: StockTransferOrder = {
      id: `sto-${Date.now()}`,
      transferOrderNumber: `STO-AMC-2026-${Math.floor(100 + Math.random() * 900)}`,
      sku: transferFormData.sku,
      productName:
        inventoryItems.find((i) => i.sku === transferFormData.sku)?.productName ||
        'ArielMC Export Product',
      sourceWarehouseCode: transferFormData.sourceWarehouseCode,
      destinationWarehouseCode: transferFormData.destinationWarehouseCode,
      unitsToTransfer: Number(transferFormData.unitsToTransfer),
      channelDestination: transferFormData.channelDestination,
      modeOfTransport: transferFormData.modeOfTransport,
      carrier: transferFormData.carrier,
      trackingOrContainerNumber: transferFormData.trackingOrContainerNumber,
      departureDate: transferFormData.departureDate,
      estimatedArrivalDate: transferFormData.estimatedArrivalDate,
      status: 'IN_TRANSIT',
      notes: transferFormData.notes,
    };

    setTransfers([newTransfer, ...transfers]);

    // Update source warehouse stock
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (
          item.sku === transferFormData.sku &&
          item.warehouseCode === transferFormData.sourceWarehouseCode
        ) {
          const newOnHand = Math.max(0, item.onHandQty - Number(transferFormData.unitsToTransfer));
          return {
            ...item,
            onHandQty: newOnHand,
            availableQty: Math.max(0, newOnHand - item.reservedQty),
            inTransitQty: item.inTransitQty + Number(transferFormData.unitsToTransfer),
          };
        }
        return item;
      })
    );

    setIsTransferModalOpen(false);
  };

  // Export Inventory CSV
  const handleExportCsv = () => {
    const headers = [
      'SKU',
      'Product Name',
      'Sector',
      'Category',
      'Warehouse Code',
      'Warehouse Name',
      'On Hand Qty',
      'Reserved Qty',
      'Available Qty (ATP)',
      'In Transit Qty',
      'Amazon FBA Allocation',
      'Shopify D2C Allocation',
      'B2B Wholesale Allocation',
      'Showroom Allocation',
      'Unit Cost (USD)',
      'Total Value (USD)',
      'Daily Run Rate',
      'Days Inventory Remaining',
      'Health Status',
      'Factory of Origin',
      'Raw Material Lot',
      'QC Certificate',
    ];

    const rows = inventoryItems.map((item) => [
      `"${item.sku}"`,
      `"${item.productName}"`,
      `"${item.sector}"`,
      `"${item.category}"`,
      `"${item.warehouseCode}"`,
      `"${item.warehouseName}"`,
      item.onHandQty,
      item.reservedQty,
      item.availableQty,
      item.inTransitQty,
      item.allocations.amazonFbaQty,
      item.allocations.shopifyD2cQty,
      item.allocations.b2bWholesaleReservedQty,
      item.allocations.showroomDisplayQty,
      item.unitCostUsd,
      item.totalValuationUsd,
      item.dailyRunRate,
      item.daysOfInventoryRemaining,
      `"${item.healthStatus}"`,
      `"${item.provenance.factoryName}"`,
      `"${item.provenance.rawMaterialLot}"`,
      `"${item.provenance.qcInspectionCertificate}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ArielMC_Global_Inventory_Ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title Bar */}
      <div className="rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] p-6 shadow-md text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-[#C8A96A] shadow-inner shrink-0">
              <Boxes className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
                  PHASE 7 LIVE PLATFORM
                </span>
                <span className="text-xs text-[#CFE0D5] flex items-center gap-1 font-medium">
                  <Globe2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                  Global Fulfillment Hierarchy: Dhaka Hub &rarr; Maritime Transit &rarr; 3PL &rarr; Amazon FBA
                </span>
              </div>
              <h1 className="text-2xl font-bold font-heading text-white mt-1">
                Multi-Location Global Inventory &amp; Omnichannel Allocation
              </h1>
              <p className="text-sm text-[#CFE0D5] mt-1 max-w-3xl">
                Real-time stock visibility across Bangladesh central transit corridors, ocean vessels en route, regional 3PL gateways (UK, US, EU, AU), and Amazon FBA fulfillment centers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-heading shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Stock Transfer</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all shadow-sm"
              title="Download Full Inventory Master CSV"
            >
              <Download className="w-4 h-4 text-[#C8A96A]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/15 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('LEDGER')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'LEDGER'
                ? 'bg-white text-[#1F3A2E] font-bold shadow-sm'
                : 'text-[#CFE0D5] hover:text-white hover:bg-white/10'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Master Stock Ledger ({inventoryItems.length} SKUs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('WAREHOUSES')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'WAREHOUSES'
                ? 'bg-white text-[#1F3A2E] font-bold shadow-sm'
                : 'text-[#CFE0D5] hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Global Warehouses ({warehouses.length} Facilities)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ALLOCATIONS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'ALLOCATIONS'
                ? 'bg-white text-[#1F3A2E] font-bold shadow-sm'
                : 'text-[#CFE0D5] hover:text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Omnichannel Allocation Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TRANSFERS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'TRANSFERS'
                ? 'bg-white text-[#1F3A2E] font-bold shadow-sm'
                : 'text-[#CFE0D5] hover:text-white hover:bg-white/10'
            }`}
          >
            <Ship className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Maritime &amp; In-Transit Corridors ({transfers.length})</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Stock Valuation */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>Total Stock Asset</span>
            <DollarSign className="w-4 h-4 text-[#1E6B3A]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1E6B3A] mt-1.5">
            {formatPrice(totalValuationUsd)}
          </div>
          <div className="text-[10px] text-[#6B7269] mt-1">
            USD ${(totalValuationUsd / 1000).toFixed(1)}k Book Value
          </div>
        </div>

        {/* Physical On Hand */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>On-Hand Physical</span>
            <Boxes className="w-4 h-4 text-[#1F3A2E]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-1.5">
            {totalPhysicalOnHand.toLocaleString()}{' '}
            <span className="text-xs text-[#6B7269] font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-[#2E6B18] mt-1 flex items-center gap-1 font-medium">
            <span>ATP: {totalAvailableQty.toLocaleString()} units free</span>
          </div>
        </div>

        {/* Floating Ocean Transit */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>On-Water Floating</span>
            <Ship className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#0284C7] mt-1.5">
            {totalInTransitQty.toLocaleString()}{' '}
            <span className="text-xs text-[#6B7269] font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-[#0284C7] mt-1">
            <span>3 Vessels Active</span>
          </div>
        </div>

        {/* Amazon FBA Allocation */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>Amazon FBA</span>
            <ShoppingBag className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#D97706] mt-1.5">
            {totalAmazonFbaUnits.toLocaleString()}{' '}
            <span className="text-xs text-[#6B7269] font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-[#6B7269] mt-1">
            {Math.round((totalAmazonFbaUnits / totalPhysicalOnHand) * 100)}% of Land Inventory
          </div>
        </div>

        {/* Shopify D2C Allocation */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>Shopify D2C</span>
            <Store className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#7C3AED] mt-1.5">
            {totalShopifyD2cUnits.toLocaleString()}{' '}
            <span className="text-xs text-[#6B7269] font-sans font-normal">units</span>
          </div>
          <div className="text-[10px] text-[#6B7269] mt-1">
            {Math.round((totalShopifyD2cUnits / totalPhysicalOnHand) * 100)}% Direct Luxury
          </div>
        </div>

        {/* Critical Reorder Warnings */}
        <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span>Stock Health Alert</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#DC2626] mt-1.5">
            {criticalReorderCount}{' '}
            <span className="text-xs text-[#6B7269] font-sans font-normal">SKUs Low</span>
          </div>
          <div className="text-[10px] text-[#DC2626] mt-1 font-semibold">
            <span>Trigger factory bulk PO</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: MASTER STOCK LEDGER */}
      {activeSubTab === 'LEDGER' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by SKU, Product Name, Category, Warehouse, or Factory of Origin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#C8A96A] bg-[#F8F6F2]/50 text-[#1A1A1A]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Warehouse Filter */}
              <select
                value={selectedWarehouseFilter}
                onChange={(e) => setSelectedWarehouseFilter(e.target.value)}
                className="text-xs border border-[#DDE3DD] rounded-lg px-2.5 py-2 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
              >
                <option value="ALL">All Warehouses ({warehouses.length})</option>
                {warehouses.map((wh) => (
                  <option key={wh.code} value={wh.code}>
                    {wh.flag} {wh.code} - {wh.city}
                  </option>
                ))}
              </select>

              {/* Sector Filter */}
              <select
                value={selectedSectorFilter}
                onChange={(e) => setSelectedSectorFilter(e.target.value as any)}
                className="text-xs border border-[#DDE3DD] rounded-lg px-2.5 py-2 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
              >
                <option value="ALL">All Sectors (4)</option>
                <option value="LEATHER">Leather Goods</option>
                <option value="JUTE">Jute &amp; Fiber</option>
                <option value="TEXTILE">Handloom &amp; Textiles</option>
                <option value="CERAMICS">Ceramics &amp; Tableware</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="text-xs border border-[#DDE3DD] rounded-lg px-2.5 py-2 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
              >
                <option value="ALL">All Stock Health Levels</option>
                <option value="OPTIMAL">Optimal Stock</option>
                <option value="LOW_STOCK">Low Stock Warning</option>
                <option value="CRITICAL_REORDER">Critical Reorder Required</option>
                <option value="OVERSTOCKED">Surplus</option>
              </select>
            </div>
          </div>

          {/* Master Inventory Table */}
          <div className="rounded-xl bg-white border border-[#DDE3DD] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DDE3DD] bg-[#F8F6F2] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider">
                    <th className="py-3 px-4">SKU / Sector</th>
                    <th className="py-3 px-4">Product Name &amp; Category</th>
                    <th className="py-3 px-4">Facility / Hub</th>
                    <th className="py-3 px-4 text-center">On Hand</th>
                    <th className="py-3 px-4 text-center">Committed</th>
                    <th className="py-3 px-4 text-center font-bold text-[#1F3A2E]">ATP (Free)</th>
                    <th className="py-3 px-4 text-center text-[#0284C7]">In Transit</th>
                    <th className="py-3 px-4">Omnichannel Allocation</th>
                    <th className="py-3 px-4 text-center">Run Rate / DOIR</th>
                    <th className="py-3 px-4 text-right">Valuation ({activeCurrency.code})</th>
                    <th className="py-3 px-4 text-center">Health Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-xs">
                  {filteredItems.map((item) => {
                    const health = getHealthStatusBadge(item.healthStatus);
                    const sectorBadge = getSectorBadge(item.sector);
                    const isLow = item.healthStatus === 'CRITICAL_REORDER' || item.healthStatus === 'LOW_STOCK';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#F4F6F4]/60 transition-colors ${
                          isLow ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        {/* SKU & Sector */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-[#1F3A2E] text-xs">
                            {item.sku}
                          </div>
                          <span
                            className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sectorBadge.color}`}
                          >
                            {sectorBadge.label}
                          </span>
                        </td>

                        {/* Product Name & Category */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-[#1A1A1A] line-clamp-1">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-[#6B7269] mt-0.5">
                            {item.category}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                            <span>Origin: {item.provenance.cluster}</span>
                          </div>
                        </td>

                        {/* Facility / Hub */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                            <span className="text-sm">
                              {warehouses.find((w) => w.code === item.warehouseCode)?.flag || '🏢'}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#1F3A2E]">
                              {item.warehouseCode}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#6B7269] truncate max-w-[140px]">
                            {item.warehouseName}
                          </div>
                        </td>

                        {/* On Hand */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1A1A1A]">
                          {item.onHandQty.toLocaleString()}
                        </td>

                        {/* Committed / Reserved */}
                        <td className="py-3.5 px-4 text-center font-mono text-amber-700">
                          {item.reservedQty.toLocaleString()}
                        </td>

                        {/* ATP Free */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40">
                          {item.availableQty.toLocaleString()}
                        </td>

                        {/* In Transit */}
                        <td className="py-3.5 px-4 text-center font-mono text-[#0284C7]">
                          {item.inTransitQty > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-semibold">
                              <Ship className="w-3 h-3" />
                              +{item.inTransitQty.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Omnichannel Allocation Breakdown */}
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                              <span>FBA: {item.allocations.amazonFbaQty}</span>
                              <span>D2C: {item.allocations.shopifyD2cQty}</span>
                              <span>B2B: {item.allocations.b2bWholesaleReservedQty}</span>
                              <span>Show: {item.allocations.showroomDisplayQty}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
                              <div
                                style={{
                                  width: `${(item.allocations.amazonFbaQty / item.onHandQty) * 100}%`,
                                }}
                                className="bg-[#D97706]"
                                title={`Amazon FBA: ${item.allocations.amazonFbaQty} units`}
                              />
                              <div
                                style={{
                                  width: `${(item.allocations.shopifyD2cQty / item.onHandQty) * 100}%`,
                                }}
                                className="bg-[#7C3AED]"
                                title={`Shopify D2C: ${item.allocations.shopifyD2cQty} units`}
                              />
                              <div
                                style={{
                                  width: `${(item.allocations.b2bWholesaleReservedQty / item.onHandQty) * 100}%`,
                                }}
                                className="bg-[#1E6B3A]"
                                title={`B2B Wholesale: ${item.allocations.b2bWholesaleReservedQty} units`}
                              />
                              <div
                                style={{
                                  width: `${(item.allocations.showroomDisplayQty / item.onHandQty) * 100}%`,
                                }}
                                className="bg-[#0284C7]"
                                title={`Showroom: ${item.allocations.showroomDisplayQty} units`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Velocity & DOIR */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="font-mono text-xs text-[#1A1A1A]">
                            {item.dailyRunRate} pcs/day
                          </div>
                          <div
                            className={`text-[10px] font-bold mt-0.5 ${
                              item.daysOfInventoryRemaining <= 10
                                ? 'text-rose-600'
                                : item.daysOfInventoryRemaining <= 25
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {item.daysOfInventoryRemaining} Days Left
                          </div>
                        </td>

                        {/* Valuation */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-mono font-bold text-[#1E6B3A]">
                            {formatPrice(item.totalValuationUsd)}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            @ ${item.unitCostUsd.toFixed(2)} USD
                          </div>
                        </td>

                        {/* Health Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${health.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
                            {health.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectItem(item)}
                              className="px-2 py-1 rounded bg-[#E8F0EA] hover:bg-[#D4E4D7] text-[#1F3A2E] text-[11px] font-semibold border border-[#BEDDA0] transition-colors"
                              title="Inspect Raw Hide/Fabric Lot & Provenance"
                            >
                              Trace
                            </button>
                            <button
                              onClick={() => handleOpenAllocationModal(item)}
                              className="px-2 py-1 rounded bg-[#FEF6E4] hover:bg-[#FBE3B0] text-[#7A5508] text-[11px] font-semibold border border-[#FBE3B0] transition-colors"
                              title="Adjust Omnichannel Allocation (Amazon FBA vs Shopify vs B2B)"
                            >
                              Allocate
                            </button>
                          </div>
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

      {/* VIEW 2: GLOBAL WAREHOUSES DIRECTORY */}
      {activeSubTab === 'WAREHOUSES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((wh) => {
              const itemsInWh = inventoryItems.filter((i) => i.warehouseCode === wh.code);
              const totalValuationInWh = itemsInWh.reduce(
                (acc, curr) => acc + curr.totalValuationUsd,
                0
              );
              const totalUnitsInWh = itemsInWh.reduce((acc, curr) => acc + curr.onHandQty, 0);

              return (
                <div
                  key={wh.code}
                  className="rounded-xl bg-white border border-[#DDE3DD] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{wh.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#1F3A2E] text-white">
                            {wh.code}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold uppercase">
                            {wh.type.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-sm text-[#1A1A1A] mt-1">
                          {wh.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7269] mt-2 line-clamp-1">{wh.address}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#DDE3DD] text-xs">
                    <div>
                      <div className="text-[10px] text-[#6B7269] uppercase font-semibold">
                        Stocked SKUs
                      </div>
                      <div className="font-bold text-[#1A1A1A] font-mono mt-0.5">
                        {itemsInWh.length} Active SKUs
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {totalUnitsInWh.toLocaleString()} Physical Pcs
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B7269] uppercase font-semibold">
                        Facility Value
                      </div>
                      <div className="font-bold text-[#1E6B3A] font-mono mt-0.5">
                        {formatPrice(totalValuationInWh)}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {wh.climateControlled ? '❄️ Climate Monitored' : 'Standard Ambience'}
                      </div>
                    </div>
                  </div>

                  {/* Utilization bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-[#6B7269] mb-1">
                      <span>CBM Capacity: {wh.capacityCbm} m³</span>
                      <span className="font-bold text-[#1F3A2E]">{wh.currentUtilizationPct}% Utilized</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        style={{ width: `${wh.currentUtilizationPct}%` }}
                        className={`h-full rounded-full ${
                          wh.currentUtilizationPct > 85
                            ? 'bg-rose-500'
                            : wh.currentUtilizationPct > 70
                            ? 'bg-amber-500'
                            : 'bg-[#1E6B3A]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DDE3DD] flex items-center justify-between text-xs text-[#6B7269]">
                    <div className="truncate max-w-[180px]">
                      <span className="font-semibold text-[#1A1A1A]">Op:</span> {wh.operator}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedWarehouseFilter(wh.code);
                        setActiveSubTab('LEDGER');
                      }}
                      className="flex items-center gap-1 text-[#1F3A2E] hover:text-[#C8A96A] font-semibold text-xs"
                    >
                      <span>View Stock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: OMNICHANNEL ALLOCATION MATRIX */}
      {activeSubTab === 'ALLOCATIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
            <h3 className="font-heading font-bold text-sm text-[#1F3A2E] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C8A96A]" />
              Omnichannel Stock Balancing Strategy
            </h3>
            <p className="text-xs text-[#6B7269] mt-1">
              Distribute physical landed inventory across Amazon FBA fulfillment channels, direct high-margin Shopify luxury store (`arielmc.shop`), B2B Wholesale pre-allocated buyer contracts, and flagship showroom displays.
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[#DDE3DD] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DDE3DD] bg-[#F8F6F2] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider">
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4">Warehouse</th>
                  <th className="py-3 px-4 text-center">Total On Hand</th>
                  <th className="py-3 px-4 text-center text-[#D97706]">Amazon FBA</th>
                  <th className="py-3 px-4 text-center text-[#7C3AED]">Shopify D2C</th>
                  <th className="py-3 px-4 text-center text-[#1E6B3A]">B2B Wholesale</th>
                  <th className="py-3 px-4 text-center text-[#0284C7]">Showroom</th>
                  <th className="py-3 px-4 text-center">Free Unallocated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-xs">
                {inventoryItems.map((item) => {
                  const totalAlloc =
                    item.allocations.amazonFbaQty +
                    item.allocations.shopifyD2cQty +
                    item.allocations.b2bWholesaleReservedQty +
                    item.allocations.showroomDisplayQty;
                  const freeUnallocated = item.onHandQty - totalAlloc;

                  return (
                    <tr key={item.id} className="hover:bg-[#F4F6F4]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#1F3A2E] text-xs">
                          {item.sku}
                        </div>
                        <div className="font-medium text-[#1A1A1A] line-clamp-1">
                          {item.productName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-gray-700">
                        {item.warehouseCode}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1A1A1A]">
                        {item.onHandQty.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#D97706] bg-amber-50/30">
                        {item.allocations.amazonFbaQty.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#7C3AED] bg-purple-50/30">
                        {item.allocations.shopifyD2cQty.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1E6B3A] bg-emerald-50/30">
                        {item.allocations.b2bWholesaleReservedQty.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0284C7] bg-sky-50/30">
                        {item.allocations.showroomDisplayQty.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {freeUnallocated > 0 ? (
                          <span className="text-emerald-700 font-bold">
                            {freeUnallocated.toLocaleString()} free
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAllocationModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Re-Balance
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: MARITIME & STOCK TRANSFERS */}
      {activeSubTab === 'TRANSFERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#1F3A2E] flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#0284C7]" />
              Active Maritime Shipments &amp; Inbound Transfer Orders
            </h3>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A96A] text-[#1F3A2E] font-bold text-xs shadow-sm hover:bg-[#b59556]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Transfer Order</span>
            </button>
          </div>

          <div className="space-y-3">
            {transfers.map((sto) => (
              <div
                key={sto.id}
                className="rounded-xl bg-white border border-[#DDE3DD] p-5 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] shrink-0">
                      <Ship className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#1F3A2E] text-white">
                          {sto.transferOrderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                          {sto.modeOfTransport.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Channel: {sto.channelDestination}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1A1A1A] mt-1.5">
                        {sto.productName} ({sto.sku})
                      </h4>
                      <p className="text-xs text-[#6B7269] mt-0.5">
                        Carrier: <span className="font-semibold text-[#1A1A1A]">{sto.carrier}</span> | Container/Airway: <span className="font-mono text-[#1F3A2E]">{sto.trackingOrContainerNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                      <div className="text-[10px] text-[#6B7269] uppercase font-semibold">
                        Corridor
                      </div>
                      <div className="font-mono font-bold text-[#1A1A1A] mt-0.5">
                        {sto.sourceWarehouseCode} &rarr; {sto.destinationWarehouseCode}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        ETD: {sto.departureDate} | ETA: {sto.estimatedArrivalDate}
                      </div>
                    </div>

                    <div className="text-right pl-4 border-l border-[#DDE3DD]">
                      <div className="text-[10px] text-[#6B7269] uppercase font-semibold">
                        Units in Transit
                      </div>
                      <div className="font-mono font-bold text-base text-[#0284C7] mt-0.5">
                        {sto.unitsToTransfer.toLocaleString()}{' '}
                        <span className="text-xs font-normal">pcs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {sto.notes && (
                  <div className="mt-3 pt-3 border-t border-[#DDE3DD] text-[11px] text-[#6B7269] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                    <span>{sto.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: BATCH PROVENANCE & RAW MATERIAL TRACEABILITY */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] max-w-xl w-full p-6 text-[#1A1A1A] relative">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#E8F0EA] text-[#1F3A2E] border border-[#BEDDA0]">
                <ShieldCheck className="w-6 h-6 text-[#1E6B3A]" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  GS1 / REACH PROVENANCE
                </span>
                <h3 className="font-heading font-bold text-base text-[#1F3A2E] mt-1">
                  Batch &amp; Raw Material Traceability
                </h3>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B7269]">SKU / Product:</span>
                <span className="font-mono font-bold text-[#1F3A2E]">{inspectItem.sku}</span>
              </div>
              <div className="font-semibold text-[#1A1A1A]">{inspectItem.productName}</div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-[#DDE3DD] space-y-2">
                <div className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#C8A96A]" />
                  <span>Manufacturing Facility of Origin</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">Factory:</span>{' '}
                    <span className="font-semibold">{inspectItem.provenance.factoryName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Factory Code:</span>{' '}
                    <span className="font-mono font-bold text-[#1F3A2E]">
                      {inspectItem.provenance.factoryCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Industrial Cluster:</span>{' '}
                    <span className="font-medium">{inspectItem.provenance.cluster}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Production Date:</span>{' '}
                    <span className="font-mono">{inspectItem.provenance.productionDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#DDE3DD] space-y-2">
                <div className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  <Barcode className="w-4 h-4 text-[#C8A96A]" />
                  <span>Raw Material Lot &amp; Tannery / Loom Trace</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">Batch Number:</span>{' '}
                    <span className="font-mono font-bold text-[#1A1A1A]">
                      {inspectItem.provenance.batchNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Raw Lot #:</span>{' '}
                    <span className="font-mono font-bold text-amber-700">
                      {inspectItem.provenance.rawMaterialLot}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Compliance Audit Standard:</span>{' '}
                    <span className="font-semibold text-emerald-800">
                      {inspectItem.provenance.complianceRating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quality Assurance Inspection Pass</span>
                </div>
                <div className="text-[11px] text-emerald-950 flex justify-between">
                  <span>Certificate: <strong className="font-mono">{inspectItem.provenance.qcInspectionCertificate}</strong></span>
                  <span>Auditor: <strong>{inspectItem.provenance.inspectorName}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold"
              >
                Close Provenance Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST OMNICHANNEL STOCK ALLOCATION */}
      {editingAllocationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] max-w-lg w-full p-6 text-[#1A1A1A] relative">
            <button
              onClick={() => setEditingAllocationItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0]">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  STOCK RE-BALANCING
                </span>
                <h3 className="font-heading font-bold text-base text-[#1F3A2E] mt-1">
                  Adjust Channel Allocations
                </h3>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] text-xs">
              <div className="font-mono font-bold text-[#1F3A2E]">
                {editingAllocationItem.sku} &mdash; {editingAllocationItem.warehouseCode}
              </div>
              <div className="text-gray-700 font-medium mt-0.5">
                {editingAllocationItem.productName}
              </div>
              <div className="mt-2 flex items-center justify-between font-mono pt-2 border-t border-[#DDE3DD]">
                <span>Total On-Hand: <strong>{editingAllocationItem.onHandQty} pcs</strong></span>
                <span>
                  Remaining Free:{' '}
                  <strong className="text-emerald-700">
                    {editingAllocationItem.onHandQty -
                      (allocationForm.amazonFbaQty +
                        allocationForm.shopifyD2cQty +
                        allocationForm.b2bWholesaleReservedQty +
                        allocationForm.showroomDisplayQty)}{' '}
                    pcs
                  </strong>
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Amazon FBA Dedicated Pool (pcs):
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingAllocationItem.onHandQty}
                  value={allocationForm.amazonFbaQty}
                  onChange={(e) =>
                    setAllocationForm({
                      ...allocationForm,
                      amazonFbaQty: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-sm font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Shopify Luxury Direct (arielmc.shop) (pcs):
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingAllocationItem.onHandQty}
                  value={allocationForm.shopifyD2cQty}
                  onChange={(e) =>
                    setAllocationForm({
                      ...allocationForm,
                      shopifyD2cQty: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-sm font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  B2B Wholesale Pre-Contracted Reserve (pcs):
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingAllocationItem.onHandQty}
                  value={allocationForm.b2bWholesaleReservedQty}
                  onChange={(e) =>
                    setAllocationForm({
                      ...allocationForm,
                      b2bWholesaleReservedQty: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-sm font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Showroom &amp; VIP Sampling Pool (pcs):
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingAllocationItem.onHandQty}
                  value={allocationForm.showroomDisplayQty}
                  onChange={(e) =>
                    setAllocationForm({
                      ...allocationForm,
                      showroomDisplayQty: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-sm font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingAllocationItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllocation}
                className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow"
              >
                Save New Allocations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW STOCK TRANSFER */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] max-w-xl w-full p-6 text-[#1A1A1A] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  INTER-WAREHOUSE CORRIDOR
                </span>
                <h3 className="font-heading font-bold text-base text-[#1F3A2E] mt-1">
                  Issue Inbound Stock Transfer Order
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Product SKU to Transfer:
                </label>
                <select
                  value={transferFormData.sku}
                  onChange={(e) => setTransferFormData({ ...transferFormData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.sku} &mdash; {item.productName} (Avail: {item.availableQty} pcs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Origin Warehouse:
                  </label>
                  <select
                    value={transferFormData.sourceWarehouseCode}
                    onChange={(e) =>
                      setTransferFormData({ ...transferFormData, sourceWarehouseCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.code} value={wh.code}>
                        {wh.flag} {wh.code} ({wh.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Destination Warehouse:
                  </label>
                  <select
                    value={transferFormData.destinationWarehouseCode}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        destinationWarehouseCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.code} value={wh.code}>
                        {wh.flag} {wh.code} ({wh.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Units to Dispatch:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={transferFormData.unitsToTransfer}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        unitsToTransfer: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-sm font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Channel Purpose:
                  </label>
                  <select
                    value={transferFormData.channelDestination}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        channelDestination: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="AMAZON_FBA">Amazon FBA Stock Pool</option>
                    <option value="SHOPIFY_D2C">Shopify Direct Storefront</option>
                    <option value="B2B_WHOLESALE">B2B Wholesale Pre-Order</option>
                    <option value="SHOWROOM">Showroom Showcase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Transport Mode:
                  </label>
                  <select
                    value={transferFormData.modeOfTransport}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        modeOfTransport: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="OCEAN_FREIGHT">Ocean Freight (Container)</option>
                    <option value="AIR_CARGO">Air Cargo Express</option>
                    <option value="DOMESTIC_DRAYAGE">Domestic Drayage / Courier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Carrier / Vessel:
                  </label>
                  <input
                    type="text"
                    required
                    value={transferFormData.carrier}
                    onChange={(e) =>
                      setTransferFormData({ ...transferFormData, carrier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Container # / Airway Bill:
                  </label>
                  <input
                    type="text"
                    required
                    value={transferFormData.trackingOrContainerNumber}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        trackingOrContainerNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg font-mono text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Estimated Arrival Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={transferFormData.estimatedArrivalDate}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        estimatedArrivalDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Logistics Instructions / Notes:
                </label>
                <textarea
                  rows={2}
                  value={transferFormData.notes}
                  onChange={(e) =>
                    setTransferFormData({ ...transferFormData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#DDE3DD] rounded-lg text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-md"
                >
                  Confirm &amp; Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
