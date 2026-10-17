/**
 * ArielMC - Profit & Loss Calculation Data & Engines
 * 
 * Commercial Policy Guidelines:
 * 1. B2B P&L Calculation Method: ORDER WISE (Evaluated per buyer commercial contract / sales order)
 * 2. B2C P&L Calculation Method: LOT / SHIPMENT WISE (Evaluated per production batch / shipping consignment)
 * 3. Profit Margin Policy: Minimum 25% - 30% Net Profit Margin target
 * 4. B2B Wholesale Pricing: 40% - 50% discount off B2C/D2C realized retail price
 */

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES FOR B2B ORDER-WISE P&L
// -----------------------------------------------------------------------------

export type B2bOrderStatus = 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'SETTLED';

export interface B2bOrderCostItem {
  head: string;
  category: 'COGS_FACTORY' | 'LOGISTICS_FREIGHT' | 'TOOLING_BRANDING' | 'BANKING_LC_FINANCE';
  amountUsd: number;
  amountBdt: number;
  description: string;
}

export interface B2BOrderPnl {
  id: string;
  soNumber: string;
  buyerCompany: string;
  buyerContact: string;
  targetMarket: 'UK' | 'US' | 'EU' | 'AU';
  currency: 'GBP' | 'USD' | 'EUR' | 'AUD';
  fxRateToUsd: number;
  incoterm: string;
  status: B2bOrderStatus;
  orderDate: string;
  targetDeliveryDate: string;
  totalQuantity: number;
  
  // Revenue
  contractUnitBuyerCurrency: number;
  contractTotalBuyerCurrency: number;
  contractRevenueUsd: number;
  contractRevenueBdt: number;
  
  // Factory COGS
  linkedPoNumber: string;
  factoryName: string;
  factoryCogsUsd: number;
  factoryCogsBdt: number;
  
  // Direct Order Logistics & Compliance
  inlandFreightPortCfsUsd: number;
  customBrandingToolingUsd: number;
  exportFinanceBankingLcUsd: number;
  complianceBufferUsd: number;
  
  // Computed Totals
  totalOrderCostUsd: number;
  totalOrderCostBdt: number;
  orderNetProfitUsd: number;
  orderNetProfitBdt: number;
  orderProfitMarginPct: number;
  isPolicyCompliant: boolean; // >= 25%
  
  // Per Unit Economics
  revenuePerUnitUsd: number;
  costPerUnitUsd: number;
  profitPerUnitUsd: number;
  
  paymentTerms: string;
  masterLcNumber?: string;
  costBreakdown: B2bOrderCostItem[];
  notes: string;
}

// -----------------------------------------------------------------------------
// 2. TYPES & INTERFACES FOR B2C LOT / SHIPMENT-WISE P&L
// -----------------------------------------------------------------------------

export type B2cLotStatus = 'IN_TRANSIT' | 'ARRIVED_HUB' | 'FULFILLING' | 'SETTLED' | 'SOLD_OUT';
export type B2cFreightType = 'OCEAN_40HC' | 'OCEAN_40FT' | 'AIR_EXPRESS';

export interface B2cLotChannelSales {
  channel: 'Amazon FBA Prime' | 'Shopify DTC Global' | 'Mayfair Showroom POS' | 'Marketplace Partners';
  unitsSold: number;
  averageRrpUsd: number;
  grossSalesUsd: number;
}

export interface B2cLotCostItem {
  category: 'FACTORY_COGS' | 'FREIGHT_SHIPPING' | 'PORT_CUSTOMS' | 'WAREHOUSE_3PL' | 'FBA_PICK_PACK' | 'MARKETING_CAC' | 'GATEWAY_FEES';
  name: string;
  amountUsd: number;
  pctOfNetRevenue: number;
  description: string;
}

export interface B2CLotShipmentPnl {
  id: string;
  lotNumber: string;
  consignmentNumber: string;
  destinationHub: string;
  hubLocation: 'UK' | 'US' | 'EU';
  carrierVessel: string;
  freightType: B2cFreightType;
  status: B2cLotStatus;
  departureDate: string;
  etaArrivalDate: string;
  totalUnits: number;
  unitsSold: number;
  retailCurrency: 'GBP' | 'USD' | 'EUR';
  
  // Revenue Top-line
  grossRetailSalesBuyerCurrency: number;
  grossSalesUsd: number;
  vatOrSalesTaxRemittanceUsd: number; // UK 20% VAT / US state marketplace tax shielded by PVA
  netCommercialTurnoverUsd: number; // Gross - Tax
  
  // Landed Cost & Direct Operations
  factoryFobCogsUsd: number;
  oceanOrAirFreightUsd: number;
  portCustomsClearanceCfsUsd: number;
  inbound3plReceivingStorageUsd: number;
  amazonFbaOrLocalPickPackUsd: number;
  channelPerformanceAdSpendUsd: number;
  paymentGatewayFxProcessingUsd: number;
  
  // Computed Totals
  totalLotCostUsd: number;
  lotNetProfitUsd: number;
  lotProfitMarginPct: number; // (Profit / Net Commercial Turnover) * 100
  isPolicyCompliant: boolean;
  
  // Per Unit Unit Economics
  grossRrpPerUnitUsd: number;
  netRevenuePerUnitUsd: number;
  landedCostPerUnitUsd: number;
  fulfillmentAndAdPerUnitUsd: number;
  profitPerUnitUsd: number;
  
  channels: B2cLotChannelSales[];
  costBreakdown: B2cLotCostItem[];
  vesselTrackingNote: string;
}

