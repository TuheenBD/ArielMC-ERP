'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BuyerSalesOrder,
  CrmLead,
  SupplierFactory,
  ProductItem,
  CompanyEntity,
  CurrencyRate,
  OrderStatus,
  ProductSector,
  EntityCode,
} from '@/types/erp';
import { BuyerPortfolio } from '@/types/buyerPortfolio';
import { INITIAL_BUYER_PORTFOLIOS } from '@/data/initialBuyerPortfolios';
import { fetchBuyerPortfolios, persistBuyerPortfolios } from '@/lib/erpPersistence';
import { BuyerPortfolioModal } from './BuyerPortfolioModal';
import { ThemeProfile, ActiveTab } from '@/components/Sidebar';
import { ArielMC } from '@/lib/brand';
import { DocumentType } from '@/components/OfficialDocumentCenter';
import {
  TrendingUp,
  DollarSign,
  Repeat,
  Users2,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Globe2,
  ShieldCheck,
  ExternalLink,
  X,
  Percent,
  ChevronRight,
  Award,
  ArrowRight,
  Store,
  Send,
  Sparkles,
  Calendar,
  Layers,
  Printer,
  Share2,
  Eye,
  BadgePercent,
  Briefcase,
  FileCheck,
  Factory,
  Ship,
  PhoneCall,
  Mail,
  Copy,
  Check,
  ChevronDown,
  Scale,
  Star,
} from 'lucide-react';

export type SalesSubTab = 
  | 'OVERVIEW' 
  | 'ORDERS' 
  | 'QUOTATIONS_PI' 
  | 'BUYERS' 
  | 'PIPELINE' 
  | 'TARGETS';

interface SalesManagementProps {
  orders: BuyerSalesOrder[];
  crmLeads: CrmLead[];
  factories: SupplierFactory[];
  products: ProductItem[];
  activeEntity: CompanyEntity;
  activeCurrency: CurrencyRate;
  currencies?: CurrencyRate[];
  onNavigateTab: (tab: ActiveTab) => void;
  onAddOrder?: (newOrder: BuyerSalesOrder) => void;
  onOpenDocumentCenter?: (initialType?: DocumentType, orderId?: string) => void;
  theme?: ThemeProfile;
  initialSubTab?: SalesSubTab;
  initialBuyerCompany?: string;
  onSubTabChange?: (tab: SalesSubTab) => void;
  favoritePages?: string[];
  onToggleFavorite?: (id: string) => void;
}

// Representative commercial Proforma Invoices & Quotations
interface QuotationPIItem {
  id: string;
  piNumber: string;
  soNumberRef?: string;
  buyerCompany: string;
  buyerContact: string;
  market: 'UK' | 'US' | 'EU' | 'AU';
  entity: EntityCode;
  currency: 'GBP' | 'USD' | 'EUR' | 'AUD';
  totalValue: number;
  totalValueUsd: number;
  sector: ProductSector;
  styleName: string;
  quantity: number;
  incoterm: string;
  paymentTerms: string;
  issueDate: string;
  validUntil: string;
  status: 'ACCEPTED_CONFIRMED' | 'UNDER_REVIEW' | 'LC_PENDING' | 'DRAFT';
}

const INITIAL_QUOTATIONS_PI: QuotationPIItem[] = [
  {
    id: 'pi-001',
    piNumber: 'PI-2026-AMC-HARRODS-01',
    soNumberRef: 'SO-2026-UK-001',
    buyerCompany: 'Harrods London',
    buyerContact: 'Eleanor Vance (Senior Buyer)',
    market: 'UK',
    entity: 'ARIEL_UK',
    currency: 'GBP',
    totalValue: 67500,
    totalValueUsd: 87750,
    sector: 'LEATHER',
    styleName: 'Artisan Full-Grain Messenger Bag',
    quantity: 1500,
    incoterm: 'FOB Chittagong Port (BDCGP)',
    paymentTerms: 'Confirmed Irrevocable L/C 90-Days',
    issueDate: '2026-09-18',
    validUntil: '2026-11-15',
    status: 'ACCEPTED_CONFIRMED',
  },
  {
    id: 'pi-002',
    piNumber: 'PI-2026-AMC-RALPH-02',
    soNumberRef: 'SO-2026-US-002',
    buyerCompany: 'Ralph Lauren Corporation',
    buyerContact: 'Marcus Thorne (Global Procurement)',
    market: 'US',
    entity: 'ARIEL_US',
    currency: 'USD',
    totalValue: 142500,
    totalValueUsd: 142500,
    sector: 'LEATHER',
    styleName: 'Savile Row Leather Weekender Duffle',
    quantity: 950,
    incoterm: 'CIF Long Beach Port (USLGB)',
    paymentTerms: 'Irrevocable At-Sight Master L/C',
    issueDate: '2026-09-24',
    validUntil: '2026-11-20',
    status: 'ACCEPTED_CONFIRMED',
  },
  {
    id: 'pi-003',
    piNumber: 'PI-2026-AMC-MS-03',
    soNumberRef: 'SO-2026-UK-003',
    buyerCompany: 'Marks & Spencer PLC',
    buyerContact: 'Gareth Jenkins (Head of Sourcing)',
    market: 'UK',
    entity: 'ARIEL_UK',
    currency: 'GBP',
    totalValue: 54000,
    totalValueUsd: 70200,
    sector: 'JUTE',
    styleName: 'Eco-Luxury Jute & Vegan Leather Shopper',
    quantity: 2400,
    incoterm: 'FOB Chittagong Port (BDCGP)',
    paymentTerms: 'Confirmed Irrevocable L/C at Sight',
    issueDate: '2026-10-02',
    validUntil: '2026-11-30',
    status: 'ACCEPTED_CONFIRMED',
  },
  {
    id: 'pi-004',
    piNumber: 'PI-2026-AMC-ZARA-04',
    soNumberRef: 'SO-2026-EU-004',
    buyerCompany: 'Inditex (Zara Home)',
    buyerContact: 'Sofia Alvarez (Materials Lead)',
    market: 'EU',
    entity: 'ARIEL_EU',
    currency: 'EUR',
    totalValue: 98000,
    totalValueUsd: 106820,
    sector: 'CERAMICS',
    styleName: 'Terracotta Handcrafted Serving Platter',
    quantity: 3200,
    incoterm: 'CIF Rotterdam Gateway',
    paymentTerms: 'Irrevocable 60-Day L/C',
    issueDate: '2026-10-08',
    validUntil: '2026-12-05',
    status: 'LC_PENDING',
  },
  {
    id: 'pi-005',
    piNumber: 'PI-2026-AMC-CR-05',
    buyerCompany: 'Country Road Australia',
    buyerContact: 'Liam Henderson (Brand Director)',
    market: 'AU',
    entity: 'ARIEL_AU',
    currency: 'AUD',
    totalValue: 82500,
    totalValueUsd: 53625,
    sector: 'TEXTILE',
    styleName: 'Heritage Organic Denim Work Jacket',
    quantity: 1100,
    incoterm: 'FOB Chittagong Port (BDCGP)',
    paymentTerms: 'Confirmed L/C at Sight',
    issueDate: '2026-10-14',
    validUntil: '2026-12-15',
    status: 'UNDER_REVIEW',
  },
];

