import { CurrencyCode, ProductSector } from './erp';

export type D2cPlatformType =
  | 'AMAZON_FBA'
  | 'AMAZON_FBM'
  | 'SHOPIFY'
  | 'ETSY'
  | 'TIKTOK_SHOP'
  | 'EBAY'
  | 'RETAIL_STORE';

export type D2cRegion = 'US' | 'UK' | 'EU' | 'AU' | 'GLOBAL';

export interface D2cSalesPoint {
  id: string;
  name: string; // e.g. "Amazon North America Store (FBA)", "Shopify Official Store", "Etsy Heritage Crafts"
  platform: D2cPlatformType;
  storeUrl?: string;
  region: D2cRegion;
  currency: CurrencyCode;
  feePercentage: number; // e.g. 15% for Amazon referral, 2.9% for Shopify, 6.5% for Etsy
  fixedFeePerOrder: number; // e.g. $0.30 or £0.20
  fbaPickPackFeePerUnit?: number; // e.g. $4.85 for Amazon FBA
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  syncStatus: 'LIVE_CONNECTED' | 'MANUAL_ENTRY' | 'SCHEDULED_BATCH';
  lastSyncedAt?: string;
  description?: string;
  createdDate: string;
}

export interface D2cSaleOrderItem {
  sku: string;
  styleName: string;
  sector?: ProductSector;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
  totalPrice: number;
  imageUrl?: string;
}

export interface D2cSaleOrder {
  id: string;
  orderNumber: string; // e.g. "AMZ-114-8492019-20491", "SPF-10492", "ETSY-948102"
  salesPointId: string;
  salesPointName: string;
  platform: D2cPlatformType;
  orderDate: string; // YYYY-MM-DD
  orderTime?: string; // HH:mm
  customerName: string;
  customerEmail?: string;
  customerCountry: string; // e.g. "United States", "United Kingdom", "Germany", "Australia"
  shippingCity?: string;
  items: D2cSaleOrderItem[];
  totalQuantity: number;
  currency: CurrencyCode;
  grossAmount: number;
  grossAmountUsd: number;
  platformFeesUsd: number;
  shippingFeeUsd: number;
  taxAmountUsd: number;
  netPayoutUsd: number;
  fulfillmentMethod: 'FBA' | 'FBM' | 'SHOPIFY_3PL' | 'DIRECT_POST' | 'ROYAL_MAIL' | 'IN_STORE';
  orderStatus: 'DELIVERED' | 'IN_TRANSIT' | 'PROCESSING' | 'RETURNED' | 'CANCELLED';
  trackingNumber?: string;
  carrier?: string;
  customerRating?: number; // 1 to 5
  customerReview?: string;
  notes?: string;
}

export interface D2cChannelSummary {
  platform: D2cPlatformType;
  salesPointName: string;
  totalOrders: number;
  totalUnitsSold: number;
  grossRevenueUsd: number;
  totalFeesUsd: number;
  netPayoutUsd: number;
  averageOrderValueUsd: number;
  returnCount: number;
  returnRatePct: number;
}
