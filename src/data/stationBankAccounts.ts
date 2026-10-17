import { VoucherCurrency } from '@/types/voucher';

export interface StationBankAccount {
  id: string;
  stationCode: 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | 'ARIEL_BD';
  stationName: string;
  country: string;
  countryCode: string;
  flag: string;
  bankName: string;
  accountNumberMask: string;
  currency: VoucherCurrency;
  accountType: string;
  branch: string;
  sortCodeOrRouting?: string;
  swiftBic?: string;
  defaultFxRateToBdt: number;
  purpose: string;
  supportedChannels: string[];
  isPrimary?: boolean;
}

export const STATION_BANK_ACCOUNTS: StationBankAccount[] = [
  // -------------------------------------------------------------
  // 1. UK STATION (Barclays Bank UK PLC & Wise Business UK)
  // -------------------------------------------------------------
  {
    id: 'ba-uk-01',
    stationCode: 'ARIEL_UK',
    stationName: 'UK Station (London Covent Garden HQ)',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    bankName: 'Barclays Bank UK PLC (London Corporate)',
    accountNumberMask: '**** 1184',
    currency: 'GBP',
    accountType: 'Commercial Current & VAT Settlement',
    branch: 'Covent Garden Corporate Branch, London',
    sortCodeOrRouting: 'Sort Code: 20-04-15',
    swiftBic: 'BARCGB22',
    defaultFxRateToBdt: 152.0,
    purpose: 'London showroom POS card payments, UK domestic consumer wires, and HMRC VAT clearing',
    supportedChannels: [
      'London Mayfair Showroom POS',
      'Faster Payments Wire',
      'Shopify UK Payments',
      'Direct Bank Transfer'
    ],
    isPrimary: true,
  },
  {
    id: 'ba-uk-02',
    stationCode: 'ARIEL_UK',
    stationName: 'UK Station (Wise European Clearing Desk)',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    bankName: 'Wise Business UK (Multi-Currency Clearing Desk)',
    accountNumberMask: '**** 7392',
    currency: 'GBP',
    accountType: 'Marketplace Payout & European Clearing',
    branch: 'Digital Settlement Gateway, London',
    sortCodeOrRouting: 'Sort Code: 23-14-70',
    swiftBic: 'TRWIGB2L',
    defaultFxRateToBdt: 152.0,
    purpose: 'Amazon UK Marketplace payouts, Shopify D2C disbursements, and cross-border collections',
    supportedChannels: [
      'Shopify UK Payments',
      'Amazon UK Storefront Payout',
      'Stripe UK Direct',
      'PayPal Express Checkout'
    ],
    isPrimary: false,
  },

  // -------------------------------------------------------------
  // 2. US STATION (JPMorgan Chase Bank & Stripe / Amazon Custody)
  // -------------------------------------------------------------
  {
    id: 'ba-us-01',
    stationCode: 'ARIEL_US',
    stationName: 'US Station (Wilmington / New York)',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    bankName: 'JPMorgan Chase Bank, N.A. (Commercial Treasury)',
    accountNumberMask: '**** 5592',
    currency: 'USD',
    accountType: 'US Commercial Treasury & Corporate Operating',
    branch: 'New York Commercial Banking Center',
    sortCodeOrRouting: 'Routing (ABA): 021000021',
    swiftBic: 'CHASUS33',
    defaultFxRateToBdt: 121.5,
    purpose: 'US domestic ACH collections, high-net-worth client wires, and North American distribution',
    supportedChannels: [
      'ACH Inward Direct Deposit',
      'Fedwire / Domestic Wire',
      'Shopify US Payments',
      'B2C VIP Wire'
    ],
    isPrimary: true,
  },
  {
    id: 'ba-us-02',
    stationCode: 'ARIEL_US',
    stationName: 'US Station (E-Commerce Merchant Escrow)',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    bankName: 'Stripe & Amazon USA Settlement Custody Account',
    accountNumberMask: '**** 8412',
    currency: 'USD',
    accountType: 'E-Commerce Marketplace Settlement Escrow',
    branch: 'Automated Merchant Clearing Desk, San Francisco',
    defaultFxRateToBdt: 121.5,
    purpose: 'Daily Amazon.com Storefront disbursements and Shopify Payments D2C merchant settlement',
    supportedChannels: [
      'Shopify US Payments',
      'Amazon US FBA/FBM Disbursement',
      'Stripe Payments',
      'PayPal D2C'
    ],
    isPrimary: false,
  },

  // -------------------------------------------------------------
  // 3. EU STATION (ING Bank Amsterdam & Rabobank International)
  // -------------------------------------------------------------
  {
    id: 'ba-eu-01',
    stationCode: 'ARIEL_EU',
    stationName: 'EU Station (Amsterdam Wholesale Center)',
    country: 'Netherlands / EU Zone',
    countryCode: 'NL',
    flag: '🇪🇺',
    bankName: 'ING Bank N.V. (Amsterdam Wholesale Banking)',
    accountNumberMask: '**** 3381',
    currency: 'EUR',
    accountType: 'Euro Zone Settlement & Commercial Treasury',
    branch: 'Amsterdam Zuidas Wholesale Center',
    swiftBic: 'INGBNL2A',
    defaultFxRateToBdt: 132.0,
    purpose: 'Euro SEPA consumer payments, iDEAL checkout settlements, and European distribution',
    supportedChannels: [
      'SEPA Instant Credit Transfer',
      'Shopify EU (iDEAL / Bancontact)',
      'Stripe EU',
      'Direct Bank Wire'
    ],
    isPrimary: true,
  },
  {
    id: 'ba-eu-02',
    stationCode: 'ARIEL_EU',
    stationName: 'EU Station (Rotterdam Port Desk)',
    country: 'Netherlands / EU Zone',
    countryCode: 'NL',
    flag: '🇪🇺',
    bankName: 'Rabobank International (Rotterdam Port Desk)',
    accountNumberMask: '**** 6210',
    currency: 'EUR',
    accountType: 'Bonded Customs Guarantee & Transit Account',
    branch: 'Rotterdam Harbor Logistics Division',
    swiftBic: 'RABONL2U',
    defaultFxRateToBdt: 132.0,
    purpose: 'Bonded transit clearance and European marketplace escrow',
    supportedChannels: [
      'SEPA Credit Transfer',
      'Direct Bank Wire'
    ],
    isPrimary: false,
  },

  // -------------------------------------------------------------
  // 4. AU STATION (Commonwealth Bank of Australia & Airwallex)
  // -------------------------------------------------------------
  {
    id: 'ba-au-01',
    stationCode: 'ARIEL_AU',
    stationName: 'AU Station (Sydney Corporate Branch)',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    bankName: 'Commonwealth Bank of Australia (CBA Sydney Corporate)',
    accountNumberMask: '**** 7701',
    currency: 'AUD',
    accountType: 'Business Transaction & GST Settlement',
    branch: 'Sydney George Street Corporate Branch',
    sortCodeOrRouting: 'BSB: 062-000',
    swiftBic: 'CTBAAU2S',
    defaultFxRateToBdt: 80.0,
    purpose: 'Australian Taxation Office GST remittance and domestic wholesale/retail billing',
    supportedChannels: [
      'PayID / Osko Instant Transfer',
      'Direct BSB/Account Transfer',
      'Shopify AU Payments'
    ],
    isPrimary: true,
  },
  {
    id: 'ba-au-02',
    stationCode: 'ARIEL_AU',
    stationName: 'AU Station (Melbourne Cross-Border Rails)',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    bankName: 'Airwallex Australia Multi-Currency Cross-Border Rails',
    accountNumberMask: '**** 4019',
    currency: 'AUD',
    accountType: 'Cross-Border Marketplace Clearing Account',
    branch: 'Melbourne Global Settlement Center',
    defaultFxRateToBdt: 80.0,
    purpose: 'Daily consumer credit card payments, Shopify AU payouts, and inward repatriation',
    supportedChannels: [
      'Shopify AU Payments',
      'Stripe AU',
      'Airwallex Checkout'
    ],
    isPrimary: false,
  },

  // -------------------------------------------------------------
  // 5. BD CENTRAL STATION (Eastern Bank PLC)
  // -------------------------------------------------------------
  {
    id: 'ba-bd-01',
    stationCode: 'ARIEL_BD',
    stationName: 'BD Central Station (Dhaka Central HQ)',
    country: 'Bangladesh',
    countryCode: 'BD',
    flag: '🇧🇩',
    bankName: 'Eastern Bank PLC (Gulshan Corporate Branch)',
    accountNumberMask: '**** 4819',
    currency: 'BDT',
    accountType: 'Primary Operational & Payroll Account',
    branch: 'Gulshan-2 Corporate Branch, Dhaka',
    swiftBic: 'EBLDBDDH',
    defaultFxRateToBdt: 1.0,
    purpose: 'Local showroom counter deposits, direct BDT transfers, and supplier settlements',
    supportedChannels: [
      'Dhaka Flagship VIP POS',
      'bKash Merchant Pay',
      'City Bank / EBL POS Card',
      'BEFTN / NPSB'
    ],
    isPrimary: true,
  },
  {
    id: 'ba-bd-02',
    stationCode: 'ARIEL_BD',
    stationName: 'BD Station (AD Forex Trade Desk)',
    country: 'Bangladesh',
    countryCode: 'BD',
    flag: '🇧🇩',
    bankName: 'Eastern Bank PLC (AD Foreign Exchange Desk)',
    accountNumberMask: '**** 8831',
    currency: 'USD',
    accountType: 'Authorized Dealer (AD) Export Proceeds Account',
    branch: 'AD Foreign Exchange Trade Desk, Dhaka',
    swiftBic: 'EBLDBDDH',
    defaultFxRateToBdt: 121.5,
    purpose: 'Master L/C export negotiation and foreign currency trade facilities',
    supportedChannels: [
      'SWIFT Inward Wire (MT103)',
      'International Card Remittance'
    ],
    isPrimary: false,
  },
];

