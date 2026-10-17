'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  PosStoreLocationId,
  PosStoreLocation,
  PosTerminalMode,
  PosCartItem,
  PosCustomer,
  PosPaymentMethod,
  PosTransaction,
  PosRegisterShift
} from '@/types/pos';
import { ProductItem, ProductSector, CurrencyCode } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import { POS_STORES, INITIAL_POS_CUSTOMERS, INITIAL_POS_TRANSACTIONS, INITIAL_REGISTER_SHIFTS } from '@/data/initialPosData';
import { INITIAL_PRODUCTS } from '@/data/initialData';
import {
  Store,
  ShoppingBag,
  CreditCard,
  DollarSign,
  QrCode,
  Printer,
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  X,
  ChevronDown,
  Sliders,
  ArrowRight,
  UserCheck,
  RefreshCw,
  BarChart3,
  Receipt,
  Tag,
  Lock,
  History,
  Truck,
  Building2,
  Globe2,
  Percent,
  Banknote,
  Smartphone,
  ExternalLink,
  SlidersHorizontal,
  PackageCheck,
  Share2
} from 'lucide-react';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import { ArielMC, renderBrandText } from '@/lib/brand';

interface OmnichannelPosSuiteProps {
  products?: ProductItem[];
  theme?: ThemeProfile;
  initialStoreId?: PosStoreLocationId;
  onNavigateToOrders?: () => void;
}

