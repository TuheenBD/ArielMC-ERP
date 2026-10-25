import { ActiveTab } from '@/components/Sidebar';
import { PageDefinition, FavoriteKey } from '@/types/favorites';

export const FAVORITES_STORAGE_KEY = 'arielmc_favorite_pages_v1';

export const DEFAULT_FAVORITE_PAGES: FavoriteKey[] = [
  'ORDERS',
  'CRM',
  'STRATEGIC_ACCOUNTS',
  'ECOM',
  'PRODUCTS',
];

export const ALL_PAGE_DEFINITIONS: Record<string, PageDefinition> = {
  DASHBOARD: {
    id: 'DASHBOARD',
    targetTab: 'DASHBOARD',
    label: 'Executive Sourcing Command',
    shortLabel: 'Dashboard',
    category: 'Executive Command',
    badge: 'Overview',
    phase: 'Command Hub',
    description: 'Executive sourcing overview, station revenue KPIs, and active pipeline metrics.',
    iconName: 'LayoutDashboard',
  },
  ORDERS: {
    id: 'ORDERS',
    targetTab: 'ORDERS',
    label: 'B2B Sales Orders (SO)',
    shortLabel: 'Sales Orders',
    category: 'Sales & Commercial Command',
    badge: '5 Live SOs',
    phase: 'Phase 5',
    description: 'Export purchase orders, milestone tracking, LC status, and delivery schedules.',
    iconName: 'Repeat',
  },
  CRM: {
    id: 'CRM',
    targetTab: 'CRM',
    label: 'Global CRM & B2B Leads',
    shortLabel: 'Global CRM',
    category: 'Sales & Commercial Command',
    badge: '254 Leads',
    phase: 'Live Suite',
    description: 'International brand buyers, outreach pipeline, lead scoring, and account portfolios.',
    iconName: 'Users2',
  },
  ECOM: {
    id: 'ECOM',
    targetTab: 'ECOM',
    label: 'E-Com Sales',
    shortLabel: 'E-Com Sales',
    category: 'Sales & Commercial Command',
    badge: 'Amazon • Shopify • Etsy',
    phase: 'Multichannel',
    description: 'Amazon Prime FBA/FBM, Shopify storefront, Etsy handmade sales, and channel profitability.',
    iconName: 'Globe2',
  },
  POS: {
    id: 'POS',
    targetTab: 'POS',
    label: 'Store POS',
    shortLabel: 'Store POS',
    category: 'Sales & Commercial Command',
    badge: 'Showroom & Retail',
    phase: 'Live Register',
    description: 'Showroom checkout terminal, barcode scanning, thermal receipts, and cash drawer balance.',
    iconName: 'Store',
  },
  PRODUCTS: {
    id: 'PRODUCTS',
    targetTab: 'PRODUCTS',
    label: 'Master Product Catalog',
    shortLabel: 'Product Catalog',
    category: 'Foundation (Live)',
    badge: '4 Sectors',
    phase: 'Foundation',
    description: 'Sector styles, finished goods, FOB costing matrices, tech packs, and BOM blueprints.',
    iconName: 'Package',
  },
  SALES: {
    id: 'SALES',
    targetTab: 'SALES',
    label: 'Sales Management Hub',
    shortLabel: 'Sales Hub',
    category: 'Sales & Commercial Command',
    badge: 'Core Engine',
    phase: 'Live Hub',
    description: 'Central commercial command, quotation proposals, and proforma invoices (PI).',
    iconName: 'TrendingUp',
  },
  STRATEGIC_ACCOUNTS: {
    id: 'STRATEGIC_ACCOUNTS',
    targetTab: 'SALES',
    subTab: 'BUYERS',
    label: 'Strategic Accounts',
    shortLabel: 'Strategic Accounts',
    category: 'Sales & Commercial Command',
    badge: 'Living Portfolio',
    phase: 'Tier-1 Buyers',
    description: 'Direct access to international strategic buyer accounts, living portfolios, credit ratings & commercial terms.',
    iconName: 'Building2',
  },
  QUOTATIONS_PI: {
    id: 'QUOTATIONS_PI',
    targetTab: 'SALES',
    subTab: 'QUOTATIONS_PI',
    label: 'Proformas & Quotes (PI)',
    shortLabel: 'Proformas (PI)',
    category: 'Sales & Commercial Command',
    badge: '8 Quotes',
    phase: 'Live Hub',
    description: 'Export proforma invoices, formal commercial quotations, and cost breakdowns.',
    iconName: 'FileText',
  },
  MARKETING: {
    id: 'MARKETING',
    targetTab: 'MARKETING',
    label: 'Marketing & Collaterals',
    shortLabel: 'Marketing',
    category: 'Brand & Marketing',
    badge: 'Campaigns Live',
    phase: 'Live Hub',
    description: 'Dual-engine ABM playbooks, buyer lookbooks, email flows, and commercial collateral.',
    iconName: 'Megaphone',
  },
  FINANCE: {
    id: 'FINANCE',
    targetTab: 'FINANCE',
    label: 'Global Multi-Station Finance',
    shortLabel: 'Global Finance',
    category: 'Accounting / Finance',
    badge: '10k P&L Live',
    phase: 'Phase 8',
    description: 'Multi-station statutory accounting, 10k P&L, forex currency conversion, and cash flow.',
    iconName: 'Landmark',
  },
  FACTORIES: {
    id: 'FACTORIES',
    targetTab: 'FACTORIES',
    label: 'BD Factory & Compliance',
    shortLabel: 'Factories',
    category: 'Supply Chain & Manufacturing',
    badge: '8 Factories',
    phase: 'Phase 2',
    description: 'Tanneries, composite mills, social compliance audits, and production capacity.',
    iconName: 'Factory',
  },
  RND: {
    id: 'RND',
    targetTab: 'RND',
    label: 'R&D, Tech Packs & Sampling',
    shortLabel: 'R&D & Sampling',
    category: 'Supply Chain & Manufacturing',
    badge: '8 SDOs',
    phase: 'Phase 3',
    description: 'Sample development orders (SDO), CAD pattern files, grading, and material swatches.',
    iconName: 'FlaskConical',
  },
  LOGISTICS: {
    id: 'LOGISTICS',
    targetTab: 'LOGISTICS',
    label: 'Logistics & Export Docs',
    shortLabel: 'Logistics',
    category: 'Commercial & Global Trade',
    badge: 'Dual-Hub Live',
    phase: 'Phase 6',
    description: 'Vessel consignments, ocean bills of lading (BL), air waybills, and customs declarations.',
    iconName: 'Ship',
  },
  INVENTORY: {
    id: 'INVENTORY',
    targetTab: 'INVENTORY',
    label: 'Multi-Warehouse Inventory',
    shortLabel: 'Inventory',
    category: 'Commercial & Global Trade',
    badge: '12 Hubs Live',
    phase: 'Phase 7 Live',
    description: 'Raw leather, textiles, accessories, finished goods stock, and bin location tracking.',
    iconName: 'Boxes',
  },
  DOCUMENTS: {
    id: 'DOCUMENTS',
    targetTab: 'DOCUMENTS',
    label: 'Document Portal',
    shortLabel: 'Document Portal',
    category: 'Foundation (Live)',
    badge: 'All Stations',
    phase: 'Statutory Hub',
    description: 'Commercial Invoices, Packing Lists, Mushak 6.3 VAT tax invoices, and Purchase Orders.',
    iconName: 'FolderLock',
  },
  STATIONS: {
    id: 'STATIONS',
    targetTab: 'STATIONS',
    label: 'Multi-Entity Stations',
    shortLabel: 'Operating Stations',
    category: 'Foundation (Live)',
    badge: '5 Stations',
    phase: 'Foundation',
    description: 'ArielMC BD, UK, US, EU, and AU global operating entities, tax profiles, and bank links.',
    iconName: 'Building2',
  },
  COMMUNICATIONS: {
    id: 'COMMUNICATIONS',
    targetTab: 'COMMUNICATIONS',
    label: 'Communications & Meetings',
    shortLabel: 'Comm Hub',
    category: 'Foundation (Live)',
    badge: 'Live Desks',
    phase: 'Direct Hub',
    description: 'Instant buyer/supplier live chat, video conferences, memos, and executive board bulletins.',
    iconName: 'Video',
  },
  UTILITIES: {
    id: 'UTILITIES',
    targetTab: 'UTILITIES',
    label: 'Office & Enterprise Utilities',
    shortLabel: 'Utilities',
    category: 'Enterprise Utilities',
    badge: '8 Tools',
    phase: 'Head Section',
    description: 'Corporate calculator, note pad, task manager, calendar, contacts, wallet, and translator.',
    iconName: 'Wrench',
  },
  REPORTS: {
    id: 'REPORTS',
    targetTab: 'REPORTS',
    label: 'Executive Reports Suite',
    shortLabel: 'Executive Reports',
    category: 'Executive Command',
    badge: 'Executive',
    phase: 'Live Hub',
    description: 'Executive cross-station analytics, profit margins, operational audits, and export trends.',
    iconName: 'BarChart3',
  },
};