export const PAYMENT_CHANNELS = [
  { id: 'SHOPIFY', label: 'Shopify Payments D2C', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'STRIPE', label: 'Stripe Direct Checkout', badge: 'bg-indigo-100 text-indigo-800' },
  { id: 'AMAZON', label: 'Amazon Storefront Disbursement (FBA/FBM)', badge: 'bg-amber-100 text-amber-800' },
  { id: 'FASTER_PAYMENTS_ACH', label: 'Faster Payments (UK) / ACH Wire (US)', badge: 'bg-blue-100 text-blue-800' },
  { id: 'SHOWROOM_POS', label: 'Showroom Card POS Terminal (Walk-in)', badge: 'bg-purple-100 text-purple-800' },
  { id: 'PAYPAL', label: 'PayPal Express Checkout', badge: 'bg-sky-100 text-sky-800' },
  { id: 'BANK_TRANSFER', label: 'Direct Station Bank Inward Wire', badge: 'bg-teal-100 text-teal-800' },
];

export const STATION_METADATA: Record<string, { name: string; flag: string; country: string; defaultCurrency: VoucherCurrency; defaultFx: number }> = {
  ARIEL_UK: { name: 'UK Station (London)', flag: '🇬🇧', country: 'United Kingdom', defaultCurrency: 'GBP', defaultFx: 152.0 },
  ARIEL_US: { name: 'US Station (New York / Delaware)', flag: '🇺🇸', country: 'United States', defaultCurrency: 'USD', defaultFx: 121.5 },
  ARIEL_EU: { name: 'EU Station (Amsterdam / Rotterdam)', flag: '🇪🇺', country: 'Netherlands', defaultCurrency: 'EUR', defaultFx: 132.0 },
  ARIEL_AU: { name: 'AU Station (Sydney / Melbourne)', flag: '🇦🇺', country: 'Australia', defaultCurrency: 'AUD', defaultFx: 80.0 },
  ARIEL_BD: { name: 'BD Central Station (Dhaka Niketon)', flag: '🇧🇩', country: 'Bangladesh', defaultCurrency: 'BDT', defaultFx: 1.0 },
};

export const getStationBankById = (id: string): StationBankAccount | undefined => {
  return STATION_BANK_ACCOUNTS.find((b) => b.id === id);
};

export const getStationBanksByCode = (stationCode: string): StationBankAccount[] => {
  return STATION_BANK_ACCOUNTS.filter((b) => b.stationCode === stationCode);
};

export const getDefaultExchangeRate = (currency: VoucherCurrency | string): number => {
  switch (currency) {
    case 'GBP': return 152.0;
    case 'USD': return 121.5;
    case 'EUR': return 132.0;
    case 'AUD': return 80.0;
    case 'BDT': return 1.0;
    default: return 1.0;
  }
};
