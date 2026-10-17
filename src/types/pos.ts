import { ProductSector, CurrencyCode, EntityCode } from './erp';

export type PosStoreLocationId = 'LONDON_MAYFAIR' | 'DHAKA_FLAGSHIP' | 'NEW_YORK_5TH';

export interface PosStoreLocation {
  id: PosStoreLocationId;
  name: string;
  city: string;
  country: string;
  flag: string;
  operatingEntity: EntityCode;
  currency: CurrencyCode;
  currencySymbol: string;
  address: string;
  vatRate: number; // e.g. 0.20 for UK, 0.05 for BD
  taxLabel: string;
  phone: string;
  manager: string;
}

export type PosTerminalMode = 'B2B_WHOLESALE' | 'D2C_RETAIL';

export interface PosCartItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  sector: ProductSector;
  image: string;
  priceMode: 'WHOLESALE' | 'RETAIL';
  unitPrice: number;
  wholesaleFobPrice: number;
  retailMsrpPrice: number;
  factoryCostUsd: number;
  quantity: number;
  moq: number;
  stockFloor: number;
  stockBackroom: number;
  stockHub: number;
}

export interface PosCustomer {
  id: string;
  name: string;
  company?: string;
  type: 'B2B_BUYER' | 'VIP_RETAIL' | 'WALK_IN';
  email: string;
  phone: string;
  tier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  vatNumber?: string;
  creditLimitUsd?: number;
}

export type PosPaymentMethod = 
  | 'CARD_TERMINAL' 
  | 'CASH' 
  | 'BANK_WIRE' 
  | 'APPLE_PAY' 
  | 'BKASH_NAGAD';

export interface PosTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  time: string;
  storeId: PosStoreLocationId;
  mode: PosTerminalMode;
  customer: PosCustomer;
  items: PosCartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
  currencySymbol: string;
  paymentMethod: PosPaymentMethod;
  paymentRef?: string;
  amountTendered: number;
  changeDue: number;
  cashierName: string;
  linkedSalesOrderId?: string;
  notes?: string;
}

export interface PosRegisterShift {
  id: string;
  storeId: PosStoreLocationId;
  cashier: string;
  openedAt: string;
  closedAt?: string;
  openingFloat: number;
  cashSales: number;
  cardSales: number;
  wireSales: number;
  mobileSales: number;
  totalSales: number;
  totalOrders: number;
  b2bOrdersCount: number;
  d2cOrdersCount: number;
  cashExpected: number;
  cashActual?: number;
  variance?: number;
  status: 'OPEN' | 'CLOSED';
}