export const OmnichannelPosSuite: React.FC<OmnichannelPosSuiteProps> = ({
  products = INITIAL_PRODUCTS,
  theme = 'crm-green',
  initialStoreId = 'LONDON_MAYFAIR',
  onNavigateToOrders,
}) => {
  // Store & Terminal Mode state
  const [activeStoreId, setActiveStoreId] = useState<PosStoreLocationId>(initialStoreId);
  const [terminalMode, setTerminalMode] = useState<PosTerminalMode>('B2B_WHOLESALE');
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'TRANSACTIONS' | 'DRAWER'>('REGISTER');

  // Active Store Object
  const currentStore = POS_STORES.find((s) => s.id === activeStoreId) || POS_STORES[0];

  // Active Register Shift State
  const [shifts, setShifts] = useState<Record<string, PosRegisterShift>>(INITIAL_REGISTER_SHIFTS);
  const currentShift = shifts[activeStoreId] || INITIAL_REGISTER_SHIFTS.LONDON_MAYFAIR;

  // Transactions State
  const [transactions, setTransactions] = useState<PosTransaction[]>(INITIAL_POS_TRANSACTIONS);

  // Customer selection
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer>(INITIAL_POS_CUSTOMERS[0]);
  const [isVatExemptOverride, setIsVatExemptOverride] = useState<boolean>(terminalMode === 'B2B_WHOLESALE');

  // Cart State
  const [cart, setCart] = useState<PosCartItem[]>([
    {
      id: 'cart-init-1',
      productId: products[0]?.id || 'prod_lth_01',
      sku: products[0]?.sku || 'AMC-LT2-LEA-BUR-SGL',
      name: products[0]?.name || 'ArielMC Style 2 Full Leather Tote - Burgundy',
      sector: products[0]?.sector || 'LEATHER',
      image: products[0]?.images?.[0] || '/images/leather_bag.png',
      priceMode: 'WHOLESALE',
      unitPrice: products[0]?.costing?.b2bFobPriceUsd || 42.0,
      wholesaleFobPrice: products[0]?.costing?.b2bFobPriceUsd || 42.0,
      retailMsrpPrice: products[0]?.costing?.d2cRetailPriceUsd || 110.0,
      factoryCostUsd: products[0]?.costing?.factoryCostUsd || 28.0,
      quantity: 25,
      moq: products[0]?.partnerFactory?.moq || 20,
      stockFloor: 12,
      stockBackroom: 45,
      stockHub: 1250,
    },
  ]);

  // Catalog Filtering
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [stockAvailabilityFilter, setStockAvailabilityFilter] = useState<'ALL' | 'ON_FLOOR' | 'HUB'>('ALL');

  // Checkout & Payment Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PosPaymentMethod>('CARD_TERMINAL');
  const [amountTenderedInput, setAmountTenderedInput] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Discount code state
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Completed Receipt Modal State
  const [viewingReceipt, setViewingReceipt] = useState<PosTransaction | null>(null);
  const [receiptPrintFormat, setReceiptPrintFormat] = useState<'THERMAL' | 'A4_DOCKET'>('THERMAL');
  const [isShareReceiptOpen, setIsShareReceiptOpen] = useState(false);

  // Barcode Scanner Simulator State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerNotification, setScannerNotification] = useState<string | null>(null);

  // Close Register Modal State
  const [isCloseDrawerModalOpen, setIsCloseDrawerModalOpen] = useState(false);
  const [actualCashCount, setActualCashCount] = useState<string>('');

  // Switch terminal mode automatically updates cart items pricing
  const handleToggleTerminalMode = (newMode: PosTerminalMode) => {
    setTerminalMode(newMode);
    setIsVatExemptOverride(newMode === 'B2B_WHOLESALE');
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        priceMode: newMode === 'B2B_WHOLESALE' ? 'WHOLESALE' : 'RETAIL',
        unitPrice: newMode === 'B2B_WHOLESALE' ? item.wholesaleFobPrice : item.retailMsrpPrice,
      }))
    );
  };

  // Add product to cart
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      const wholesalePrice = product.costing?.b2bFobPriceUsd || 40.0;
      const retailPrice = product.costing?.d2cRetailPriceUsd || 95.0;
      const initialQty = terminalMode === 'B2B_WHOLESALE' ? Math.max(10, product.partnerFactory?.moq || 10) : 1;

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + (terminalMode === 'B2B_WHOLESALE' ? 5 : 1) }
            : item
        );
      }

      const newItem: PosCartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        sector: product.sector,
        image: product.images?.[0] || '/images/leather_bag.png',
        priceMode: terminalMode === 'B2B_WHOLESALE' ? 'WHOLESALE' : 'RETAIL',
        unitPrice: terminalMode === 'B2B_WHOLESALE' ? wholesalePrice : retailPrice,
        wholesaleFobPrice: wholesalePrice,
        retailMsrpPrice: retailPrice,
        factoryCostUsd: product.costing?.factoryCostUsd || 25.0,
        quantity: initialQty,
        moq: product.partnerFactory?.moq || 10,
        stockFloor: Math.floor(Math.random() * 15) + 3,
        stockBackroom: Math.floor(Math.random() * 40) + 10,
        stockHub: Math.floor(Math.random() * 800) + 200,
      };

      return [newItem, ...prev];
    });

    setScannerNotification(`Added "${product.name.slice(0, 24)}..." to Terminal Cart`);
    setTimeout(() => setScannerNotification(null), 3000);
  };

  // Barcode simulation
  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(
      (p) =>
        p.eanBarcode?.toLowerCase() === barcodeInput.trim().toLowerCase() ||
        p.sku?.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matched) {
      handleAddToCart(matched);
      setBarcodeInput('');
    } else {
      setScannerNotification(`No SKU matching barcode "${barcodeInput}" found`);
      setTimeout(() => setScannerNotification(null), 3500);
    }
  };

  // Adjust item quantity
  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  // Toggle item pricing wholesale vs retail
  const handleToggleItemPriceMode = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newMode = item.priceMode === 'WHOLESALE' ? 'RETAIL' : 'WHOLESALE';
        return {
          ...item,
          priceMode: newMode,
          unitPrice: newMode === 'WHOLESALE' ? item.wholesaleFobPrice : item.retailMsrpPrice,
        };
      })
    );
  };

  // Apply Promo / Discount code
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setAppliedDiscountRate(0);
      setDiscountError(null);
      return;
    }
    if (code === 'VIP10' || code === 'HARRODS10') {
      setAppliedDiscountRate(0.10);
      setDiscountError(null);
    } else if (code === 'VOLUME5' || code === 'SUMMER5') {
      setAppliedDiscountRate(0.05);
      setDiscountError(null);
    } else if (code === 'ARIEL20' || code === 'DIRECTOR20') {
      setAppliedDiscountRate(0.20);
      setDiscountError(null);
    } else {
      setDiscountError('Invalid code. Try VIP10, VOLUME5, or HARRODS10');
    }
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return cartSubtotal * appliedDiscountRate;
  }, [cartSubtotal, appliedDiscountRate]);

  const taxAmount = useMemo(() => {
    if (isVatExemptOverride) return 0;
    return (cartSubtotal - discountAmount) * currentStore.vatRate;
  }, [cartSubtotal, discountAmount, isVatExemptOverride, currentStore.vatRate]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + taxAmount);
  }, [cartSubtotal, discountAmount, taxAmount]);

  // Overall Sourcing Gross Margin Lock Calculation (Mandatory rule: >= 25% - 30%)
  const overallMarginStats = useMemo(() => {
    let totalBuyerRevenue = 0;
    let totalFactoryCost = 0;

    cart.forEach((item) => {
      totalBuyerRevenue += item.unitPrice * item.quantity;
      totalFactoryCost += (item.factoryCostUsd || item.unitPrice * 0.65) * item.quantity;
    });

    const netMargin = totalBuyerRevenue - totalFactoryCost;
    const marginPct = totalBuyerRevenue > 0 ? (netMargin / totalBuyerRevenue) * 100 : 35;
    const isHealthy = marginPct >= 25;

    return {
      totalRevenue: totalBuyerRevenue,
      totalCost: totalFactoryCost,
      netMargin,
      marginPct: marginPct.toFixed(1),
      isHealthy,
    };
  }, [cart]);

  // Filtered Products Catalog
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        prod.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        prod.eanBarcode?.toLowerCase().includes(catalogSearch.toLowerCase());

      const matchSector = selectedSector === 'ALL' || prod.sector === selectedSector;

      return matchSearch && matchSector;
    });
  }, [products, catalogSearch, selectedSector]);

  // Process Completed Transaction
  const handleCompleteSale = () => {
    const tendered = Number(amountTenderedInput) || cartTotal;
    const change = Math.max(0, tendered - cartTotal);

    const newTxn: PosTransaction = {
      id: `txn-${Date.now()}`,
      receiptNumber: `REC-${currentStore.city.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      storeId: activeStoreId,
      mode: terminalMode,
      customer: selectedCustomer,
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      discountCode: appliedDiscountRate > 0 ? discountCode : undefined,
      taxAmount,
      totalAmount: cartTotal,
      currency: currentStore.currency,
      currencySymbol: currentStore.currencySymbol,
      paymentMethod: selectedPaymentMethod,
      amountTendered: tendered,
      changeDue: change,
      cashierName: currentShift.cashier,
      notes: paymentNotes || undefined,
    };

    // Update transactions log
    setTransactions((prev) => [newTxn, ...prev]);

    // Update Shift Totals
    setShifts((prev) => {
      const old = prev[activeStoreId] || currentShift;
      return {
        ...prev,
        [activeStoreId]: {
          ...old,
          totalSales: old.totalSales + cartTotal,
          totalOrders: old.totalOrders + 1,
          b2bOrdersCount: old.b2bOrdersCount + (terminalMode === 'B2B_WHOLESALE' ? 1 : 0),
          d2cOrdersCount: old.d2cOrdersCount + (terminalMode === 'D2C_RETAIL' ? 1 : 0),
          cashSales: selectedPaymentMethod === 'CASH' ? old.cashSales + cartTotal : old.cashSales,
          cardSales: selectedPaymentMethod === 'CARD_TERMINAL' || selectedPaymentMethod === 'APPLE_PAY' ? old.cardSales + cartTotal : old.cardSales,
          wireSales: selectedPaymentMethod === 'BANK_WIRE' ? old.wireSales + cartTotal : old.wireSales,
          cashExpected: selectedPaymentMethod === 'CASH' ? old.cashExpected + cartTotal : old.cashExpected,
        },
      };
    });

    // Clear cart and show receipt
    setCart([]);
    setIsCheckoutOpen(false);
    setAmountTenderedInput('');
    setPaymentNotes('');
    setViewingReceipt(newTxn);
  };

  // Reconcile and close shift
  const handleCloseShift = () => {
    const actual = Number(actualCashCount) || currentShift.cashExpected;
    const variance = actual - currentShift.cashExpected;

    setShifts((prev) => ({
      ...prev,
      [activeStoreId]: {
        ...prev[activeStoreId],
        closedAt: new Date().toISOString(),
        cashActual: actual,
        variance,
        status: 'CLOSED',
      },
    }));

    setIsCloseDrawerModalOpen(false);
  };

  // Reopen shift
  const handleReopenShift = () => {
    setShifts((prev) => ({
      ...prev,
      [activeStoreId]: {
        ...prev[activeStoreId],
        openedAt: new Date().toISOString(),
        status: 'OPEN',
      },
    }));
  };

  // Themes
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  const containerBg = isRoyal ? 'bg-[#0B132B] text-slate-100' : isHeritage ? 'bg-[#181208] text-[#F5EEDC]' : 'bg-[#0D1913] text-white';
  const headerBg = isRoyal ? 'bg-[#0F172A] border-slate-800' : isHeritage ? 'bg-[#261E10] border-[#8A6D3B]/40' : 'bg-[#162B22] border-[#2C5240]';
  const cardBg = isRoyal ? 'bg-slate-900/80 border-slate-800' : isHeritage ? 'bg-[#22180C] border-[#8A6D3B]/30' : 'bg-[#12231B] border-[#2C5240]';
  const terminalCartBg = isRoyal ? 'bg-slate-950/90 border-slate-800' : isHeritage ? 'bg-[#1C140A] border-[#8A6D3B]/40' : 'bg-[#0D1913] border-[#2C5240]';
  const accentGold = isRoyal ? 'text-blue-400' : 'text-[#C8A96A]';
  const accentBadge = isRoyal ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/30';

  return (
    <div className={`flex flex-col h-full min-h-screen ${containerBg} font-sans`}>
      
      {/* ========================================================
          1. TOP APP HEADER & SHOWROOM STATION SELECTOR
          ======================================================== */}
      <div className={`px-6 py-4 border-b ${headerBg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0`}>
        
        {/* Left: Brand Identity & Active Station */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/15 border border-[#C8A96A]/30 flex items-center justify-center p-2 shadow-xs">
            <Store className="w-6 h-6 text-[#C8A96A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${accentBadge}`}>
                PHASE 9: OMNICHANNEL POS
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Station Online (IndexedDB Synced)</span>
              </span>
            </div>
            <h1 className="text-xl font-bold font-heading text-white mt-0.5 flex items-center gap-1.5">
              <ArielMC />
              <span>Flagship Showroom &amp; Trade Suite POS</span>
            </h1>
          </div>
        </div>

        {/* Center: Mode Switcher (B2B Wholesale Trade vs D2C Retail) */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => handleToggleTerminalMode('B2B_WHOLESALE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              terminalMode === 'B2B_WHOLESALE'
                ? 'bg-[#1F3A2E] text-white shadow-md border border-[#C8A96A]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#C8A96A]" />
            <span>B2B Wholesale Showroom</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono">
              FOB / CIF -50%
            </span>
          </button>

          <button
            onClick={() => handleToggleTerminalMode('D2C_RETAIL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              terminalMode === 'D2C_RETAIL'
                ? 'bg-[#1F3A2E] text-white shadow-md border border-[#C8A96A]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C8A96A]" />
            <span>D2C Luxury Retail POS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Full MSRP
            </span>
          </button>
        </div>

        {/* Right: Station Selector & Register Shift Button */}
        <div className="flex items-center gap-3">
          {/* Store Location Dropdown */}
          <div className="relative">
            <select
              value={activeStoreId}
              onChange={(e) => setActiveStoreId(e.target.value as PosStoreLocationId)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-black/50 border border-white/20 text-xs font-semibold text-white focus:outline-none focus:border-[#C8A96A] transition-all cursor-pointer"
            >
              {POS_STORES.map((st) => (
                <option key={st.id} value={st.id} className="bg-[#12231B] text-white">
                  {st.flag} {st.city} &bull; {st.currency} ({st.currencySymbol})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Register Drawer Summary Button */}
          <button
            onClick={() => setIsCloseDrawerModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs text-[#CFE0D5] font-semibold transition-all"
            title="View cash drawer balance & shift reconciliation"
          >
            <Banknote className="w-4 h-4 text-[#C8A96A]" />
            <span className="hidden sm:inline">Drawer:</span>
            <span className="font-mono font-bold text-white">
              {currentStore.currencySymbol}{currentShift.cashExpected.toLocaleString()}
            </span>
          </button>

          {/* Tab Navigation: Register vs Transactions */}
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5">
            <button
              onClick={() => setActiveTab('REGISTER')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'REGISTER' ? 'bg-[#1F3A2E] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
              title="POS Register & Terminal"
            >
              <Store className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'TRANSACTIONS' ? 'bg-[#1F3A2E] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
              title="Sales History & Receipts"
            >
              <Receipt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barcode Simulator Notification Banner */}
      {scannerNotification && (
        <div className="bg-[#1F3A2E] text-[#CFE0D5] border-b border-[#C8A96A]/40 px-6 py-2 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{scannerNotification}</span>
          </div>
          <button onClick={() => setScannerNotification(null)} className="text-gray-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================
          2. MAIN REGISTER WORKSPACE: CATALOG + ACTIVE CART TERMINAL
          ======================================================== */}
      {activeTab === 'REGISTER' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT 60%: Omnichannel Product Catalog Browser */}
          <div className="flex-1 flex flex-col border-r border-[#2C5240]/60 overflow-hidden">
            
            {/* Catalog Filter Bar */}
            <div className={`p-4 border-b ${headerBg} flex flex-wrap items-center justify-between gap-3 shrink-0`}>
              
              {/* Live Search & Barcode Scanner */}
              <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search style name, SKU, or HS code..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A] transition-all"
                  />
                </div>

                {/* Instant Barcode Scan Form */}
                <form onSubmit={handleScanBarcode} className="relative w-44 hidden sm:block">
                  <QrCode className="w-4 h-4 text-[#C8A96A] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan EAN / Barcode..."
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-black/40 border border-[#C8A96A]/30 text-xs font-mono text-[#C8A96A] placeholder-amber-700/60 focus:outline-none focus:border-[#C8A96A] transition-all"
                  />
                </form>
              </div>

              {/* Sector Pills: LEATHER 💼, JUTE, APPAREL */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setSelectedSector('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedSector === 'ALL'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => setSelectedSector('LEATHER')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSector === 'LEATHER'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>💼</span>
                  <span>Leather Goods</span>
                </button>
                <button
                  onClick={() => setSelectedSector('JUTE')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSector === 'JUTE'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>🌿</span>
                  <span>Jute Luxury</span>
                </button>
                <button
                  onClick={() => setSelectedSector('TEXTILE')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    selectedSector === 'TEXTILE'
                      ? 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>🧵</span>
                  <span>Textile &amp; Apparel</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const wholesaleFob = prod.costing?.b2bFobPriceUsd || 40.0;
                const retailMsrp = prod.costing?.d2cRetailPriceUsd || 95.0;
                const discountPct = Math.round(((retailMsrp - wholesaleFob) / retailMsrp) * 100);

                const activeDisplayPrice = terminalMode === 'B2B_WHOLESALE' ? wholesaleFob : retailMsrp;

                // Sector Icon Rule: Leather is strictly 💼
                const sectorIcon = prod.sector === 'LEATHER' ? '💼' : prod.sector === 'JUTE' ? '🌿' : '🧵';

                return (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border ${cardBg} p-4 flex flex-col justify-between hover:border-[#C8A96A]/60 transition-all shadow-sm group`}
                  >
                    <div>
                      {/* Image Thumbnail & Sector Badge */}
                      <div className="relative w-full h-36 rounded-xl bg-black/40 overflow-hidden mb-3 border border-white/5">
                        <Image
                          src={prod.images?.[0] || '/images/leather_bag.png'}
                          alt={prod.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white">
                          <span>{sectorIcon}</span>
                          <span>{prod.sector}</span>
                        </div>
                        {terminalMode === 'B2B_WHOLESALE' && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                            -{discountPct}% Wholesale
                          </div>
                        )}
                      </div>

                      {/* Title & SKU */}
                      <h3 className="font-heading font-bold text-xs text-white line-clamp-2 leading-snug">
                        {renderBrandText(prod.name)}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1">
                        <span>SKU: {prod.sku}</span>
                        <span>MOQ: {prod.partnerFactory?.moq || 10}</span>
                      </div>

                      {/* Stock Level Strip */}
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px]">
                        <div className="text-gray-400">
                          Floor: <strong className="text-emerald-400">12</strong> &bull; Back: <strong className="text-white">45</strong>
                        </div>
                        <div className="text-gray-400 font-mono text-[10px]">
                          Hub: <strong className="text-blue-400">1,250</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Add Button */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          {terminalMode === 'B2B_WHOLESALE' ? 'Wholesale FOB' : 'Retail MSRP'}
                        </div>
                        <div className="text-base font-bold font-mono text-white flex items-baseline gap-1">
                          <span className="text-[#C8A96A]">{currentStore.currencySymbol}</span>
                          <span>{activeDisplayPrice.toFixed(2)}</span>
                          {terminalMode === 'B2B_WHOLESALE' && (
                            <span className="text-[10px] text-gray-400 line-through font-normal ml-1">
                              {currentStore.currencySymbol}{retailMsrp.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#CFE0D5] hover:text-white border border-[#C8A96A]/40 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 40%: Active POS Terminal & Cart Engine */}
          <div className={`w-full lg:w-[480px] ${terminalCartBg} flex flex-col justify-between overflow-hidden shrink-0`}>
            
            {/* Terminal Top: Customer & Trade Account Selector */}
            <div className={`p-4 border-b ${headerBg} space-y-3`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C8A96A] font-mono font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C8A96A]" />
                  <span>Customer / Trade Account:</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {selectedCustomer.tier} VIP
                </span>
              </div>

              {/* Customer Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedCustomer.id}
                  onChange={(e) => {
                    const cust = INITIAL_POS_CUSTOMERS.find((c) => c.id === e.target.value);
                    if (cust) setSelectedCustomer(cust);
                  }}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C8A96A] transition-all font-medium"
                >
                  {INITIAL_POS_CUSTOMERS.map((cust) => (
                    <option key={cust.id} value={cust.id} className="bg-[#12231B] text-white">
                      {cust.name} {cust.company ? `(${cust.company})` : ''} - {cust.type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sourcing Margin Protection Status (Wholesale Mode Rule: >= 25% - 30%) */}
              {terminalMode === 'B2B_WHOLESALE' && (
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  overallMarginStats.isHealthy
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                    <span className="font-semibold text-[11px]">Sourcing Margin Lock:</span>
                  </div>
                  <div className="font-mono font-bold">
                    {overallMarginStats.marginPct}% ({overallMarginStats.isHealthy ? 'HEALTHY' : 'BELOW 25% HURDLE'})
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 p-6">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mb-3 stroke-[1.5]" />
                  <p className="font-bold text-sm text-gray-400">Terminal Cart is Empty</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Select products from the showroom catalog or scan barcode to begin a B2B order or retail ticket.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    {/* Item Info */}
                    <div className="flex items-start gap-2.5">
                      <div className="relative w-12 h-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white line-clamp-1">
                          {renderBrandText(item.name)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {item.sku} &bull; {item.sector === 'LEATHER' ? '💼 Leather' : '🌿 Jute'}
                        </div>

                        {/* Price Mode Toggle Pill */}
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => handleToggleItemPriceMode(item.id)}
                            className="text-[9.5px] px-2 py-0.5 rounded font-mono font-bold bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/30 hover:bg-[#2C5240] transition-colors"
                            title="Toggle wholesale FOB vs retail MSRP price"
                          >
                            {item.priceMode}: {currentStore.currencySymbol}{item.unitPrice.toFixed(2)}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex flex-col items-end justify-between self-stretch">
                      <div className="text-sm font-bold font-mono text-white">
                        {currentStore.currencySymbol}{(item.unitPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-lg bg-black/60 border border-white/15 p-0.5 mt-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - (terminalMode === 'B2B_WHOLESALE' ? 5 : 1))}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + (terminalMode === 'B2B_WHOLESALE' ? 5 : 1))}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 0)}
                          className="p-1 text-gray-500 hover:text-rose-400 ml-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Terminal Bottom: Discounts, Totals & Tender Buttons */}
            <div className={`p-4 border-t ${headerBg} space-y-3 shrink-0`}>
              
              {/* Discount Code Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Promo code (e.g. VIP10, VOLUME5)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A96A] font-mono uppercase"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {discountError && (
                <div className="text-[10px] text-rose-400">{discountError}</div>
              )}

              {/* Subtotal & Taxes Breakdown */}
              <div className="space-y-1 text-xs text-gray-300 pt-1 border-t border-white/10 font-medium">
                <div className="flex items-center justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">
                    {currentStore.currencySymbol}{cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {appliedDiscountRate > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Discount ({appliedDiscountRate * 100}%):</span>
                    <span className="font-mono">
                      -{currentStore.currencySymbol}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>{currentStore.taxLabel}:</span>
                    <label className="text-[10px] text-gray-400 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVatExemptOverride}
                        onChange={(e) => setIsVatExemptOverride(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-900 text-emerald-500 w-3 h-3"
                      />
                      <span>Bonded / Zero</span>
                    </label>
                  </div>
                  <span className="font-mono text-white">
                    {currentStore.currencySymbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-white/15">
                  <span className="font-heading">Total Payable:</span>
                  <span className="font-mono text-[#C8A96A] text-xl">
                    {currentStore.currencySymbol}{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Checkout / Payment Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  disabled={cart.length === 0}
                  onClick={() => setCart([])}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  Clear Cart
                </button>

                <button
                  disabled={cart.length === 0}
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1F3A2E] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay &bull; Tender Sale</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. TRANSACTIONS LOG & SALES AUDIT TAB
          ======================================================== */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                Showroom Sales Ledger &amp; Customer Invoices
              </h2>
              <p className="text-xs text-gray-400">
                Audited real-time transactions synchronized with ArielMC Central PostgreSQL Ledger.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('REGISTER')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F3A2E] text-[#CFE0D5] hover:text-white text-xs font-semibold"
            >
              <Store className="w-4 h-4 text-[#C8A96A]" />
              <span>Back to POS Register</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold text-left">
                  <th className="p-3">Receipt #</th>
                  <th className="p-3">Date &amp; Time</th>
                  <th className="p-3">Store Station</th>
                  <th className="p-3">Channel Mode</th>
                  <th className="p-3">Client / Buyer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Total Amount</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#C8A96A]">{txn.receiptNumber}</td>
                    <td className="p-3 font-mono text-gray-300">{txn.date} {txn.time}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white">
                        {POS_STORES.find((s) => s.id === txn.storeId)?.city || txn.storeId}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        txn.mode === 'B2B_WHOLESALE'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {txn.mode}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{txn.customer.name}</div>
                      <div className="text-[10px] text-gray-400">{txn.customer.company || 'Private Client'}</div>
                    </td>
                    <td className="p-3 font-mono text-gray-300">
                      {txn.items.reduce((sum, it) => sum + it.quantity, 0)} pcs ({txn.items.length} styles)
                    </td>
                    <td className="p-3 font-mono text-gray-300">
                      {txn.paymentMethod}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white text-sm">
                      {txn.currencySymbol}{txn.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setViewingReceipt(txn)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                        title="Print or view receipt"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          4. PAYMENT & CHECKOUT TENDER MODAL
          ======================================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#12231B] border border-[#2C5240] text-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C8A96A]/20 text-[#C8A96A]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Tender Sale &amp; Settlement
                  </h3>
                  <div className="text-xs text-gray-400">
                    Station: {currentStore.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Balance Due Card */}
            <div className="p-4 rounded-xl bg-black/50 border border-[#C8A96A]/40 text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Total Amount Due:
              </div>
              <div className="text-3xl font-mono font-bold text-[#C8A96A] mt-1">
                {currentStore.currencySymbol}{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Client: <strong>{selectedCustomer.name}</strong> ({selectedCustomer.company || 'Retail Walk-In'})
              </div>
            </div>

            {/* Select Tender / Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#C8A96A] uppercase tracking-wider">
                Select Tender Method:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedPaymentMethod('CARD_TERMINAL')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedPaymentMethod === 'CARD_TERMINAL'
                      ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C8A96A]" />
                  <span>Card / Chip &amp; PIN</span>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('CASH')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedPaymentMethod === 'CASH'
                      ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <span>Cash Drawer</span>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('BANK_WIRE')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedPaymentMethod === 'BANK_WIRE'
                      ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>Bank Wire (EBL/Barclays)</span>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('APPLE_PAY')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedPaymentMethod === 'APPLE_PAY'
                      ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-400" />
                  <span>Apple / Google Pay</span>
                </button>

                {activeStoreId === 'DHAKA_FLAGSHIP' && (
                  <button
                    onClick={() => setSelectedPaymentMethod('BKASH_NAGAD')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      selectedPaymentMethod === 'BKASH_NAGAD'
                        ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-pink-400" />
                    <span>bKash / Nagad</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cash Tender Input & Change */}
            {selectedPaymentMethod === 'CASH' && (
              <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Amount Tendered:</span>
                  <input
                    type="number"
                    value={amountTenderedInput}
                    onChange={(e) => setAmountTenderedInput(e.target.value)}
                    placeholder={cartTotal.toString()}
                    className="w-32 px-2.5 py-1.5 rounded bg-black/60 border border-white/20 text-white font-mono text-right focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                {Number(amountTenderedInput) > cartTotal && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold pt-1 border-t border-white/10">
                    <span>Change Due to Client:</span>
                    <span className="font-mono text-sm">
                      {currentStore.currencySymbol}{(Number(amountTenderedInput) - cartTotal).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Note input */}
            <div>
              <span className="text-[11px] text-gray-400 font-medium">Order Notes / Packaging:</span>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. VIP branded gift wrap, hold for pickup..."
                className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C8A96A]"
              />
            </div>

            {/* Confirm Tender Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSale}
                className="px-5 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1F3A2E] text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Complete Sale &amp; Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. RECEIPT / SHOWROOM DOCKET MODAL
          ======================================================== */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#12231B] border border-[#2C5240] text-white p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#C8A96A]" />
                <h3 className="font-heading font-bold text-sm text-white">
                  Official Showroom Sales Receipt
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#C8A96A] text-[#1F3A2E] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsShareReceiptOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Share Receipt for Verification & Acknowledgement"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share (Verify / Ack)</span>
                </button>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-black/30 my-3 rounded-xl">
              <div
                id="pos-thermal-receipt"
                className="bg-white text-black p-5 rounded shadow-md w-72 text-[10px] font-mono leading-tight space-y-3"
              >
                {/* Header */}
                <div className="text-center pb-2 border-b border-dashed border-gray-400">
                  <div className="text-sm font-bold tracking-tight">
                    <ArielMC />
                  </div>
                  <div className="text-[8.5px] uppercase text-gray-700 font-sans mt-0.5">
                    {POS_STORES.find((s) => s.id === viewingReceipt.storeId)?.name}
                  </div>
                  <div className="text-[7.5px] text-gray-500 font-sans">
                    {POS_STORES.find((s) => s.id === viewingReceipt.storeId)?.address}
                  </div>
                  <div className="text-[7.5px] text-gray-500 font-sans">
                    Tel: {POS_STORES.find((s) => s.id === viewingReceipt.storeId)?.phone}
                  </div>
                </div>

                {/* Receipt Details */}
                <div className="space-y-0.5 text-[8.5px]">
                  <div>REC NO: <strong>{viewingReceipt.receiptNumber}</strong></div>
                  <div>DATE: {viewingReceipt.date} {viewingReceipt.time}</div>
                  <div>CASHIER: {viewingReceipt.cashierName}</div>
                  <div>CLIENT: {viewingReceipt.customer.name}</div>
                  <div>MODE: {viewingReceipt.mode}</div>
                </div>

                {/* Items */}
                <div className="border-t border-b border-dashed border-gray-400 py-1.5 space-y-1">
                  {viewingReceipt.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-start">
                      <div className="pr-2">
                        <div className="font-bold">{it.name.slice(0, 22)}</div>
                        <div className="text-[7.5px] text-gray-500">{it.sku} x{it.quantity}</div>
                      </div>
                      <div className="font-bold shrink-0">
                        {viewingReceipt.currencySymbol}{(it.unitPrice * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-0.5 text-[9px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{viewingReceipt.currencySymbol}{viewingReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  {viewingReceipt.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount:</span>
                      <span>-{viewingReceipt.currencySymbol}{viewingReceipt.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax/VAT:</span>
                    <span>{viewingReceipt.currencySymbol}{viewingReceipt.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-gray-400">
                    <span>TOTAL:</span>
                    <span>{viewingReceipt.currencySymbol}{viewingReceipt.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Tender ({viewingReceipt.paymentMethod}):</span>
                    <span>{viewingReceipt.currencySymbol}{viewingReceipt.amountTendered.toFixed(2)}</span>
                  </div>
                  {viewingReceipt.changeDue > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>Change:</span>
                      <span>{viewingReceipt.currencySymbol}{viewingReceipt.changeDue.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Footer Barcode Simulation */}
                <div className="text-center pt-2 border-t border-dashed border-gray-400 space-y-1">
                  <div className="font-mono text-center tracking-widest text-[8px] font-bold">
                    ||||| ||||||| |||| |||||||| ||||
                  </div>
                  <div className="text-[7px] text-gray-500">
                    THANK YOU FOR SHOPPING AT <ArielMC />
                  </div>
                  <div className="text-[6.5px] text-gray-400">
                    Return Policy: 14 Days with original receipt &amp; dustbag.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-gray-400 shrink-0">
              Receipt saved to ERP transaction database.
            </div>
          </div>
        </div>
      )}

      {/* Share POS Receipt Modal */}
      {viewingReceipt && (
        <ShareDocumentModal
          isOpen={isShareReceiptOpen}
          onClose={() => setIsShareReceiptOpen(false)}
          document={{
            id: `RECEIPT-${viewingReceipt.id}`,
            docCode: viewingReceipt.receiptNumber,
            documentNumber: viewingReceipt.receiptNumber,
            title: `ArielMC Official Sales Receipt - ${viewingReceipt.receiptNumber}`,
            category: 'Point-of-Sale Retail Receipt',
            section: 'COMMERCIAL_ORDERS',
            issuingAuthority: `ArielMC Flagship Showroom (${currentStore.name})`,
            station: (currentStore.operatingEntity === 'ARIEL_BD' ? 'ARIEL_DHAKA' : currentStore.operatingEntity) as any,
            countryCode: currentStore.country,
            issueDate: viewingReceipt.date || new Date().toISOString().split('T')[0],
            expiryDate: '2026-12-31',
            renewalLeadDays: 30,
            status: 'ACTIVE',
            fileFormat: 'PDF',
            fileSize: '450 KB',
            downloadUrl: '#',
            verified: true,
            uploadedBy: viewingReceipt.cashierName || 'Retail Cashier Desk',
            uploadedAt: `${viewingReceipt.date}T${viewingReceipt.time || '12:00:00'}Z`,
            verificationUrl: `https://erp.arielmc.com/verify-doc?code=${viewingReceipt.receiptNumber}&ack=true`,
            qrCodeData: `${viewingReceipt.receiptNumber}|${viewingReceipt.totalAmount}|VERIFIED`,
            tags: ['POS', 'Receipt', 'Retail', 'Verified Sale'],
            notes: `Official showroom point-of-sale transaction receipt for ${viewingReceipt.customer?.name || 'Walk-in Guest'} (${viewingReceipt.items.length} items, Total: ${viewingReceipt.currencySymbol}${viewingReceipt.totalAmount.toFixed(2)}).`,
            isStatutoryRequirement: true,
          }}
        />
      )}

      {/* ========================================================
          6. REGISTER SHIFT & CASH DRAWER RECONCILIATION MODAL
          ======================================================== */}
      {isCloseDrawerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#12231B] border border-[#2C5240] text-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#C8A96A]" />
                <h3 className="font-heading font-bold text-base text-white">
                  Cash Drawer &amp; Shift Reconciliation
                </h3>
              </div>
              <button
                onClick={() => setIsCloseDrawerModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shift Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-gray-400">Opening Float:</div>
                <div className="text-base font-bold font-mono text-white">
                  {currentStore.currencySymbol}{currentShift.openingFloat.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-gray-400">Total Shift Sales:</div>
                <div className="text-base font-bold font-mono text-[#C8A96A]">
                  {currentStore.currencySymbol}{currentShift.totalSales.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-gray-400">Cash Collected:</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {currentStore.currencySymbol}{currentShift.cashSales.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-gray-400">Card &amp; Wire Settlements:</div>
                <div className="text-base font-bold font-mono text-blue-400">
                  {currentStore.currencySymbol}{(currentShift.cardSales + currentShift.wireSales).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Expected Cash in Drawer */}
            <div className="p-3 rounded-xl bg-[#1F3A2E]/60 border border-[#C8A96A]/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#CFE0D5]">Expected Cash in Drawer:</span>
              <span className="text-lg font-mono font-bold text-[#C8A96A]">
                {currentStore.currencySymbol}{currentShift.cashExpected.toLocaleString()}
              </span>
            </div>

            {/* Actual Cash Count Input */}
            {currentShift.status === 'OPEN' && (
              <div className="space-y-1 text-xs">
                <label className="text-gray-300 font-semibold">Counted Cash Amount:</label>
                <input
                  type="number"
                  value={actualCashCount}
                  onChange={(e) => setActualCashCount(e.target.value)}
                  placeholder={currentShift.cashExpected.toString()}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Shift Status: <strong>{currentShift.status}</strong>
              </div>

              <div className="flex items-center gap-2">
                {currentShift.status === 'OPEN' ? (
                  <button
                    onClick={handleCloseShift}
                    className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
                  >
                    Close Shift &amp; Reconcile
                  </button>
                ) : (
                  <button
                    onClick={handleReopenShift}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                  >
                    Reopen Register Shift
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