export const SalesManagement: React.FC<SalesManagementProps> = ({
  orders,
  crmLeads,
  factories,
  products,
  activeEntity,
  activeCurrency,
  currencies,
  onNavigateTab,
  onAddOrder,
  onOpenDocumentCenter,
  theme = 'crm-green',
  initialSubTab,
  initialBuyerCompany,
  onSubTabChange,
  favoritePages,
  onToggleFavorite,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SalesSubTab>(initialSubTab || 'OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'UK' | 'US' | 'EU' | 'AU'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Notify parent of sub-tab changes
  useEffect(() => {
    onSubTabChange?.(activeSubTab);
  }, [activeSubTab, onSubTabChange]);

  // Buyer Portfolio States & Persistence
  const [buyerPortfolios, setBuyerPortfolios] = useState<BuyerPortfolio[]>(INITIAL_BUYER_PORTFOLIOS);
  const [selectedBuyerPortfolio, setSelectedBuyerPortfolio] = useState<BuyerPortfolio | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialBuyerCompany && buyerPortfolios.length > 0) {
      const match = buyerPortfolios.find(
        (b) =>
          b.buyerCompany.toLowerCase() === initialBuyerCompany.toLowerCase() ||
          b.buyerCompany.toLowerCase().includes(initialBuyerCompany.toLowerCase()) ||
          initialBuyerCompany.toLowerCase().includes(b.buyerCompany.toLowerCase())
      );
      if (match) {
        setSelectedBuyerPortfolio(match);
      }
    }
  }, [initialBuyerCompany, buyerPortfolios]);

  useEffect(() => {
    fetchBuyerPortfolios().then((persisted) => {
      if (persisted && persisted.length > 0) {
        setBuyerPortfolios(persisted);
      }
    });
  }, []);

  const handleSaveBuyerPortfolio = (updated: BuyerPortfolio) => {
    setBuyerPortfolios((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === updated.id || p.buyerCompany.toLowerCase() === updated.buyerCompany.toLowerCase()
      );
      let next: BuyerPortfolio[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updated;
      } else {
        next = [updated, ...prev];
      }
      persistBuyerPortfolios(next);
      return next;
    });
    setSelectedBuyerPortfolio(updated);
  };

  const getPortfolioForBuyer = (companyName: string, market: string = 'UK'): BuyerPortfolio => {
    const found = buyerPortfolios.find(
      (p) =>
        p.buyerCompany.toLowerCase() === companyName.toLowerCase() ||
        companyName.toLowerCase().includes(p.buyerCompany.toLowerCase())
    );
    if (found) return found;

    const marketStation = (market === 'USA' ? 'US' : market || 'UK') as any;
    return {
      id: `bp-${Date.now()}`,
      buyerCompany: companyName,
      brandCode: companyName.replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase(),
      marketStation,
      accountStatus: 'ACTIVE_GROWTH',
      lastUpdated: new Date().toISOString().split('T')[0],
      businessPortfolio: {
        legalEntityName: `${companyName} International Ltd`,
        tradeName: companyName,
        country: marketStation === 'US' ? 'United States' : marketStation === 'UK' ? 'United Kingdom' : 'European Union',
        headquarters: `${marketStation} International Commercial Office`,
        establishedYear: 2008,
        annualCorporateTurnoverUsd: '$50 Million - $250 Million',
        storeCount: 30,
        eCommerceChannels: [`${companyName.toLowerCase().replace(/\s+/g, '')}.com`],
        tierClassification: 'Premium Omnichannel Brand',
        keyDecisionMakers: [
          {
            name: 'Head of Global Sourcing',
            designation: 'Commercial Procurement Director',
            email: `sourcing@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: '+44 20 7000 0000',
            decisionScope: 'Range Planning & Vendor Signoff',
          },
        ],
        primaryStationBranch: marketStation,
      },
      currentProducts: [],
      interestPoints: {
        preferredMaterials: ['Full-Grain Cowhide Leather', 'GOTS Organic Cotton', 'Sustainable Jute Fiber'],
        sustainabilityMandates: ['LWG Gold Tannery Origin', 'Zero Single-Use Plastic', 'EU REACH Annex XVII'],
        qualityStandardsAql: 'Standard AQL 1.5 Major / 2.5 Minor with 100% FRI Pass',
        packagingAndBranding: 'Branded FSC Gift Boxes & Barcoded Master Cartons',
        designAesthetic: 'Contemporary Luxury with Clean Silhouette',
        targetLeadTimeWeeks: 7,
        priceSensitivity: 'MID_TIER_BALANCED',
        specialRequirementsNotes: 'Requires complete chemical testing certificates attached to export shipping documents.',
      },
      futureReachPlanning: [
        {
          id: `fut-${Date.now()}`,
          seasonOrQuarter: 'AW 2027 Expansion Range',
          targetCategory: 'Artisan Leather Goods & Accessories',
          projectedVolumeUnits: 2500,
          targetWholesaleFobUsd: 55,
          targetRetailSalesPrice: 195,
          samplingTargetDate: '2027-02-15',
          shelfLaunchDate: '2027-08-01',
          developmentStage: 'CONCEPT',
          strategicObjective: 'Grow product assortment with sustainable Bangladeshi craftsmanship.',
        },
      ],
      financialPortfolio: {
        approvedCreditLimitUsd: 350000,
        paymentTerms: 'Confirmed Irrevocable L/C at Sight (60 Days)',
        creditRiskRating: 'A Commercial Standard',
        lifetimeGmvUsd: 150000,
        ytdRevenueUsd: 45000,
        outstandingReceivablesUsd: 0,
        overdueAmountUsd: 0,
        advisingIssuingBank: 'International Commercial Bank',
        swiftBic: 'INTLGB22',
        preferredTradeCurrency: marketStation === 'UK' ? 'GBP' : marketStation === 'EU' ? 'EUR' : 'USD',
        paymentPunctualityScorePct: 98.5,
      },
      competitiveIntelligence: {
        shareOfWalletPct: 25,
        primaryAlternativeSourcingHubs: ['Vietnam', 'India'],
        strategicAdvantageOverCompetitors: 'ArielMC provides superior craftsmanship, lower duty via GSP, and dedicated sampling speed.',
      },
      interactionLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'ZOOM_CALL',
          summary: 'Initial commercial discussion regarding portfolio expansion and sampling roadmap.',
          attendedBy: 'Merchandising Ops',
        },
      ],
      internalMerchandisingNotes: 'Promising growth account.',
    };
  };

  // Operating Station BD Detection
  const isBdStation = activeEntity?.code === 'ARIEL_BD' || activeEntity?.baseCurrency === 'BDT';

  // Live and statutory FX rates anchored to USD (1 USD = X units of currency)
  const bdtRate = useMemo(() => {
    return currencies?.find((c) => c.code === 'BDT')?.rateToUsd || 121.5;
  }, [currencies]);

  const gbpRate = useMemo(() => {
    return currencies?.find((c) => c.code === 'GBP')?.rateToUsd || 0.77;
  }, [currencies]);

  const eurRate = useMemo(() => {
    return currencies?.find((c) => c.code === 'EUR')?.rateToUsd || 0.92;
  }, [currencies]);

  const audRate = useMemo(() => {
    return currencies?.find((c) => c.code === 'AUD')?.rateToUsd || 1.52;
  }, [currencies]);

  // Convert any foreign or station currency amount to USD
  const toUsd = (amount: number, fromCurrency: string = 'USD'): number => {
    if (fromCurrency === 'USD') return amount;
    if (fromCurrency === 'GBP') return amount / gbpRate;
    if (fromCurrency === 'EUR') return amount / eurRate;
    if (fromCurrency === 'AUD') return amount / audRate;
    if (fromCurrency === 'BDT') return amount / bdtRate;
    return amount;
  };

  // Convert any currency amount to BDT (৳)
  const toBdt = (amount: number, fromCurrency: string = 'USD'): number => {
    if (fromCurrency === 'BDT') return amount;
    const usd = toUsd(amount, fromCurrency);
    return Math.round(usd * bdtRate);
  };

  // Format BDT with South Asian / Bengali formatting (৳ Lakh / Crore or comma separated)
  const formatBdt = (bdtAmount: number, compact: boolean = false): string => {
    const val = Math.round(bdtAmount);
    if (compact) {
      if (val >= 10000000) return `৳${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `৳${(val / 100000).toFixed(1)} Lakh`;
    }
    return `৳${val.toLocaleString('en-IN')}`;
  };

  // New Order Form State
  const [newBuyerCompany, setNewBuyerCompany] = useState('');
  const [newTargetMarket, setNewTargetMarket] = useState<'UK' | 'US' | 'EU' | 'AU'>('UK');
  const [newSector, setNewSector] = useState<ProductSector>('LEATHER');
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1000);
  const [newUnitPrice, setNewUnitPrice] = useState(45);
  const [newFactoryId, setNewFactoryId] = useState('');
  const [newIncoterm, setNewIncoterm] = useState('FOB Chittagong Sea Port (BDCGP)');
  const [newPaymentTerms, setNewPaymentTerms] = useState('Confirmed Irrevocable 90-Day L/C at Sight');

  // KPI Computations
  const totalGrossSalesUsd = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmountUsd || 0), 0);
  }, [orders]);

  const totalGrossSalesBdt = useMemo(() => {
    return Math.round(totalGrossSalesUsd * bdtRate);
  }, [totalGrossSalesUsd, bdtRate]);

  const totalContractedUnits = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalQuantity || 0), 0);
  }, [orders]);

  const totalNetMarginUsd = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.marginProtection?.netMarginUsd || 0), 0);
  }, [orders]);

  const totalNetMarginBdt = useMemo(() => {
    return Math.round(totalNetMarginUsd * bdtRate);
  }, [totalNetMarginUsd, bdtRate]);

  const averageGrossMarginPct = useMemo(() => {
    if (!orders.length) return 28.5;
    const totalMargin = orders.reduce(
      (sum, o) => sum + (o.marginProtection?.marginPercentage || 28),
      0
    );
    return Number((totalMargin / orders.length).toFixed(1));
  }, [orders]);

  const totalPipelineValueUsd = useMemo(() => {
    return crmLeads.reduce((sum, l) => sum + (Number(l.value) || 35000), 0);
  }, [crmLeads]);

  const totalPipelineValueBdt = useMemo(() => {
    return Math.round(totalPipelineValueUsd * bdtRate);
  }, [totalPipelineValueUsd, bdtRate]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.items && o.items.some((i) => i.styleName.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesMarket = marketFilter === 'ALL' || o.targetMarket === marketFilter;
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesSector =
        sectorFilter === 'ALL' ||
        (o.items && o.items.some((i) => i.sector === sectorFilter));
      return matchesSearch && matchesMarket && matchesStatus && matchesSector;
    });
  }, [orders, searchQuery, marketFilter, statusFilter, sectorFilter]);

  // Unique Buyer Accounts
  const buyerAccounts = useMemo(() => {
    const map = new Map<string, {
      company: string;
      market: string;
      ordersCount: number;
      totalSpendUsd: number;
      activeStatus: string;
      latestOrderDate: string;
      creditRating: string;
      contact: string;
    }>();

    orders.forEach((o) => {
      const existing = map.get(o.buyerCompany);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpendUsd += o.totalAmountUsd || 0;
        if (o.orderDate > existing.latestOrderDate) {
          existing.latestOrderDate = o.orderDate;
        }
      } else {
        map.set(o.buyerCompany, {
          company: o.buyerCompany,
          market: o.targetMarket,
          ordersCount: 1,
          totalSpendUsd: o.totalAmountUsd || 0,
          activeStatus: 'Active Wholesale Account',
          latestOrderDate: o.orderDate,
          creditRating: 'AAA Sovereign Verified',
          contact: o.buyerContact || 'Head of Buying & Procurement',
        });
      }
    });

    // Also bring in high-value CRM leads
    crmLeads.slice(0, 10).forEach((l) => {
      if (!map.has(l.company)) {
        map.set(l.company, {
          company: l.company,
          market: l.market === 'USA' ? 'US' : l.market || 'UK',
          ordersCount: 0,
          totalSpendUsd: Number(l.value) || 45000,
          activeStatus: `Pipeline (${l.stage || 'In Negotiation'})`,
          latestOrderDate: '2026-10-15',
          creditRating: 'Institutional AQL Tier 1',
          contact: l.contact || 'Commercial Sourcing Director',
        });
      }
    });

    return Array.from(map.values());
  }, [orders, crmLeads]);

  // Station targets & achievements
  const stationTargets = [
    {
      station: 'ArielMC BD Headquarters',
      code: 'ARIEL_BD',
      currency: 'BDT (৳)',
      currencySymbol: '৳',
      targetUsd: 2500000,
      achievedUsd: 1895000,
      target: 2500000,
      achieved: 1895000,
      activeSOs: orders.length,
      leadCount: crmLeads.length,
      primaryBuyers: 'Central Sourcing & Manufacturing Clearinghouse',
      isDomestic: true,
    },
    {
      station: 'ArielMC UK Station',
      code: 'ARIEL_UK',
      currency: 'GBP (£)',
      currencySymbol: '£',
      targetUsd: Math.round(650000 / gbpRate),
      achievedUsd: Math.round(485000 / gbpRate),
      target: 650000,
      achieved: 485000,
      activeSOs: orders.filter((o) => o.targetMarket === 'UK').length,
      leadCount: crmLeads.filter((l) => l.market === 'UK').length,
      primaryBuyers: 'Harrods, Marks & Spencer, ASOS',
      isDomestic: false,
    },
    {
      station: 'ArielMC US Station',
      code: 'ARIEL_US',
      currency: 'USD ($)',
      currencySymbol: '$',
      targetUsd: 850000,
      achievedUsd: 642000,
      target: 850000,
      achieved: 642000,
      activeSOs: orders.filter((o) => o.targetMarket === 'US').length,
      leadCount: crmLeads.filter((l) => l.market === 'USA' || l.market === 'US').length,
      primaryBuyers: 'Ralph Lauren, Bloomingdale\'s, Nordstrom',
      isDomestic: false,
    },
    {
      station: 'ArielMC EU Station',
      code: 'ARIEL_EU',
      currency: 'EUR (€)',
      currencySymbol: '€',
      targetUsd: Math.round(500000 / eurRate),
      achievedUsd: Math.round(345000 / eurRate),
      target: 500000,
      achieved: 345000,
      activeSOs: orders.filter((o) => o.targetMarket === 'EU').length,
      leadCount: crmLeads.filter((l) => l.market === 'EU').length,
      primaryBuyers: 'Inditex (Zara), Mango, Zalando',
      isDomestic: false,
    },
    {
      station: 'ArielMC AU Station',
      code: 'ARIEL_AU',
      currency: 'AUD (A$)',
      currencySymbol: 'A$',
      targetUsd: Math.round(350000 / audRate),
      achievedUsd: Math.round(265000 / audRate),
      target: 350000,
      achieved: 265000,
      activeSOs: orders.filter((o) => o.targetMarket === 'AU').length,
      leadCount: crmLeads.filter((l) => l.market === 'AU' || l.market === 'Australia').length,
      primaryBuyers: 'Country Road, David Jones, The Iconic',
      isDomestic: false,
    },
  ];

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/sales/${code}`);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = products.find((p) => p.id === newProductId) || products[0] || {
      id: 'prod-fallback',
      sku: 'AM-LTH-099',
      name: 'Custom Tailored Commercial Line',
      sector: newSector,
      unitPriceUsd: newUnitPrice,
    };

    const targetFac = factories.find((f) => f.id === newFactoryId) || factories[0] || {
      id: 'fac-001',
      name: 'Apex Footwear Ltd - Unit 2 Leathercraft',
    };

    const fxRate = newTargetMarket === 'UK' ? 1.3 : newTargetMarket === 'EU' ? 1.09 : newTargetMarket === 'AU' ? 0.65 : 1.0;
    const totalBuyerCur = newQuantity * newUnitPrice;
    const totalUsd = Math.round(totalBuyerCur * fxRate);
    const factoryUnitBdt = Math.round(newUnitPrice * 120 * 0.68);
    const factoryTotalBdt = factoryUnitBdt * newQuantity;
    const factoryCostUsd = Math.round(factoryTotalBdt / 120);

    const freight = Math.round(totalUsd * 0.05);
    const compliance = Math.round(totalUsd * 0.02);
    const netMargin = totalUsd - factoryCostUsd - freight - compliance;
    const marginPct = Number(((netMargin / totalUsd) * 100).toFixed(1));

    const currencyCode = newTargetMarket === 'UK' ? 'GBP' : newTargetMarket === 'EU' ? 'EUR' : newTargetMarket === 'AU' ? 'AUD' : 'USD';

    const orderObj: BuyerSalesOrder = {
      id: `so-${Date.now()}`,
      soNumber: `SO-2026-${newTargetMarket}-${Math.floor(100 + Math.random() * 900)}`,
      buyerCompany: newBuyerCompany || 'Premier International Buyer Ltd',
      buyerContact: 'Head of Sourcing & Merchandising',
      targetMarket: newTargetMarket,
      operatingEntity: newTargetMarket === 'UK' ? 'ARIEL_UK' : newTargetMarket === 'US' ? 'ARIEL_US' : newTargetMarket === 'EU' ? 'ARIEL_EU' : 'ARIEL_AU',
      currency: currencyCode as any,
      incoterm: newIncoterm,
      status: 'CONFIRMED',
      orderDate: new Date().toISOString().split('T')[0],
      targetExFactoryDate: '2026-11-28',
      targetPortCutOffDate: '2026-12-05',
      targetDeliveryDate: '2027-01-15',
      paymentTerms: newPaymentTerms,
      masterLcNumber: `LC-${newTargetMarket}-${Math.floor(100000 + Math.random() * 900000)}`,
      totalQuantity: newQuantity,
      totalAmountBuyerCurrency: totalBuyerCur,
      totalAmountUsd: totalUsd,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: targetProd.id,
          sku: targetProd.sku || 'AM-SLS-001',
          styleName: targetProd.name || 'Commercial Line Spec',
          sector: newSector,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          totalPrice: totalBuyerCur,
          factoryUnitCost: factoryUnitBdt,
          factoryTotalCost: factoryTotalBdt,
        },
      ],
      linkedPo: {
        id: `po-${Date.now()}`,
        poNumber: `PO-2026-FAC-${Math.floor(100 + Math.random() * 900)}`,
        factoryId: targetFac.id,
        factoryName: targetFac.name,
        currency: 'BDT',
        status: 'IN_LINE_SEWING',
        issueDate: new Date().toISOString().split('T')[0],
        targetExFactoryDate: '2026-11-25',
        totalQuantity: newQuantity,
        totalCostBdt: factoryTotalBdt,
        totalCostUsd: factoryCostUsd,
        paymentTerms: 'Back-to-Back Letter of Credit (90 Days)',
        items: [],
      },
      marginProtection: {
        buyerRevenueUsd: totalUsd,
        factoryCostUsd,
        freightAllowanceUsd: freight,
        complianceBufferUsd: compliance,
        netMarginUsd: netMargin,
        marginPercentage: marginPct,
        status: marginPct >= 20 ? 'LOCKED_HEALTHY' : 'MARGIN_WARNING',
      },
      timeAndAction: [],
      inspections: [],
    };

    onAddOrder?.(orderObj);
    setIsCreateModalOpen(false);
    // Reset
    setNewBuyerCompany('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* 1. Master Executive Command Banner (British Racing Green & Heritage Gold) - Compact Edition */}
      <div className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#1F3A2E] via-[#162B22] to-[#0F1E18] text-white shadow-md border-b-2 border-[#C8A96A] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#C8A96A]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Left: Compact Title, Badges & Micro-Description */}
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-heading tracking-tight text-white flex items-center gap-2 shrink-0">
                <TrendingUp className="w-5 h-5 text-[#C8A96A]" />
                <span>Sales Management &amp; Commercial Hub</span>
              </h1>

              <span className="px-2 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] text-[10px] font-bold font-mono tracking-wider uppercase">
                Core Sales
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 text-[10px] font-bold font-mono border border-emerald-400/30">
                L/C &amp; Margin Locked
              </span>
              {isBdStation && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-bold font-mono border border-emerald-400/40">
                  🇧🇩 Station BD: BDT (৳) Mode
                </span>
              )}
            </div>

            <p className="text-xs text-gray-300 line-clamp-1 max-w-3xl">
              Consolidated enterprise sales command: B2B Sales Orders (SO), Proforma Invoices (PI), wholesale credit ratings &amp; gross margin protection.{isBdStation ? ' Contractual exports in foreign currency; factory spends in BDT (৳).' : ''}
            </p>
          </div>

          {/* Right: Sleek Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#12231B] text-xs font-bold shadow-sm transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Sales Order (SO)</span>
            </button>

            <button
              onClick={() => onOpenDocumentCenter?.('PROFORMA_INVOICE')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              title="Issue Official Export Proforma Invoice (PI)"
            >
              <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Issue Proforma (PI)</span>
            </button>

            <button
              onClick={() => onNavigateTab('CRM')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              title="Open full B2B Leads CRM Pipeline"
            >
              <Users2 className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>CRM Leads ({crmLeads.length})</span>
            </button>

            <button
              onClick={() => onNavigateTab('ECOM')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              title="Open Multichannel E-Com Sales (Amazon, Shopify, Etsy)"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>E-Com Sales</span>
            </button>

            <button
              onClick={() => onNavigateTab('POS')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              title="Open Showroom Store POS Register"
            >
              <Store className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Store POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Executive Sales KPI Scorecard (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Gross Confirmed Sales */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Gross Sales Booked
            </span>
            <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
              ${totalGrossSalesUsd.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">USD</span>
            </div>
            {isBdStation && (
              <div className="text-xs font-mono font-bold text-emerald-800">
                ({formatBdt(totalGrossSalesBdt)} BDT)
              </div>
            )}
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{orders.length} Buyer Sales Orders Active</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#1F3A2E] shrink-0">
            <DollarSign className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* KPI 2: Contracted Production Volume */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Contracted Volume
            </span>
            <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
              {totalContractedUnits.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">Pcs</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Across Leather, Jute, Textiles &amp; Ceramics
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#1F3A2E] shrink-0">
            <Layers className="w-6 h-6 text-amber-700" />
          </div>
        </div>

        {/* KPI 3: Average Gross Margin Locked */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Average Net Margin Locked
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-700">
              {averageGrossMarginPct}% <span className="text-xs font-sans text-slate-400 font-normal">Net</span>
            </div>
            {isBdStation ? (
              <div className="text-[11px] font-mono font-bold text-emerald-800">
                Locked: {formatBdt(totalNetMarginBdt)} BDT (~${totalNetMarginUsd.toLocaleString()} USD)
              </div>
            ) : (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Back-to-Back PO Protected</span>
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] flex items-center justify-center text-[#1F3A2E] shrink-0">
            <Percent className="w-6 h-6 text-[#1F3A2E]" />
          </div>
        </div>

        {/* KPI 4: Qualified CRM Sales Pipeline */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Unconverted Pipeline Value
            </span>
            <div className="text-2xl font-bold font-mono text-[#C8A96A]">
              ${(totalPipelineValueUsd / 1000).toFixed(0)}k <span className="text-xs font-sans text-slate-400 font-normal">USD</span>
            </div>
            {isBdStation && (
              <div className="text-xs font-mono font-bold text-amber-800">
                ({formatBdt(totalPipelineValueBdt, true)} BDT)
              </div>
            )}
            <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{crmLeads.length} Global Buyer Deals</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
            <Users2 className="w-6 h-6 text-indigo-700" />
          </div>
        </div>

      </div>

      {/* 3. Sub-Tab Segmented Navigation Bar */}
      <div className="bg-white p-1 rounded-xl border border-[#DDE3DD] shadow-xs flex items-center justify-between gap-1 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1 shrink-0">
          {[
            { id: 'OVERVIEW' as SalesSubTab, label: 'Sales Command Overview', icon: TrendingUp },
            { id: 'ORDERS' as SalesSubTab, label: `Sales Orders (${orders.length})`, icon: Repeat },
            { id: 'QUOTATIONS_PI' as SalesSubTab, label: `Proformas & Quotes (${INITIAL_QUOTATIONS_PI.length})`, icon: FileText, favKey: 'QUOTATIONS_PI' },
            { id: 'BUYERS' as SalesSubTab, label: `Strategic Accounts (${buyerAccounts.length})`, icon: Building2, favKey: 'STRATEGIC_ACCOUNTS' },
            { id: 'PIPELINE' as SalesSubTab, label: `Funnel & Deals (${crmLeads.length})`, icon: Users2 },
            { id: 'TARGETS' as SalesSubTab, label: 'Station Targets', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            const isFav = tab.favKey ? (favoritePages?.includes(tab.favKey) ?? false) : false;
            return (
              <div key={tab.id} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 group ${
                    isActive
                      ? 'bg-[#1F3A2E] text-white shadow-xs'
                      : 'text-[#1F3A2E]/80 hover:text-[#1F3A2E] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A96A]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>

                  {tab.favKey && onToggleFavorite && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tab.favKey!);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          onToggleFavorite(tab.favKey!);
                        }
                      }}
                      className={`ml-1 p-0.5 rounded transition cursor-pointer ${
                        isFav
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-400/70 hover:text-amber-400'
                      }`}
                      title={
                        isFav
                          ? `Remove "${tab.label}" from Favorite Pages`
                          : `Add "${tab.label}" to Favorite Pages`
                      }
                    >
                      <Star
                        className={`w-3 h-3 ${
                          isFav
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                      />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-slate-500 font-mono shrink-0">
          <span className="text-slate-400">Station:</span>
          <span 
            className="font-bold text-[#1F3A2E] bg-[#F8FAF8] px-2 py-0.5 rounded border border-[#DDE3DD] cursor-help"
            title={activeEntity.legalName}
          >
            {activeEntity.code} ({activeEntity.baseCurrency})
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: SALES COMMAND OVERVIEW                             */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Sovereign Station Sales Performance Matrix */}
          <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                  <Globe2 className="w-5 h-5 text-[#C8A96A]" />
                  <span>Sovereign Station Sales Execution Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Performance across ArielMC operating stations in the UK, United States, European Union, and Australia.
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#F8FAF8] text-[#1F3A2E] border border-[#DDE3DD]">
                Consolidated Invoicing Engine
              </span>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${isBdStation ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3.5 pt-2`}>
              {(isBdStation ? stationTargets : stationTargets.filter(s => s.code !== 'ARIEL_BD')).map((st, idx) => {
                const pct = Math.round((st.achieved / st.target) * 100);
                const isBd = st.code === 'ARIEL_BD';
                return (
                  <div key={idx} className={`p-4 rounded-xl border space-y-3 ${isBd && isBdStation ? 'bg-emerald-50/60 border-emerald-300' : 'bg-[#F8FAF8] border-[#DDE3DD]'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1F3A2E] truncate">{st.station}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isBd ? 'bg-emerald-800 text-white' : 'bg-[#1F3A2E] text-white'}`}>
                        {st.code}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs flex-wrap gap-1">
                        <span className="text-slate-500 text-[11px]">Achieved:</span>
                        <div className="text-right">
                          {isBd && isBdStation ? (
                            <span className="font-mono font-bold text-emerald-900 block text-xs">
                              {formatBdt(st.achievedUsd * bdtRate)} BDT
                            </span>
                          ) : isBdStation ? (
                            <>
                              <span className="font-mono font-bold text-[#1F3A2E] block text-xs">
                                {st.currencySymbol}{st.achieved.toLocaleString()}
                              </span>
                              <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                                ({formatBdt(toBdt(st.achieved, st.code === 'ARIEL_UK' ? 'GBP' : st.code === 'ARIEL_EU' ? 'EUR' : st.code === 'ARIEL_AU' ? 'AUD' : 'USD'))})
                              </span>
                            </>
                          ) : (
                            <span className="font-mono font-bold text-[#1F3A2E]">
                              {st.currency.split(' ')[0]} {st.achieved.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between text-xs flex-wrap gap-1">
                        <span className="text-slate-400 text-[11px]">Target Quota:</span>
                        <div className="text-right">
                          {isBd && isBdStation ? (
                            <span className="font-mono text-slate-600 block text-[11px]">
                              {formatBdt(st.targetUsd * bdtRate)} BDT
                            </span>
                          ) : isBdStation ? (
                            <span className="font-mono text-slate-500 block text-[10px]">
                              {st.currencySymbol}{st.target.toLocaleString()} ({formatBdt(toBdt(st.target, st.code === 'ARIEL_UK' ? 'GBP' : st.code === 'ARIEL_EU' ? 'EUR' : st.code === 'ARIEL_AU' ? 'AUD' : 'USD'))})
                            </span>
                          ) : (
                            <span className="font-mono text-slate-500">
                              {st.currency.split(' ')[0]} {st.target.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#1F3A2E] to-[#C8A96A] rounded-full transition-all"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>{pct}% to quota</span>
                        <span>{st.activeSOs} Active SOs</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#DDE3DD] text-[11px] text-slate-600 truncate" title={st.primaryBuyers}>
                      <span className="font-medium text-slate-500">Key Buyers:</span> {st.primaryBuyers}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dual Columns: Active Sales Orders Snapshot & Strategic Buyer Portfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: High-Priority B2B Sales Orders */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                    <Repeat className="w-5 h-5 text-[#C8A96A]" />
                    <span>Active B2B Sales Orders (SO) Pipeline</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synchronized with Bangladesh manufacturing floors and locked gross margins.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSubTab('ORDERS')}
                  className="text-xs font-bold text-[#1F3A2E] hover:text-[#C8A96A] flex items-center gap-1 transition-colors"
                >
                  <span>View All ({orders.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] hover:border-[#1F3A2E]/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded bg-[#1F3A2E] text-white font-mono font-bold text-xs">
                          {ord.soNumber}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                            <span>{ord.buyerCompany}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-[#C8A96A]/20 text-[#1F3A2E] border border-[#C8A96A]/40">
                              {ord.targetMarket}
                            </span>
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            {ord.items?.[0]?.styleName || 'Custom Specification Line'} • {ord.totalQuantity.toLocaleString()} pcs
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-[#1F3A2E]">
                          {ord.currency} {ord.totalAmountBuyerCurrency.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isBdStation ? (
                            <>
                              <strong className="text-emerald-800">({formatBdt(ord.totalAmountUsd * bdtRate)} BDT)</strong> • ${ord.totalAmountUsd.toLocaleString()} USD
                            </>
                          ) : (
                            `($${ord.totalAmountUsd.toLocaleString()} USD)`
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDE3DD]/60 flex-wrap gap-2">
                      <div className="flex items-center gap-4 text-[11px] text-slate-600 flex-wrap">
                        <span><strong>Incoterm:</strong> {ord.incoterm}</span>
                        <span>
                          <strong>Factory PO:</strong> {ord.linkedPo.poNumber}
                          {isBdStation ? (
                            <strong className="text-emerald-800 ml-1">
                              • {formatBdt(ord.linkedPo.totalCostBdt || (ord.linkedPo.totalCostUsd * bdtRate))} BDT
                            </strong>
                          ) : (
                            <span className="text-slate-500 ml-1 font-mono">
                              (${ord.linkedPo.totalCostUsd.toLocaleString()} USD)
                            </span>
                          )}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          Margin: {ord.marginProtection.marginPercentage}% 
                          {isBdStation ? (
                            <span className="ml-1 text-emerald-800 font-mono">
                              ({formatBdt(ord.marginProtection.netMarginUsd * bdtRate)} BDT / ${ord.marginProtection.netMarginUsd.toLocaleString()} USD)
                            </span>
                          ) : (
                            ` ($${ord.marginProtection.netMarginUsd.toLocaleString()})`
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenDocumentCenter?.('PROFORMA_INVOICE', ord.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] text-[#1F3A2E] transition-colors"
                        >
                          View PI
                        </button>
                        <button
                          onClick={() => onNavigateTab('ORDERS')}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#1F3A2E] text-white hover:bg-[#162B22] transition-colors"
                        >
                          Manage Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Top Commercial Buyer Portfolio */}
            <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                    <Building2 className="w-5 h-5 text-[#C8A96A]" />
                    <span>Tier-1 Strategic Accounts</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified wholesale department stores &amp; brands.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onToggleFavorite && (
                    <button
                      type="button"
                      onClick={() => onToggleFavorite('STRATEGIC_ACCOUNTS')}
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        favoritePages?.includes('STRATEGIC_ACCOUNTS')
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-white text-slate-500 hover:text-amber-600 border-slate-200'
                      }`}
                      title={
                        favoritePages?.includes('STRATEGIC_ACCOUNTS')
                          ? 'Remove Strategic Accounts from Favorite Pages'
                          : 'Add Strategic Accounts to Favorite Pages'
                      }
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          favoritePages?.includes('STRATEGIC_ACCOUNTS')
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSubTab('BUYERS')}
                    className="text-xs font-bold text-[#1F3A2E] hover:text-[#C8A96A] cursor-pointer"
                  >
                    All ({buyerAccounts.length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {buyerAccounts.slice(0, 5).map((ba, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1A1A1A]">{ba.company}</h4>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#C8A96A]/20 text-[#1F3A2E]">
                        {ba.market}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Lifetime Spend:</span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1F3A2E] block">
                          ${ba.totalSpendUsd.toLocaleString()} USD
                        </span>
                        {isBdStation && (
                          <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                            ({formatBdt(ba.totalSpendUsd * bdtRate)} BDT)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#DDE3DD]/60">
                      <span>{ba.creditRating}</span>
                      <span>{ba.ordersCount} Confirmed Orders</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigateTab('CRM')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#F1F3EE] text-[#1F3A2E] text-xs font-bold border border-[#DDE3DD] transition-colors"
              >
                <Users2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Explore Full 254-Lead Directory</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: BUYER SALES ORDERS (SO) DETAILED REGISTER          */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'ORDERS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by SO number, buyer, style, or PO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#1F3A2E] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Market Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#F8FAF8] rounded-xl border border-[#DDE3DD]">
                {(['ALL', 'UK', 'US', 'EU', 'AU'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMarketFilter(m)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      marketFilter === m ? 'bg-[#1F3A2E] text-white' : 'text-slate-600 hover:text-[#1F3A2E]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1F3A2E] font-medium focus:outline-none focus:border-[#1F3A2E]"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="CONFIRMED">Confirmed / L/C Opened</option>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="QUALITY_INSPECTION">QA / AQL Inspection</option>
                <option value="READY_TO_SHIP">Ready for Chittagong</option>
                <option value="SHIPPED_CHITTAGONG">Shipped Transit</option>
                <option value="FULFILLED">Delivered &amp; Settled</option>
              </select>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-9 px-4 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Add Sales Order</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF8] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">SO Number</th>
                    <th className="py-3.5 px-4">Buyer &amp; Market</th>
                    <th className="py-3.5 px-4">Product &amp; Spec</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Total Value</th>
                    <th className="py-3.5 px-4">Factory PO</th>
                    <th className="py-3.5 px-4">Margin Protection</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No sales orders match your current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F8FAF8]/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                          {ord.soNumber}
                          <span className="block text-[10px] font-normal text-slate-400">
                            {ord.orderDate}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1A1A1A] block">{ord.buyerCompany}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#C8A96A]/20 text-[#1F3A2E]">
                            {ord.targetMarket} Station
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {ord.items?.[0]?.styleName || 'Custom Line'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ord.items?.[0]?.sector || 'LEATHER'} • Incoterm: {ord.incoterm}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {ord.totalQuantity.toLocaleString()} pcs
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#1F3A2E] block">
                            {ord.currency} {ord.totalAmountBuyerCurrency.toLocaleString()}
                          </span>
                          {isBdStation ? (
                            <>
                              <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                                ({formatBdt(ord.totalAmountUsd * bdtRate)} BDT)
                              </span>
                              <span className="font-mono text-[9px] text-slate-400 block">
                                ${ord.totalAmountUsd.toLocaleString()} USD
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-[10px] text-slate-500">
                              ${ord.totalAmountUsd.toLocaleString()} USD
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-[#1F3A2E] block">
                            {ord.linkedPo.poNumber}
                          </span>
                          {isBdStation ? (
                            <>
                              <span className="font-mono font-bold text-xs text-emerald-800 block">
                                {formatBdt(ord.linkedPo.totalCostBdt || (ord.linkedPo.totalCostUsd * bdtRate))} BDT
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block max-w-[140px]" title={ord.linkedPo.factoryName}>
                                {ord.linkedPo.factoryName} (~${ord.linkedPo.totalCostUsd.toLocaleString()})
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-mono text-xs text-slate-700 block">
                                ${ord.linkedPo.totalCostUsd.toLocaleString()} USD
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block max-w-[140px]" title={ord.linkedPo.factoryName}>
                                {ord.linkedPo.factoryName}
                              </span>
                            </>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {ord.marginProtection.marginPercentage}% Locked
                            </span>
                          </div>
                          {isBdStation ? (
                            <>
                              <span className="text-[10px] text-emerald-800 font-mono font-semibold block mt-0.5">
                                +{formatBdt(ord.marginProtection.netMarginUsd * bdtRate)} BDT
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                (+${ord.marginProtection.netMarginUsd.toLocaleString()} USD)
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                              +${ord.marginProtection.netMarginUsd.toLocaleString()} Net
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenDocumentCenter?.('PROFORMA_INVOICE', ord.id)}
                              className="p-1.5 rounded-lg bg-[#F8FAF8] hover:bg-white text-[#1F3A2E] border border-[#DDE3DD] transition-colors"
                              title="Generate/Preview Proforma Invoice"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenDocumentCenter?.('COMMERCIAL_INVOICE', ord.id)}
                              className="p-1.5 rounded-lg bg-[#F8FAF8] hover:bg-white text-emerald-700 border border-[#DDE3DD] transition-colors"
                              title="Export Commercial Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onNavigateTab('ORDERS')}
                              className="px-2 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-white text-[11px] font-bold transition-colors"
                              title="Open full OMS Time & Action gantt view"
                            >
                              OMS Sync
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: PROFORMA INVOICES & COMMERCIAL QUOTATIONS          */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'QUOTATIONS_PI' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                  <FileText className="w-5 h-5 text-[#C8A96A]" />
                  <span>Official Commercial Quotations &amp; Proforma Invoices (PI)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export banking documents issued under Bangladesh Bank Foreign Exchange Guidelines with L/C opening clauses.
                </p>
              </div>

              <button
                onClick={() => onOpenDocumentCenter?.('PROFORMA_INVOICE')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>+ Issue New Proforma Invoice</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF8] border-b border-[#DDE3DD] text-[#1F3A2E] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">PI Document Number</th>
                    <th className="py-3 px-4">Buyer Entity</th>
                    <th className="py-3 px-4">Product Line</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Quotation Value</th>
                    <th className="py-3 px-4">Payment Terms &amp; L/C</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD]">
                  {INITIAL_QUOTATIONS_PI.map((pi) => (
                    <tr key={pi.id} className="hover:bg-[#F8FAF8]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        {pi.piNumber}
                        <span className="block text-[10px] font-normal text-slate-400">
                          Issued: {pi.issueDate} • Valid: {pi.validUntil}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1A1A1A] block">{pi.buyerCompany}</span>
                        <span className="text-[10px] text-slate-500">{pi.buyerContact}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{pi.styleName}</span>
                        <span className="text-[10px] text-slate-400">Incoterm: {pi.incoterm}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {pi.quantity.toLocaleString()} pcs
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        {pi.currency} {pi.totalValue.toLocaleString()}
                        {isBdStation ? (
                          <>
                            <span className="block text-[10px] text-emerald-800 font-semibold">
                              ({formatBdt(toBdt(pi.totalValue, pi.currency))} BDT)
                            </span>
                            <span className="block text-[9px] text-slate-400">
                              ${pi.totalValueUsd.toLocaleString()} USD
                            </span>
                          </>
                        ) : (
                          <span className="block text-[10px] text-slate-400">
                            (${pi.totalValueUsd.toLocaleString()} USD)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {pi.paymentTerms}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pi.status === 'ACCEPTED_CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : pi.status === 'LC_PENDING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {pi.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDocumentCenter?.('PROFORMA_INVOICE')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAF8] hover:bg-white text-[#1F3A2E] border border-[#DDE3DD] font-semibold text-[11px] transition-colors"
                          >
                            <Eye className="w-3 h-3 text-[#C8A96A]" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => handleCopyLink(pi.piNumber)}
                            className="p-1 rounded-lg bg-[#F8FAF8] hover:bg-white text-slate-600 border border-[#DDE3DD]"
                            title="Copy share link"
                          >
                            {copiedLink === pi.piNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 4: STRATEGIC BUYER ACCOUNTS & LIVING PORTFOLIO       */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'BUYERS' && (
        <div className="space-y-4">
          {/* Header Banner explaining the 5 Pillars of Buyer Portfolio */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#162B22] to-[#1F3A2E] text-white border border-[#C8A96A]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  TIME-TO-TIME LIVING PORTFOLIO
                </span>
                <span className="text-xs text-emerald-200">
                  {buyerPortfolios.length} Enterprise Buyer Portfolios Configured
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C8A96A]" />
                <span>Buyer Portfolio: 5-Pillar Comprehensive Intelligence System</span>
              </h3>
              <p className="text-xs text-emerald-100/90 max-w-3xl">
                Store and maintain ongoing Buyer Profiles: <strong>A.</strong> Current Product List, Visuals &amp; Retail Prices; <strong>B.</strong> Strategic Interest Points &amp; ESG Mandates; <strong>C.</strong> Future Target Product Reach Roadmaps; <strong>D.</strong> Financial &amp; Credit Portfolio; <strong>E.</strong> Business &amp; Buying Team Governance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite('STRATEGIC_ACCOUNTS')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer select-none ${
                    favoritePages?.includes('STRATEGIC_ACCOUNTS')
                      ? 'bg-amber-400 text-[#12231B] border-2 border-amber-300 ring-2 ring-amber-400/30 shadow-amber-900/20'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-amber-400/50'
                  }`}
                  title={
                    favoritePages?.includes('STRATEGIC_ACCOUNTS')
                      ? 'Remove Strategic Accounts from Favorite Pages'
                      : 'Pin Strategic Accounts to Favorite Pages in Header'
                  }
                >
                  <Star
                    className={`w-4 h-4 ${
                      favoritePages?.includes('STRATEGIC_ACCOUNTS')
                        ? 'fill-[#12231B] text-[#12231B]'
                        : 'text-amber-400 fill-amber-400'
                    }`}
                  />
                  <span>
                    {favoritePages?.includes('STRATEGIC_ACCOUNTS')
                      ? 'Strategic Accounts Favorited'
                      : 'Add Strategic Accounts to Fav'}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  const defaultBuyer = buyerPortfolios[0];
                  if (defaultBuyer) setSelectedBuyerPortfolio(defaultBuyer);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold shadow-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1F3A2E]" />
                <span>Explore Featured Portfolio</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerAccounts.map((ba, idx) => {
              const matchingPortfolio = buyerPortfolios.find(
                (p) =>
                  p.buyerCompany.toLowerCase() === ba.company.toLowerCase() ||
                  ba.company.toLowerCase().includes(p.buyerCompany.toLowerCase())
              );
              const productCount = matchingPortfolio?.currentProducts.length || 0;
              const futureCount = matchingPortfolio?.futureReachPlanning.length || 0;

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-5 space-y-4 hover:border-[#1F3A2E]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          onClick={() => setSelectedBuyerPortfolio(getPortfolioForBuyer(ba.company, ba.market))}
                          className="text-base font-bold text-[#1A1A1A] font-heading hover:text-[#C8A96A] cursor-pointer transition-colors"
                          title="Click to open full Buyer Portfolio"
                        >
                          {ba.company}
                        </h4>
                        <p className="text-xs text-slate-500">{ba.contact}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#1F3A2E] text-white">
                        {ba.market} Station
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Verified Credit:</span>
                        <span className="font-bold text-emerald-700">{ba.creditRating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Total Commercial Spend:</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#1F3A2E] block">
                            ${ba.totalSpendUsd.toLocaleString()} USD
                          </span>
                          {isBdStation && (
                            <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                              ({formatBdt(ba.totalSpendUsd * bdtRate)} BDT)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Account Status:</span>
                        <span className="font-semibold text-slate-700">{ba.activeStatus}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 text-[11px]">
                        <span className="text-slate-500">Portfolio Assortment:</span>
                        <span className="font-semibold text-[#1F3A2E]">
                          {productCount} Products • {futureCount} Future Targets
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DDE3DD] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedBuyerPortfolio(getPortfolioForBuyer(ba.company, ba.market))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-all shadow-sm"
                      title="Open living Buyer Portfolio Dossier (5 Pillars)"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Buyer Portfolio</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab('COMMUNICATIONS')}
                      className="p-2 rounded-xl bg-[#F8FAF8] hover:bg-[#F1F3EE] text-[#1F3A2E] text-xs font-semibold border border-[#DDE3DD] transition-colors"
                      title="Open Communications Desk"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C8A96A]" />
                    </button>

                    <button
                      onClick={() => {
                        setNewBuyerCompany(ba.company);
                        setIsCreateModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-[#F8FAF8] hover:bg-[#F1F3EE] text-[#1F3A2E] text-xs font-semibold border border-[#DDE3DD] transition-colors"
                      title="Issue Sales Order (SO)"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 5: SALES FUNNEL & DEAL PIPELINE (FROM CRM)            */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'PIPELINE' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                  <Users2 className="w-5 h-5 text-[#C8A96A]" />
                  <span>Wholesale Deal Progression &amp; Conversion Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live tracking of 254 international procurement accounts from ABM outreach to confirmed L/C order.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('CRM')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-colors"
              >
                <span>Open Full Kanban Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8A96A]" />
              </button>
            </div>

            {/* Funnel Stages */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                { stage: '1. Inquiries / Leads', count: 184, valueUsd: 6400000, value: '$6.4M', color: 'border-slate-300 bg-slate-50' },
                { stage: '2. Tech Pack Review', count: 32, valueUsd: 1800000, value: '$1.8M', color: 'border-amber-300 bg-amber-50/50' },
                { stage: '3. SDO Proto Sampling', count: 18, valueUsd: 840000, value: '$840k', color: 'border-purple-300 bg-purple-50/50' },
                { stage: '4. Quotation / PI Sent', count: 12, valueUsd: 620000, value: '$620k', color: 'border-blue-300 bg-blue-50/50' },
                { stage: '5. Confirmed SO (Won)', count: orders.length, valueUsd: totalGrossSalesUsd, value: `$${(totalGrossSalesUsd/1000).toFixed(0)}k`, color: 'border-emerald-300 bg-emerald-50/60' },
              ].map((fn, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${fn.color} space-y-1.5`}>
                  <span className="text-[11px] font-bold text-slate-700 block">{fn.stage}</span>
                  <div className="text-xl font-bold font-mono text-[#1F3A2E]">{fn.count} Deals</div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-semibold text-slate-600 block">
                      Est: {fn.value}
                    </span>
                    {isBdStation && (
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold block">
                        ({formatBdt(fn.valueUsd * bdtRate, true)} BDT)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* High-Impact Opportunities List */}
            <div className="pt-4 border-t border-[#DDE3DD] space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Top Priority Sourcing Opportunities Ready for Order Conversion
              </h4>
              <div className="divide-y divide-[#DDE3DD]">
                {crmLeads.slice(0, 6).map((lead) => (
                  <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1A1A1A]">{lead.company}</span>
                      <span className="text-slate-400 ml-2">({lead.country || 'Global'})</span>
                      <span className="block text-[11px] text-slate-500">Contact: {lead.contact || 'Head of Buying'} • Focus: {lead.interest || lead.focus || 'Leather Goods'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1F3A2E] block">
                          ${Number(lead.value || 45000).toLocaleString()} USD
                        </span>
                        {isBdStation && (
                          <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                            ({formatBdt(Number(lead.value || 45000) * bdtRate)} BDT)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setNewBuyerCompany(lead.company);
                          setNewTargetMarket(lead.market === 'USA' ? 'US' : lead.market === 'EU' ? 'EU' : lead.market === 'AU' ? 'AU' : 'UK');
                          setIsCreateModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1F3A2E] hover:bg-[#162B22] text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Convert to SO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 6: STATION TARGETS & GROSS MARGIN SIMULATOR           */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'TARGETS' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#1F3A2E] flex items-center gap-2 font-heading">
                <Award className="w-5 h-5 text-[#C8A96A]" />
                <span>Annual Sovereign Operating Station Quota &amp; Margin Ledger</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target realization under ArielMC global sourcing agreements and Bangladesh Bank FX repatriation desks.
              </p>
            </div>

            <div className="space-y-4">
              {stationTargets.map((st, idx) => {
                const pct = Math.round((st.achieved / st.target) * 100);
                const isBd = st.code === 'ARIEL_BD';
                return (
                  <div key={idx} className={`p-4 rounded-xl border space-y-2 ${isBd && isBdStation ? 'bg-emerald-50/60 border-emerald-300 shadow-xs' : 'bg-[#F8FAF8] border-[#DDE3DD]'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1F3A2E]">{st.station}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isBd ? 'bg-emerald-800 text-white' : 'bg-[#1F3A2E] text-white'}`}>
                          {st.code}
                        </span>
                        {isBd && isBdStation && (
                          <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            Central Production &amp; Clearing HQ (BDT ৳)
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {isBd && isBdStation ? (
                          <>
                            <span className="font-mono font-bold text-sm text-emerald-900 block">
                              {formatBdt(st.achievedUsd * bdtRate)} BDT
                            </span>
                            <span className="text-slate-500 text-xs font-mono block">
                              / {formatBdt(st.targetUsd * bdtRate)} BDT (~${(st.target/1000000).toFixed(1)}M USD)
                            </span>
                          </>
                        ) : isBdStation ? (
                          <>
                            <span className="font-mono font-bold text-sm text-[#1F3A2E] block">
                              {st.currencySymbol}{st.achieved.toLocaleString()}
                            </span>
                            <span className="font-mono text-[10px] text-emerald-800 font-semibold block">
                              ({formatBdt(toBdt(st.achieved, st.code === 'ARIEL_UK' ? 'GBP' : st.code === 'ARIEL_EU' ? 'EUR' : st.code === 'ARIEL_AU' ? 'AUD' : 'USD'))} BDT)
                            </span>
                            <span className="text-slate-400 text-xs font-mono block">
                              / {st.currencySymbol}{st.target.toLocaleString()} ({formatBdt(toBdt(st.target, st.code === 'ARIEL_UK' ? 'GBP' : st.code === 'ARIEL_EU' ? 'EUR' : st.code === 'ARIEL_AU' ? 'AUD' : 'USD'))} BDT)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-mono font-bold text-sm text-[#1F3A2E]">
                              {st.currency.split(' ')[0]} {st.achieved.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-xs font-mono ml-1.5">
                              / {st.currency.split(' ')[0]} {st.target.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1F3A2E] via-[#2A4D3D] to-[#C8A96A] rounded-full transition-all"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{pct}% Quota Realization</span>
                      <span>Target Margin Threshold: <strong>25% - 32% Net</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE NEW BUYER SALES ORDER (SO)                      */}
      {/* ------------------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden text-[#1A1A1A]">
            {/* Top-Right Absolute Close Button (Standard Window Position) */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/30 hover:bg-black/60 text-white/90 hover:text-white border border-white/20 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              title="Close Window (X)"
              aria-label="Close Window"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pr-16 py-4 bg-gradient-to-r from-[#1F3A2E] to-[#12231B] text-white border-b border-[#C8A96A]/30">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-[#C8A96A] text-[#1F3A2E]">
                  SO Generation
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  Launch New B2B Sales Order (SO)
                </h3>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateOrderSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buyer Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrods London, Ralph Lauren"
                    value={newBuyerCompany}
                    onChange={(e) => setNewBuyerCompany(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] focus:border-[#1F3A2E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Operating Market *
                  </label>
                  <select
                    value={newTargetMarket}
                    onChange={(e) => setNewTargetMarket(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1F3A2E] font-semibold focus:border-[#1F3A2E] focus:outline-none"
                  >
                    <option value="UK">UK Station (GBP £)</option>
                    <option value="US">US Station (USD $)</option>
                    <option value="EU">EU Station (EUR €)</option>
                    <option value="AU">AU Station (AUD A$)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Sector *
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1F3A2E] font-semibold focus:border-[#1F3A2E] focus:outline-none"
                  >
                    <option value="LEATHER">Leather Goods &amp; Accessories</option>
                    <option value="JUTE">Jute &amp; Diversified Natural Fibers</option>
                    <option value="TEXTILE">Textiles &amp; Organic Apparel</option>
                    <option value="CERAMICS">Ceramics &amp; Handcrafted Pottery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Partner BD Factory *
                  </label>
                  <select
                    value={newFactoryId}
                    onChange={(e) => setNewFactoryId(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1F3A2E] font-semibold focus:border-[#1F3A2E] focus:outline-none"
                  >
                    {factories.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.cluster})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order Quantity (Pcs) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] font-mono focus:border-[#1F3A2E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buyer Unit Price ({newTargetMarket === 'UK' ? '£' : newTargetMarket === 'EU' ? '€' : '$'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] font-mono focus:border-[#1F3A2E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Incoterm *
                  </label>
                  <input
                    type="text"
                    required
                    value={newIncoterm}
                    onChange={(e) => setNewIncoterm(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] focus:border-[#1F3A2E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Terms *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPaymentTerms}
                    onChange={(e) => setNewPaymentTerms(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] focus:border-[#1F3A2E] focus:bg-white focus:outline-none"
                  />
                </div>

              </div>

              {/* Live Margin Calculation Preview */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Real-Time Back-to-Back Margin Protection</span>
                  </div>
                  <span className="text-emerald-700 font-mono">
                    ~28.2% Projected Net
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-emerald-800 font-mono pt-1">
                  <div>
                    <span className="text-slate-500 block">Buyer Total:</span>
                    <strong>{newQuantity * newUnitPrice} {newTargetMarket === 'UK' ? 'GBP' : newTargetMarket === 'EU' ? 'EUR' : 'USD'}</strong>
                    {isBdStation && (
                      <span className="text-[10px] text-emerald-700 block">
                        ({formatBdt(toBdt(newQuantity * newUnitPrice, newTargetMarket === 'UK' ? 'GBP' : newTargetMarket === 'EU' ? 'EUR' : newTargetMarket === 'AU' ? 'AUD' : 'USD'))} BDT)
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estimated Factory Spend:</span>
                    <strong>{formatBdt(newQuantity * newUnitPrice * 120 * 0.68)} BDT</strong>
                    <span className="text-[10px] text-slate-500 block">
                      (~${Math.round((newQuantity * newUnitPrice * 120 * 0.68) / 120).toLocaleString()} USD)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status:</span>
                    <strong className="text-emerald-700">LOCKED HEALTHY</strong>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#DDE3DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DDE3DD] text-slate-600 text-xs font-bold hover:bg-[#F8FAF8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <span>Confirm &amp; Generate SO</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: LIVING BUYER PORTFOLIO DOSSIER (5 PILLARS)             */}
      {/* ------------------------------------------------------------- */}
      {selectedBuyerPortfolio && (
        <BuyerPortfolioModal
          portfolio={selectedBuyerPortfolio}
          onClose={() => setSelectedBuyerPortfolio(null)}
          onSavePortfolio={handleSaveBuyerPortfolio}
          isBdStation={isBdStation}
          bdtRate={bdtRate}
          onIssueSalesOrder={(company) => {
            setNewBuyerCompany(company);
            setIsCreateModalOpen(true);
          }}
          onNavigateTab={onNavigateTab}
        />
      )}

    </div>
  );
};