// -----------------------------------------------------------------------------
// 3. B2B ORDER-WISE DATASET (Calculated per buyer contract)
// -----------------------------------------------------------------------------

export const B2B_ORDER_PNL_DATA: B2BOrderPnl[] = [
  {
    id: 'b2b-ord-001',
    soNumber: 'SO-2026-UK-001',
    buyerCompany: 'Harrods London',
    buyerContact: 'Eleanor Vance (Senior Accessories Buyer)',
    targetMarket: 'UK',
    currency: 'GBP',
    fxRateToUsd: 1.30,
    incoterm: 'FOB Chittagong Port',
    status: 'IN_PRODUCTION',
    orderDate: '2026-09-20',
    targetDeliveryDate: '2026-12-18',
    totalQuantity: 1500,
    
    contractUnitBuyerCurrency: 45.0,
    contractTotalBuyerCurrency: 67500,
    contractRevenueUsd: 87750,
    contractRevenueBdt: 10661625,
    
    linkedPoNumber: 'PO-2026-FAC-001',
    factoryName: 'Apex Footwear Ltd - Unit 2 Leathercraft (Gazipur)',
    factoryCogsUsd: 57500,
    factoryCogsBdt: 6900000,
    
    inlandFreightPortCfsUsd: 4500,
    customBrandingToolingUsd: 950,
    exportFinanceBankingLcUsd: 550,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 63500,
    totalOrderCostBdt: 7715250,
    orderNetProfitUsd: 24250,
    orderNetProfitBdt: 2946375,
    orderProfitMarginPct: 27.64,
    isPolicyCompliant: true,
    
    revenuePerUnitUsd: 58.50,
    costPerUnitUsd: 42.33,
    profitPerUnitUsd: 16.17,
    
    paymentTerms: 'Confirmed Irrevocable L/C at Sight (HSBC London)',
    masterLcNumber: 'HSBC-LON-LC-948102',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 57500,
        amountBdt: 6900000,
        description: '1,500 pcs Full-Grain Pull-Up Leather Messenger bags @ ৳4,600/unit FOB factory.'
      },
      {
        head: '2. Inland Logistics & CFS Port',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 4500,
        amountBdt: 546750,
        description: 'Dedicated GPS-sealed container trucking from Gazipur to Chittagong Port + CFS terminal handling.'
      },
      {
        head: '3. Custom Debossing & Dies',
        category: 'TOOLING_BRANDING',
        amountUsd: 950,
        amountBdt: 115425,
        description: 'Bespoke Harrods signature brass hot-stamping die, interior woven heritage labels and barcoding.'
      },
      {
        head: '4. Bank LC & Export Filings',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 550,
        amountBdt: 66825,
        description: 'Eastern Bank PLC L/C advising charge, Bangladesh Bank Form EXP certification and courier of shipping docs.'
      }
    ],
    notes: 'Premier department store order for Knightsbridge flagship store. 100% Letter of Credit backed with zero bad debt exposure.'
  },
  {
    id: 'b2b-ord-002',
    soNumber: 'SO-2026-US-001',
    buyerCompany: 'Nordstrom NYC',
    buyerContact: 'Marcus Sterling (VP Merchandising - Sustainable Living)',
    targetMarket: 'US',
    currency: 'USD',
    fxRateToUsd: 1.0,
    incoterm: 'DDP New York Hub',
    status: 'CONFIRMED',
    orderDate: '2026-10-02',
    targetDeliveryDate: '2027-01-15',
    totalQuantity: 2000,
    
    contractUnitBuyerCurrency: 57.0,
    contractTotalBuyerCurrency: 114000,
    contractRevenueUsd: 114000,
    contractRevenueBdt: 13851000,
    
    linkedPoNumber: 'PO-2026-FAC-002',
    factoryName: 'Bengal Leather Complex & Artisan Hub (Savar)',
    factoryCogsUsd: 74000,
    factoryCogsBdt: 8991000,
    
    inlandFreightPortCfsUsd: 5800,
    customBrandingToolingUsd: 1100,
    exportFinanceBankingLcUsd: 800,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 81700,
    totalOrderCostBdt: 9926550,
    orderNetProfitUsd: 32300,
    orderNetProfitBdt: 3924450,
    orderProfitMarginPct: 28.33,
    isPolicyCompliant: true,
    
    revenuePerUnitUsd: 57.00,
    costPerUnitUsd: 40.85,
    profitPerUnitUsd: 16.15,
    
    paymentTerms: '50% TT Wire Deposit upon PO, 50% upon Bill of Lading Surrender',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 74000,
        amountBdt: 8991000,
        description: '2,000 pcs Bloom Embroidered Laptop Totes with LWG Gold leather handles @ $37.00/unit.'
      },
      {
        head: '2. Inland Logistics & Ocean Share',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 5800,
        amountBdt: 704700,
        description: 'Inland transport to Chittagong and consolidated container space to Port of Newark / NY Hub.'
      },
      {
        head: '3. Custom Nordstrom Packaging',
        category: 'TOOLING_BRANDING',
        amountUsd: 1100,
        amountBdt: 133650,
        description: 'Nordstrom EDI barcode carton marking, individual organic cotton dust covers and swing tags.'
      },
      {
        head: '4. Treasury Wire & Forex Clearing',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 800,
        amountBdt: 97200,
        description: 'International Fedwire reception charges via Chase New York Station and forex hedging spread.'
      }
    ],
    notes: 'Major US department store seasonal expansion across 8 prime Northeast stores. Upfront 50% deposit received into Chase NY Station.'
  },
  {
    id: 'b2b-ord-003',
    soNumber: 'SO-2026-EU-002',
    buyerCompany: 'Le Bon Marché Paris',
    buyerContact: 'Camille Dubois (Head of Luxury Accessories)',
    targetMarket: 'EU',
    currency: 'EUR',
    fxRateToUsd: 1.08,
    incoterm: 'CIF Port of Le Havre / Paris',
    status: 'IN_PRODUCTION',
    orderDate: '2026-09-28',
    targetDeliveryDate: '2026-12-28',
    totalQuantity: 1200,
    
    contractUnitBuyerCurrency: 62.0,
    contractTotalBuyerCurrency: 74400,
    contractRevenueUsd: 80352,
    contractRevenueBdt: 9762768,
    
    linkedPoNumber: 'PO-2026-FAC-003',
    factoryName: 'Picard Bangladesh Ltd - Artisan Guild (Tongi)',
    factoryCogsUsd: 51800,
    factoryCogsBdt: 6293700,
    
    inlandFreightPortCfsUsd: 4100,
    customBrandingToolingUsd: 1450,
    exportFinanceBankingLcUsd: 1050,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 58400,
    totalOrderCostBdt: 7095600,
    orderNetProfitUsd: 21952,
    orderNetProfitBdt: 2667168,
    orderProfitMarginPct: 27.32,
    isPolicyCompliant: true,
    
    revenuePerUnitUsd: 66.96,
    costPerUnitUsd: 48.67,
    profitPerUnitUsd: 18.29,
    
    paymentTerms: 'Irrevocable L/C at 60 Days Sight (BNP Paribas Paris)',
    masterLcNumber: 'BNP-PARIS-LC-22904',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 51800,
        amountBdt: 6293700,
        description: '1,200 pcs Structured Leather Tote in Deep Burgundy and Chestnut Tan @ $43.16/unit.'
      },
      {
        head: '2. Logistics & Marine Insurance',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 4100,
        amountBdt: 498150,
        description: 'Chittagong port handling, ocean transit to Rotterdam and Institute Cargo Clauses (A) all-risk insurance.'
      },
      {
        head: '3. French Luxury Foil Debossing',
        category: 'TOOLING_BRANDING',
        amountUsd: 1450,
        amountBdt: 176175,
        description: 'Individual serialized numbered leather provenance tags and French bilingual care instruction booklets.'
      },
      {
        head: '4. Bank LC Advising & REX EU Origin',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 1050,
        amountBdt: 127575,
        description: 'Registered Exporter (REX) EU origin certification (0% duty under GSP/EBA) and L/C processing fees.'
      }
    ],
    notes: 'Left Bank Paris department store partnership. High prestige brand alignment for ArielMC European positioning.'
  },
  {
    id: 'b2b-ord-004',
    soNumber: 'SO-2026-AU-001',
    buyerCompany: 'David Jones Sydney',
    buyerContact: 'Lachlan Murdoch (Merchandise Lead - Sustainable Goods)',
    targetMarket: 'AU',
    currency: 'AUD',
    fxRateToUsd: 0.66,
    incoterm: 'FOB Chittagong Port',
    status: 'SHIPPED',
    orderDate: '2026-08-15',
    targetDeliveryDate: '2026-11-20',
    totalQuantity: 800,
    
    contractUnitBuyerCurrency: 65.0,
    contractTotalBuyerCurrency: 52000,
    contractRevenueUsd: 34320,
    contractRevenueBdt: 4169880,
    
    linkedPoNumber: 'PO-2026-FAC-004',
    factoryName: 'Apex Footwear Ltd - Unit 2 Leathercraft',
    factoryCogsUsd: 22400,
    factoryCogsBdt: 2721600,
    
    inlandFreightPortCfsUsd: 2800,
    customBrandingToolingUsd: 620,
    exportFinanceBankingLcUsd: 480,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 26300,
    totalOrderCostBdt: 3195450,
    orderNetProfitUsd: 8020,
    orderNetProfitBdt: 974430,
    orderProfitMarginPct: 23.37,
    isPolicyCompliant: false, // 23.37% is slightly below 25% min policy target due to higher initial tooling
    
    revenuePerUnitUsd: 42.90,
    costPerUnitUsd: 32.88,
    profitPerUnitUsd: 10.02,
    
    paymentTerms: 'Confirmed L/C at Sight (Commonwealth Bank of Australia)',
    masterLcNumber: 'CBA-SYD-LC-559102',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 22400,
        amountBdt: 2721600,
        description: '800 pcs Jute-Cotton Commuter Totes with heavy-duty top zipper @ $28.00/unit.'
      },
      {
        head: '2. Inland Trucking & Port Handling',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 2800,
        amountBdt: 340200,
        description: 'Inland transport, fumigation inspection and Chittagong container loading for direct Melbourne vessel.'
      },
      {
        head: '3. Custom Australian Swing Tags',
        category: 'TOOLING_BRANDING',
        amountUsd: 620,
        amountBdt: 75330,
        description: 'Custom Australian consumer law warranty tags and David Jones retail pricing stickers.'
      },
      {
        head: '4. Bank LC Advising & Courier',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 480,
        amountBdt: 58320,
        description: 'CBA Australia L/C transmission fees and DHL courier of original bills of lading.'
      }
    ],
    notes: 'Initial pilot order for Sydney Elizabeth Street and Melbourne Bourke Street stores. Margin was 23.4% due to first-time tooling amortization; re-order margin projected at 28.5%.'
  },
  {
    id: 'b2b-ord-005',
    soNumber: 'SO-2026-UK-002',
    buyerCompany: 'Selfridges & Co London',
    buyerContact: 'Sophie Montgomery (Contemporary Buyer)',
    targetMarket: 'UK',
    currency: 'GBP',
    fxRateToUsd: 1.30,
    incoterm: 'DDP Northampton Hub / Oxford St',
    status: 'SETTLED',
    orderDate: '2026-07-10',
    targetDeliveryDate: '2026-10-05',
    totalQuantity: 1000,
    
    contractUnitBuyerCurrency: 44.0,
    contractTotalBuyerCurrency: 44000,
    contractRevenueUsd: 57200,
    contractRevenueBdt: 6949800,
    
    linkedPoNumber: 'PO-2026-FAC-005',
    factoryName: 'Bengal Leather Complex (Savar)',
    factoryCogsUsd: 36000,
    factoryCogsBdt: 4374000,
    
    inlandFreightPortCfsUsd: 2900,
    customBrandingToolingUsd: 850,
    exportFinanceBankingLcUsd: 520,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 40270,
    totalOrderCostBdt: 4892805,
    orderNetProfitUsd: 16930,
    orderNetProfitBdt: 2056995,
    orderProfitMarginPct: 29.60,
    isPolicyCompliant: true,
    
    revenuePerUnitUsd: 57.20,
    costPerUnitUsd: 40.27,
    profitPerUnitUsd: 16.93,
    
    paymentTerms: 'Bank TT Wire (100% Received in Barclays UK Station)',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 36000,
        amountBdt: 4374000,
        description: '1,000 pcs Executive Leather Folios & Cardholder Sets @ $36.00/unit.'
      },
      {
        head: '2. Consolidated Ocean Freight',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 2900,
        amountBdt: 352350,
        description: 'Consolidated ocean freight to Southampton and delivery to Selfridges distribution center.'
      },
      {
        head: '3. Gold Foil Hot Stamping',
        category: 'TOOLING_BRANDING',
        amountUsd: 850,
        amountBdt: 103275,
        description: 'Bespoke Selfridges Yellow inner lining and gold-leaf debossed presentation boxes.'
      },
      {
        head: '4. Treasury Wire & Forex Clearing',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 520,
        amountBdt: 63180,
        description: 'Barclays Bank UK corporate account wire processing and statutory documentation.'
      }
    ],
    notes: 'Order fully delivered and settled. 100% funds cleared in Barclays UK Station with 29.6% net margin.'
  },
  {
    id: 'b2b-ord-006',
    soNumber: 'SO-2026-US-002',
    buyerCompany: "Bloomingdale's 59th St New York",
    buyerContact: 'Julian Alvarez (Senior Sourcing Director)',
    targetMarket: 'US',
    currency: 'USD',
    fxRateToUsd: 1.0,
    incoterm: 'CIF Port of New York & New Jersey',
    status: 'CONFIRMED',
    orderDate: '2026-10-12',
    targetDeliveryDate: '2027-02-10',
    totalQuantity: 1500,
    
    contractUnitBuyerCurrency: 48.0,
    contractTotalBuyerCurrency: 72000,
    contractRevenueUsd: 72000,
    contractRevenueBdt: 8748000,
    
    linkedPoNumber: 'PO-2026-FAC-006',
    factoryName: 'Picard Bangladesh Ltd (Tongi)',
    factoryCogsUsd: 45000,
    factoryCogsBdt: 5467500,
    
    inlandFreightPortCfsUsd: 3600,
    customBrandingToolingUsd: 750,
    exportFinanceBankingLcUsd: 650,
    complianceBufferUsd: 0,
    
    totalOrderCostUsd: 50000,
    totalOrderCostBdt: 6075000,
    orderNetProfitUsd: 22000,
    orderNetProfitBdt: 2673000,
    orderProfitMarginPct: 30.56,
    isPolicyCompliant: true,
    
    revenuePerUnitUsd: 48.00,
    costPerUnitUsd: 33.33,
    profitPerUnitUsd: 14.67,
    
    paymentTerms: 'Confirmed L/C at Sight (JPMorgan Chase NY)',
    masterLcNumber: 'JPMC-NYC-LC-77192',
    costBreakdown: [
      {
        head: '1. Direct Factory Sourcing',
        category: 'COGS_FACTORY',
        amountUsd: 45000,
        amountBdt: 5467500,
        description: '1,500 pcs Natural Jute Commuter Totes with cognac pull-up leather straps @ $30.00/unit.'
      },
      {
        head: '2. Inland Trucking & Ocean Drayage',
        category: 'LOGISTICS_FREIGHT',
        amountUsd: 3600,
        amountBdt: 437400,
        description: 'Inland transport, container seal security and ocean shipping from CTG to Newark.'
      },
      {
        head: '3. Custom Bloomingdales Packaging',
        category: 'TOOLING_BRANDING',
        amountUsd: 750,
        amountBdt: 91125,
        description: 'Iconic black-and-white custom tissue wrap, retail barcode stickers and protective poly sleeves.'
      },
      {
        head: '4. Bank LC Advising & Customs Bond',
        category: 'BANKING_LC_FINANCE',
        amountUsd: 650,
        amountBdt: 78975,
        description: 'Chase NY L/C document examination and US customs single-entry security bond.'
      }
    ],
    notes: 'Spring/Summer eco-friendly capsule collection for flagship Manhattan store and e-commerce.'
  }
];

