import { ProductItem } from "@/types/erp";
import {
  TECH_PACK_BLM_1612,
  TECH_PACK_BLS_1801,
  TECH_PACK_ELR_2001,
  TECH_PACK_IRS_1401,
  TECH_PACK_KNX_0801,
  TECH_PACK_LOK_1201,
} from "./standardTechPacks";

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    "id": "prod-ld-06",
    "sku": "LD-SCB-6",
    "roadmapCode": "LD-SCB-6",
    "prodtId": 6,
    "styleCode": "SCB",
    "eanBarcode": "0538920190001",
    "name": "Structured Satchels, Briefcases & Evening Clutches",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Structured Carry & Bags",
    "subCategory": "Handbags & Executive Carry",
    "hsCode": "4202.11.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Rigid heritage briefcase and satchel with signature turn-lock mechanism, accordion interior dividing walls, and burnished edge saddle-stitch construction.",
    "unit": "PCS",
    "dimensions": "290 x 390 x 95 mm",
    "weightKg": 1.45,
    "tags": [
      "Leather",
      "Structured Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 14162,
      "factoryCostUsd": 113.75,
      "initialFactoryAskingCostBdt": 16341,
      "initialFactoryAskingCostUsd": 131.25,
      "negotiatedSavingsBdt": 2179,
      "negotiatedSavingsUsd": 17.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 114.65,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 175,
      "d2cRetailPriceUsd": 612.5,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 16.63,
      "totalEnterpriseMarginPct": 44
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 25 - 50 pcs)",
        "moqRange": "25 - 50 pcs",
        "fobPriceUsd": 175,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (51 - 100 pcs)",
        "moqRange": "51 - 100 pcs",
        "fobPriceUsd": 161,
        "marginPct": 29.3
      },
      {
        "slabName": "FCL Bulk Volume (101+ pcs)",
        "moqRange": "101+ pcs",
        "fobPriceUsd": 148.75,
        "marginPct": 24.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-SCB-6-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-SCB-6-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "Chromium-VI Free"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/leather/LD-CRK-03.jpg",
      "/images/products/leather/LD-COR-04.jpg",
      "/images/products/leather/LD-HNB-07.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-blm-16",
    "sku": "LD-BLM-16",
    "roadmapCode": "LD-BLM-16",
    "prodtId": 16,
    "styleCode": "BLM",
    "eanBarcode": "0538920190002",
    "name": "Bloom Series Embroidered Denim & Leather Satchel",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Handcrafted Leather Bags",
    "subCategory": "Floral Embroidered Denim & Leather Bags",
    "hsCode": "4202.21.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisan tote pairing custom deep indigo cotton denim with genuine full-grain vegetable-tanned leather trim, multi-colored botanical wildflower embroidery, suspended 16\" laptop chamber, and solid brushed antique brass hardware.",
    "unit": "PCS",
    "dimensions": "305 x 405 x 120 mm",
    "weightKg": 0.85,
    "tags": [
      "Leather",
      "Handcrafted Leather Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1699,
      "factoryCostUsd": 13.65,
      "initialFactoryAskingCostBdt": 1961,
      "initialFactoryAskingCostUsd": 15.75,
      "negotiatedSavingsBdt": 262,
      "negotiatedSavingsUsd": 2.1,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 14.55,
      "arielSourcingMarginPct": 30.7,
      "b2bFobPriceUsd": 21,
      "d2cRetailPriceUsd": 73.5,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2,
      "totalEnterpriseMarginPct": 40.2
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 21,
        "marginPct": 30.7
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 19.32,
        "marginPct": 26.1
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 17.85,
        "marginPct": 21.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-BLM-16-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-BLM-16-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 6
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Gold Audited",
      "REACH Annex XVII",
      "BSCI Grade A",
      "ISO 105-X12 Crocking Pass"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/bloom/bloom-front.jpg",
      "/images/products/bangla_eco/bloom/bloom-strap.jpg",
      "/images/products/bangla_eco/bloom/bloom-detail.jpg",
      "/images/products/bangla_eco/bloom/bloom-back.jpg",
      "/images/products/bangla_eco/bloom/bloom-side.jpg",
      "/images/products/bangla_eco/bloom/bloom-interior.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-bls-18",
    "sku": "LD-BLS-18",
    "roadmapCode": "LD-BLS-18",
    "prodtId": 18,
    "styleCode": "BLS",
    "eanBarcode": "0538920190003",
    "name": "Blossom Floral Embroidered Denim & Leather Bag",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Handcrafted Leather Bags",
    "subCategory": "Floral Embroidered Denim & Leather Bags",
    "hsCode": "4202.21.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Handcrafted boutique bag pairing custom deep indigo denim with genuine full-grain leather trim and refined multicolored floral embroidery. Features imported gold hardware, heavy chain zippers, dual carry handles, secure exterior zip back pocket, and organized brown lining.",
    "unit": "PCS",
    "dimensions": "254 x 241 x 127 mm",
    "weightKg": 0.62,
    "tags": [
      "Leather",
      "Handcrafted Leather Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1214,
      "factoryCostUsd": 9.75,
      "initialFactoryAskingCostBdt": 1401,
      "initialFactoryAskingCostUsd": 11.25,
      "negotiatedSavingsBdt": 187,
      "negotiatedSavingsUsd": 1.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.65,
      "arielSourcingMarginPct": 29,
      "b2bFobPriceUsd": 15,
      "d2cRetailPriceUsd": 52.5,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.43,
      "totalEnterpriseMarginPct": 38.5
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 15,
        "marginPct": 29
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 13.8,
        "marginPct": 24.6
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 12.75,
        "marginPct": 20.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-BLS-18-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-BLS-18-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 7
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "BSCI Grade A",
      "REACH Annex XVII"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/blossom/1-11.png",
      "/images/products/bangla_eco/blossom/1-12.jpg",
      "/images/products/bangla_eco/blossom/1-13.jpg",
      "/images/products/bangla_eco/blossom/1-14.jpg",
      "/images/products/bangla_eco/blossom/1-15.jpg",
      "/images/products/bangla_eco/blossom/1-16.jpg",
      "/images/products/bangla_eco/blossom/1-17.jpeg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-elr-20",
    "sku": "LD-ELR-20",
    "roadmapCode": "LD-ELR-20",
    "prodtId": 20,
    "styleCode": "ELR",
    "eanBarcode": "0538920190004",
    "name": "Elora Floral Embroidered Twill & Leather Tote Bag",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Handcrafted Leather Bags",
    "subCategory": "Floral Embroidered Black Twill & Leather Laptop Totes",
    "hsCode": "4202.21.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "High-capacity tote bag pairing premium heavy black twill fabric with full-grain leather trim and refined botanical floral embroidery. Features solid gold-tone hardware, secure zippered back pocket, and generous interior with padded laptop sleeve, bottle holder, and organizers.",
    "unit": "PCS",
    "dimensions": "305 x 457 x 140 mm",
    "weightKg": 0.82,
    "tags": [
      "Leather",
      "Handcrafted Leather Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2023,
      "factoryCostUsd": 16.25,
      "initialFactoryAskingCostBdt": 2334,
      "initialFactoryAskingCostUsd": 18.75,
      "negotiatedSavingsBdt": 311,
      "negotiatedSavingsUsd": 2.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 17.15,
      "arielSourcingMarginPct": 31.4,
      "b2bFobPriceUsd": 25,
      "d2cRetailPriceUsd": 87.5,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.38,
      "totalEnterpriseMarginPct": 40.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 25,
        "marginPct": 31.4
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 23,
        "marginPct": 26.7
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 21.25,
        "marginPct": 22
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-ELR-20-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-ELR-20-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 9
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "BSCI Grade A",
      "REACH Annex XVII"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/elora/1.jpg",
      "/images/products/bangla_eco/elora/2.jpg",
      "/images/products/bangla_eco/elora/3.jpg",
      "/images/products/bangla_eco/elora/4.jpg",
      "/images/products/bangla_eco/elora/5.jpg",
      "/images/products/bangla_eco/elora/6.jpg",
      "/images/products/bangla_eco/elora/7.jpg",
      "/images/products/bangla_eco/elora/8.jpg",
      "/images/products/bangla_eco/elora/9.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-irs-14",
    "sku": "LD-IRS-14",
    "roadmapCode": "LD-IRS-14",
    "prodtId": 14,
    "styleCode": "IRS",
    "eanBarcode": "0538920190005",
    "name": "Iris Handcrafted Denim & Leather Shoulder Bag",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Handcrafted Leather Bags",
    "subCategory": "Compact Denim & Leather Shoulder Bags",
    "hsCode": "4202.21.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Chic and compact shoulder bag constructed from washed blue cotton denim and genuine full-grain leather. Elevated with imported gold hardware, custom-colored metallic chain, and signature handmade artisan crochet flower charm. Features dual carry and organized brown lining.",
    "unit": "PCS",
    "dimensions": "165 x 267 x 76 mm",
    "weightKg": 0.48,
    "tags": [
      "Leather",
      "Handcrafted Leather Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1093,
      "factoryCostUsd": 8.78,
      "initialFactoryAskingCostBdt": 1261,
      "initialFactoryAskingCostUsd": 10.13,
      "negotiatedSavingsBdt": 168,
      "negotiatedSavingsUsd": 1.35,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 9.68,
      "arielSourcingMarginPct": 28.3,
      "b2bFobPriceUsd": 13.5,
      "d2cRetailPriceUsd": 47.25,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.28,
      "totalEnterpriseMarginPct": 37.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 13.5,
        "marginPct": 28.3
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 12.42,
        "marginPct": 24.1
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 11.47,
        "marginPct": 19.8
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-IRS-14-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-IRS-14-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "BSCI Grade A",
      "REACH Annex XVII",
      "EN 1811 Nickel-Free"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/iris/1.jpg",
      "/images/products/bangla_eco/iris/2.jpg",
      "/images/products/bangla_eco/iris/3.jpeg",
      "/images/products/bangla_eco/iris/4.jpeg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-knx-08",
    "sku": "LD-KNX-08",
    "roadmapCode": "LD-KNX-08",
    "prodtId": 8,
    "styleCode": "KNX",
    "eanBarcode": "0538920190006",
    "name": "Knox Full-Grain Crazy Horse Leather Wallet",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Wallets & Small Leather Goods",
    "subCategory": "Crazy Horse Leather Bifold Wallets",
    "hsCode": "4202.31.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Refined everyday bifold wallet crafted from full-grain Crazy Horse leather with self-healing oil/wax pull-up finish that develops rich vintage patina. Features 3 card slots, 2 full-length cash compartments, hidden sub-pocket, and a dedicated gusseted coin pouch with solid antique brass hardware.",
    "unit": "PCS",
    "dimensions": "86 x 114 x 13 mm",
    "weightKg": 0.11,
    "tags": [
      "Leather",
      "Wallets & Small Leather Goods",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 688,
      "factoryCostUsd": 5.53,
      "initialFactoryAskingCostBdt": 794,
      "initialFactoryAskingCostUsd": 6.38,
      "negotiatedSavingsBdt": 106,
      "negotiatedSavingsUsd": 0.85,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 6.43,
      "arielSourcingMarginPct": 24.4,
      "b2bFobPriceUsd": 8.5,
      "d2cRetailPriceUsd": 29.75,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.81,
      "totalEnterpriseMarginPct": 33.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 8.5,
        "marginPct": 24.4
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 7.82,
        "marginPct": 20.7
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 7.22,
        "marginPct": 17.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-KNX-08-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-KNX-08-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 8
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "BSCI Grade A",
      "REACH Annex XVII",
      "Chromium-VI Free"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/knox/1.jpg",
      "/images/products/bangla_eco/knox/2.jpg",
      "/images/products/bangla_eco/knox/3.jpg",
      "/images/products/bangla_eco/knox/4.jpg",
      "/images/products/bangla_eco/knox/5.jpg",
      "/images/products/bangla_eco/knox/6.jpg",
      "/images/products/bangla_eco/knox/7.jpg",
      "/images/products/bangla_eco/knox/8.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ld-lok-12",
    "sku": "LD-LOK-12",
    "roadmapCode": "LD-LOK-12",
    "prodtId": 12,
    "styleCode": "LOK",
    "eanBarcode": "0538920190007",
    "name": "Loko Full-Grain Crazy Horse Leather Long Wallet",
    "sector": "LEATHER",
    "category": "01 The Leather Compendium / Wallets & Small Leather Goods",
    "subCategory": "Zero-Fabric Crazy Horse Long Wallets & Phone Clutches",
    "hsCode": "4202.31.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "High-capacity continental wallet and smartphone clutch crafted entirely from genuine full-grain Crazy Horse leather with ZERO fabric lining. Features 7 dedicated card slots, a metal chain zipped coin pocket, a dedicated phone chamber fitting devices up to 6.8\", 2 full-length cash/passport compartments, and a 4-point concealed magnetic closure.",
    "unit": "PCS",
    "dimensions": "190 x 95 x 19 mm",
    "weightKg": 0.18,
    "tags": [
      "Leather",
      "Wallets & Small Leather Goods",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1174,
      "factoryCostUsd": 9.43,
      "initialFactoryAskingCostBdt": 1355,
      "initialFactoryAskingCostUsd": 10.88,
      "negotiatedSavingsBdt": 181,
      "negotiatedSavingsUsd": 1.45,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.33,
      "arielSourcingMarginPct": 28.8,
      "b2bFobPriceUsd": 14.5,
      "d2cRetailPriceUsd": 50.75,
      "incentiveCategory": "CRUST_LEATHER_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.38,
      "totalEnterpriseMarginPct": 38.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 14.5,
        "marginPct": 28.8
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 13.34,
        "marginPct": 24.5
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 12.32,
        "marginPct": 20.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/LD-LOK-12-Studio-HiRes.zip",
      "studioPhotoZipName": "LD-LOK-12-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 6
    },
    "attributes": {
      "sector": "LEATHER",
      "data": {
        "leatherType": "Full-Grain Bovine Cowhide",
        "tanningMethod": "Vegetable-Tanned & Chromium-VI Free",
        "hideOrigin": "Savar LWG-Certified Tannery Hub, Dhaka",
        "thicknessMm": "1.2 - 1.4 mm",
        "hardwareFinish": "Solid Antique Brass / Gunmetal Alloy",
        "edgeFinish": "Multi-Layer Hand-Burnished Italian Edge Inking",
        "reachCompliant": true,
        "lwgCertification": "LWG Gold Audited"
      }
    },
    "complianceCertificates": [
      "LWG Audited",
      "BSCI Grade A",
      "REACH Annex XVII"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 28,
      "moq": 25,
      "sampleTurnaroundDays": 8,
      "samplePriceUsd": 65,
      "samplePackingUsd": 15,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/bangla_eco/loko/1.jpg",
      "/images/products/bangla_eco/loko/2.jpg",
      "/images/products/bangla_eco/loko/3.jpg",
      "/images/products/bangla_eco/loko/4.jpg",
      "/images/products/bangla_eco/loko/5.jpeg",
      "/images/products/bangla_eco/loko/6.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-16",
    "sku": "JD-EDC-16",
    "roadmapCode": "JD-EDC-16",
    "prodtId": 16,
    "styleCode": "EDC",
    "eanBarcode": "0538920190008",
    "name": "Laminated High-Capacity Market Totes",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Market Shoppers & Lifestyle Totes",
    "hsCode": "6305.10.10",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "High-capacity utility shopper constructed from 350 GSM golden jute with internal food-grade wipe-clean laminate barrier, cotton cord handles, and 20 kg load capacity.",
    "unit": "PCS",
    "dimensions": "360 x 440 x 180 mm",
    "weightKg": 0.38,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1174,
      "factoryCostUsd": 9.43,
      "initialFactoryAskingCostBdt": 1355,
      "initialFactoryAskingCostUsd": 10.88,
      "negotiatedSavingsBdt": 181,
      "negotiatedSavingsUsd": 1.45,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.33,
      "arielSourcingMarginPct": 28.8,
      "b2bFobPriceUsd": 14.5,
      "d2cRetailPriceUsd": 50.75,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.38,
      "totalEnterpriseMarginPct": 38.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 14.5,
        "marginPct": 28.8
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 13.34,
        "marginPct": 24.5
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 12.32,
        "marginPct": 20.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-EDC-16-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-EDC-16-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "DAE Phytosanitary",
      "Fumigation Certified",
      "Sedex SMETA"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/JD-EDC-16.jpg",
      "/images/products/jute/JD-EDC-16-navy-sq.jpg",
      "/images/products/jute/JD-EDC-16-logo-detail.jpg",
      "/images/products/jute/JD-EDC-16-handle-detail.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-20-amc",
    "sku": "JD-EDC-20-AMC",
    "roadmapCode": "JD-EDC-20-AMC",
    "prodtId": 201,
    "styleCode": "EDC",
    "eanBarcode": "0538920190009",
    "name": "Eco-Friendly Jute Tote Bag",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Market Shoppers & Lifestyle Totes",
    "hsCode": "4202.92.98",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Laminated heavy natural golden jute canvas tote with reinforced cotton webbing handles, box-X stitching, full top zip closure, and interior slip pocket. Features 5 curated colorways plus custom OEM.",
    "unit": "PCS",
    "dimensions": "280 x 340 x 140 mm",
    "weightKg": 0.32,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 320,
      "factoryCostUsd": 2.57,
      "initialFactoryAskingCostBdt": 369,
      "initialFactoryAskingCostUsd": 2.96,
      "negotiatedSavingsBdt": 49,
      "negotiatedSavingsUsd": 0.39,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.47,
      "arielSourcingMarginPct": 12.2,
      "b2bFobPriceUsd": 3.95,
      "d2cRetailPriceUsd": 13.83,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.38,
      "totalEnterpriseMarginPct": 21.7
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 500 - 1000 pcs)",
        "moqRange": "500 - 1000 pcs",
        "fobPriceUsd": 3.95,
        "marginPct": 12.2
      },
      {
        "slabName": "Wholesale Tier 2 (1001 - 2000 pcs)",
        "moqRange": "1001 - 2000 pcs",
        "fobPriceUsd": 3.63,
        "marginPct": 10.4
      },
      {
        "slabName": "FCL Bulk Volume (2001+ pcs)",
        "moqRange": "2001+ pcs",
        "fobPriceUsd": 3.36,
        "marginPct": 8.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-EDC-20-AMC-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-EDC-20-AMC-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 10
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "DAE Phytosanitary",
      "AZO-Free Dye Tested",
      "OEKO-TEX Standard 100",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/style-1/IMG_2453.jpeg",
      "/images/products/jute/style-1/IMG_2461.jpeg",
      "/images/products/jute/style-1/IMG_2465.jpeg",
      "/images/products/jute/style-1/IMG_2466.jpeg",
      "/images/products/jute/style-1/IMG_2467.jpeg",
      "/images/products/jute/style-1/IMG_2454.jpeg",
      "/images/products/jute/style-1/IMG_2455.jpeg",
      "/images/products/jute/style-1/IMG_2456.jpeg",
      "/images/products/jute/style-1/IMG_2460.jpeg",
      "/images/products/jute/style-1/IMG_2464.jpeg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-edc-21-rdl",
    "sku": "JD-EDC-21-RDL",
    "roadmapCode": "JD-EDC-21-RDL",
    "prodtId": 202,
    "styleCode": "EDC",
    "eanBarcode": "0538920190010",
    "name": "ArielMC Riviera Tropical Monstera Leaf Tote",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Resort Shoppers & Beach Bags",
    "hsCode": "4202.92.98",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Resort utility tote crafted from 380 GSM jute-cotton composite weave featuring a multi-tonal tropical Monstera and split-leaf palm print. Finished with 12 mm thick nautical braided cotton rope handles, hand-knotted tassels, turned wooden beads, and food-grade clear laminated PE inner lining.",
    "unit": "PCS",
    "dimensions": "305 x 380 x 127 mm",
    "weightKg": 0.42,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 446,
      "factoryCostUsd": 3.58,
      "initialFactoryAskingCostBdt": 514,
      "initialFactoryAskingCostUsd": 4.13,
      "negotiatedSavingsBdt": 68,
      "negotiatedSavingsUsd": 0.55,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 4.48,
      "arielSourcingMarginPct": 18.5,
      "b2bFobPriceUsd": 5.5,
      "d2cRetailPriceUsd": 19.25,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.52,
      "totalEnterpriseMarginPct": 28
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 5.5,
        "marginPct": 18.5
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 5.06,
        "marginPct": 15.7
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 4.67,
        "marginPct": 12.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-EDC-21-RDL-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-EDC-21-RDL-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "100% Golden Jute Biodegradable",
      "AZO-Free Eco Dyes",
      "REACH Compliant (EC No 1907/2006)",
      "California Prop 65 Tested",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/riviera/riviera-tote-lifestyle.jpg",
      "/images/products/jute/riviera/riviera-tote-studio.jpg",
      "/images/products/jute/riviera/riviera-tote-detail.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-edc-22-rdl",
    "sku": "JD-EDC-22-RDL",
    "roadmapCode": "JD-EDC-22-RDL",
    "prodtId": 203,
    "styleCode": "EDC",
    "eanBarcode": "0538920190011",
    "name": "ArielMC Heritage Folk Jute-Cotton Pouch Collection",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Artisanal Pouches & Cosmetic Clutches",
    "hsCode": "4202.32.10",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisanal accessory pouches marrying Scandinavian geometric cross-stitch geometry with Bangladeshi textile craft. Available in 2 silhouettes: Handy Hand Purse (flat rectangular clutch) and Stylish Dome Clutch (curved stand-up profile with thick braided nautical rope wristlet).",
    "unit": "PCS",
    "dimensions": "140 x 254 x 15 mm",
    "weightKg": 0.12,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 283,
      "factoryCostUsd": 2.27,
      "initialFactoryAskingCostBdt": 327,
      "initialFactoryAskingCostUsd": 2.63,
      "negotiatedSavingsBdt": 44,
      "negotiatedSavingsUsd": 0.36,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.17,
      "arielSourcingMarginPct": 9.4,
      "b2bFobPriceUsd": 3.5,
      "d2cRetailPriceUsd": 12.25,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.33,
      "totalEnterpriseMarginPct": 18.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 3.5,
        "marginPct": 9.4
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 3.22,
        "marginPct": 8
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 2.98,
        "marginPct": 6.6
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-EDC-22-RDL-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-EDC-22-RDL-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "100% Golden Jute Biodegradable",
      "AZO-Free Eco Dyes",
      "REACH Compliant (EC No 1907/2006)",
      "Fair Trade Craft Cluster",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/pouches/heritage-folk-flat.jpg",
      "/images/products/jute/pouches/heritage-folk-dome.jpg",
      "/images/products/jute/pouches/heritage-folk-detail.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-22",
    "sku": "JD-MLD-22",
    "roadmapCode": "JUT-RUN-022-JLX",
    "prodtId": 22,
    "styleCode": "MLD",
    "eanBarcode": "0538920190012",
    "name": "Artisanal Jute Table Runners, Mats & Cutlery Sleeves",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Home Storage & Living Accessories",
    "hsCode": "6304.99.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Handcrafted natural golden jute table runner and dining suite featuring delicate floral crochet lace inserts, geometric borders, two-tone bleached cotton panels, and matching silverware cutlery sleeves. Finished with food-grade water-resistant backing and selvedge overlocking.",
    "unit": "PCS",
    "dimensions": "1800 x 350 x 6 mm",
    "weightKg": 0.36,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 308,
      "factoryCostUsd": 2.47,
      "initialFactoryAskingCostBdt": 355,
      "initialFactoryAskingCostUsd": 2.85,
      "negotiatedSavingsBdt": 47,
      "negotiatedSavingsUsd": 0.38,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.37,
      "arielSourcingMarginPct": 11.3,
      "b2bFobPriceUsd": 3.8,
      "d2cRetailPriceUsd": 13.3,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.36,
      "totalEnterpriseMarginPct": 20.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 3.8,
        "marginPct": 11.3
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 3.5,
        "marginPct": 9.6
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 3.23,
        "marginPct": 7.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-22-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-22-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "Plant-Based 100% Biodegradable",
      "REACH Compliant (EC No 1907/2006)",
      "California Prop 65 Tested",
      "Sedex SMETA 4-Pillar Audited",
      "OEKO-TEX Standard 100 Trims"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/JD-MLD-22-lace-center.jpg",
      "/images/products/jute/JD-MLD-22-botanical-sunflower.jpg",
      "/images/products/jute/JD-MLD-22-red-stripe.jpg",
      "/images/products/jute/JD-MLD-22-cutlery-pocket.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-23",
    "sku": "JD-MLD-23",
    "roadmapCode": "JD-MLD-23",
    "prodtId": 23,
    "styleCode": "MLD",
    "eanBarcode": "0538920190013",
    "name": "Natural Hessian Area Rugs & Floor Mats",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Home Storage & Living Accessories",
    "hsCode": "5702.32.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Heavyweight architectural floor rug emphasizing natural tonal striations of organic unbleached jute. Flat-weave reversible build with flame-retardant backing.",
    "unit": "PCS",
    "dimensions": "1200 x 1800 x 12 mm",
    "weightKg": 5.8,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 14567,
      "factoryCostUsd": 117,
      "initialFactoryAskingCostBdt": 16808,
      "initialFactoryAskingCostUsd": 135,
      "negotiatedSavingsBdt": 2241,
      "negotiatedSavingsUsd": 18,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 117.9,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 180,
      "d2cRetailPriceUsd": 630,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 17.1,
      "totalEnterpriseMarginPct": 44
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 15 - 30 pcs)",
        "moqRange": "15 - 30 pcs",
        "fobPriceUsd": 180,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (31 - 60 pcs)",
        "moqRange": "31 - 60 pcs",
        "fobPriceUsd": 165.6,
        "marginPct": 29.3
      },
      {
        "slabName": "FCL Bulk Volume (61+ pcs)",
        "moqRange": "61+ pcs",
        "fobPriceUsd": 153,
        "marginPct": 24.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-23-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-23-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "GOTS Organic",
      "BS 4790 Flammability Standard",
      "DAE Fumigated"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/JD-MLD-23-sq.jpg",
      "/images/products/jute/JD-MLD-23-loop-sq.jpg",
      "/images/products/jute/JD-MLD-23-coils-sq.jpg",
      "/images/products/jute/JD-MLD-23-natura-composite.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-mld-24-rdl",
    "sku": "JD-MLD-24-RDL",
    "roadmapCode": "JD-MLD-24-RDL",
    "prodtId": 331,
    "styleCode": "MLD",
    "eanBarcode": "0538920190014",
    "name": "ArielMC Terracotta Mandala Round Jute Rug",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Handcrafted Jute Area Rugs",
    "hsCode": "5702.39.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Concentric flat-braided raw natural jute base block-printed with a striking geometric mandala motif in rich terracotta red, deep charcoal, and organic cream. Reversible 8 mm flatweave profile (3 ft / 90 cm & 4 ft / 120 cm dia).",
    "unit": "PCS",
    "dimensions": "8 x 1200 x 1200 mm",
    "weightKg": 2.4,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 874,
      "factoryCostUsd": 7.02,
      "initialFactoryAskingCostBdt": 1008,
      "initialFactoryAskingCostUsd": 8.1,
      "negotiatedSavingsBdt": 134,
      "negotiatedSavingsUsd": 1.08,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 7.92,
      "arielSourcingMarginPct": 26.7,
      "b2bFobPriceUsd": 10.8,
      "d2cRetailPriceUsd": 37.8,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.03,
      "totalEnterpriseMarginPct": 36.2
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 10.8,
        "marginPct": 26.7
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 9.94,
        "marginPct": 22.7
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 9.18,
        "marginPct": 18.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-24-RDL-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-24-RDL-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "100% Golden Jute Biodegradable",
      "AZO-Free Eco Dyes",
      "Fair Trade Craft Cluster",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/rugs/mandala-rug.jpg",
      "/images/products/jute/rugs/mandala-rug-detail.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-mld-25-rdl",
    "sku": "JD-MLD-25-RDL",
    "roadmapCode": "JD-MLD-25-RDL",
    "prodtId": 332,
    "styleCode": "MLD",
    "eanBarcode": "0538920190015",
    "name": "ArielMC Crimson Bloom Embroidered Jute Rug",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Handcrafted Jute Area Rugs",
    "hsCode": "5702.39.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Dense hand-guided crewel floral embroidery over polished fine golden jute webbing with ivory daisies, marigold blossoms, soft green foliage, and classic running-vine border (3 ft / 90 cm & 4 ft / 120 cm dia).",
    "unit": "PCS",
    "dimensions": "10 x 1200 x 1200 mm",
    "weightKg": 2.8,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1699,
      "factoryCostUsd": 13.65,
      "initialFactoryAskingCostBdt": 1961,
      "initialFactoryAskingCostUsd": 15.75,
      "negotiatedSavingsBdt": 262,
      "negotiatedSavingsUsd": 2.1,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 14.55,
      "arielSourcingMarginPct": 30.7,
      "b2bFobPriceUsd": 21,
      "d2cRetailPriceUsd": 73.5,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2,
      "totalEnterpriseMarginPct": 40.2
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 21,
        "marginPct": 30.7
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 19.32,
        "marginPct": 26.1
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 17.85,
        "marginPct": 21.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-04-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Rodela Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-04-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-25-RDL-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-25-RDL-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "100% Golden Jute Biodegradable",
      "AZO-Free Eco Dyes",
      "Fair Trade Craft Cluster",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_04",
      "factoryCode": "FAC-DHK-04",
      "factoryName": "Rodela Craft",
      "contactPerson": "Md. Rafiqul Islam (General Manager)",
      "contactPhone": "+880 1711-238491",
      "contactEmail": "sourcing@rodelacraft.com",
      "location": "Dhaka Artisan Cluster (FAC-DHK-04)",
      "leadTimeDays": 25,
      "moq": 250,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/rugs/crimson-bloom-rug.jpg",
      "/images/products/jute/rugs/crimson-bloom-detail.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-mld-26-hpd",
    "sku": "JD-MLD-26-HPD",
    "roadmapCode": "JD-MLD-26-HPD",
    "prodtId": 333,
    "styleCode": "MLD",
    "eanBarcode": "0538920190016",
    "name": "ArielMC Hand-Painted Botanical Oval Jute Doormat",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Handcrafted Jute Area Rugs & Doormats",
    "hsCode": "5702.39.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisan hand-braided 100% natural golden jute oval entrance mat featuring hand-painted botanical vine and floral garlands with eco-friendly mineral dyes. Reversible 10 mm heavy-duty braided coil construction (20\" × 30\" / 508 × 762 mm Oval).",
    "unit": "PCS",
    "dimensions": "10 x 762 x 508 mm",
    "weightKg": 1.45,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 768,
      "factoryCostUsd": 6.17,
      "initialFactoryAskingCostBdt": 888,
      "initialFactoryAskingCostUsd": 7.13,
      "negotiatedSavingsBdt": 120,
      "negotiatedSavingsUsd": 0.96,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 7.07,
      "arielSourcingMarginPct": 25.6,
      "b2bFobPriceUsd": 9.5,
      "d2cRetailPriceUsd": 33.25,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.9,
      "totalEnterpriseMarginPct": 35.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 9.5,
        "marginPct": 25.6
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 8.74,
        "marginPct": 21.8
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 8.07,
        "marginPct": 17.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BEN-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Beni Boonon Handcrafted Home Decor Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BEN-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-26-HPD-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-26-HPD-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 5
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "100% Golden Jute Biodegradable",
      "Azo-Free Eco Dyes & Pigments",
      "Fair Trade Craft Cluster",
      "Sedex SMETA 4-Pillar Audited",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_06",
      "factoryCode": "FAC-BEN-01",
      "factoryName": "Beni Boonon Handcrafted Home Decor Ltd",
      "contactPerson": "Azizun Nessa (Managing Partner)",
      "contactPhone": "+880 1714-045174",
      "contactEmail": "support@beniboonon.com",
      "location": "Faridpur & Narayanganj Artisan Guilds",
      "leadTimeDays": 21,
      "moq": 300,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 35,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/doormats/jute-doormat-english-rose.jpg",
      "/images/products/jute/doormats/jute-doormat-indigo-berry.jpg",
      "/images/products/jute/doormats/jute-doormat-french-lavender.jpg",
      "/images/products/jute/doormats/jute-doormat-cranberry-vine.jpg",
      "/images/products/jute/doormats/jute-doormat-marigold-primrose.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-mld-27-trs",
    "sku": "JD-MLD-27-TRS",
    "roadmapCode": "JD-MLD-27-TRS",
    "prodtId": 337,
    "styleCode": "MLD",
    "eanBarcode": "0538920190017",
    "name": "ArielMC Handcrafted Jute Trivet Set in Woven Basket (7-Piece Set)",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Modern Living & Décor",
    "subCategory": "Home Storage & Living Accessories",
    "hsCode": "6304.99.90",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisan hand-braided 7-piece natural jute tabletop suite comprising 6 heat-resistant round trivets (9″ / 228 mm Dia) nested in a matching shallow braided jute storage tray (9.5″ / 240 mm Dia). Features dense concentric spiral stitching, high-tensile Bengali golden jute, and artisan hand-painted botanical and folk wreath designs in food-safe eco-friendly mineral pigments.",
    "unit": "PCS",
    "dimensions": "45 x 240 x 240 mm",
    "weightKg": 0.65,
    "tags": [
      "Jute",
      "Modern Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1032,
      "factoryCostUsd": 8.29,
      "initialFactoryAskingCostBdt": 1190,
      "initialFactoryAskingCostUsd": 9.56,
      "negotiatedSavingsBdt": 158,
      "negotiatedSavingsUsd": 1.27,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 9.19,
      "arielSourcingMarginPct": 27.9,
      "b2bFobPriceUsd": 12.75,
      "d2cRetailPriceUsd": 44.63,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.21,
      "totalEnterpriseMarginPct": 37.4
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 250 - 500 pcs)",
        "moqRange": "250 - 500 pcs",
        "fobPriceUsd": 12.75,
        "marginPct": 27.9
      },
      {
        "slabName": "Wholesale Tier 2 (501 - 1000 pcs)",
        "moqRange": "501 - 1000 pcs",
        "fobPriceUsd": 11.73,
        "marginPct": 23.7
      },
      {
        "slabName": "FCL Bulk Volume (1001+ pcs)",
        "moqRange": "1001+ pcs",
        "fobPriceUsd": 10.84,
        "marginPct": 19.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BEN-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Beni Boonon Handcrafted Home Decor Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BEN-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-MLD-27-TRS-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-MLD-27-TRS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 9
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "Sedex SMETA Audited Facility (FAC-BEN-01)",
      "Azo-Free & Heavy Metal Free Certified (LFGB / REACH)",
      "100% Biodegradable & Compostable Bengal Jute",
      "ISO 9001:2015 Quality Management",
      "Fair Trade & Living Wage Workshop Certified"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_06",
      "factoryCode": "FAC-BEN-01",
      "factoryName": "Beni Boonon Handcrafted Home Decor Ltd",
      "contactPerson": "Azizun Nessa (Managing Partner)",
      "contactPhone": "+880 1714-045174",
      "contactEmail": "support@beniboonon.com",
      "location": "Faridpur & Narayanganj Artisan Guilds",
      "leadTimeDays": 21,
      "moq": 300,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 35,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/trivets/jute-trivet-set-7pcs-holly.jpg",
      "/images/products/jute/trivets/jute-trivet-lifestyle-evergreen.jpg",
      "/images/products/jute/trivets/jute-trivet-lifestyle-mimosa.jpg",
      "/images/products/jute/trivets/jute-trivet-lifestyle-cranberry.jpg",
      "/images/products/jute/trivets/jute-trivet-mandala-alpana.jpg",
      "/images/products/jute/trivets/jute-trivet-plumeria-frangipani.jpg",
      "/images/products/jute/trivets/jute-trivet-tree-of-life.jpg",
      "/images/products/jute/trivets/jute-trivet-styles-collection.jpg",
      "/images/products/jute/trivets/jute-trivet-showroom-display.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-29",
    "sku": "JD-EPG-29",
    "roadmapCode": "JUT-SAC-029-JLX",
    "prodtId": 29,
    "styleCode": "EPG",
    "eanBarcode": "0538920190018",
    "name": "Single & Dual Jute Wine Bottle Carriers",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Eco-Packaging & Gifting",
    "subCategory": "Retail Packaging & Hospitality",
    "hsCode": "6305.10.10",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Heavy-duty 380 GSM natural golden jute wine and champagne bottle carrier featuring full-grain artisan leather carrying handles, solid antique brass rivets, stitched leather emblem, and water-resistant wipe-clean lining.",
    "unit": "PCS",
    "dimensions": "360 x 120 x 110 mm",
    "weightKg": 0.18,
    "tags": [
      "Jute",
      "Eco-Packaging & Gifting",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 178,
      "factoryCostUsd": 1.43,
      "initialFactoryAskingCostBdt": 205,
      "initialFactoryAskingCostUsd": 1.65,
      "negotiatedSavingsBdt": 27,
      "negotiatedSavingsUsd": 0.22,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 2.33,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 2.2,
      "d2cRetailPriceUsd": 7.7,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.21,
      "totalEnterpriseMarginPct": 3.6
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 2.2,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 2.02,
        "marginPct": -5
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 1.87,
        "marginPct": -4.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-GAZ-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Jute Luxury Fashion & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-GAZ-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-EPG-29-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-EPG-29-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "Plant-Based 100% Biodegradable",
      "REACH Compliant (EC No 1907/2006)",
      "Sedex SMETA 4-Pillar Audited",
      "LWG Certified Leather Trim"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_02",
      "factoryCode": "FAC-GAZ-02",
      "factoryName": "Jute Luxury Fashion",
      "contactPerson": "Nazrul Islam (Head of Merchandising)",
      "contactPhone": "+880 1713-984421",
      "contactEmail": "info@juteluxuryfashion.com",
      "location": "Tongi, Gazipur Export Zone",
      "leadTimeDays": 20,
      "moq": 300,
      "sampleTurnaroundDays": 6,
      "samplePriceUsd": 30,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.75
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/JD-EPG-29.jpg",
      "/images/products/jute/JD-EPG-29-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-pkg-33-ffc",
    "sku": "JD-PKG-33",
    "roadmapCode": "JD-PKG-33",
    "prodtId": 333,
    "styleCode": "PKG",
    "eanBarcode": "0538920190019",
    "name": "ArielMC Executive Corporate Pilot Tote with Front Canvas Pocket",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Pilot Runs & Corporate Gifting (MOQ: 100 Pcs)",
    "hsCode": "4202.92.98",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Heavy laminated natural golden jute tote featuring 10 oz unbleached cotton canvas front slip pocket, structured gussets, and soft padded cotton webbing carry handles. Engineered for corporate branding, conference kits, and boutique pilot runs.",
    "unit": "PCS",
    "dimensions": "330 x 380 x 150 mm",
    "weightKg": 0.34,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 230,
      "factoryCostUsd": 1.85,
      "initialFactoryAskingCostBdt": 266,
      "initialFactoryAskingCostUsd": 2.14,
      "negotiatedSavingsBdt": 36,
      "negotiatedSavingsUsd": 0.29,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 2.75,
      "arielSourcingMarginPct": 3.5,
      "b2bFobPriceUsd": 2.85,
      "d2cRetailPriceUsd": 9.97,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.27,
      "totalEnterpriseMarginPct": 13
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 2.85,
        "marginPct": 3.5
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 2.62,
        "marginPct": 3
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 2.42,
        "marginPct": 2.4
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-PKG-33-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-PKG-33-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "ISO 9001:2015 Quality Management",
      "SEDEX SMETA 4-Pillar Audited",
      "OEKO-TEX Standard 100 Certified Dyes",
      "100% Recyclable Biodegradable Natural Fiber"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/pilot-canvas-tote.jpg",
      "/images/products/jute/pilot-canvas-tote-lifestyle.jpg",
      "/images/products/jute/pilot-bleached-shopper.jpg",
      "/images/products/jute/pilot-corporate-versatility.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-pkg-34-ffc",
    "sku": "JD-PKG-34",
    "roadmapCode": "JD-PKG-34",
    "prodtId": 334,
    "styleCode": "PKG",
    "eanBarcode": "0538920190020",
    "name": "ArielMC Clear-Window Single & Dual Wine/Beverage Carrier",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Eco-Packaging & Gifting",
    "subCategory": "Pilot Runs & Corporate Gifting (MOQ: 100 Pcs)",
    "hsCode": "4202.92.98",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Eco-luxury wine and beverage gifting tote crafted from 360 GSM natural laminated golden jute with transparent food-grade presentation window, rigid partition dividers, and soft padded cane-style handles.",
    "unit": "PCS",
    "dimensions": "350 x 200 x 100 mm",
    "weightKg": 0.23,
    "tags": [
      "Jute",
      "Eco-Packaging & Gifting",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 158,
      "factoryCostUsd": 1.27,
      "initialFactoryAskingCostBdt": 182,
      "initialFactoryAskingCostUsd": 1.46,
      "negotiatedSavingsBdt": 24,
      "negotiatedSavingsUsd": 0.19,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 2.17,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 1.95,
      "d2cRetailPriceUsd": 6.83,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.19,
      "totalEnterpriseMarginPct": -1.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 1.95,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 1.79,
        "marginPct": -9.6
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 1.66,
        "marginPct": -7.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-PKG-34-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-PKG-34-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "ISO 9001:2015 Certified",
      "Food Safety Contact Certified",
      "AZO-Free Eco Inks",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/pilot-wine-window-carrier.jpg",
      "/images/products/jute/pilot-canvas-tote-lifestyle.jpg",
      "/images/products/jute/pilot-corporate-versatility.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-pkg-35-ffc",
    "sku": "JD-PKG-35",
    "roadmapCode": "JD-PKG-35",
    "prodtId": 335,
    "styleCode": "PKG",
    "eanBarcode": "0538920190021",
    "name": "ArielMC Color-Gusset Corporate Shopper Suite",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Everyday Carry & Bags",
    "subCategory": "Pilot Runs & Corporate Gifting (MOQ: 100 Pcs)",
    "hsCode": "4202.92.98",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Structured corporate shopper tote engineered with raw golden jute body and dyed azo-free color-contrast side gussets (Navy, Forest Green, Terracotta, Burgundy, Onyx). Padded handles and perimeter piping.",
    "unit": "PCS",
    "dimensions": "320 x 300 x 140 mm",
    "weightKg": 0.28,
    "tags": [
      "Jute",
      "Everyday Carry & Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 198,
      "factoryCostUsd": 1.59,
      "initialFactoryAskingCostBdt": 229,
      "initialFactoryAskingCostUsd": 1.84,
      "negotiatedSavingsBdt": 31,
      "negotiatedSavingsUsd": 0.25,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 2.49,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 2.45,
      "d2cRetailPriceUsd": 8.58,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.23,
      "totalEnterpriseMarginPct": 7.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 2.45,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 2.25,
        "marginPct": -1.4
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 2.08,
        "marginPct": -1.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-PKG-35-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-PKG-35-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "ISO 9001:2015 Certified",
      "OEKO-TEX Standard 100 Certified Dyes",
      "SEDEX SMETA Audited",
      "100% Biodegradable Base"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/pilot-color-gusset-shopper.jpg",
      "/images/products/jute/pilot-corporate-conference-tote.jpg",
      "/images/products/jute/pilot-corporate-versatility.jpg",
      "/images/products/jute/pilot-corporate-white-tote.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-jd-pkg-36-ffc",
    "sku": "JD-PKG-36",
    "roadmapCode": "JD-PKG-36",
    "prodtId": 336,
    "styleCode": "PKG",
    "eanBarcode": "0538920190022",
    "name": "ArielMC Coordinated Executive Desk & Hospitality Amenity Set",
    "sector": "JUTE",
    "category": "02 The Golden Fiber Edit / Tech & Eco-Stationery",
    "subCategory": "Pilot Runs & Corporate Gifting (MOQ: 100 Pcs)",
    "hsCode": "6305.10.10",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Eco-luxury coordinated desk and hospitality accessory collection including executive structured tissue box dispenser, insulated bento lunch tote, zipper document pouch, and duffle amenity case.",
    "unit": "PCS",
    "dimensions": "90 x 250 x 130 mm",
    "weightKg": 0.11,
    "tags": [
      "Jute",
      "Tech & Eco-Stationery",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 122,
      "factoryCostUsd": 0.98,
      "initialFactoryAskingCostBdt": 141,
      "initialFactoryAskingCostUsd": 1.13,
      "negotiatedSavingsBdt": 19,
      "negotiatedSavingsUsd": 0.15,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 1.88,
      "arielSourcingMarginPct": 34.5,
      "b2bFobPriceUsd": 1.5,
      "d2cRetailPriceUsd": 5.25,
      "incentiveCategory": "DIVERSIFIED_JUTE_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.14,
      "totalEnterpriseMarginPct": -15.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 1.5,
        "marginPct": 34.5
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 1.38,
        "marginPct": -21.5
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 1.27,
        "marginPct": -17.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHK-05-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (FineFair Craft & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHK-05-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/JD-PKG-36-Studio-HiRes.zip",
      "studioPhotoZipName": "JD-PKG-36-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "JUTE",
      "data": {
        "fiberGrade": "Tossa Jute Grade 1 & 2 (100% Biodegradable)",
        "construction": "Reinforced high-tensile braid & machine lockstitch",
        "weightGsm": 1850,
        "lamination": "Food-Grade PE / Natural Breathable",
        "dyeType": "Azo-Free Eco Mineral Dyes",
        "ecoCertifications": [
          "OEKO-TEX Standard 100",
          "SEDEX Audited",
          "JDPC Registered"
        ]
      }
    },
    "complianceCertificates": [
      "ISO 9001:2015 Certified",
      "Hospitality Grade Cleanability",
      "Azo-Free Certified",
      "Sedex SMETA Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_jut_05",
      "factoryCode": "FAC-DHK-05",
      "factoryName": "FineFair Craft",
      "contactPerson": "Kamrul Hasan (Export Lead)",
      "contactPhone": "+880 1819-338822",
      "contactEmail": "export@finefaircraft.com",
      "location": "Demra & Tejgaon Industrial Area, Dhaka",
      "leadTimeDays": 18,
      "moq": 100,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 25,
      "samplePackingUsd": 8,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.8
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/jute/pilot-hospitality-suite.jpg",
      "/images/products/jute/pilot-hospitality-infographic.jpg",
      "/images/products/jute/pilot-corporate-versatility.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-ath-48",
    "sku": "CT-ATH-48",
    "roadmapCode": "CT-ATH-48",
    "prodtId": 49,
    "styleCode": "ATH",
    "eanBarcode": "0538920190023",
    "name": "Athena 24K Gold Filigree Porcelain Dinner Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Dinnerware & Tabletop",
    "subCategory": "Hospitality & Retail Tableware Suites",
    "hsCode": "6911.10.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Fine porcelain 26/52-piece export dinner set adorned with opulent 24K gold filigree edging for timeless luxury dining.",
    "unit": "PCS",
    "dimensions": "280 x 320 x 320 mm",
    "weightKg": 4.2,
    "tags": [
      "Ceramics",
      "Dinnerware & Tabletop",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 3884,
      "factoryCostUsd": 31.2,
      "initialFactoryAskingCostBdt": 4482,
      "initialFactoryAskingCostUsd": 36,
      "negotiatedSavingsBdt": 598,
      "negotiatedSavingsUsd": 4.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 32.1,
      "arielSourcingMarginPct": 33.1,
      "b2bFobPriceUsd": 48,
      "d2cRetailPriceUsd": 168,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 4.56,
      "totalEnterpriseMarginPct": 42.6
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 48,
        "marginPct": 33.1
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 44.16,
        "marginPct": 28.1
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 40.8,
        "marginPct": 23.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-ATH-48-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-ATH-48-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-ATH-48-plate-sq.jpg",
      "/images/products/ceramics/CT-ATH-48-table.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-dnt-49",
    "sku": "CT-DNT-49",
    "roadmapCode": "CT-DNT-49",
    "prodtId": 50,
    "styleCode": "DNT",
    "eanBarcode": "0538920190024",
    "name": "Artisan Reactive Glaze Stoneware Tableware Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Dinnerware & Tabletop",
    "subCategory": "Hospitality & Retail Tableware Suites",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "1,280°C Vitrified stoneware suite in textured matte charcoal ombré. Includes 28 cm charger, 22 cm salad plate, 18 cm soup bowl, and 380 ml mug.",
    "unit": "PCS",
    "dimensions": "260 x 280 x 280 mm",
    "weightKg": 3.8,
    "tags": [
      "Ceramics",
      "Dinnerware & Tabletop",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2266,
      "factoryCostUsd": 18.2,
      "initialFactoryAskingCostBdt": 2615,
      "initialFactoryAskingCostUsd": 21,
      "negotiatedSavingsBdt": 349,
      "negotiatedSavingsUsd": 2.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 19.1,
      "arielSourcingMarginPct": 31.8,
      "b2bFobPriceUsd": 28,
      "d2cRetailPriceUsd": 98,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.66,
      "totalEnterpriseMarginPct": 41.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 28,
        "marginPct": 31.8
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 25.76,
        "marginPct": 27
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 23.8,
        "marginPct": 22.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-DNT-49-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-DNT-49-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-DNT-49-sq.jpg",
      "/images/products/ceramics/CT-DWC-53-mug.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-eth-50",
    "sku": "CT-ETH-50",
    "roadmapCode": "CT-ETH-50",
    "prodtId": 51,
    "styleCode": "ETH",
    "eanBarcode": "0538920190025",
    "name": "Ethnic Floral Kaleidoscope Dinnerware Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Dinnerware & Tabletop",
    "subCategory": "Hospitality & Retail Tableware Suites",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Fine vitrified ceramic dinnerware showcasing an elaborate ethnic floral kaleidoscope design with coordinating teaware.",
    "unit": "PCS",
    "dimensions": "270 x 290 x 290 mm",
    "weightKg": 3.9,
    "tags": [
      "Ceramics",
      "Dinnerware & Tabletop",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2590,
      "factoryCostUsd": 20.8,
      "initialFactoryAskingCostBdt": 2988,
      "initialFactoryAskingCostUsd": 24,
      "negotiatedSavingsBdt": 398,
      "negotiatedSavingsUsd": 3.2,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 21.7,
      "arielSourcingMarginPct": 32.2,
      "b2bFobPriceUsd": 32,
      "d2cRetailPriceUsd": 112,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 3.04,
      "totalEnterpriseMarginPct": 41.7
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 32,
        "marginPct": 32.2
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 29.44,
        "marginPct": 27.4
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 27.2,
        "marginPct": 22.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-ETH-50-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-ETH-50-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-ETH-50-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-tur-58",
    "sku": "CT-TUR-58",
    "roadmapCode": "CT-TUR-58",
    "prodtId": 52,
    "styleCode": "TUR",
    "eanBarcode": "0538920190026",
    "name": "Turquoise Horizon Vitrified Dinnerware Set",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Dinnerware & Tabletop",
    "subCategory": "Hospitality & Retail Tableware Suites",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Contemporary turquoise/teal ribbed rim dinnerware set engineered for luxury hospitality and everyday dining.",
    "unit": "PCS",
    "dimensions": "260 x 270 x 270 mm",
    "weightKg": 3.4,
    "tags": [
      "Ceramics",
      "Dinnerware & Tabletop",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2104,
      "factoryCostUsd": 16.9,
      "initialFactoryAskingCostBdt": 2428,
      "initialFactoryAskingCostUsd": 19.5,
      "negotiatedSavingsBdt": 324,
      "negotiatedSavingsUsd": 2.6,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 17.8,
      "arielSourcingMarginPct": 31.5,
      "b2bFobPriceUsd": 26,
      "d2cRetailPriceUsd": 91,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.47,
      "totalEnterpriseMarginPct": 41
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 26,
        "marginPct": 31.5
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 23.92,
        "marginPct": 26.8
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 22.1,
        "marginPct": 22
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-TUR-58-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-TUR-58-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-TUR-58-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-nel-51",
    "sku": "CT-NEL-51",
    "roadmapCode": "CT-NEL-51",
    "prodtId": 54,
    "styleCode": "NEL",
    "eanBarcode": "0538920190027",
    "name": "Neelima Royal Cobalt Floral Tea Service",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Drinkware & Café",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6911.10.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Classic hand-painted cobalt blue & white floral teapot pouring set with matching saucers, cups, and creamer.",
    "unit": "PCS",
    "dimensions": "180 x 220 x 150 mm",
    "weightKg": 1.85,
    "tags": [
      "Ceramics",
      "Drinkware & Café",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1942,
      "factoryCostUsd": 15.6,
      "initialFactoryAskingCostBdt": 2241,
      "initialFactoryAskingCostUsd": 18,
      "negotiatedSavingsBdt": 299,
      "negotiatedSavingsUsd": 2.4,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 16.5,
      "arielSourcingMarginPct": 31.3,
      "b2bFobPriceUsd": 24,
      "d2cRetailPriceUsd": 84,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.28,
      "totalEnterpriseMarginPct": 40.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 24,
        "marginPct": 31.3
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 22.08,
        "marginPct": 26.6
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 20.4,
        "marginPct": 21.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-NEL-51-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-NEL-51-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-NEL-51-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-ind-52",
    "sku": "CT-IND-52",
    "roadmapCode": "CT-IND-52",
    "prodtId": 55,
    "styleCode": "IND",
    "eanBarcode": "0538920190028",
    "name": "Indigo Petals Royal Cobalt Ceramic Tea Set",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Drinkware & Café",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Deep royal cobalt indigo glazed ceramic teapot, covered sugar, creamer, and teacups with botanical petal reliefs.",
    "unit": "PCS",
    "dimensions": "175 x 210 x 145 mm",
    "weightKg": 1.75,
    "tags": [
      "Ceramics",
      "Drinkware & Café",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1780,
      "factoryCostUsd": 14.3,
      "initialFactoryAskingCostBdt": 2054,
      "initialFactoryAskingCostUsd": 16.5,
      "negotiatedSavingsBdt": 274,
      "negotiatedSavingsUsd": 2.2,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 15.2,
      "arielSourcingMarginPct": 30.9,
      "b2bFobPriceUsd": 22,
      "d2cRetailPriceUsd": 77,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.09,
      "totalEnterpriseMarginPct": 40.4
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 22,
        "marginPct": 30.9
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 20.24,
        "marginPct": 26.3
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 18.7,
        "marginPct": 21.6
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-IND-52-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-IND-52-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-IND-52-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-mnk-71",
    "sku": "CT-MNK-71",
    "roadmapCode": "CT-MNK-71",
    "prodtId": 56,
    "styleCode": "MNK",
    "eanBarcode": "0538920190029",
    "name": "Handcrafted Meenakari Teapot Set",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Drinkware & Café",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "8-Piece tea service suite: 1.0L hand-enameled aluminium teapot, 6 matching cutting chai glasses (100 ml), and hand-painted wooden cart tray holder. Available in Midnight and Cobalt.",
    "unit": "PCS",
    "dimensions": "220 x 240 x 160 mm",
    "weightKg": 1.95,
    "tags": [
      "Ceramics",
      "Drinkware & Café",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2832,
      "factoryCostUsd": 22.75,
      "initialFactoryAskingCostBdt": 3268,
      "initialFactoryAskingCostUsd": 26.25,
      "negotiatedSavingsBdt": 436,
      "negotiatedSavingsUsd": 3.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 23.65,
      "arielSourcingMarginPct": 32.4,
      "b2bFobPriceUsd": 35,
      "d2cRetailPriceUsd": 122.5,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 3.33,
      "totalEnterpriseMarginPct": 41.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 35,
        "marginPct": 32.4
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 32.2,
        "marginPct": 27.5
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 29.75,
        "marginPct": 22.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-MNK-71-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-MNK-71-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-MNK-71-blk-sq.jpg",
      "/images/products/ceramics/CT-MNK-71-blu-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-cat-73",
    "sku": "CT-CAT-73",
    "roadmapCode": "CT-CAT-73",
    "prodtId": 57,
    "styleCode": "CAT",
    "eanBarcode": "0538920190030",
    "name": "Whimsical Cat-Lid Ceramic Mug (480 ml)",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Drinkware & Café",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisanal 480 ml porcelain stoneware mug with sculpted 3D cat head lid finial, fitted ceramic ball spoon, branch-form handle, and hand-drawn chef cat illustration.",
    "unit": "PCS",
    "dimensions": "140 x 90 x 130 mm",
    "weightKg": 0.42,
    "tags": [
      "Ceramics",
      "Drinkware & Café",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 388,
      "factoryCostUsd": 3.12,
      "initialFactoryAskingCostBdt": 448,
      "initialFactoryAskingCostUsd": 3.6,
      "negotiatedSavingsBdt": 60,
      "negotiatedSavingsUsd": 0.48,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 4.02,
      "arielSourcingMarginPct": 16.3,
      "b2bFobPriceUsd": 4.8,
      "d2cRetailPriceUsd": 16.8,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.46,
      "totalEnterpriseMarginPct": 25.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 4.8,
        "marginPct": 16.3
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 4.42,
        "marginPct": 13.9
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 4.08,
        "marginPct": 11.4
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-CAT-73-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-CAT-73-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-CAT-73-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-vas-55",
    "sku": "CT-VAS-55",
    "roadmapCode": "CT-VAS-55",
    "prodtId": 58,
    "styleCode": "VAS",
    "eanBarcode": "0538920190031",
    "name": "Heritage Cobalt Flora Porcelain Globe Vase",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Modern Living & Decor",
    "subCategory": "Botanicals & Interior Vessels",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Hand-thrown vitrified white porcelain spherical centerpiece vase (20 cm diameter) adorned with master hand-painted cobalt blue botanical tendrils and floral brushwork.",
    "unit": "PCS",
    "dimensions": "200 x 200 x 200 mm",
    "weightKg": 1.4,
    "tags": [
      "Ceramics",
      "Modern Living & Decor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2266,
      "factoryCostUsd": 18.2,
      "initialFactoryAskingCostBdt": 2615,
      "initialFactoryAskingCostUsd": 21,
      "negotiatedSavingsBdt": 349,
      "negotiatedSavingsUsd": 2.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 19.1,
      "arielSourcingMarginPct": 31.8,
      "b2bFobPriceUsd": 28,
      "d2cRetailPriceUsd": 98,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.66,
      "totalEnterpriseMarginPct": 41.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 28,
        "marginPct": 31.8
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 25.76,
        "marginPct": 27
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 23.8,
        "marginPct": 22.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-VAS-55-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-VAS-55-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-VAS-55-ped-sq.jpg",
      "/images/products/ceramics/CT-VAS-55-dtl-sq.jpg",
      "/images/products/ceramics/CT-VAS-55-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-bot-54",
    "sku": "CT-BOT-54",
    "roadmapCode": "CT-BOT-54",
    "prodtId": 59,
    "styleCode": "BOT",
    "eanBarcode": "0538920190032",
    "name": "Royal Blue Flora Botanica Mug with Lid",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Modern Living & Decor",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Fine cobalt blue botanical ceramic mug crafted with intricate white flora, comfortable arched handle, and matching tea lid.",
    "unit": "PCS",
    "dimensions": "130 x 85 x 120 mm",
    "weightKg": 0.38,
    "tags": [
      "Ceramics",
      "Modern Living & Decor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 340,
      "factoryCostUsd": 2.73,
      "initialFactoryAskingCostBdt": 392,
      "initialFactoryAskingCostUsd": 3.15,
      "negotiatedSavingsBdt": 52,
      "negotiatedSavingsUsd": 0.42,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.63,
      "arielSourcingMarginPct": 13.6,
      "b2bFobPriceUsd": 4.2,
      "d2cRetailPriceUsd": 14.7,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.4,
      "totalEnterpriseMarginPct": 23.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 4.2,
        "marginPct": 13.6
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 3.86,
        "marginPct": 11.6
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 3.57,
        "marginPct": 9.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-BOT-54-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-BOT-54-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-BOT-54-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-mug-60",
    "sku": "CT-MUG-60",
    "roadmapCode": "CT-MUG-60",
    "prodtId": 60,
    "styleCode": "MUG",
    "eanBarcode": "0538920190033",
    "name": "Modern Ceramic Artisan Coffee Mug Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Modern Living & Decor",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Contemporary matte ceramic coffee mug collection with minimalist typography, line-art illustrations, and ergonomic handle design.",
    "unit": "PCS",
    "dimensions": "100 x 85 x 120 mm",
    "weightKg": 0.32,
    "tags": [
      "Ceramics",
      "Modern Living & Decor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 291,
      "factoryCostUsd": 2.34,
      "initialFactoryAskingCostBdt": 336,
      "initialFactoryAskingCostUsd": 2.7,
      "negotiatedSavingsBdt": 45,
      "negotiatedSavingsUsd": 0.36,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.24,
      "arielSourcingMarginPct": 10,
      "b2bFobPriceUsd": 3.6,
      "d2cRetailPriceUsd": 12.6,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.34,
      "totalEnterpriseMarginPct": 19.5
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 500 - 1000 pcs)",
        "moqRange": "500 - 1000 pcs",
        "fobPriceUsd": 3.6,
        "marginPct": 10
      },
      {
        "slabName": "Wholesale Tier 2 (1001 - 2000 pcs)",
        "moqRange": "1001 - 2000 pcs",
        "fobPriceUsd": 3.31,
        "marginPct": 8.5
      },
      {
        "slabName": "FCL Bulk Volume (2001+ pcs)",
        "moqRange": "2001+ pcs",
        "fobPriceUsd": 3.06,
        "marginPct": 7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-MUG-60-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-MUG-60-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-MUG-60-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-jar-61",
    "sku": "CT-JAR-61",
    "roadmapCode": "CT-JAR-61",
    "prodtId": 61,
    "styleCode": "JAR",
    "eanBarcode": "0538920190034",
    "name": "Artisanal Airtight Porcelain Biscuit Canister",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Botanicals & Interior Vessels",
    "hsCode": "6911.10.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "1,000 ml food-safe porcelain airtight storage jar with food-grade silicone freshness gasket and sculptural 24K gold wing finial lid.",
    "unit": "PCS",
    "dimensions": "160 x 120 x 120 mm",
    "weightKg": 0.75,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1174,
      "factoryCostUsd": 9.43,
      "initialFactoryAskingCostBdt": 1355,
      "initialFactoryAskingCostUsd": 10.88,
      "negotiatedSavingsBdt": 181,
      "negotiatedSavingsUsd": 1.45,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.33,
      "arielSourcingMarginPct": 28.8,
      "b2bFobPriceUsd": 14.5,
      "d2cRetailPriceUsd": 50.75,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.38,
      "totalEnterpriseMarginPct": 38.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 14.5,
        "marginPct": 28.8
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 13.34,
        "marginPct": 24.5
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 12.32,
        "marginPct": 20.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-JAR-61-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-JAR-61-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-JAR-61-tur-sq.jpg",
      "/images/products/ceramics/CT-JAR-61-ivo-sq.jpg",
      "/images/products/ceramics/CT-JAR-61-red-sq.jpg",
      "/images/products/ceramics/CT-JAR-61-blu-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-cks-62",
    "sku": "CT-CKS-62",
    "roadmapCode": "CT-CKS-62",
    "prodtId": 62,
    "styleCode": "CKS",
    "eanBarcode": "0538920190035",
    "name": "Botanical Floral Porcelain Pedestal Cake Stand",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Botanicals & Interior Vessels",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "30.5 cm (12\") raised pedestal cake and dessert display stand in fine porcelain, showcasing vibrant red poppies, blue hydrangeas, and glossy vitrified glaze.",
    "unit": "PCS",
    "dimensions": "120 x 305 x 305 mm",
    "weightKg": 1.6,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1579,
      "factoryCostUsd": 12.68,
      "initialFactoryAskingCostBdt": 1821,
      "initialFactoryAskingCostUsd": 14.63,
      "negotiatedSavingsBdt": 242,
      "negotiatedSavingsUsd": 1.95,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 13.58,
      "arielSourcingMarginPct": 30.4,
      "b2bFobPriceUsd": 19.5,
      "d2cRetailPriceUsd": 68.25,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.85,
      "totalEnterpriseMarginPct": 39.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 19.5,
        "marginPct": 30.4
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 17.94,
        "marginPct": 25.8
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 16.57,
        "marginPct": 21.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-CKS-62-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-CKS-62-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-CKS-62-sq.jpg",
      "/images/products/ceramics/CT-CKS-62-clean.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-hnd-56",
    "sku": "CT-HND-56",
    "roadmapCode": "CT-HND-56",
    "prodtId": 63,
    "styleCode": "HND",
    "eanBarcode": "0538920190036",
    "name": "Artisanal Ceramic Serving Handi & Casserole (1.5L)",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Export-grade culinary serving handi in 1,500 ml banquet casserole with 24K gold finial domed cover. Available in 4 heritage motifs: Cobalt Ikat, Onyx Nakshi, Folk Chevron, and Yellow Damask.",
    "unit": "PCS",
    "dimensions": "160 x 220 x 220 mm",
    "weightKg": 1.45,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1457,
      "factoryCostUsd": 11.7,
      "initialFactoryAskingCostBdt": 1681,
      "initialFactoryAskingCostUsd": 13.5,
      "negotiatedSavingsBdt": 224,
      "negotiatedSavingsUsd": 1.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 12.6,
      "arielSourcingMarginPct": 30,
      "b2bFobPriceUsd": 18,
      "d2cRetailPriceUsd": 63,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.71,
      "totalEnterpriseMarginPct": 39.5
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 18,
        "marginPct": 30
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 16.56,
        "marginPct": 25.5
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 15.3,
        "marginPct": 21
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-HND-56-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-HND-56-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-HND-56-15L-blu-sq.jpg",
      "/images/products/ceramics/CT-HND-56-15L-blk-sq.jpg",
      "/images/products/ceramics/CT-HND-56-15L-folk-sq.jpg",
      "/images/products/ceramics/CT-HND-56-15L-damask-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-duo-76",
    "sku": "CT-DUO-76",
    "roadmapCode": "CT-DUO-76",
    "prodtId": 64,
    "styleCode": "DUO",
    "eanBarcode": "0538920190037",
    "name": "Artisanal Ceramic Mini Handi Duo with Serving Tray",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Twin 200 cc covered mini handis with matching 20 × 13 cm porcelain platter tray in rich Crimson/Onyx Nakshi Paisley and Ivory/Sand Folk Chevron.",
    "unit": "PCS",
    "dimensions": "90 x 200 x 130 mm",
    "weightKg": 1.1,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1335,
      "factoryCostUsd": 10.72,
      "initialFactoryAskingCostBdt": 1541,
      "initialFactoryAskingCostUsd": 12.38,
      "negotiatedSavingsBdt": 206,
      "negotiatedSavingsUsd": 1.66,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 11.62,
      "arielSourcingMarginPct": 29.6,
      "b2bFobPriceUsd": 16.5,
      "d2cRetailPriceUsd": 57.75,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.57,
      "totalEnterpriseMarginPct": 39.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 16.5,
        "marginPct": 29.6
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 15.18,
        "marginPct": 25.2
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 14.03,
        "marginPct": 20.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-DUO-76-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-DUO-76-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-DUO-76-nak-sq.jpg",
      "/images/products/ceramics/CT-DUO-76-flk-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-flr-59",
    "sku": "CT-FLR-59",
    "roadmapCode": "CT-FLR-59",
    "prodtId": 65,
    "styleCode": "FLR",
    "eanBarcode": "0538920190038",
    "name": "Artisanal Ceramic Teacup & Serving Tray Duo Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Artisan glazed 2-piece cup/mug set with matching 20 × 13 cm serving tray. Available in Royal Cobalt Aztec Ikat (150 ml), Turquoise Daisy Trellis (150 ml), Crimson Nakshi Paisley (300 ml), and Royal Marigold Damask (150 ml) with hand-finished rim accents.",
    "unit": "PCS",
    "dimensions": "90 x 200 x 130 mm",
    "weightKg": 0.85,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1012,
      "factoryCostUsd": 8.13,
      "initialFactoryAskingCostBdt": 1168,
      "initialFactoryAskingCostUsd": 9.38,
      "negotiatedSavingsBdt": 156,
      "negotiatedSavingsUsd": 1.25,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 9.03,
      "arielSourcingMarginPct": 27.8,
      "b2bFobPriceUsd": 12.5,
      "d2cRetailPriceUsd": 43.75,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.19,
      "totalEnterpriseMarginPct": 37.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 12.5,
        "marginPct": 27.8
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 11.5,
        "marginPct": 23.6
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 10.63,
        "marginPct": 19.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-FLR-59-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-FLR-59-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-FLR-59-ikt-sq.jpg",
      "/images/products/ceramics/CT-FLR-59-tur-sq.jpg",
      "/images/products/ceramics/CT-FLR-59-red-sq.jpg",
      "/images/products/ceramics/CT-FLR-59-yel-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-emr-57",
    "sku": "CT-EMR-57",
    "roadmapCode": "CT-EMR-57",
    "prodtId": 66,
    "styleCode": "EMR",
    "eanBarcode": "0538920190039",
    "name": "Emerald Blossom Pastel Floral Tea Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Specialty Beverage Collections",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Mint emerald green floral patterned porcelain tea service with teacups, teapot, and coordinated serving platter.",
    "unit": "PCS",
    "dimensions": "170 x 210 x 140 mm",
    "weightKg": 1.65,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1821,
      "factoryCostUsd": 14.63,
      "initialFactoryAskingCostBdt": 2102,
      "initialFactoryAskingCostUsd": 16.88,
      "negotiatedSavingsBdt": 281,
      "negotiatedSavingsUsd": 2.25,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 15.53,
      "arielSourcingMarginPct": 31,
      "b2bFobPriceUsd": 22.5,
      "d2cRetailPriceUsd": 78.75,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.14,
      "totalEnterpriseMarginPct": 40.5
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 22.5,
        "marginPct": 31
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 20.7,
        "marginPct": 26.3
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 19.13,
        "marginPct": 21.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-EMR-57-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-EMR-57-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-EMR-57-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-plt-63",
    "sku": "CT-PLT-63",
    "roadmapCode": "CT-PLT-63",
    "prodtId": 67,
    "styleCode": "PLT",
    "eanBarcode": "0538920190040",
    "name": "Artisanal Porcelain Snacks & Serving Platter",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6911.10.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "20 × 13 cm vitrified fine porcelain snacks and hors d'oeuvre platter with genuine 24K gold rim. Oven, microwave, and dishwasher safe.",
    "unit": "PCS",
    "dimensions": "25 x 200 x 130 mm",
    "weightKg": 0.42,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 688,
      "factoryCostUsd": 5.53,
      "initialFactoryAskingCostBdt": 794,
      "initialFactoryAskingCostUsd": 6.38,
      "negotiatedSavingsBdt": 106,
      "negotiatedSavingsUsd": 0.85,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 6.43,
      "arielSourcingMarginPct": 24.4,
      "b2bFobPriceUsd": 8.5,
      "d2cRetailPriceUsd": 29.75,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.81,
      "totalEnterpriseMarginPct": 33.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 300 - 600 pcs)",
        "moqRange": "300 - 600 pcs",
        "fobPriceUsd": 8.5,
        "marginPct": 24.4
      },
      {
        "slabName": "Wholesale Tier 2 (601 - 1200 pcs)",
        "moqRange": "601 - 1200 pcs",
        "fobPriceUsd": 7.82,
        "marginPct": 20.7
      },
      {
        "slabName": "FCL Bulk Volume (1201+ pcs)",
        "moqRange": "1201+ pcs",
        "fobPriceUsd": 7.22,
        "marginPct": 17.1
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-PLT-63-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-PLT-63-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-PLT-63-tur-sq.jpg",
      "/images/products/ceramics/CT-PLT-63-ivo-sq.jpg",
      "/images/products/ceramics/CT-PLT-63-blu-sq.jpg",
      "/images/products/ceramics/CT-PLT-63-red-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-pza-64",
    "sku": "CT-PZA-64",
    "roadmapCode": "CT-PZA-64",
    "prodtId": 68,
    "styleCode": "PZA",
    "eanBarcode": "0538920190041",
    "name": "Artisanal Ceramic Pizza & Flatbread Platter",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "34 × 20 cm handcrafted vitrified ceramic pizza paddle with ergonomic serving handle. Oven, microwave, and dishwasher safe.",
    "unit": "PCS",
    "dimensions": "20 x 340 x 200 mm",
    "weightKg": 0.85,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1214,
      "factoryCostUsd": 9.75,
      "initialFactoryAskingCostBdt": 1401,
      "initialFactoryAskingCostUsd": 11.25,
      "negotiatedSavingsBdt": 187,
      "negotiatedSavingsUsd": 1.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.65,
      "arielSourcingMarginPct": 29,
      "b2bFobPriceUsd": 15,
      "d2cRetailPriceUsd": 52.5,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.43,
      "totalEnterpriseMarginPct": 38.5
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 15,
        "marginPct": 29
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 13.8,
        "marginPct": 24.6
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 12.75,
        "marginPct": 20.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-PZA-64-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-PZA-64-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-PZA-64-nok-sq.jpg",
      "/images/products/ceramics/CT-PZA-64-red-sq.jpg",
      "/images/products/ceramics/CT-PZA-64-yel-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-srv-65",
    "sku": "CT-SRV-65",
    "roadmapCode": "CT-SRV-65",
    "prodtId": 69,
    "styleCode": "SRV",
    "eanBarcode": "0538920190042",
    "name": "Artisanal Porcelain Oval Serving Set (3 Pcs)",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "3-piece banquet-grade vitrified porcelain oval serving platter and deep baker set (1× 34 cm platter, 2× 28 cm entrée bakers). Oven, microwave, and dishwasher safe.",
    "unit": "PCS",
    "dimensions": "60 x 340 x 220 mm",
    "weightKg": 2.2,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1942,
      "factoryCostUsd": 15.6,
      "initialFactoryAskingCostBdt": 2241,
      "initialFactoryAskingCostUsd": 18,
      "negotiatedSavingsBdt": 299,
      "negotiatedSavingsUsd": 2.4,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 16.5,
      "arielSourcingMarginPct": 31.3,
      "b2bFobPriceUsd": 24,
      "d2cRetailPriceUsd": 84,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.28,
      "totalEnterpriseMarginPct": 40.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 24,
        "marginPct": 31.3
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 22.08,
        "marginPct": 26.6
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 20.4,
        "marginPct": 21.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-SRV-65-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-SRV-65-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 4
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-SRV-65-tur-sq.jpg",
      "/images/products/ceramics/CT-SRV-65-ivo-sq.jpg",
      "/images/products/ceramics/CT-SRV-65-red-sq.jpg",
      "/images/products/ceramics/CT-SRV-65-blu-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-cry-66",
    "sku": "CT-CRY-66",
    "roadmapCode": "CT-CRY-66",
    "prodtId": 70,
    "styleCode": "CRY",
    "eanBarcode": "0538920190043",
    "name": "Artisanal Porcelain Casserole & Curry Bowl Set",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Tiered 3-piece vitrified porcelain casserole and curry bowl set (7″, 8″ & 10″) with dual stay-cool handles and fitted steam-vented lids. Oven, microwave, and dishwasher safe.",
    "unit": "PCS",
    "dimensions": "120 x 250 x 250 mm",
    "weightKg": 2.4,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2104,
      "factoryCostUsd": 16.9,
      "initialFactoryAskingCostBdt": 2428,
      "initialFactoryAskingCostUsd": 19.5,
      "negotiatedSavingsBdt": 324,
      "negotiatedSavingsUsd": 2.6,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 17.8,
      "arielSourcingMarginPct": 31.5,
      "b2bFobPriceUsd": 26,
      "d2cRetailPriceUsd": 91,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.47,
      "totalEnterpriseMarginPct": 41
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 26,
        "marginPct": 31.5
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 23.92,
        "marginPct": 26.8
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 22.1,
        "marginPct": 22
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-CRY-66-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-CRY-66-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-CRY-66-red-sq.jpg",
      "/images/products/ceramics/CT-CRY-66-blu-sq.jpg",
      "/images/products/ceramics/CT-CRY-66-mah-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-dsh-67",
    "sku": "CT-DSH-67",
    "roadmapCode": "CT-DSH-67",
    "prodtId": 71,
    "styleCode": "DSH",
    "eanBarcode": "0538920190044",
    "name": "Artisanal Porcelain Covered Banquet Dish",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Generous 12″ (30.5 cm / 3.8L) vitrified porcelain covered banquet dish with fitted domed lid and spherical knob. Persian turquoise floral medallions with 24K gold rim.",
    "unit": "PCS",
    "dimensions": "180 x 305 x 305 mm",
    "weightKg": 2.8,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2347,
      "factoryCostUsd": 18.85,
      "initialFactoryAskingCostBdt": 2708,
      "initialFactoryAskingCostUsd": 21.75,
      "negotiatedSavingsBdt": 361,
      "negotiatedSavingsUsd": 2.9,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 19.75,
      "arielSourcingMarginPct": 31.9,
      "b2bFobPriceUsd": 29,
      "d2cRetailPriceUsd": 101.5,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 2.75,
      "totalEnterpriseMarginPct": 41.4
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 29,
        "marginPct": 31.9
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 26.68,
        "marginPct": 27.1
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 24.65,
        "marginPct": 22.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-DSH-67-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-DSH-67-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-DSH-67-sq.jpg",
      "/images/products/ceramics/CT-DSH-67-detail-sq.jpg",
      "/images/products/ceramics/CT-DSH-67.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-dst-68",
    "sku": "CT-DST-68",
    "roadmapCode": "CT-DST-68",
    "prodtId": 72,
    "styleCode": "DST",
    "eanBarcode": "0538920190045",
    "name": "Artisanal Porcelain Dessert Bowl Set (6 Pcs)",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Vitrified porcelain 6-piece dessert and appetizer suites (11 cm / 12 cm). Available in Piscine Artisan Fish, Bohemian Mandala, and Sakura Blossom pastels. Microwave & dishwasher safe.",
    "unit": "PCS",
    "dimensions": "55 x 115 x 115 mm",
    "weightKg": 0.95,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1133,
      "factoryCostUsd": 9.1,
      "initialFactoryAskingCostBdt": 1307,
      "initialFactoryAskingCostUsd": 10.5,
      "negotiatedSavingsBdt": 174,
      "negotiatedSavingsUsd": 1.4,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10,
      "arielSourcingMarginPct": 28.6,
      "b2bFobPriceUsd": 14,
      "d2cRetailPriceUsd": 49,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.33,
      "totalEnterpriseMarginPct": 38.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 14,
        "marginPct": 28.6
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 12.88,
        "marginPct": 24.3
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 11.9,
        "marginPct": 20
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-DST-68-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-DST-68-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-DST-68-fish-sq.jpg",
      "/images/products/ceramics/CT-DST-68-boh-sq.jpg",
      "/images/products/ceramics/CT-DST-68-sak-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-cut-69",
    "sku": "CT-CUT-69",
    "roadmapCode": "CT-CUT-69",
    "prodtId": 73,
    "styleCode": "CUT",
    "eanBarcode": "0538920190046",
    "name": "Artisanal Ceramic Tote Cutlery Holder",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Botanicals & Interior Vessels",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Architectural tote-bag silhouette ceramic cutlery and utensil caddy (11.5 × 8 × 12 cm) with dual upright arch loop handles. Available in Moroccan Trellis, Ethnic Ikat, and Folk Chevron.",
    "unit": "PCS",
    "dimensions": "120 x 115 x 80 mm",
    "weightKg": 0.55,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 768,
      "factoryCostUsd": 6.17,
      "initialFactoryAskingCostBdt": 888,
      "initialFactoryAskingCostUsd": 7.13,
      "negotiatedSavingsBdt": 120,
      "negotiatedSavingsUsd": 0.96,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 7.07,
      "arielSourcingMarginPct": 25.6,
      "b2bFobPriceUsd": 9.5,
      "d2cRetailPriceUsd": 33.25,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 0.9,
      "totalEnterpriseMarginPct": 35.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 250 - 500 pcs)",
        "moqRange": "250 - 500 pcs",
        "fobPriceUsd": 9.5,
        "marginPct": 25.6
      },
      {
        "slabName": "Wholesale Tier 2 (501 - 1000 pcs)",
        "moqRange": "501 - 1000 pcs",
        "fobPriceUsd": 8.74,
        "marginPct": 21.8
      },
      {
        "slabName": "FCL Bulk Volume (1001+ pcs)",
        "moqRange": "1001+ pcs",
        "fobPriceUsd": 8.07,
        "marginPct": 17.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-CUT-69-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-CUT-69-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-CUT-69-tre-sq.jpg",
      "/images/products/ceramics/CT-CUT-69-ikt-sq.jpg",
      "/images/products/ceramics/CT-CUT-69-nak-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-trn-70",
    "sku": "CT-TRN-70",
    "roadmapCode": "CT-TRN-70",
    "prodtId": 74,
    "styleCode": "TRN",
    "eanBarcode": "0538920190047",
    "name": "Imperial Swan-Neck Porcelain Tureen",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Palace-grade vitrified bone porcelain banquet tureen (2.0L) with sculpted swan handles, pedestal foot, and 24K gold finial domed lid. Available in Royal Marigold and Emerald Peacock.",
    "unit": "PCS",
    "dimensions": "220 x 290 x 240 mm",
    "weightKg": 2.6,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 3075,
      "factoryCostUsd": 24.7,
      "initialFactoryAskingCostBdt": 3548,
      "initialFactoryAskingCostUsd": 28.5,
      "negotiatedSavingsBdt": 473,
      "negotiatedSavingsUsd": 3.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 25.6,
      "arielSourcingMarginPct": 32.6,
      "b2bFobPriceUsd": 38,
      "d2cRetailPriceUsd": 133,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 3.61,
      "totalEnterpriseMarginPct": 42.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 38,
        "marginPct": 32.6
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 34.96,
        "marginPct": 27.7
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 32.3,
        "marginPct": 22.8
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-TRN-70-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-TRN-70-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-TRN-70-yel-sq.jpg",
      "/images/products/ceramics/CT-TRN-70-tur-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-cmp-72",
    "sku": "CT-CMP-72",
    "roadmapCode": "CT-CMP-72",
    "prodtId": 75,
    "styleCode": "CMP",
    "eanBarcode": "0538920190048",
    "name": "3-Compartment Handled Relish Platter",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "24.5 cm Triple-bowl relish & condiment caddy with central ergonomic loop handle. Fused high-fire ceramic with hand-painted crimson peony and sapphire berry botanical motifs.",
    "unit": "PCS",
    "dimensions": "95 x 245 x 245 mm",
    "weightKg": 0.85,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 931,
      "factoryCostUsd": 7.48,
      "initialFactoryAskingCostBdt": 1074,
      "initialFactoryAskingCostUsd": 8.63,
      "negotiatedSavingsBdt": 143,
      "negotiatedSavingsUsd": 1.15,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 8.38,
      "arielSourcingMarginPct": 27.1,
      "b2bFobPriceUsd": 11.5,
      "d2cRetailPriceUsd": 40.25,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.09,
      "totalEnterpriseMarginPct": 36.6
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 250 - 500 pcs)",
        "moqRange": "250 - 500 pcs",
        "fobPriceUsd": 11.5,
        "marginPct": 27.1
      },
      {
        "slabName": "Wholesale Tier 2 (501 - 1000 pcs)",
        "moqRange": "501 - 1000 pcs",
        "fobPriceUsd": 10.58,
        "marginPct": 23
      },
      {
        "slabName": "FCL Bulk Volume (1001+ pcs)",
        "moqRange": "1001+ pcs",
        "fobPriceUsd": 9.78,
        "marginPct": 19
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-CMP-72-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-CMP-72-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-CMP-72-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-spc-74",
    "sku": "CT-SPC-74",
    "roadmapCode": "CT-SPC-74",
    "prodtId": 76,
    "styleCode": "SPC",
    "eanBarcode": "0538920190049",
    "name": "Artisanal Ceramic Spice Canister Suite",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Botanicals & Interior Vessels",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "350 ml Vitrified ceramic spice & condiment canister suite with knobbed lids. Available in artisan heritage patterns (Moroccan Trellis, Daisy, Floral Garland, Florette) or high-gloss solid glazes.",
    "unit": "PCS",
    "dimensions": "110 x 85 x 85 mm",
    "weightKg": 1.2,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1295,
      "factoryCostUsd": 10.4,
      "initialFactoryAskingCostBdt": 1494,
      "initialFactoryAskingCostUsd": 12,
      "negotiatedSavingsBdt": 199,
      "negotiatedSavingsUsd": 1.6,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 11.3,
      "arielSourcingMarginPct": 29.4,
      "b2bFobPriceUsd": 16,
      "d2cRetailPriceUsd": 56,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 1.52,
      "totalEnterpriseMarginPct": 38.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 16,
        "marginPct": 29.4
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 14.72,
        "marginPct": 25
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 13.6,
        "marginPct": 20.6
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-SPC-74-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-SPC-74-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-SPC-74-pat-clean-sq.jpg",
      "/images/products/ceramics/CT-SPC-74-gls-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-ct-ct-fsh-75",
    "sku": "CT-FSH-75",
    "roadmapCode": "CT-FSH-75",
    "prodtId": 77,
    "styleCode": "FSH",
    "eanBarcode": "0538920190050",
    "name": "Imperial Hand-Painted Fish Banquet Platter",
    "sector": "CERAMICS",
    "category": "03 The Ceramic Index / Culinary Serving & Hospitality",
    "subCategory": "Culinary & Serving Essentials",
    "hsCode": "6912.00.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Grand 48 cm artisanal ceramic fish silhouette serving dish with Persian Bengal botanical mandala artwork, sculpted lips, saffron fins, and 4.3 cm depth profile.",
    "unit": "PCS",
    "dimensions": "45 x 480 x 260 mm",
    "weightKg": 2.2,
    "tags": [
      "Ceramics",
      "Culinary Serving & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 2751,
      "factoryCostUsd": 22.1,
      "initialFactoryAskingCostBdt": 3175,
      "initialFactoryAskingCostUsd": 25.5,
      "negotiatedSavingsBdt": 424,
      "negotiatedSavingsUsd": 3.4,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 23,
      "arielSourcingMarginPct": 32.4,
      "b2bFobPriceUsd": 34,
      "d2cRetailPriceUsd": 119,
      "incentiveCategory": "LIGHT_ENGINEERING_CERAMIC_10",
      "incentiveRatePct": 10,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 9.5,
      "netIncentiveUsd": 3.23,
      "totalEnterpriseMarginPct": 41.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 34,
        "marginPct": 32.4
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 31.28,
        "marginPct": 27.5
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 28.9,
        "marginPct": 22.7
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-MON-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Monno Ceramic Industries Ltd & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-MON-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/CT-FSH-75-Studio-HiRes.zip",
      "studioPhotoZipName": "CT-FSH-75-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "CERAMICS",
      "data": {
        "clayBody": "High-Purity Fine Vitrified Stoneware & Bone China",
        "glazeType": "Food-Grade Artisanal Reactive Glaze (Lead & Cadmium 0.0 ppm)",
        "firingTempCelsius": 1280,
        "foodContactSafety": "LFGB & FDA Certified Food-Contact Safe",
        "dishwasherSafe": true,
        "microwaveSafe": true
      }
    },
    "complianceCertificates": [
      "LFGB Food Safe Certified",
      "FDA 21 CFR 175.300",
      "ISO 6486 Lead & Cadmium Leaching Certified",
      "BSCI Audited Facility"
    ],
    "partnerFactory": {
      "factoryId": "fac_cer_01",
      "factoryCode": "FAC-MON-01",
      "factoryName": "Monno Ceramic Industries Ltd",
      "contactPerson": "Tanvir Ahmed (Head of Export)",
      "contactPhone": "+880 1755-559210",
      "contactEmail": "info@monnoceramic.com",
      "location": "Islampur, Purba Panchash, Dhamrai, Dhaka",
      "leadTimeDays": 30,
      "moq": 150,
      "sampleTurnaroundDays": 10,
      "samplePriceUsd": 85,
      "samplePackingUsd": 20,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.95
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/ceramics/CT-FSH-75-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-tx-ctb-01-amc",
    "sku": "TX-CTB-01-AMC",
    "roadmapCode": "TX-CTB-01-AMC",
    "prodtId": 329,
    "styleCode": "CTB",
    "eanBarcode": "0538920190051",
    "name": "The Ariel Horizon Canvas Tote",
    "sector": "TEXTILE",
    "category": "04 Thread & Weave / Canvas Tote Bags",
    "subCategory": "Heavyweight Cotton Duck Totes",
    "hsCode": "4202.92.15",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "16 oz heavy unbleached cotton canvas mini tote with 18 oz reinforced contrast base & handles, 3D satin embroidery, drop-in bay with iPad compartment, external sleeve, and dual interior slip pockets. Features 4 curated colorways plus custom OEM.",
    "unit": "PCS",
    "dimensions": "229 x 318 x 121 mm",
    "weightKg": 0.34,
    "tags": [
      "Textiles",
      "Canvas Tote Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 320,
      "factoryCostUsd": 2.57,
      "initialFactoryAskingCostBdt": 369,
      "initialFactoryAskingCostUsd": 2.96,
      "negotiatedSavingsBdt": 49,
      "negotiatedSavingsUsd": 0.39,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.47,
      "arielSourcingMarginPct": 12.2,
      "b2bFobPriceUsd": 3.95,
      "d2cRetailPriceUsd": 13.83,
      "incentiveCategory": "EXPORT_RMG_INCENTIVE_08",
      "incentiveRatePct": 8,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 7.6,
      "netIncentiveUsd": 0.3,
      "totalEnterpriseMarginPct": 19.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 500 - 1000 pcs)",
        "moqRange": "500 - 1000 pcs",
        "fobPriceUsd": 3.95,
        "marginPct": 12.2
      },
      {
        "slabName": "Wholesale Tier 2 (1001 - 2000 pcs)",
        "moqRange": "1001 - 2000 pcs",
        "fobPriceUsd": 3.63,
        "marginPct": 10.4
      },
      {
        "slabName": "FCL Bulk Volume (2001+ pcs)",
        "moqRange": "2001+ pcs",
        "fobPriceUsd": 3.36,
        "marginPct": 8.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/TX-CTB-01-AMC-Studio-HiRes.zip",
      "studioPhotoZipName": "TX-CTB-01-AMC-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 5
    },
    "attributes": {
      "sector": "TEXTILE",
      "data": {
        "composition": "100% Combed Cotton Duck / Organic Linen Blend",
        "gsm": 380,
        "weaveType": "Heavyweight Plain Weave Duck Canvas",
        "dyeStandard": "Azo-Free Eco Reactive Dye",
        "shrinkageLimit": "< 3%"
      }
    },
    "complianceCertificates": [
      "OEKO-TEX Standard 100",
      "GOTS Organic Cotton Base",
      "BSCI Audit Grade A",
      "Sedex SMETA"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 21,
      "moq": 100,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 35,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/textiles/horizon-tote/1.jpeg",
      "/images/products/textiles/horizon-tote/5.jpeg",
      "/images/products/textiles/horizon-tote/2.jpeg",
      "/images/products/textiles/horizon-tote/3.jpeg",
      "/images/products/textiles/horizon-tote/4.jpeg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-tx-ctb-02-amc",
    "sku": "TX-CTB-02-AMC",
    "roadmapCode": "TX-CTB-02-AMC",
    "prodtId": 330,
    "styleCode": "CTB",
    "eanBarcode": "0538920190052",
    "name": "The Sage & Sapphire Everyday Shopper",
    "sector": "TEXTILE",
    "category": "04 Thread & Weave / Canvas Tote Bags",
    "subCategory": "Heavyweight Cotton Duck Totes",
    "hsCode": "4202.92.15",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "14 oz washed cotton canvas body in slate sapphire blue with 16 oz reinforced organic sage base & full-height straps, botanical imprint, and 15 kg structural capacity (40 × 34 × 14 cm). Custom OEM dyeing and client branding available.",
    "unit": "PCS",
    "dimensions": "340 x 400 x 140 mm",
    "weightKg": 0.38,
    "tags": [
      "Textiles",
      "Canvas Tote Bags",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 320,
      "factoryCostUsd": 2.57,
      "initialFactoryAskingCostBdt": 369,
      "initialFactoryAskingCostUsd": 2.96,
      "negotiatedSavingsBdt": 49,
      "negotiatedSavingsUsd": 0.39,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 3.47,
      "arielSourcingMarginPct": 12.2,
      "b2bFobPriceUsd": 3.95,
      "d2cRetailPriceUsd": 13.83,
      "incentiveCategory": "EXPORT_RMG_INCENTIVE_08",
      "incentiveRatePct": 8,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 7.6,
      "netIncentiveUsd": 0.3,
      "totalEnterpriseMarginPct": 19.8
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 500 - 1000 pcs)",
        "moqRange": "500 - 1000 pcs",
        "fobPriceUsd": 3.95,
        "marginPct": 12.2
      },
      {
        "slabName": "Wholesale Tier 2 (1001 - 2000 pcs)",
        "moqRange": "1001 - 2000 pcs",
        "fobPriceUsd": 3.63,
        "marginPct": 10.4
      },
      {
        "slabName": "FCL Bulk Volume (2001+ pcs)",
        "moqRange": "2001+ pcs",
        "fobPriceUsd": 3.36,
        "marginPct": 8.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-BE-01-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Bangla Eco & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-BE-01-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/TX-CTB-02-AMC-Studio-HiRes.zip",
      "studioPhotoZipName": "TX-CTB-02-AMC-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "TEXTILE",
      "data": {
        "composition": "100% Combed Cotton Duck / Organic Linen Blend",
        "gsm": 380,
        "weaveType": "Heavyweight Plain Weave Duck Canvas",
        "dyeStandard": "Azo-Free Eco Reactive Dye",
        "shrinkageLimit": "< 3%"
      }
    },
    "complianceCertificates": [
      "OEKO-TEX Standard 100",
      "GOTS Organic Cotton Base",
      "BSCI Audit Grade A",
      "Sedex SMETA"
    ],
    "partnerFactory": {
      "factoryId": "fac_lth_01",
      "factoryCode": "FAC-BE-01",
      "factoryName": "Bangla Eco",
      "contactPerson": "Shahrier Nyeem (Director)",
      "contactPhone": "+880 1533-685796",
      "contactEmail": "banglaeco.contact@gmail.com",
      "location": "Hazaribagh & Savar, Dhaka",
      "leadTimeDays": 21,
      "moq": 100,
      "sampleTurnaroundDays": 7,
      "samplePriceUsd": 35,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.9
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/textiles/sage-sapphire/IMG_2457.jpeg",
      "/images/products/textiles/sage-sapphire/IMG_2458.jpeg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-62",
    "sku": "PT-BNG-62",
    "roadmapCode": "PT-BNG-62",
    "prodtId": 62,
    "styleCode": "BNG",
    "eanBarcode": "0538920190053",
    "name": "Fluted & Ribbed Cylinder Pots with Saucers (15–30 cm)",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Botanical & Garden",
    "subCategory": "Breathable Architectural Planters",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Architectural wheel-turned terracotta planter featuring concentric horizontal ribbed flute textures, root-aeration porosity, and matching water saucer.",
    "unit": "PCS",
    "dimensions": "240 x 220 x 220 mm",
    "weightKg": 1.9,
    "tags": [
      "Pottery",
      "Botanical & Garden",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1174,
      "factoryCostUsd": 9.43,
      "initialFactoryAskingCostBdt": 1355,
      "initialFactoryAskingCostUsd": 10.88,
      "negotiatedSavingsBdt": 181,
      "negotiatedSavingsUsd": 1.45,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.33,
      "arielSourcingMarginPct": 28.8,
      "b2bFobPriceUsd": 14.5,
      "d2cRetailPriceUsd": 50.75,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 2.07,
      "totalEnterpriseMarginPct": 43
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 14.5,
        "marginPct": 28.8
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 13.34,
        "marginPct": 24.5
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 12.32,
        "marginPct": 20.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/PT-BNG-62-Studio-HiRes.zip",
      "studioPhotoZipName": "PT-BNG-62-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Natural Eco-Friendly Clay",
      "Fair Trade Artisan Verified"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-PLT-61-sq.jpg",
      "/images/products/terracotta/TC-PLT-61-combo.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-63",
    "sku": "PT-BNG-63",
    "roadmapCode": "PT-BNG-63",
    "prodtId": 63,
    "styleCode": "BNG",
    "eanBarcode": "0538920190054",
    "name": "Tapered Urns & Large-Scale Patio Planters",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Botanical & Garden",
    "subCategory": "Breathable Architectural Planters",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Substantial monumental patio urn with hand-coiled classical tapering silhouette, heavy rim collar, and natural wood-fired variegated blushing.",
    "unit": "PCS",
    "dimensions": "580 x 420 x 420 mm",
    "weightKg": 8.5,
    "tags": [
      "Pottery",
      "Botanical & Garden",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 3884,
      "factoryCostUsd": 31.2,
      "initialFactoryAskingCostBdt": 4482,
      "initialFactoryAskingCostUsd": 36,
      "negotiatedSavingsBdt": 598,
      "negotiatedSavingsUsd": 4.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 32.1,
      "arielSourcingMarginPct": 33.1,
      "b2bFobPriceUsd": 48,
      "d2cRetailPriceUsd": 168,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 6.84,
      "totalEnterpriseMarginPct": 47.4
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 30 - 60 pcs)",
        "moqRange": "30 - 60 pcs",
        "fobPriceUsd": 48,
        "marginPct": 33.1
      },
      {
        "slabName": "Wholesale Tier 2 (61 - 120 pcs)",
        "moqRange": "61 - 120 pcs",
        "fobPriceUsd": 44.16,
        "marginPct": 28.1
      },
      {
        "slabName": "FCL Bulk Volume (121+ pcs)",
        "moqRange": "121+ pcs",
        "fobPriceUsd": 40.8,
        "marginPct": 23.2
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/PT-BNG-63-Studio-HiRes.zip",
      "studioPhotoZipName": "PT-BNG-63-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 3
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "BSCI Audited",
      "Fair Trade Verified"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-AMP-62-sq.jpg",
      "/images/products/terracotta/TC-AMP-62.jpg",
      "/images/products/terracotta/TC-VAS-64-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-64",
    "sku": "PT-BNG-64",
    "roadmapCode": "PT-BNG-64",
    "prodtId": 64,
    "styleCode": "BNG",
    "eanBarcode": "0538920190055",
    "name": "Modular Hanging Pots & Self-Watering Spikes",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Botanical & Garden",
    "subCategory": "Breathable Architectural Planters",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Indoor hanging succulent pot with 3-strand natural jute suspension macramé rope, paired with 2 micro-porous terracotta slow-release plant irrigation spikes.",
    "unit": "PCS",
    "dimensions": "140 x 150 x 150 mm",
    "weightKg": 0.42,
    "tags": [
      "Pottery",
      "Botanical & Garden",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 768,
      "factoryCostUsd": 6.17,
      "initialFactoryAskingCostBdt": 888,
      "initialFactoryAskingCostUsd": 7.13,
      "negotiatedSavingsBdt": 120,
      "negotiatedSavingsUsd": 0.96,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 7.07,
      "arielSourcingMarginPct": 25.6,
      "b2bFobPriceUsd": 9.5,
      "d2cRetailPriceUsd": 33.25,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 1.35,
      "totalEnterpriseMarginPct": 39.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 200 - 400 pcs)",
        "moqRange": "200 - 400 pcs",
        "fobPriceUsd": 9.5,
        "marginPct": 25.6
      },
      {
        "slabName": "Wholesale Tier 2 (401 - 800 pcs)",
        "moqRange": "401 - 800 pcs",
        "fobPriceUsd": 8.74,
        "marginPct": 21.8
      },
      {
        "slabName": "FCL Bulk Volume (801+ pcs)",
        "moqRange": "801+ pcs",
        "fobPriceUsd": 8.07,
        "marginPct": 17.9
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/PT-BNG-64-Studio-HiRes.zip",
      "studioPhotoZipName": "PT-BNG-64-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Natural Clay Certified"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-VAS-63-sq.jpg",
      "/images/products/terracotta/TC-VAS-63.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-66",
    "sku": "POT-JUG-008-BMS",
    "roadmapCode": "PT-TTH-66",
    "prodtId": 66,
    "styleCode": "JUG",
    "eanBarcode": "0538920190056",
    "name": "Clay Water Carafes, Jugs & Drinking Tumblers",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Tabletop & Hospitality",
    "subCategory": "Evaporative Serving & Dining Pieces",
    "hsCode": "6912.00.20",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Heritage water cooling carafe (1.2L) with fitted clay cup lid and 4 matching tumblers. Naturally imparts alkaline mineral balance and chilling to drinking water.",
    "unit": "PCS",
    "dimensions": "260 x 160 x 160 mm",
    "weightKg": 1.4,
    "tags": [
      "Pottery",
      "Tabletop & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1214,
      "factoryCostUsd": 9.75,
      "initialFactoryAskingCostBdt": 1401,
      "initialFactoryAskingCostUsd": 11.25,
      "negotiatedSavingsBdt": 187,
      "negotiatedSavingsUsd": 1.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10.65,
      "arielSourcingMarginPct": 29,
      "b2bFobPriceUsd": 15,
      "d2cRetailPriceUsd": 52.5,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 2.14,
      "totalEnterpriseMarginPct": 43.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 120 - 240 pcs)",
        "moqRange": "120 - 240 pcs",
        "fobPriceUsd": 15,
        "marginPct": 29
      },
      {
        "slabName": "Wholesale Tier 2 (241 - 480 pcs)",
        "moqRange": "241 - 480 pcs",
        "fobPriceUsd": 13.8,
        "marginPct": 24.6
      },
      {
        "slabName": "FCL Bulk Volume (481+ pcs)",
        "moqRange": "481+ pcs",
        "fobPriceUsd": 12.75,
        "marginPct": 20.3
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/POT-JUG-008-BMS-Studio-HiRes.zip",
      "studioPhotoZipName": "POT-JUG-008-BMS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "LFGB Certified Food Safe",
      "FDA Lead Free"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-EVV-65.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-67",
    "sku": "POT-BWL-007-BMS",
    "roadmapCode": "PT-TTH-67",
    "prodtId": 67,
    "styleCode": "BWL",
    "eanBarcode": "0538920190057",
    "name": "Geometric Hexagonal & Square Terracotta Tapas Bowls",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Tabletop & Hospitality",
    "subCategory": "Evaporative Serving & Dining Pieces",
    "hsCode": "6912.00.20",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Traditional glazed interior terracotta cazuela dip bowls (Set of 6, 12 cm) suitable for serving warm tapas, olive oil dipping, and artisanal condiments.",
    "unit": "PCS",
    "dimensions": "35 x 120 x 120 mm",
    "weightKg": 0.21,
    "tags": [
      "Pottery",
      "Tabletop & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 608,
      "factoryCostUsd": 4.88,
      "initialFactoryAskingCostBdt": 701,
      "initialFactoryAskingCostUsd": 5.63,
      "negotiatedSavingsBdt": 93,
      "negotiatedSavingsUsd": 0.75,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 5.78,
      "arielSourcingMarginPct": 22.9,
      "b2bFobPriceUsd": 7.5,
      "d2cRetailPriceUsd": 26.25,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 1.07,
      "totalEnterpriseMarginPct": 37.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 250 - 500 pcs)",
        "moqRange": "250 - 500 pcs",
        "fobPriceUsd": 7.5,
        "marginPct": 22.9
      },
      {
        "slabName": "Wholesale Tier 2 (501 - 1000 pcs)",
        "moqRange": "501 - 1000 pcs",
        "fobPriceUsd": 6.9,
        "marginPct": 19.5
      },
      {
        "slabName": "FCL Bulk Volume (1001+ pcs)",
        "moqRange": "1001+ pcs",
        "fobPriceUsd": 6.38,
        "marginPct": 16
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/POT-BWL-007-BMS-Studio-HiRes.zip",
      "studioPhotoZipName": "POT-BWL-007-BMS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "LFGB",
      "FDA 21 CFR Compliant"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-PLT-61.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-68",
    "sku": "POT-HND-004-BMS",
    "roadmapCode": "PT-TTH-68",
    "prodtId": 68,
    "styleCode": "HND",
    "eanBarcode": "0538920190058",
    "name": "Traditional Slow-Cooking Biryani Handi with Lid",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Tabletop & Hospitality",
    "subCategory": "Evaporative Serving & Dining Pieces",
    "hsCode": "6912.00.20",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Authentic covered round slow-cooking biryani/curry handi pot with fitted lid. Retains moisture, circulates steam, and enhances deep flavor profiles.",
    "unit": "PCS",
    "dimensions": "180 x 240 x 240 mm",
    "weightKg": 2.2,
    "tags": [
      "Pottery",
      "Tabletop & Hospitality",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1457,
      "factoryCostUsd": 11.7,
      "initialFactoryAskingCostBdt": 1681,
      "initialFactoryAskingCostUsd": 13.5,
      "negotiatedSavingsBdt": 224,
      "negotiatedSavingsUsd": 1.8,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 12.6,
      "arielSourcingMarginPct": 30,
      "b2bFobPriceUsd": 18,
      "d2cRetailPriceUsd": 63,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 2.56,
      "totalEnterpriseMarginPct": 44.3
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 18,
        "marginPct": 30
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 16.56,
        "marginPct": 25.5
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 15.3,
        "marginPct": 21
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/POT-HND-004-BMS-Studio-HiRes.zip",
      "studioPhotoZipName": "POT-HND-004-BMS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "LFGB Tested",
      "FDA Lead Free"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-PLT-61-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-69",
    "sku": "POT-VAS-012-BMS",
    "roadmapCode": "PT-HLD-69",
    "prodtId": 69,
    "styleCode": "VAS",
    "eanBarcode": "0538920190059",
    "name": "Hand-Coiled Earthen Fluted Urn & Amphora Floor Vase",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Home Living & Décor",
    "subCategory": "Sculptural Accents & Interior Objects",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Grand 65 cm artisan statement floor amphora vessel hand-coiled by master potters. Raw terracotta textured base with fluid turquoise drip glaze neck accent.",
    "unit": "PCS",
    "dimensions": "650 x 340 x 340 mm",
    "weightKg": 6.5,
    "tags": [
      "Pottery",
      "Home Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 5260,
      "factoryCostUsd": 42.25,
      "initialFactoryAskingCostBdt": 6069,
      "initialFactoryAskingCostUsd": 48.75,
      "negotiatedSavingsBdt": 809,
      "negotiatedSavingsUsd": 6.5,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 43.15,
      "arielSourcingMarginPct": 33.6,
      "b2bFobPriceUsd": 65,
      "d2cRetailPriceUsd": 227.5,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 9.26,
      "totalEnterpriseMarginPct": 47.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 25 - 50 pcs)",
        "moqRange": "25 - 50 pcs",
        "fobPriceUsd": 65,
        "marginPct": 33.6
      },
      {
        "slabName": "Wholesale Tier 2 (51 - 100 pcs)",
        "moqRange": "51 - 100 pcs",
        "fobPriceUsd": 59.8,
        "marginPct": 28.6
      },
      {
        "slabName": "FCL Bulk Volume (101+ pcs)",
        "moqRange": "101+ pcs",
        "fobPriceUsd": 55.25,
        "marginPct": 23.5
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/POT-VAS-012-BMS-Studio-HiRes.zip",
      "studioPhotoZipName": "POT-VAS-012-BMS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Fair Trade Verified",
      "BSCI Audited"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-AMP-62.jpg",
      "/images/products/terracotta/TC-AMP-62-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-70",
    "sku": "PT-HLD-70",
    "roadmapCode": "PT-HLD-70",
    "prodtId": 70,
    "styleCode": "HLD",
    "eanBarcode": "0538920190060",
    "name": "Minimalist Candle Holders, Vessels & Oil Diffusers",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Home Living & Décor",
    "subCategory": "Sculptural Accents & Interior Objects",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Organic geometric taper candle holder pair and essential oil burner with hollow heat-diffusing candle chamber and unglazed textural raw finish.",
    "unit": "PCS",
    "dimensions": "110 x 95 x 95 mm",
    "weightKg": 0.28,
    "tags": [
      "Pottery",
      "Home Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 931,
      "factoryCostUsd": 7.48,
      "initialFactoryAskingCostBdt": 1074,
      "initialFactoryAskingCostUsd": 8.63,
      "negotiatedSavingsBdt": 143,
      "negotiatedSavingsUsd": 1.15,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 8.38,
      "arielSourcingMarginPct": 27.1,
      "b2bFobPriceUsd": 11.5,
      "d2cRetailPriceUsd": 40.25,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 1.64,
      "totalEnterpriseMarginPct": 41.4
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 150 - 300 pcs)",
        "moqRange": "150 - 300 pcs",
        "fobPriceUsd": 11.5,
        "marginPct": 27.1
      },
      {
        "slabName": "Wholesale Tier 2 (301 - 600 pcs)",
        "moqRange": "301 - 600 pcs",
        "fobPriceUsd": 10.58,
        "marginPct": 23
      },
      {
        "slabName": "FCL Bulk Volume (601+ pcs)",
        "moqRange": "601+ pcs",
        "fobPriceUsd": 9.78,
        "marginPct": 19
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/PT-HLD-70-Studio-HiRes.zip",
      "studioPhotoZipName": "PT-HLD-70-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Heat Shock Tested",
      "Fair Trade"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-VAS-64.jpg",
      "/images/products/terracotta/TC-VAS-64-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-71",
    "sku": "PT-HLD-71",
    "roadmapCode": "PT-HLD-71",
    "prodtId": 71,
    "styleCode": "HLD",
    "eanBarcode": "0538920190061",
    "name": "Decorative Terracotta Wall Plates & Catchall Trays",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Home Living & Décor",
    "subCategory": "Sculptural Accents & Interior Objects",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Hand-etched decorative medallion wall plate (28 cm) with integrated wire hanging fixture and traditional Bengali folk geometric carved relief motifs.",
    "unit": "PCS",
    "dimensions": "280 x 280 x 30 mm",
    "weightKg": 0.95,
    "tags": [
      "Pottery",
      "Home Living & Décor",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1133,
      "factoryCostUsd": 9.1,
      "initialFactoryAskingCostBdt": 1307,
      "initialFactoryAskingCostUsd": 10.5,
      "negotiatedSavingsBdt": 174,
      "negotiatedSavingsUsd": 1.4,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 10,
      "arielSourcingMarginPct": 28.6,
      "b2bFobPriceUsd": 14,
      "d2cRetailPriceUsd": 49,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 2,
      "totalEnterpriseMarginPct": 42.9
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 120 - 240 pcs)",
        "moqRange": "120 - 240 pcs",
        "fobPriceUsd": 14,
        "marginPct": 28.6
      },
      {
        "slabName": "Wholesale Tier 2 (241 - 480 pcs)",
        "moqRange": "241 - 480 pcs",
        "fobPriceUsd": 12.88,
        "marginPct": 24.3
      },
      {
        "slabName": "FCL Bulk Volume (481+ pcs)",
        "moqRange": "481+ pcs",
        "fobPriceUsd": 11.9,
        "marginPct": 20
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/PT-HLD-71-Studio-HiRes.zip",
      "studioPhotoZipName": "PT-HLD-71-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 2
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Fair Trade Artisan Verified"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-VAS-63.jpg",
      "/images/products/terracotta/TC-VAS-63-sq.jpg"
    ],
    "createdDate": "2026-11-01"
  },
  {
    "id": "prod-pt-74",
    "sku": "POT-LNT-011-BMS",
    "roadmapCode": "PT-AEE-74",
    "prodtId": 74,
    "styleCode": "LNT",
    "eanBarcode": "0538920190062",
    "name": "Pierced Geometric Terracotta Garden Lantern",
    "sector": "POTTERY",
    "category": "05 Earth & Form / Architectural Elements",
    "subCategory": "Clay Tiles & Structural Ceramics",
    "hsCode": "6914.90.00",
    "packagingMode": "Standard Export Carton & Poly-Sleeve",
    "description": "Pierced decorative garden hurricane lantern with intricate geometric light-casting pinhole apertures, weather-proof chimney top, and solid brass carry bail handle.",
    "unit": "PCS",
    "dimensions": "340 x 190 x 190 mm",
    "weightKg": 2.45,
    "tags": [
      "Pottery",
      "Architectural Elements",
      "Export Verified",
      "ArielMC Certified"
    ],
    "targetMarkets": [
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "costing": {
      "factoryCostBdt": 1780,
      "factoryCostUsd": 14.3,
      "initialFactoryAskingCostBdt": 2054,
      "initialFactoryAskingCostUsd": 16.5,
      "negotiatedSavingsBdt": 274,
      "negotiatedSavingsUsd": 2.2,
      "exportPackagingUsd": 0.35,
      "inlandFreightPortUsd": 0.25,
      "qualityInspectionReserveUsd": 0.15,
      "complianceOverheadReserveUsd": 0.15,
      "totalLandedCostUsd": 15.2,
      "arielSourcingMarginPct": 30.9,
      "b2bFobPriceUsd": 22,
      "d2cRetailPriceUsd": 77,
      "incentiveCategory": "HANDICRAFTS_BENGAL_15",
      "incentiveRatePct": 15,
      "sourceTaxRatePct": 5,
      "netIncentivePct": 14.25,
      "netIncentiveUsd": 3.13,
      "totalEnterpriseMarginPct": 45.1
    },
    "volumePricingSlabs": [
      {
        "slabName": "Pilot Run (MOQ 100 - 200 pcs)",
        "moqRange": "100 - 200 pcs",
        "fobPriceUsd": 22,
        "marginPct": 30.9
      },
      {
        "slabName": "Wholesale Tier 2 (201 - 400 pcs)",
        "moqRange": "201 - 400 pcs",
        "fobPriceUsd": 20.24,
        "marginPct": 26.3
      },
      {
        "slabName": "FCL Bulk Volume (401+ pcs)",
        "moqRange": "401+ pcs",
        "fobPriceUsd": 18.7,
        "marginPct": 21.6
      }
    ],
    "sourcingVault": {
      "signedMouUrl": "/docs/mou/MOU-FAC-DHM-02-2026.pdf",
      "signedMouName": "Deed of Sourcing Agreement (Dhamrai Traditional Clay & Terracotta Guild & ArielMC)",
      "signedMouDate": "2026-01-15",
      "hasIncentiveWaiverClause": true,
      "factoryRatingGrade": "A",
      "factoryRatingScore": 94,
      "factoryAuditReportUrl": "/docs/audit/AUDIT-FAC-DHM-02-2026.pdf",
      "factoryAuditReportName": "ArielMC On-Site Artisan Quality & Wage Audit",
      "studioPhotoZipUrl": "/assets/studio/POT-LNT-011-BMS-Studio-HiRes.zip",
      "studioPhotoZipName": "POT-LNT-011-BMS-Studio-300DPI-Pack.zip",
      "highResPhotoCount": 1
    },
    "attributes": {
      "sector": "POTTERY",
      "data": {
        "clayType": "Alluvial Red Bengal River Silt Clay",
        "firingTempCelsius": 980,
        "finishStyle": "Hand-Burnished Natural Clay with Stone Polishing",
        "evaporativeCoolingRating": "Active (Cools water by 3-5°C below ambient)",
        "ecoCertifications": [
          "100% Lead-Free",
          "Natural Mineral Only",
          "Artisan Heritage Certified"
        ]
      }
    },
    "complianceCertificates": [
      "Fair Trade Verified",
      "BSCI Certified"
    ],
    "partnerFactory": {
      "factoryId": "fac_pot_01",
      "factoryCode": "FAC-DHM-02",
      "factoryName": "Dhamrai Traditional Clay & Terracotta Guild",
      "contactPerson": "Gouranga Pal (Master Potter)",
      "contactPhone": "+880 1718-491823",
      "contactEmail": "dhamrai.pottery@arielmc.com",
      "location": "Dhamrai Heritage Craft Village, Dhaka District",
      "leadTimeDays": 20,
      "moq": 200,
      "sampleTurnaroundDays": 5,
      "samplePriceUsd": 45,
      "samplePackingUsd": 10,
      "sampleCostPolicy": "PAID_UPFRONT_CREDITED_ON_BULK_PO",
      "rating": 4.85
    },
    "sampleStatus": "BUYER_APPROVED",
    "images": [
      "/images/products/terracotta/TC-VAS-64.jpg"
    ],
    "createdDate": "2026-11-01"
  }
];