export const loadFavoritePages = (): FavoriteKey[] => {
  if (typeof window === 'undefined') return DEFAULT_FAVORITE_PAGES;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return DEFAULT_FAVORITE_PAGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      // Validate that items exist in ALL_PAGE_DEFINITIONS
      const valid = parsed.filter((id) => id in ALL_PAGE_DEFINITIONS) as FavoriteKey[];
      return valid;
    }
    return DEFAULT_FAVORITE_PAGES;
  } catch (err) {
    console.error('Error loading favorite pages from localStorage:', err);
    return DEFAULT_FAVORITE_PAGES;
  }
};

export const saveFavoritePages = (favorites: FavoriteKey[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Error saving favorite pages to localStorage:', err);
  }
};

export const togglePageFavorite = (
  currentFavorites: FavoriteKey[],
  id: FavoriteKey
): { updatedFavorites: FavoriteKey[]; isAdded: boolean } => {
  const isExisting = currentFavorites.includes(id);
  let updatedFavorites: FavoriteKey[];
  if (isExisting) {
    updatedFavorites = currentFavorites.filter((t) => t !== id);
  } else {
    updatedFavorites = [...currentFavorites, id];
  }
  saveFavoritePages(updatedFavorites);
  return { updatedFavorites, isAdded: !isExisting };
};

export const getPageMeta = (id: string): PageDefinition => {
  return (
    ALL_PAGE_DEFINITIONS[id] || {
      id: id,
      targetTab: 'DASHBOARD',
      label: id,
      shortLabel: id,
      category: 'General',
      description: 'ArielMC Enterprise ERP Module.',
      iconName: 'LayoutDashboard',
    }
  );
};