// Helper: Calculate B2B Summary
export const getB2bOrderPnlSummary = (orders: B2BOrderPnl[] = B2B_ORDER_PNL_DATA) => {
  const totalOrders = orders.length;
  const totalUnits = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalRevenueUsd = orders.reduce((sum, o) => sum + o.contractRevenueUsd, 0);
  const totalRevenueBdt = orders.reduce((sum, o) => sum + o.contractRevenueBdt, 0);
  const totalFactoryCogsUsd = orders.reduce((sum, o) => sum + o.factoryCogsUsd, 0);
  const totalLogisticsUsd = orders.reduce((sum, o) => sum + o.inlandFreightPortCfsUsd, 0);
  const totalToolingUsd = orders.reduce((sum, o) => sum + o.customBrandingToolingUsd, 0);
  const totalBankingUsd = orders.reduce((sum, o) => sum + o.exportFinanceBankingLcUsd, 0);
  const totalCostUsd = orders.reduce((sum, o) => sum + o.totalOrderCostUsd, 0);
  const totalNetProfitUsd = orders.reduce((sum, o) => sum + o.orderNetProfitUsd, 0);
  const totalNetProfitBdt = orders.reduce((sum, o) => sum + o.orderNetProfitBdt, 0);
  const blendedMarginPct = totalRevenueUsd > 0 ? (totalNetProfitUsd / totalRevenueUsd) * 100 : 0;
  const compliantOrdersCount = orders.filter((o) => o.isPolicyCompliant).length;

  return {
    totalOrders,
    totalUnits,
    totalRevenueUsd,
    totalRevenueBdt,
    totalFactoryCogsUsd,
    totalLogisticsUsd,
    totalToolingUsd,
    totalBankingUsd,
    totalCostUsd,
    totalNetProfitUsd,
    totalNetProfitBdt,
    blendedMarginPct,
    compliantOrdersCount,
  };
};

