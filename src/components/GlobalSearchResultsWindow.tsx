'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Minus,
  Maximize2,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Factory,
  FlaskConical,
  Users2,
  Truck,
  Boxes,
  FileText,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Compass,
  Briefcase,
  Layers,
  Store,
  DollarSign
} from 'lucide-react';
import {
  ProductItem,
  SupplierFactory,
  SampleDevelopmentOrder,
  BuyerSalesOrder,
  CompanyEntity,
  LogisticsConsignment
} from '@/types/erp';
import { ActiveTab, ThemeProfile } from '@/components/Sidebar';
import { INITIAL_BUYER_PORTFOLIOS } from '@/data/initialBuyerPortfolios';
import { BuyerPortfolio } from '@/types/buyerPortfolio';
import { INITIAL_INVENTORY_ITEMS } from '@/data/initialInventory';
import { initialConsignments } from '@/data/initialLogistics';
import { INITIAL_OFFICIAL_DOCUMENTS } from '@/data/initialOfficialDocuments';
import { INITIAL_CHEMICAL_TESTS } from '@/data/initialChemicalTests';
import { INITIAL_ENTERPRISE_CONTACTS } from '@/data/initialUtilitiesData';
import rawCrmLeads from '@/data/crmLeads.json';

export type SearchCategory = 
  | 'ALL'
  | 'NAVIGATION'
  | 'BUYERS'
  | 'PRODUCTS'
  | 'ORDERS'
  | 'FACTORIES'
  | 'RND'
  | 'CRM'
  | 'LOGISTICS'
  | 'INVENTORY'
  | 'DOCUMENTS'
  | 'STATIONS'
  | 'COMPLIANCE';

export interface GlobalSearchResultItem {
  id: string;
  category: SearchCategory;
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  title: string;
  shortDescription: string;
  badge?: string;
  badgeColor?: string;
  tab: ActiveTab;
  dataItem?: any;
  score?: number;
}

export interface GlobalSearchResultsWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onMinimize: () => void;
  onRestore: () => void;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme?: ThemeProfile;
  products?: ProductItem[];
  orders?: BuyerSalesOrder[];
  factories?: SupplierFactory[];
  samples?: SampleDevelopmentOrder[];
  companies?: CompanyEntity[];
  onSelectResult: (result: GlobalSearchResultItem) => void;
}

/**
 * Converts any 1-based integer to lower-case Roman Numerals (i, ii, iii, iv, v, vi, vii...)
 * Retained for legacy backwards-compatibility if referenced externally.
 */
export function toRomanNumeral(num: number): string {
  if (num <= 0) return 'i';
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
  let roman = '';
  let n = num;
  for (let i = 0; i < val.length; i++) {
    while (n >= val[i]) {
      roman += syms[i];
      n -= val[i];
    }
  }
  return roman || 'i';
}

interface NavigationIntentDef {
  id: string;
  title: string;
  shortDescription: string;
  badge: string;
  badgeColor: string;
  categoryLabel: string;
  tab: ActiveTab;
  keywords: string[];
}

