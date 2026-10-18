export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export type CollateralCategory = 
  | 'LOOKBOOK' 
  | 'LINE_SHEET' 
  | 'SPEC_DOSSIER' 
  | 'MEDIA_KIT' 
  | 'BRAND_GUIDELINE' 
  | 'SUSTAINABILITY_REPORT';

export type ProductSector = 
  | 'ALL' 
  | 'LEATHER' 
  | 'JUTE' 
  | 'CERAMICS' 
  | 'HOME_TEXTILES' 
  | 'TERRACOTTA';

export interface CampaignKpis {
  targetLeads: number;
  leadsAcquired: number;
  sampleOrdersGenerated: number;
  estimatedPipelineUsd: number;
  roiPercent: number;
}

export interface MarketingCampaign {
  id: string;
  code: string;
  title: string;
  tagline: string;
  targetMarkets: string[]; // e.g. ['UK', 'EU', 'USA', 'AU', 'BD']
  targetSectors: ProductSector[];
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: {
    currency: string;
    planned: number;
    spent: number;
  };
  kpis: CampaignKpis;
  channels: string[];
  keyDeliverables: string[];
  featuredCollateralIds: string[];
  manager: string;
  stationCode: string;
  notes?: string;
}

export interface CollateralPagePreview {
  pageNumber: number;
  title: string;
  image: string;
  caption?: string;
}

export interface DigitalCollateral {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: CollateralCategory;
  sector: ProductSector;
  season: string;
  coverImage: string;
  pages: number;
  fileSize: string;
  fileFormat: 'PDF' | 'ZIP' | 'MP4' | 'AI';
  downloadCount: number;
  viewsCount: number;
  lastUpdated: string;
  downloadUrl: string;
  tags: string[];
  targetAudience: string;
  previewPages: CollateralPagePreview[];
  description: string;
  isPublished: boolean;
}

export interface ConfirmedTradeMeeting {
  id: string;
  buyerName: string;
  company: string;
  country: string;
  countryFlag: string;
  time: string;
  interest: string;
}

export interface TradeShowExhibition {
  id: string;
  name: string;
  edition: string;
  dates: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  countryFlag: string;
  boothNumber: string;
  hall: string;
  assignedStation: string;
  focusSectors: ProductSector[];
  status: 'UPCOMING' | 'ACTIVE' | 'CONCLUDED';
  confirmedMeetings: ConfirmedTradeMeeting[];
  budget: {
    planned: number;
    currency: string;
  };
  expectedBuyerVisits: number;
  preparedCollateral: string[];
  websiteUrl: string;
}

export interface BrandIdentityAsset {
  id: string;
  title: string;
  type: 'LOGO_VECTOR' | 'STATIONERY' | 'PACKAGING_DIELINE' | 'CERTIFICATION_BADGE' | 'SOCIAL_BANNER';
  resolution: string;
  format: string;
  fileUrl: string;
  previewImage: string;
  usageDescription: string;
  fileSize: string;
  restrictedStation?: string;
}

export interface InboundGrowthAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLookbooks: number;
  totalDownloads: number;
  totalTradeShows: number;
  pipelineAttributedUsd: number;
  regionalInterest: {
    region: string;
    flag: string;
    percentage: number;
    inquiries: number;
  }[];
  sectorBreakdown: {
    sector: ProductSector;
    percentage: number;
    downloads: number;
  }[];
}