// -----------------------------------------------------------------------------
// 4. B2C LOT / SHIPMENT-WISE DATASET (Calculated per production & shipping batch)
// -----------------------------------------------------------------------------

export const B2C_LOT_SHIPMENT_PNL_DATA: B2CLotShipmentPnl[] = [
  {
    id: 'b2c-lot-001',
    lotNumber: 'LOT-2026-UK-S01',
    consignmentNumber: 'EXP-2026-CTG-UK-01',
    destinationHub: 'WH-UK (Northampton 3PL Hub)',
    hubLocation: 'UK',
    carrierVessel: 'MSC MAYA / Voyage 2603W',
    freightType: 'OCEAN_40HC',
    status: 'IN_TRANSIT',
    departureDate: '2026-03-12',
    etaArrivalDate: '2026-04-22',
    totalUnits: 1800,
    unitsSold: 1420,
    retailCurrency: 'GBP',
    
    grossRetailSalesBuyerCurrency: 94800,
    grossSalesUsd: 123240,
    vatOrSalesTaxRemittanceUsd: 17500, // UK 20% VAT (shielded at border via Postponed VAT Accounting)
    netCommercialTurnoverUsd: 105740,
    
    factoryFobCogsUsd: 33230,
    oceanOrAirFreightUsd: 2850,
    portCustomsClearanceCfsUsd: 400,
    inbound3plReceivingStorageUsd: 320,
    amazonFbaOrLocalPickPackUsd: 18460,
    channelPerformanceAdSpendUsd: 16800,
    paymentGatewayFxProcessingUsd: 2640,
    
    totalLotCostUsd: 74700,
    lotNetProfitUsd: 31040,
    lotProfitMarginPct: 29.35,
    isPolicyCompliant: true,
    
    grossRrpPerUnitUsd: 68.47,
    netRevenuePerUnitUsd: 58.74,
    landedCostPerUnitUsd: 20.44,
    fulfillmentAndAdPerUnitUsd: 21.05,
    profitPerUnitUsd: 17.24,
    
    channels: [
      {
        channel: 'Amazon FBA Prime',
        unitsSold: 850,
        averageRrpUsd: 68.50,
        grossSalesUsd: 58225,
      },
      {
        channel: 'Shopify DTC Global',
        unitsSold: 420,
        averageRrpUsd: 72.00,
        grossSalesUsd: 30240,
      },
      {
        channel: 'Mayfair Showroom POS',
        unitsSold: 150,
        averageRrpUsd: 85.00,
        grossSalesUsd: 12750,
      }
    ],
    costBreakdown: [
      {
        category: 'FACTORY_COGS',
        name: 'Dhaka Factory Sourcing (FOB)',
        amountUsd: 33230,
        pctOfNetRevenue: 31.43,
        description: '1,800 units across Structured Tote, Bloom Laptop Tote and Commuter packs.'
      },
      {
        category: 'FREIGHT_SHIPPING',
        name: 'Ocean Freight (CTG -> Felixstowe)',
        amountUsd: 2850,
        pctOfNetRevenue: 2.70,
        description: 'Dedicated 40HC container slot via MSC MAYA with 6 desiccant poles.'
      },
      {
        category: 'PORT_CUSTOMS',
        name: 'Port CFS & Customs Brokerage',
        amountUsd: 400,
        pctOfNetRevenue: 0.38,
        description: 'Felixstowe terminal handling, DCTS 0% origin tariff clearance & phytosanitary release.'
      },
      {
        category: 'WAREHOUSE_3PL',
        name: 'Northampton 3PL Inbound Receiving',
        amountUsd: 320,
        pctOfNetRevenue: 0.30,
        description: 'Pallet unloading, carton inspection, and barcoding verification.'
      },
      {
        category: 'FBA_PICK_PACK',
        name: 'Amazon UK FBA & D2C Pick/Pack',
        amountUsd: 18460,
        pctOfNetRevenue: 17.46,
        description: 'Amazon UK Prime pick/pack fees, 15% referral fee and Royal Mail Tracked 24 D2C dispatch.'
      },
      {
        category: 'MARKETING_CAC',
        name: 'Amazon PPC & Meta Video UGC CAC',
        amountUsd: 16800,
        pctOfNetRevenue: 15.89,
        description: 'Sponsored Products target ACOS 24% and London commuter Instagram video campaigns.'
      },
      {
        category: 'GATEWAY_FEES',
        name: 'Stripe & Shopify Payments (2.5%)',
        amountUsd: 2640,
        pctOfNetRevenue: 2.50,
        description: 'Card merchant processing fees, currency conversion and fraud screening.'
      }
    ],
    vesselTrackingNote: 'Container MSCU-742910-4 on MSC MAYA. On schedule passing Suez Canal toward Felixstowe.'
  },
  {
    id: 'b2c-lot-002',
    lotNumber: 'LOT-2026-US-S01',
    consignmentNumber: 'EXP-2026-CTG-US-01',
    destinationHub: 'WH-US (Ontario California 3PL Hub)',
    hubLocation: 'US',
    carrierVessel: 'MAERSK MC-KINNEY / Voy 2605E',
    freightType: 'OCEAN_40HC',
    status: 'ARRIVED_HUB',
    departureDate: '2026-02-18',
    etaArrivalDate: '2026-03-29',
    totalUnits: 2200,
    unitsSold: 1850,
    retailCurrency: 'USD',
    
    grossRetailSalesBuyerCurrency: 158400,
    grossSalesUsd: 158400,
    vatOrSalesTaxRemittanceUsd: 11880, // US marketplace facilitator state sales tax
    netCommercialTurnoverUsd: 146520,
    
    factoryFobCogsUsd: 46200,
    oceanOrAirFreightUsd: 3450,
    portCustomsClearanceCfsUsd: 650,
    inbound3plReceivingStorageUsd: 380,
    amazonFbaOrLocalPickPackUsd: 24600,
    channelPerformanceAdSpendUsd: 26500,
    paymentGatewayFxProcessingUsd: 3660,
    
    totalLotCostUsd: 105440,
    lotNetProfitUsd: 41080,
    lotProfitMarginPct: 28.04,
    isPolicyCompliant: true,
    
    grossRrpPerUnitUsd: 72.00,
    netRevenuePerUnitUsd: 66.60,
    landedCostPerUnitUsd: 23.04,
    fulfillmentAndAdPerUnitUsd: 24.89,
    profitPerUnitUsd: 18.67,
    
    channels: [
      {
        channel: 'Amazon FBA Prime',
        unitsSold: 1200,
        averageRrpUsd: 72.00,
        grossSalesUsd: 86400,
      },
      {
        channel: 'Shopify DTC Global',
        unitsSold: 550,
        averageRrpUsd: 75.00,
        grossSalesUsd: 41250,
      },
      {
        channel: 'Marketplace Partners',
        unitsSold: 100,
        averageRrpUsd: 70.00,
        grossSalesUsd: 7000,
      }
    ],
    costBreakdown: [
      {
        category: 'FACTORY_COGS',
        name: 'Dhaka Factory Production (FOB)',
        amountUsd: 46200,
        pctOfNetRevenue: 31.53,
        description: '2,200 units (Bloom 16" and Natural Jute Commuter Totes).'
      },
      {
        category: 'FREIGHT_SHIPPING',
        name: 'Ocean Freight (CTG -> Port of Long Beach)',
        amountUsd: 3450,
        pctOfNetRevenue: 2.35,
        description: 'Trans-Pacific container slot via Maersk Line.'
      },
      {
        category: 'PORT_CUSTOMS',
        name: 'Port Drayage & US Customs Clearance',
        amountUsd: 650,
        pctOfNetRevenue: 0.44,
        description: 'Port drayage to Ontario CA warehouse and CBP customs broker filing.'
      },
      {
        category: 'WAREHOUSE_3PL',
        name: 'Ontario 3PL Intake & Palletizing',
        amountUsd: 380,
        pctOfNetRevenue: 0.26,
        description: 'Break-bulk receiving, barcode scanning and Amazon FBA carton prep.'
      },
      {
        category: 'FBA_PICK_PACK',
        name: 'Amazon US FBA Fees & Fulfillment',
        amountUsd: 24600,
        pctOfNetRevenue: 16.79,
        description: 'Amazon US Prime multi-channel fulfillment, referral commissions and UPS ground shipping.'
      },
      {
        category: 'MARKETING_CAC',
        name: 'Amazon US PPC & TikTok UGC Ads',
        amountUsd: 26500,
        pctOfNetRevenue: 18.09,
        description: 'Top-of-search Amazon PPC keywords and US commuter TikTok creator ad spend.'
      },
      {
        category: 'GATEWAY_FEES',
        name: 'Stripe & Chase Custody Processing',
        amountUsd: 3660,
        pctOfNetRevenue: 2.50,
        description: 'Credit card merchant fee settlement through Chase US Station.'
      }
    ],
    vesselTrackingNote: 'Arrived at Ontario CA 3PL Hub. Actively fulfilling Amazon US Prime and DTC Shopify orders.'
  },
  {
    id: 'b2c-lot-003',
    lotNumber: 'LOT-2026-EU-S01',
    consignmentNumber: 'EXP-2026-CTG-DE-02',
    destinationHub: 'WH-DE (Hamburg / Ruhr Fulfillment Hub)',
    hubLocation: 'EU',
    carrierVessel: 'CMA CGM LOUVRE / Voy 1109S',
    freightType: 'OCEAN_40FT',
    status: 'IN_TRANSIT',
    departureDate: '2026-03-24',
    etaArrivalDate: '2026-05-02',
    totalUnits: 1500,
    unitsSold: 980,
    retailCurrency: 'EUR',
    
    grossRetailSalesBuyerCurrency: 93000,
    grossSalesUsd: 100440,
    vatOrSalesTaxRemittanceUsd: 14800, // 19% EU VAT (German / Dutch import VAT deferred via PVA)
    netCommercialTurnoverUsd: 85640,
    
    factoryFobCogsUsd: 28500,
    oceanOrAirFreightUsd: 2750,
    portCustomsClearanceCfsUsd: 430,
    inbound3plReceivingStorageUsd: 340,
    amazonFbaOrLocalPickPackUsd: 13900,
    channelPerformanceAdSpendUsd: 13200,
    paymentGatewayFxProcessingUsd: 2140,
    
    totalLotCostUsd: 61260,
    lotNetProfitUsd: 24380,
    lotProfitMarginPct: 28.47,
    isPolicyCompliant: true,
    
    grossRrpPerUnitUsd: 66.96,
    netRevenuePerUnitUsd: 57.09,
    landedCostPerUnitUsd: 21.35,
    fulfillmentAndAdPerUnitUsd: 19.56,
    profitPerUnitUsd: 16.25,
    
    channels: [
      {
        channel: 'Amazon FBA Prime',
        unitsSold: 550,
        averageRrpUsd: 68.00,
        grossSalesUsd: 37400,
      },
      {
        channel: 'Shopify DTC Global',
        unitsSold: 350,
        averageRrpUsd: 70.00,
        grossSalesUsd: 24500,
      },
      {
        channel: 'Marketplace Partners',
        unitsSold: 80,
        averageRrpUsd: 65.00,
        grossSalesUsd: 5200,
      }
    ],
    costBreakdown: [
      {
        category: 'FACTORY_COGS',
        name: 'Dhaka Factory Production (FOB)',
        amountUsd: 28500,
        pctOfNetRevenue: 33.28,
        description: '1,500 units Structured Leather Tote LT2 & Jute Commuter packs.'
      },
      {
        category: 'FREIGHT_SHIPPING',
        name: 'Ocean Freight (CTG -> Port of Hamburg)',
        amountUsd: 2750,
        pctOfNetRevenue: 3.21,
        description: '40FT container space via CMA CGM LOUVRE.'
      },
      {
        category: 'PORT_CUSTOMS',
        name: 'Hamburg Port Handling & Customs Clear',
        amountUsd: 430,
        pctOfNetRevenue: 0.50,
        description: 'EBA preferential 0% tariff clearance and veterinary phytosanitary check.'
      },
      {
        category: 'WAREHOUSE_3PL',
        name: 'Ruhr Hub Inbound Intake & Storage',
        amountUsd: 340,
        pctOfNetRevenue: 0.40,
        description: 'Pallet storage and barcoding compliance for European distribution.'
      },
      {
        category: 'FBA_PICK_PACK',
        name: 'DHL Parcel & Amazon EU Pan-European Fees',
        amountUsd: 13900,
        pctOfNetRevenue: 16.23,
        description: 'DHL Paket cross-border EU shipping to Germany, France, Netherlands.'
      },
      {
        category: 'MARKETING_CAC',
        name: 'Google Shopping EU & Meta DE/FR Ads',
        amountUsd: 13200,
        pctOfNetRevenue: 15.41,
        description: 'Localized German and French performance marketing campaigns.'
      },
      {
        category: 'GATEWAY_FEES',
        name: 'Stripe, iDEAL & ING Settlement',
        amountUsd: 2140,
        pctOfNetRevenue: 2.50,
        description: 'European payment processing via ING Amsterdam Station.'
      }
    ],
    vesselTrackingNote: 'Container CMAU-821940-1 on CMA CGM LOUVRE in transit. Expected Hamburg docking early May.'
  },
  {
    id: 'b2c-lot-004',
    lotNumber: 'LOT-2026-UK-A01',
    consignmentNumber: 'EXP-2026-DAC-UK-A01',
    destinationHub: 'WH-UK (London Heathrow Air Cargo / Mayfair)',
    hubLocation: 'UK',
    carrierVessel: 'British Airways World Cargo (BA-144)',
    freightType: 'AIR_EXPRESS',
    status: 'SOLD_OUT',
    departureDate: '2026-01-10',
    etaArrivalDate: '2026-01-14',
    totalUnits: 500,
    unitsSold: 500,
    retailCurrency: 'GBP',
    
    grossRetailSalesBuyerCurrency: 38000,
    grossSalesUsd: 49400,
    vatOrSalesTaxRemittanceUsd: 7200,
    netCommercialTurnoverUsd: 42200,
    
    factoryFobCogsUsd: 13500,
    oceanOrAirFreightUsd: 3850,
    portCustomsClearanceCfsUsd: 620,
    inbound3plReceivingStorageUsd: 1450,
    amazonFbaOrLocalPickPackUsd: 0, // Handled exclusively via Mayfair white-glove courier
    channelPerformanceAdSpendUsd: 7200,
    paymentGatewayFxProcessingUsd: 1055,
    
    totalLotCostUsd: 27675,
    lotNetProfitUsd: 14525,
    lotProfitMarginPct: 34.42,
    isPolicyCompliant: true,
    
    grossRrpPerUnitUsd: 98.80,
    netRevenuePerUnitUsd: 84.40,
    landedCostPerUnitUsd: 35.94,
    fulfillmentAndAdPerUnitUsd: 19.44,
    profitPerUnitUsd: 29.05,
    
    channels: [
      {
        channel: 'Mayfair Showroom POS',
        unitsSold: 320,
        averageRrpUsd: 102.00,
        grossSalesUsd: 32640,
      },
      {
        channel: 'Shopify DTC Global',
        unitsSold: 180,
        averageRrpUsd: 93.11,
        grossSalesUsd: 16760,
      }
    ],
    costBreakdown: [
      {
        category: 'FACTORY_COGS',
        name: 'Dhaka VIP Capsule Sourcing (FOB)',
        amountUsd: 13500,
        pctOfNetRevenue: 31.99,
        description: '500 units Artisan Limited-Edition Leather bags with brass numbered plates.'
      },
      {
        category: 'FREIGHT_SHIPPING',
        name: 'Air Express Freight (Dhaka -> London Heathrow)',
        amountUsd: 3850,
        pctOfNetRevenue: 9.12,
        description: 'British Airways World Cargo direct priority flight (4-day transit).'
      },
      {
        category: 'PORT_CUSTOMS',
        name: 'Heathrow Air Cargo Terminal Clearance',
        amountUsd: 620,
        pctOfNetRevenue: 1.47,
        description: 'Rapid air waybill clearance and bonded courier to Central London.'
      },
      {
        category: 'WAREHOUSE_3PL',
        name: 'Mayfair Showroom Handling & White Glove Pack',
        amountUsd: 1450,
        pctOfNetRevenue: 3.44,
        description: 'Silk dustbags, bespoke rigid debossed presentation boxes & ribbon seal.'
      },
      {
        category: 'FBA_PICK_PACK',
        name: 'FBA Fees',
        amountUsd: 0,
        pctOfNetRevenue: 0.0,
        description: 'Nil (fulfilled via bespoke private courier in London).'
      },
      {
        category: 'MARKETING_CAC',
        name: 'VIP Launch Event & Press Gifting CAC',
        amountUsd: 7200,
        pctOfNetRevenue: 17.06,
        description: 'London fashion press reception, founder dinner & targeted luxury digital placement.'
      },
      {
        category: 'GATEWAY_FEES',
        name: 'Stripe & Barclays UK Settlement',
        amountUsd: 1055,
        pctOfNetRevenue: 2.50,
        description: 'Merchant payment gateway clearing directly into Barclays UK Station.'
      }
    ],
    vesselTrackingNote: 'Launch capsule 100% completed & sold out. Generated high-ticket customer acquisition.'
  }
];