const NAVIGATION_SHORTCUTS: NavigationIntentDef[] = [
  {
    id: 'nav_buyers',
    title: 'Global Buyer Directory & Strategic Brand Portfolios',
    shortDescription: 'Direct access to international strategic accounts (Harrods, Ralph Lauren, M&S, Inditex, West Elm), key merchandising directors & commercial terms.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Buyer Portfolio 360°',
    tab: 'SALES',
    keywords: ['buyer', 'buyers', 'brand', 'brands', 'portfolio', 'portfolios', 'strategic', 'strategic accounts', 'strategic account', 'client', 'clients', 'retailer', 'retailers', 'customer', 'account', 'accounts']
  },
  {
    id: 'nav_factories',
    title: 'Supplier & Factory Network Directory',
    shortDescription: 'Partner tanneries, composite textile mills, knitwear plants, and artisan leather workshops across Savar, Gazipur, and Narayanganj clusters.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Factory Directory',
    tab: 'FACTORIES',
    keywords: ['factory', 'factories', 'supplier', 'suppliers', 'tannery', 'tanneries', 'mill', 'mills', 'vendor', 'vendors', 'workshop', 'tanner']
  },
  {
    id: 'nav_ecom',
    title: 'E-Com Multichannel Sales (Amazon FBA/FBM, Shopify & Etsy)',
    shortDescription: 'Track live Amazon FBA/FBM, Shopify, and Etsy e-commerce sales, gross sales values, orders count, and sales points CRUD management.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'E-Com Sales',
    tab: 'ECOM',
    keywords: ['e-com', 'ecom', 'ecommerce', 'e-commerce', 'amazon', 'shopify', 'etsy', 'd2c', 'b2c', 'sales point', 'sales points', 'multichannel', 'fba', 'fbm', 'online sales']
  },
  {
    id: 'nav_pos',
    title: 'Flagship Showroom & Store POS Terminal',
    shortDescription: 'Showroom point-of-sale checkout register, barcode scanner, receipt generation, cash drawer reconciliation, and offline transaction ledger.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Store POS',
    tab: 'POS',
    keywords: ['pos', 'store pos', 'showroom pos', 'showroom', 'register', 'cash drawer', 'barcode scanner', 'retail checkout', 'receipts']
  },
  {
    id: 'nav_favorites',
    title: 'Favorite Pages & Pinned Quick Links',
    shortDescription: 'Quickly access your pinned favorite ERP modules (Sales Orders, CRM, E-Com Sales, Product Catalog, Finance, etc.).',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Favorite Pages',
    tab: 'DASHBOARD',
    keywords: ['favorite', 'favorites', 'fav', 'favs', 'favorite pages', 'pinned', 'star', 'starred', 'bookmark', 'bookmarks', 'quick access']
  },
  {
    id: 'nav_products',
    title: 'Master Product Catalog & Tech Pack Blueprints',
    shortDescription: 'Finished goods inventory, FOB costing matrices, bill of materials (BOM), and CAD technical measurement packs.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Catalog & Tech Packs',
    tab: 'PRODUCTS',
    keywords: ['product', 'products', 'tech pack', 'techpack', 'tech packs', 'catalog', 'sku', 'skus', 'bom', 'costing', 'blueprint', 'styles']
  },
  {
    id: 'nav_orders',
    title: 'Buyer Sales Orders (SO) & Export Ledger',
    shortDescription: 'Active export purchase orders, factory production milestones, delivery schedules, and LC status tracking.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Sales Orders Ledger',
    tab: 'ORDERS',
    keywords: ['order', 'orders', 'sales order', 'sales orders', 'so', 'po', 'purchase order', 'export order', 'export orders']
  },
  {
    id: 'nav_logistics',
    title: 'Global Logistics Command & Vessel Consignments',
    shortDescription: 'Containerized ocean freight shipments, port departures (Chattogram to Felixstowe/Rotterdam/NYC), bills of lading (B/L), and tracking.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Logistics Command',
    tab: 'LOGISTICS',
    keywords: ['logistics', 'shipment', 'shipments', 'shipping', 'cargo', 'freight', 'container', 'containers', 'vessel', 'bl', 'bill of lading', 'port']
  },
  {
    id: 'nav_documents',
    title: 'Official Document Center & Statutory Generator',
    shortDescription: 'Export commercial invoices, packing lists, certificates of origin (CoO), and statutory customs filings.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Document Center',
    tab: 'DOCUMENTS',
    keywords: ['document', 'documents', 'invoice', 'invoices', 'commercial invoice', 'packing list', 'coo', 'certificate', 'customs']
  },
  {
    id: 'nav_crm',
    title: 'CRM International Pipeline & Outreach Funnel',
    shortDescription: 'Prospect buying teams, commercial outreach campaigns, follow-up cadences, and conversion analytics.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'CRM Pipeline',
    tab: 'CRM',
    keywords: ['crm', 'pipeline', 'lead', 'leads', 'prospect', 'prospects', 'outreach', 'funnel', 'touch', 'deal', 'deals']
  },
  {
    id: 'nav_inventory',
    title: 'Warehouse Inventory & Lot Provenance Ledger',
    shortDescription: 'Stock on hand, finished goods, raw leather hides, fabric rolls, and lot tracking across central and bonded warehouses.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Inventory Ledger',
    tab: 'INVENTORY',
    keywords: ['inventory', 'stock', 'warehouse', 'raw material', 'lot', 'on hand', 'reserve', 'lots']
  },
  {
    id: 'nav_stations',
    title: 'Operating Stations & Statutory Legal Entities',
    shortDescription: 'ArielMC Bangladesh, UK, USA, EU, and Australia statutory company entities, tax IDs, and base currencies.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Operating Stations',
    tab: 'STATIONS',
    keywords: ['station', 'stations', 'entity', 'entities', 'ariel bd', 'ariel uk', 'ariel us', 'tax', 'statutory', 'legal']
  },
  {
    id: 'nav_compliance',
    title: 'Chemical Compliance & Quality Testing Lab',
    shortDescription: 'REACH, OEKO-TEX Standard 100, and CPSIA chemical test reports, laboratory accreditations, and passing certificates.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Compliance Lab',
    tab: 'REPORTS',
    keywords: ['compliance', 'chemical', 'test', 'tests', 'reach', 'oeko-tex', 'lab', 'report', 'qa', 'inspection']
  },
  {
    id: 'nav_marketing',
    title: 'Global Marketing Strategy & Brand Playbook',
    shortDescription: 'International trade show roadmaps (Première Vision, Lineapelle), multi-channel brand campaigns, and marketing ROI.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Marketing Playbook',
    tab: 'MARKETING',
    keywords: ['marketing', 'campaign', 'campaigns', 'strategy', 'playbook', 'exhibition', 'tradeshow', 'premiere vision']
  },
  {
    id: 'nav_forex',
    title: 'Foreign Exchange & Statutory Live Feed',
    shortDescription: 'Bangladesh Bank statutory customs rates, interbank foreign exchange, and historical currency valuation ledger.',
    badge: 'Quick Jump',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    categoryLabel: 'Forex Feeds',
    tab: 'FINANCE',
    keywords: ['forex', 'exchange rate', 'exchange rates', 'fx', 'currency', 'dollar', 'bdt', 'bangladesh bank']
  }
];

