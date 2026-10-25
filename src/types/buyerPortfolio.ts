export type BuyerTierClassification =
  | 'Tier 1 Luxury Department Store'
  | 'High-Street Global Retailer'
  | 'Heritage Fashion House'
  | 'Premium Omnichannel Brand'
  | 'Boutique Lifestyle Chain';

export type BuyerMarketStation = 'UK' | 'US' | 'EU' | 'AU' | 'BD';

export type BuyerAccountStatus =
  | 'STRATEGIC_KEY_ACCOUNT'
  | 'ACTIVE_GROWTH'
  | 'PROSPECT_IN_DEVELOPMENT'
  | 'SEASONAL';

export interface BuyerProductItem {
  id: string;
  sku: string;
  styleName: string;
  imageUrl?: string;
  sector: 'LEATHER' | 'APPAREL' | 'FOOTWEAR' | 'JUTE' | 'HOME_DECOR' | 'ACCESSORIES';
  category: string;
  description?: string;
  wholesaleFobPriceUsd: number;
  buyerCurrency: 'GBP' | 'USD' | 'EUR' | 'AUD' | 'BDT';
  buyerSalesPrice: number; // Buyer's retail price (MSRP/RRP in local currency)
  estimatedMarkupMultiple: number; // e.g., 4.2x retail markup
  activeOrderUnits: number;
  lifetimeOrderedUnits: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  orderStatus: 'IN_PRODUCTION' | 'DELIVERED_STOCK' | 'REPEAT_PLANNED' | 'DISCONTINUED';
}

export interface BuyerInterestPoints {
  preferredMaterials: string[]; // e.g. ["Vegetable-Tanned Cowhide", "GOTS Certified Organic Cotton", "Golden Jute"]
  sustainabilityMandates: string[]; // e.g. ["LWG Gold Tannery Only", "Zero Single-Use Plastic", "EU REACH Annex XVII"]
  qualityStandardsAql: string; // e.g. "Strict AQL 1.0 (Critical 0, Major 1.0, Minor 2.5)"
  packagingAndBranding: string; // e.g. "Debossed Gold Foil Dust Bags, FSC Recycled Hangtags, Master Carton Barcode"
  designAesthetic: string; // e.g. "British Heritage Minimalist with Architectural Silhouette"
  targetLeadTimeWeeks: number; // e.g. 6 to 8 weeks
  priceSensitivity: 'LUXURY_INELASTIC' | 'MID_TIER_BALANCED' | 'VOLUME_SENSITIVE';
  specialRequirementsNotes: string; // Notes on hardware, zipper grade, testing protocols
}

export interface BuyerFutureReachPlan {
  id: string;
  seasonOrQuarter: string; // e.g. "AW 2027 Luxury Travel Suite", "SS 2028 Sustainable Workwear"
  targetCategory: string; // e.g. "Weekend Overnight Duffel & Tech Folios"
  projectedVolumeUnits: number; // e.g. 3,500 pcs
  targetWholesaleFobUsd: number; // e.g. $65.00
  targetRetailSalesPrice: number; // e.g. $240.00
  samplingTargetDate: string; // e.g. "2027-02-15"
  shelfLaunchDate: string; // e.g. "2027-08-01"
  developmentStage: 'CONCEPT' | 'MOOD_BOARD' | 'TECH_PACK_DEV' | 'PROTO_SAMPLING' | 'BUYER_COMMITTED';
  strategicObjective: string; // e.g. "Expand Harrods luggage department footprint against Italian suppliers"
}

export interface BuyerFinancialPortfolio {
  approvedCreditLimitUsd: number;
  paymentTerms: string; // e.g. "90-Day Confirmed Irrevocable L/C at Sight"
  creditRiskRating: 'AAA Sovereign' | 'AA Investment Grade' | 'A Commercial Standard' | 'BBB Watchlist';
  lifetimeGmvUsd: number;
  ytdRevenueUsd: number;
  outstandingReceivablesUsd: number;
  overdueAmountUsd: number;
  advisingIssuingBank: string; // e.g. "HSBC Bank PLC, 8 Canada Square, Canary Wharf London"
  swiftBic: string;
  preferredTradeCurrency: 'GBP' | 'USD' | 'EUR' | 'AUD' | 'BDT';
  paymentPunctualityScorePct: number; // e.g. 99.4%
}

export interface BuyerBusinessPortfolio {
  legalEntityName: string;
  tradeName: string;
  country: string;
  headquarters: string;
  establishedYear: number;
  annualCorporateTurnoverUsd: string; // e.g. "$1.15 Billion"
  storeCount: number; // e.g. 48 Flagship Stores + Global E-commerce
  eCommerceChannels: string[]; // e.g. ["Harrods.com", "Selfridges.com", "Nordstrom Online"]
  tierClassification: BuyerTierClassification;
  keyDecisionMakers: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    linkedIn?: string;
    decisionScope: string; // e.g. "Final Purchase Sign-off", "Technical QA & Fit Approval"
  }[];
  primaryStationBranch: BuyerMarketStation;
}

export interface BuyerCompetitiveIntelligence {
  shareOfWalletPct: number; // e.g. 38% sourced from ArielMC
  primaryAlternativeSourcingHubs: string[]; // e.g. ["Vietnam (Leather)", "India (Textiles)", "Guangdong (Hardware)"]
  strategicAdvantageOverCompetitors: string; // e.g. "35% Lower Duty via Bangladesh EBA / GSP, LWG Gold Eco Traceability"
}

export interface BuyerInteractionLog {
  id: string;
  date: string;
  type: 'SHOWROOM_VISIT' | 'ZOOM_CALL' | 'FACTORY_INSPECTION' | 'PROTO_FEEDBACK' | 'CONTRACT_NEGOTIATION';
  summary: string;
  attendedBy: string;
  nextFollowUpDate?: string;
}

export interface BuyerPortfolio {
  id: string;
  buyerCompany: string;
  brandCode: string;
  logoUrl?: string;
  websiteUrl?: string;
  marketStation: BuyerMarketStation;
  accountStatus: BuyerAccountStatus;
  lastUpdated: string;

  // 5 Core Pillars:
  currentProducts: BuyerProductItem[];          // A. Current Product List, Picture & Sales Price
  interestPoints: BuyerInterestPoints;           // B. Buyer's Interest Points & ESG Mandates
  futureReachPlanning: BuyerFutureReachPlan[];   // C. Future Target Product Reach Planning
  financialPortfolio: BuyerFinancialPortfolio;   // D. Financial Portfolio
  businessPortfolio: BuyerBusinessPortfolio;     // E. Business Portfolio

  // Suggested Value-Add Dimensions:
  competitiveIntelligence: BuyerCompetitiveIntelligence;
  interactionLogs: BuyerInteractionLog[];
  internalMerchandisingNotes: string;
}