// Helper: Calculate B2C Summary
export const getB2cLotShipmentPnlSummary = (lots: B2CLotShipmentPnl[] = B2C_LOT_SHIPMENT_PNL_DATA) => {
  const totalLots = lots.length;
  const totalUnitsShipped = lots.reduce((sum, l) => sum + l.totalUnits, 0);
  const totalUnitsSold = lots.reduce((sum, l) => sum + l.unitsSold, 0);
  const totalGrossSalesUsd = lots.reduce((sum, l) => sum + l.grossSalesUsd, 0);
  const totalVatRemittanceUsd = lots.reduce((sum, l) => sum + l.vatOrSalesTaxRemittanceUsd, 0);
  const totalNetTurnoverUsd = lots.reduce((sum, l) => sum + l.netCommercialTurnoverUsd, 0);
  
  const totalFactoryCogsUsd = lots.reduce((sum, l) => sum + l.factoryFobCogsUsd, 0);
  const totalFreightShippingUsd = lots.reduce((sum, l) => sum + l.oceanOrAirFreightUsd, 0);
  const totalPortCustomsUsd = lots.reduce((sum, l) => sum + l.portCustomsClearanceCfsUsd, 0);
  const totalWarehouse3plUsd = lots.reduce((sum, l) => sum + l.inbound3plReceivingStorageUsd, 0);
  const totalFbaPickPackUsd = lots.reduce((sum, l) => sum + l.amazonFbaOrLocalPickPackUsd, 0);
  const totalMarketingAdSpendUsd = lots.reduce((sum, l) => sum + l.channelPerformanceAdSpendUsd, 0);
  const totalGatewayFeesUsd = lots.reduce((sum, l) => sum + l.paymentGatewayFxProcessingUsd, 0);
  
  const totalCostUsd = lots.reduce((sum, l) => sum + l.totalLotCostUsd, 0);
  const totalNetProfitUsd = lots.reduce((sum, l) => sum + l.lotNetProfitUsd, 0);
  const blendedMarginPct = totalNetTurnoverUsd > 0 ? (totalNetProfitUsd / totalNetTurnoverUsd) * 100 : 0;
  const compliantLotsCount = lots.filter((l) => l.isPolicyCompliant).length;

  return {
    totalLots,
    totalUnitsShipped,
    totalUnitsSold,
    totalGrossSalesUsd,
    totalVatRemittanceUsd,
    totalNetTurnoverUsd,
    totalFactoryCogsUsd,
    totalFreightShippingUsd,
    totalPortCustomsUsd,
    totalWarehouse3plUsd,
    totalFbaPickPackUsd,
    totalMarketingAdSpendUsd,
    totalGatewayFeesUsd,
    totalCostUsd,
    totalNetProfitUsd,
    blendedMarginPct,
    compliantLotsCount,
  };
};