export const GlobalSearchResultsWindow: React.FC<GlobalSearchResultsWindowProps> = ({
  isOpen,
  isMinimized,
  onMinimize,
  onRestore,
  onClose,
  searchQuery,
  onSearchChange,
  theme = 'crm-green',
  products = [],
  orders = [],
  factories = [],
  samples = [],
  companies = [],
  onSelectResult
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('ALL');
  const [lastOpenedItem, setLastOpenedItem] = useState<GlobalSearchResultItem | null>(null);

  // Theme styling configurations
  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const windowHeaderBg = isRoyal
    ? 'bg-[#0F172A] border-b border-[#1E293B] text-white'
    : isHydrangea
    ? 'bg-[#230C2E] border-b border-[#3D1A4D] text-white'
    : isCalifornia
    ? 'bg-[#0E202B] border-b border-[#1A384A] text-white'
    : isMossy
    ? 'bg-[#182319] border-b border-[#28382A] text-white'
    : isInkWash
    ? 'bg-[#1F3A2E] border-b border-[#31373E] text-white'
    : isPeach
    ? 'bg-[#2B1B17] border-b border-[#432A24] text-white'
    : isStormy
    ? 'bg-[#1A2530] border-b border-[#2B3B4C] text-white'
    : 'bg-[#1F3A2E] border-b border-[#2C5240] text-white';

  const windowBorderColor = isRoyal
    ? 'border-[#4169E1]'
    : isHydrangea
    ? 'border-[#AD56C4]'
    : isCalifornia
    ? 'border-[#66C4FF]'
    : isMossy
    ? 'border-[#8F9E6D]'
    : isInkWash
    ? 'border-[#6D8196]'
    : isPeach
    ? 'border-[#E39A7B]'
    : isStormy
    ? 'border-[#88BDF2]'
    : 'border-[#C8A96A]';

  const accentPillBg = isRoyal
    ? 'bg-[#4169E1]/20 text-[#60A5FA] border-[#4169E1]/40'
    : isHydrangea
    ? 'bg-[#AD56C4]/20 text-[#FF9CE9] border-[#AD56C4]/40'
    : 'bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/40';

  const linkHoverColor = isRoyal
    ? 'hover:text-[#4169E1]'
    : isHydrangea
    ? 'hover:text-[#AD56C4]'
    : 'hover:text-[#C8A96A]';

  // Comprehensive ERP Global Search across all business verticals
  const searchResults: GlobalSearchResultItem[] = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    if (!rawQuery) return [];

    const cleanQuery = rawQuery.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    const queryTokens = cleanQuery.split(' ').filter(Boolean);
    if (queryTokens.length === 0) return [];

    // Filter out generic search/list intent terms so that "Buyer List" searches for "Buyer" with list intent
    const listIntentWords = new Set(['list', 'directory', 'all', 'view', 'show', 'records', 'items', 'find', 'open']);
    const contentTokens = queryTokens.filter(t => !listIntentWords.has(t));
    const tokensToMatch = contentTokens.length > 0 ? contentTokens : queryTokens;

    // Detect high-intent domain keywords
    const isBuyerIntent = queryTokens.some(t => ['buyer', 'buyers', 'brand', 'brands', 'client', 'clients', 'retailer', 'retailers', 'customer', 'customers'].includes(t));
    const isFactoryIntent = queryTokens.some(t => ['factory', 'factories', 'supplier', 'suppliers', 'tannery', 'tanneries', 'mill', 'mills', 'vendor', 'workshop'].includes(t));
    const isOrderIntent = queryTokens.some(t => ['order', 'orders', 'sales order', 'so', 'po'].includes(t));
    const isProductIntent = queryTokens.some(t => ['product', 'products', 'tech pack', 'techpack', 'catalog', 'sku', 'bom'].includes(t));
    const isEcomIntent = queryTokens.some(t => ['e-com', 'ecom', 'ecommerce', 'e-commerce', 'amazon', 'shopify', 'etsy', 'd2c', 'b2c', 'sales point', 'sales points'].includes(t));
    const isPosIntent = queryTokens.some(t => ['pos', 'store pos', 'showroom', 'register', 'cash drawer', 'checkout', 'counter'].includes(t));
    const isLogisticsIntent = queryTokens.some(t => ['logistics', 'shipment', 'shipping', 'cargo', 'freight', 'container', 'vessel', 'bl'].includes(t));
    const isDocIntent = queryTokens.some(t => ['document', 'documents', 'invoice', 'commercial invoice', 'packing list', 'coo'].includes(t));
    const isCrmIntent = queryTokens.some(t => ['crm', 'pipeline', 'lead', 'leads', 'prospect', 'outreach', 'funnel'].includes(t));
    const isInventoryIntent = queryTokens.some(t => ['inventory', 'stock', 'warehouse', 'raw material', 'lot'].includes(t));
    const isComplianceIntent = queryTokens.some(t => ['compliance', 'chemical', 'reach', 'oeko-tex', 'lab', 'report'].includes(t));
    const isStationIntent = queryTokens.some(t => ['station', 'stations', 'entity', 'statutory'].includes(t));

    const items: GlobalSearchResultItem[] = [];

    // 0. QUICK JUMP NAVIGATION SHORTCUTS
    NAVIGATION_SHORTCUTS.forEach((nav) => {
      let isNavMatch = false;
      let navScore = 0;

      // Exact intent match
      for (const kw of nav.keywords) {
        if (queryTokens.includes(kw) || cleanQuery === kw || cleanQuery === `${kw} list` || cleanQuery === `${kw}s`) {
          isNavMatch = true;
          navScore = 1000;
          break;
        }
      }

      // Title/Description match
      if (!isNavMatch) {
        const titleLower = nav.title.toLowerCase();
        const descLower = nav.shortDescription.toLowerCase();
        const hasAll = tokensToMatch.every(tok => titleLower.includes(tok) || descLower.includes(tok));
        if (hasAll) {
          isNavMatch = true;
          navScore = 800;
        }
      }

      if (isNavMatch) {
        items.push({
          id: nav.id,
          category: 'NAVIGATION',
          categoryLabel: nav.categoryLabel,
          categoryIcon: <Compass className="w-3.5 h-3.5 text-amber-600" />,
          title: `Quick Jump: ${nav.title}`,
          shortDescription: nav.shortDescription,
          badge: nav.badge,
          badgeColor: nav.badgeColor,
          tab: nav.tab,
          score: navScore
        });
      }
    });

    // Helper: Precision field matcher & scorer
    const matchAndScore = (
      primary: string,
      secondary: string,
      body: string,
      category: SearchCategory
    ): { matched: boolean; score: number } => {
      const p = primary.toLowerCase();
      const s = secondary.toLowerCase();
      const b = body.toLowerCase();
      const combined = `${p} ${s} ${b}`;

      // 1. Precision condition: All active tokens must be found in the item
      const hasAllTokens = tokensToMatch.every((tok) => combined.includes(tok));
      if (!hasAllTokens) {
        // Special case: If user searched a general intent (e.g. "Buyer List") and this item belongs to that category
        if (category === 'BUYERS' && isBuyerIntent) {
          // Allow buyer items to show when searching "buyer list"
        } else {
          return { matched: false, score: 0 };
        }
      }

      let score = 0;

      // 2. Exact match bonuses
      if (p === cleanQuery) score += 200;
      else if (p.startsWith(cleanQuery)) score += 120;
      else if (p.includes(cleanQuery)) score += 80;

      // 3. Per-token field scoring
      tokensToMatch.forEach((tok) => {
        if (p === tok) score += 90;
        else if (p.startsWith(tok)) score += 60;
        else if (p.includes(tok)) score += 40;

        if (s.includes(tok)) score += 20;
        if (b.includes(tok)) score += 5;
      });

      // 4. Intent boost to place high-relevance items first
      if (isBuyerIntent && category === 'BUYERS') score += 350;
      if (isFactoryIntent && category === 'FACTORIES') score += 350;
      if (isProductIntent && category === 'PRODUCTS') score += 350;
      if (isOrderIntent && category === 'ORDERS') score += 350;
      if (isLogisticsIntent && category === 'LOGISTICS') score += 350;
      if (isInventoryIntent && category === 'INVENTORY') score += 350;
      if (isDocIntent && category === 'DOCUMENTS') score += 350;
      if (isComplianceIntent && category === 'COMPLIANCE') score += 350;
      if (isStationIntent && category === 'STATIONS') score += 350;

      return { matched: true, score };
    };

    // 1. DEDICATED STRATEGIC BUYERS & BRAND PORTFOLIOS
    const processedBuyerNames = new Set<string>();

    INITIAL_BUYER_PORTFOLIOS.forEach((bp: BuyerPortfolio) => {
      processedBuyerNames.add(bp.buyerCompany.toLowerCase());
      const contactPerson = bp.businessPortfolio?.keyDecisionMakers?.[0]?.name || 'Buying Director';
      const contactRole = bp.businessPortfolio?.keyDecisionMakers?.[0]?.designation || 'Head of Sourcing';
      const turnover = bp.businessPortfolio?.annualCorporateTurnoverUsd || 'Tier 1 Strategic';
      const linesCount = bp.currentProducts?.length || 0;
      const primary = `${bp.buyerCompany} ${bp.brandCode || ''}`;
      const secondary = `${bp.marketStation} Station • ${bp.accountStatus.replace(/_/g, ' ')} • ${bp.businessPortfolio?.country || 'Global'}`;
      const body = `Turnover: ${turnover} • Contact: ${contactPerson} (${contactRole}) • Active Lines: ${linesCount} styles • ${bp.websiteUrl || ''}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'BUYERS');
      if (matched) {
        items.push({
          id: `buyer_${bp.id}`,
          category: 'BUYERS',
          categoryLabel: 'Strategic Buyer Account',
          categoryIcon: <Briefcase className="w-3.5 h-3.5 text-indigo-600" />,
          title: `${bp.buyerCompany} (${bp.brandCode || bp.marketStation})`,
          shortDescription: `${secondary} • ${body}`,
          badge: `${bp.marketStation} • ${bp.accountStatus.replace(/_/g, ' ')}`,
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          tab: 'SALES',
          dataItem: bp,
          score
        });
      }
    });

    // Extract other known key buyers from samples and orders if not already in portfolios
    const additionalBuyers = [
      { name: 'Fortnum & Mason / Selfridges London', station: 'UK', contact: 'Alistair Montgomery (Head of Merchandising)', focus: 'Luxury Leather Goods' },
      { name: 'West Elm', station: 'US', contact: 'David Kline (Bedding & Bath Sourcing)', focus: 'Home Textiles & Sateen' },
      { name: 'John Lewis & Partners', station: 'UK', contact: 'Buying Office London', focus: 'Apparel & Accessories' },
      { name: 'Habitat UK', station: 'UK', contact: 'Homeware Buying Team', focus: 'Jute & Denim Rugs' },
    ];

    additionalBuyers.forEach((ab, idx) => {
      if (!processedBuyerNames.has(ab.name.toLowerCase())) {
        processedBuyerNames.add(ab.name.toLowerCase());
        const primary = ab.name;
        const secondary = `${ab.station} Station • ${ab.focus}`;
        const body = `Key Contact: ${ab.contact} • Commercial Buying Account`;
        const { matched, score } = matchAndScore(primary, secondary, body, 'BUYERS');
        if (matched) {
          items.push({
            id: `buyer_extra_${idx}`,
            category: 'BUYERS',
            categoryLabel: 'Strategic Buyer Account',
            categoryIcon: <Briefcase className="w-3.5 h-3.5 text-indigo-600" />,
            title: `${ab.name} (${ab.station})`,
            shortDescription: `${secondary} • ${body}`,
            badge: `${ab.station} STATION`,
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            tab: 'SALES',
            dataItem: { buyerCompany: ab.name, marketStation: ab.station },
            score
          });
        }
      }
    });

    // 2. PRODUCTS & SKUS
    products.forEach((p) => {
      const fob = p.costing?.b2bFobPriceUsd ? `$${p.costing.b2bFobPriceUsd.toFixed(2)}` : '$42.50';
      const primary = `${p.name} ${p.sku}`;
      const secondary = `${p.category} ${p.subCategory || ''} ${p.hsCode}`;
      const body = `Factory: ${p.partnerFactory?.factoryName || 'Bengal Leather'} • FOB: ${fob} • MoQ: ${p.partnerFactory?.moq || 500} pcs • ${p.description || ''}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'PRODUCTS');
      if (matched) {
        items.push({
          id: `prod_${p.id || p.sku}`,
          category: 'PRODUCTS',
          categoryLabel: 'Product / SKU',
          categoryIcon: <Package className="w-3.5 h-3.5 text-blue-600" />,
          title: `${p.name} (${p.sku})`,
          shortDescription: `${p.category}${p.subCategory ? ` / ${p.subCategory}` : ''} • Factory: ${p.partnerFactory?.factoryName || 'Bengal Leather'} • HS: ${p.hsCode} • FOB: ${fob} • MoQ: ${p.partnerFactory?.moq || 500} pcs`,
          badge: `FOB ${fob}`,
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          tab: 'PRODUCTS',
          dataItem: p,
          score
        });
      }
    });

    // 3. BUYER SALES ORDERS
    orders.forEach((o) => {
      const lineItemDesc = o.items?.length ? `${o.items[0].styleName} (${o.items[0].sku})` : 'Apparel / Leather Order';
      const primary = `${o.soNumber} ${o.buyerCompany}`;
      const secondary = `${o.targetMarket} (${o.incoterm}) ${o.status.replace(/_/g, ' ')}`;
      const body = `${lineItemDesc} • Qty: ${o.totalQuantity?.toLocaleString() || 0} pcs • Contact: ${o.buyerContact || ''}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'ORDERS');
      if (matched) {
        items.push({
          id: `ord_${o.id}`,
          category: 'ORDERS',
          categoryLabel: 'Sales Order',
          categoryIcon: <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />,
          title: `SO: ${o.soNumber} — ${o.buyerCompany}`,
          shortDescription: `${lineItemDesc} • Quantity: ${o.totalQuantity?.toLocaleString() || 0} pcs • Status: ${o.status.replace(/_/g, ' ')} • Target: ${o.targetMarket} (${o.incoterm})`,
          badge: o.status.replace(/_/g, ' '),
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          tab: 'ORDERS',
          dataItem: o,
          score
        });
      }
    });

    // 4. SUPPLIER FACTORIES & TANNERIES
    factories.forEach((f) => {
      const primary = `${f.name} ${f.code}`;
      const secondary = `${f.cluster} ${f.tier.replace(/_/g, ' ')} ${f.factoryAddress}`;
      const body = `Contact: ${f.contactPerson} (${f.designation || 'Factory Manager'}) • Lead Time: ${f.leadTimeDays || 30} days • Machines: ${f.capacity?.machineryList?.slice(0, 3).join(', ') || 'Drum, Milling, Toggle'}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'FACTORIES');
      if (matched) {
        items.push({
          id: `fac_${f.id}`,
          category: 'FACTORIES',
          categoryLabel: 'Supplier Factory',
          categoryIcon: <Factory className="w-3.5 h-3.5 text-amber-600" />,
          title: `${f.name} (${f.code})`,
          shortDescription: `Cluster: ${f.cluster} • Contact: ${f.contactPerson} (${f.designation || 'Factory Manager'}) • Tier: ${f.tier.replace(/_/g, ' ')} • Lead Time: ${f.leadTimeDays || 30} days • Machines: ${f.capacity?.machineryList?.slice(0, 3).join(', ') || 'Drum, Milling, Toggle'}`,
          badge: f.cluster,
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          tab: 'FACTORIES',
          dataItem: f,
          score
        });
      }
    });

    // 5. SAMPLE DEVELOPMENT ORDERS (R&D)
    samples.forEach((s) => {
      // NOTE: Do not include the isolated label word "buyer" in primary/secondary so searching "buyer" doesn't falsely match every sample!
      const primary = `Sample ${s.sdoNumber || s.id}: ${s.styleName} ${s.styleCode || ''}`;
      const secondary = `${s.buyerCompany} • Factory: ${s.factoryName} • Stage: ${s.stage} • ${s.status.replace(/_/g, ' ')}`;
      const body = `Round ${s.roundNumber || 1} • Contact: ${s.buyerContact || ''} • Market: ${s.targetMarket || ''}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'RND');
      if (matched) {
        items.push({
          id: `sdo_${s.id}`,
          category: 'RND',
          categoryLabel: 'R&D / Sample',
          categoryIcon: <FlaskConical className="w-3.5 h-3.5 text-purple-600" />,
          title: `Sample ${s.sdoNumber || s.id}: ${s.styleName}`,
          shortDescription: `Buyer: ${s.buyerCompany} (${s.buyerContact || 'Buyer'}) • Factory: ${s.factoryName} • Stage: ${s.stage} • Status: ${s.status.replace(/_/g, ' ')} • Round ${s.roundNumber || 1}`,
          badge: s.stage,
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          tab: 'RND',
          dataItem: s,
          score
        });
      }
    });

    // 6. CRM LEADS & OUTREACH ACCOUNTS
    (rawCrmLeads as any[]).forEach((lead) => {
      const primary = `${lead.company}`;
      const secondary = `${lead.country || 'Global'} • ${lead.stage || 'Prospect'}`;
      const body = `Contact: ${lead.contact || 'Buying Office'} • Focus: ${lead.interest || lead.focus || 'Leather Goods'} • Channel: ${lead.channel || 'B2B Wholesale'}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'CRM');
      if (matched) {
        items.push({
          id: `crm_${lead.id}`,
          category: 'CRM',
          categoryLabel: 'CRM Lead',
          categoryIcon: <Users2 className="w-3.5 h-3.5 text-indigo-600" />,
          title: `CRM: ${lead.company} (${lead.country || 'Global'})`,
          shortDescription: `Contact: ${lead.contact || 'Buying Office'} • Focus: ${lead.interest || lead.focus || 'Leather Goods'} • Pipeline Stage: ${lead.stage || 'Prospect'} • Channel: ${lead.channel || 'B2B Wholesale'}`,
          badge: lead.stage || 'PROSPECT',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          tab: 'CRM',
          dataItem: lead,
          score
        });
      }
    });

    // 7. LOGISTICS & CONSIGNMENTS
    initialConsignments.forEach((c: LogisticsConsignment) => {
      const primary = `Shipment ${c.consignmentNumber} ${c.billOfLadingNo}`;
      const secondary = `${c.carrierVessel} • ${c.originPort} ➔ ${c.destinationPort}`;
      const body = `Container: ${c.containerNumber} (${c.containerType}) • Status: ${c.status.replace(/_/g, ' ')}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'LOGISTICS');
      if (matched) {
        items.push({
          id: `log_${c.id}`,
          category: 'LOGISTICS',
          categoryLabel: 'Logistics Shipment',
          categoryIcon: <Truck className="w-3.5 h-3.5 text-cyan-600" />,
          title: `Shipment ${c.consignmentNumber} — ${c.carrierVessel}`,
          shortDescription: `Route: ${c.originPort} ➔ ${c.destinationPort} • B/L: ${c.billOfLadingNo} • Container: ${c.containerNumber} (${c.containerType}) • Status: ${c.status.replace(/_/g, ' ')}`,
          badge: c.status.replace(/_/g, ' '),
          badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          tab: 'LOGISTICS',
          dataItem: c,
          score
        });
      }
    });

    // 8. INVENTORY & WAREHOUSE
    INITIAL_INVENTORY_ITEMS.forEach((inv) => {
      const stock = inv.availableQty ?? inv.onHandQty ?? 0;
      const primary = `${inv.sku} ${inv.productName}`;
      const secondary = `${inv.warehouseName} • ${inv.category}`;
      const body = `Lot: ${inv.provenance?.rawMaterialLot || inv.provenance?.batchNumber || 'A-10'} • Available Stock: ${stock.toLocaleString()} pcs • Cost: $${inv.unitCostUsd?.toFixed(2) || '24.50'}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'INVENTORY');
      if (matched) {
        items.push({
          id: `inv_${inv.id}`,
          category: 'INVENTORY',
          categoryLabel: 'Inventory Item',
          categoryIcon: <Boxes className="w-3.5 h-3.5 text-amber-800" />,
          title: `Inventory SKU: ${inv.sku} • ${inv.productName}`,
          shortDescription: `Warehouse: ${inv.warehouseName} • Category: ${inv.category} • Lot: ${inv.provenance?.rawMaterialLot || inv.provenance?.batchNumber || 'A-10'} • Available Stock: ${stock.toLocaleString()} pcs • Cost: $${inv.unitCostUsd?.toFixed(2) || '24.50'}`,
          badge: `${stock.toLocaleString()} pcs in stock`,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          tab: 'INVENTORY',
          dataItem: inv,
          score
        });
      }
    });

    // 9. OFFICIAL EXPORT DOCUMENTS
    INITIAL_OFFICIAL_DOCUMENTS.forEach((doc) => {
      const docCode = doc.documentNumber || doc.docCode || doc.id;
      const primary = `${doc.title} ${docCode}`;
      const secondary = `${doc.category} • ${doc.issuingAuthority}`;
      const body = `Station: ${doc.station} • Issued: ${doc.issueDate} • Status: ${doc.status}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'DOCUMENTS');
      if (matched) {
        items.push({
          id: `doc_${doc.id}`,
          category: 'DOCUMENTS',
          categoryLabel: 'Official Document',
          categoryIcon: <FileText className="w-3.5 h-3.5 text-rose-600" />,
          title: `${doc.title} (${docCode})`,
          shortDescription: `Category: ${doc.category} • Authority: ${doc.issuingAuthority} • Station: ${doc.station} • Issued: ${doc.issueDate} • Status: ${doc.status}`,
          badge: doc.category,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          tab: 'DOCUMENTS',
          dataItem: doc,
          score
        });
      }
    });

    // 10. STATUTORY COMPANIES / STATIONS
    companies.forEach((comp) => {
      const primary = `${comp.legalName} ${comp.code}`;
      const secondary = `${comp.city}, ${comp.country} (${comp.flag}) • Currency: ${comp.baseCurrency}`;
      const body = `Tax ID: ${comp.taxIdentifier?.type} ${comp.taxIdentifier?.number} • Address: ${comp.address}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'STATIONS');
      if (matched) {
        items.push({
          id: `comp_${comp.code}`,
          category: 'STATIONS',
          categoryLabel: 'Operating Station',
          categoryIcon: <Building2 className="w-3.5 h-3.5 text-emerald-700" />,
          title: `Station: ${comp.legalName} (${comp.code})`,
          shortDescription: `${comp.city}, ${comp.country} (${comp.flag}) • Currency: ${comp.baseCurrency} • Tax ID: ${comp.taxIdentifier?.type} ${comp.taxIdentifier?.number} • Address: ${comp.address}`,
          badge: comp.code,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          tab: 'STATIONS',
          dataItem: comp,
          score
        });
      }
    });

    // 11. CHEMICAL COMPLIANCE TESTS
    INITIAL_CHEMICAL_TESTS.forEach((test) => {
      const primary = `Compliance Test: ${test.testReportNumber} ${test.testType.replace(/_/g, ' ')}`;
      const secondary = `${test.sku} • ${test.productName} • Standard: ${test.testStandard}`;
      const body = `Lab: ${test.accreditedLaboratory} • Measured: ${test.measuredValue} • Verdict: ${test.verdict.replace(/_/g, ' ')} • Tannery/Mill: ${test.tanneryOrMillName}`;

      const { matched, score } = matchAndScore(primary, secondary, body, 'COMPLIANCE');
      if (matched) {
        items.push({
          id: `chem_${test.id}`,
          category: 'COMPLIANCE',
          categoryLabel: 'Compliance Test',
          categoryIcon: <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />,
          title: `Compliance Test: ${test.testReportNumber} (${test.testType.replace(/_/g, ' ')})`,
          shortDescription: `SKU: ${test.sku} • Product: ${test.productName} • Standard: ${test.testStandard} • Lab: ${test.accreditedLaboratory} • Measured: ${test.measuredValue} • Verdict: ${test.verdict.replace(/_/g, ' ')}`,
          badge: test.verdict.replace(/_/g, ' '),
          badgeColor: test.verdict.includes('PASSED') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
          tab: 'REPORTS',
          dataItem: test,
          score
        });
      }
    });

    // Sort by score descending (highest relevance first)
    return items.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [searchQuery, products, orders, factories, samples, companies]);

  // Filtered by selected category
  const filteredResults = useMemo(() => {
    if (selectedCategory === 'ALL') return searchResults;
    return searchResults.filter((item) => item.category === selectedCategory);
  }, [searchResults, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: searchResults.length };
    searchResults.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [searchResults]);

  if (!isOpen) return null;

  // Handle clicking a result link
  const handleLinkClick = (item: GlobalSearchResultItem) => {
    setLastOpenedItem(item);
    onSelectResult(item);
  };

  // ========================================================
  // RENDER: MINIMIZED FLOATING DOCK
  // ========================================================
  if (isMinimized) {
    return (
      <div 
        id="global-search-minimized-dock"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl border-2 transition-all duration-300 hover:scale-[1.02] select-none cursor-pointer backdrop-blur-md animate-in fade-in slide-in-from-bottom-3"
        style={{
          backgroundColor: isRoyal ? '#0F172A' : isHydrangea ? '#230C2E' : '#1F3A2E',
          borderColor: isRoyal ? '#4169E1' : isHydrangea ? '#AD56C4' : '#C8A96A',
          color: '#FFFFFF'
        }}
        onClick={onRestore}
        title="Search Results are Minimized. Click to expand and view full results."
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#C8A96A] animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-white/90">Search:</span>
          <span className="font-mono text-[#C8A96A] font-bold max-w-[140px] truncate">&ldquo;{searchQuery}&rdquo;</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold border border-white/20">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand Search Results Window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-full text-white/80 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Search Window"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: EXPANDED FLOATING WINDOW
  // ========================================================
  return (
    <div 
      id="global-search-results-window"
      className={`fixed top-28 right-6 z-50 w-[620px] max-w-[94vw] h-[660px] max-h-[84vh] flex flex-col rounded-2xl border-2 shadow-2xl overflow-hidden bg-white transition-all duration-200 animate-in fade-in zoom-in-95 ${windowBorderColor}`}
    >
      {/* 1. WINDOW TITLE BAR WITH MINIMIZE & CLOSE BUTTONS */}
      <div className={`px-4 py-3 flex items-center justify-between shrink-0 select-none ${windowHeaderBg}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-[#C8A96A]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm tracking-wide text-white truncate">
                Search Results
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${accentPillBg}`}>
                {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
            <div className="text-[11px] text-white/70 truncate flex items-center gap-1.5">
              <span>Query:</span>
              <span className="font-semibold text-white">&ldquo;{searchQuery || 'All records'}&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Window Controls: Minimize and Close */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Minimize Button */}
          <button
            id="search-window-minimize-btn"
            type="button"
            onClick={onMinimize}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all cursor-pointer"
            title="Minimize Window (Keep search docked at bottom while exploring Main Window)"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            id="search-window-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-red-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
            title="Close Search Window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. REFINEMENT SEARCH INPUT & CATEGORY FILTER BAR */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0 space-y-2.5">
        {/* Modern, perfectly centered input container */}
        <div className="relative flex items-center w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type to filter buyers, SKUs, POs, factories, D2C channels..."
            className="w-full h-10 pl-9 pr-9 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A96A] text-slate-800 shadow-2xs font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Clear text"
            >
              <span className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-3.5 h-3.5" />
              </span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({categoryCounts.ALL || 0})
          </button>

          {categoryCounts.NAVIGATION ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('NAVIGATION')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'NAVIGATION'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              ⚡ Quick Jumps ({categoryCounts.NAVIGATION})
            </button>
          ) : null}

          {categoryCounts.BUYERS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('BUYERS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'BUYERS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              🏢 Buyers ({categoryCounts.BUYERS})
            </button>
          ) : null}

          {categoryCounts.PRODUCTS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('PRODUCTS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'PRODUCTS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Products ({categoryCounts.PRODUCTS})
            </button>
          ) : null}

          {categoryCounts.ORDERS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('ORDERS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'ORDERS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Orders ({categoryCounts.ORDERS})
            </button>
          ) : null}

          {categoryCounts.FACTORIES ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('FACTORIES')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'FACTORIES'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Factories ({categoryCounts.FACTORIES})
            </button>
          ) : null}

          {categoryCounts.RND ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('RND')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'RND'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              R&amp;D ({categoryCounts.RND})
            </button>
          ) : null}

          {categoryCounts.CRM ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('CRM')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'CRM'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              CRM ({categoryCounts.CRM})
            </button>
          ) : null}

          {categoryCounts.LOGISTICS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('LOGISTICS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'LOGISTICS'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Logistics ({categoryCounts.LOGISTICS})
            </button>
          ) : null}

          {categoryCounts.INVENTORY ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('INVENTORY')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'INVENTORY'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Inventory ({categoryCounts.INVENTORY})
            </button>
          ) : null}

          {categoryCounts.DOCUMENTS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('DOCUMENTS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'DOCUMENTS'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Docs ({categoryCounts.DOCUMENTS})
            </button>
          ) : null}

          {categoryCounts.STATIONS ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('STATIONS')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'STATIONS'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Stations ({categoryCounts.STATIONS})
            </button>
          ) : null}

          {categoryCounts.COMPLIANCE ? (
            <button
              type="button"
              onClick={() => setSelectedCategory('COMPLIANCE')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'COMPLIANCE'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Compliance ({categoryCounts.COMPLIANCE})
            </button>
          ) : null}
        </div>
      </div>

      {/* 3. SCROLLABLE RESULTS LIST */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 divide-y divide-slate-100 bg-[#FBFBFA]">
        {filteredResults.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-700">No matches found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              We couldn&apos;t find any records matching &ldquo;{searchQuery}&rdquo;. Try searching for buyer brands (Harrods, West Elm), product SKUs, factory names, or D2C channels (Amazon, Shopify).
            </p>
          </div>
        ) : (
          filteredResults.map((item, index) => {
            const isLastOpened = lastOpenedItem?.id === item.id;
            const isNav = item.category === 'NAVIGATION';
            const isBuyer = item.category === 'BUYERS';

            return (
              <div
                key={item.id}
                className={`pt-2.5 first:pt-0 transition-all rounded-xl p-3 ${
                  isLastOpened 
                    ? 'bg-emerald-50/70 border border-emerald-300 shadow-xs' 
                    : isNav
                    ? 'bg-amber-50/40 border border-amber-200/70 hover:bg-amber-50 hover:shadow-xs'
                    : isBuyer
                    ? 'bg-indigo-50/20 border border-indigo-100 hover:bg-white hover:shadow-xs'
                    : 'hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Clean Modern Serial Number Badge */}
                  {isNav ? (
                    <div 
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shrink-0 mt-0.5 select-none shadow-2xs"
                      title="Direct Navigation Shortcut"
                    >
                      ⚡ JUMP
                    </div>
                  ) : isBuyer ? (
                    <div 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 mt-0.5 select-none text-center min-w-[32px]"
                      title={`Result #${index + 1}`}
                    >
                      #{index + 1}
                    </div>
                  ) : (
                    <div 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0 mt-0.5 select-none text-center min-w-[32px]"
                      title={`Result #${index + 1}`}
                    >
                      #{index + 1}
                    </div>
                  )}

                  {/* Result Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {/* Category Badge */}
                      <span className={`flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        isNav 
                          ? 'bg-amber-100 text-amber-800 border-amber-300' 
                          : isBuyer 
                          ? 'bg-indigo-100/70 text-indigo-800 border-indigo-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.categoryIcon}
                        <span>{item.categoryLabel}</span>
                      </span>

                      {/* Status / Metric Badge */}
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Clickable Link */}
                    <button
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      className={`group font-heading font-bold text-sm text-[#1A1A1A] hover:underline flex items-center gap-1.5 text-left transition-colors cursor-pointer ${linkHoverColor}`}
                      title={`Click to open "${item.title}" in the Main Window`}
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96A] shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </button>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.shortDescription}
                    </p>

                    {/* Feedback if opened */}
                    {isLastOpened && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Opened in Main Window ({item.tab} tab)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. WINDOW FOOTER: DECISION BAR */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between gap-3 text-xs">
        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
          <span>Clicking a link opens it in the Main Window.</span>
        </div>

        {/* User Choice Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onMinimize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-[#C8A96A] bg-slate-50 hover:bg-[#FAF6EE] text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Keep search docked at bottom while working in the Main Window"
          >
            <Minus className="w-3 h-3 text-[#C8A96A]" />
            <span>Stay as Minimize</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Close this Search Window"
          >
            <X className="w-3 h-3" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
