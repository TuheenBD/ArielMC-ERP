import { FactorySupplierPortfolio } from '@/types/factoryPortfolio';

export const INITIAL_FACTORY_PORTFOLIOS: FactorySupplierPortfolio[] = [
  // 1. APEX ARTISAN LEATHERWORKS LTD (Savar Tannery Hub)
  {
    id: 'fac_lth_01',
    factoryCode: 'FAC-SAV-01',
    factoryName: 'Apex Artisan Leatherworks Ltd',
    vendorClassification: 'FULL_FLEDGED_FACTORY',
    sectors: ['LEATHER'],
    clusterRegion: 'Hemayetpur Tannery Estate, Savar, Dhaka',
    factoryAddress: 'Plot 42-45, Tannery Industrial Park, Hemayetpur, Savar, Dhaka-1340, Bangladesh',
    establishedYear: 1998,
    tier: 'TIER_1_PREFERRED',
    lastUpdated: '2026-10-18',
    keyManagementContacts: [
      {
        name: 'Engr. Mahfuzur Rahman',
        designation: 'General Manager (Operations & Compliance)',
        phone: '+880 1711-482910',
        email: 'm.rahman@apexartisan-bd.com',
      },
      {
        name: 'Kamal Hossain Mollah',
        designation: 'Head of Quality Assurance & FRI Testing',
        phone: '+880 1713-994821',
        email: 'kamal.qa@apexartisan-bd.com',
      },
    ],
    digitalChannels: {
      website: 'www.apexartisan-bd.com',
      linkedIn: 'linkedin.com/company/apex-artisan-bd',
      facebook: 'facebook.com/apexartisan.bd',
    },

    // Pillar 1: Production Capabilities & Machinery
    capacityAndMachinery: {
      monthlyCapacityUnits: 35000,
      allocatedCapacityUnits: 24500,
      arielMcReservedCapacityUnits: 12000, // 34% of total factory capacity reserved for ArielMC
      utilizationRatePct: 70.0,
      activeLinesCount: 8,
      totalWorkforce: 650,
      shiftStructure: 'Single Shift',
      machinery: [
        {
          machineName: 'Durkopp Adler Heavy Duty Lockstitch Machines (Germany)',
          originCountry: 'Germany',
          quantity: 45,
          purpose: 'High-tensile leather structural joining & precision top-stitching',
        },
        {
          machineName: 'Atom CNC Automatic Leather Die Cutting Tables (Italy)',
          originCountry: 'Italy',
          quantity: 4,
          purpose: 'Digital nest pattern cutting with zero hide waste',
        },
        {
          machineName: 'Camoga Bandknife Precision Leather Splitting Machines',
          originCountry: 'Italy',
          quantity: 6,
          purpose: 'Substance leveling from 0.8mm to 2.2mm with ±0.05mm tolerance',
        },
        {
          machineName: 'Omac Edge Inking & Thermocementing Conveyor Lines',
          originCountry: 'Italy',
          quantity: 8,
          purpose: 'Italian 3-coat edge finishing with infrared heat curing',
        },
      ],
    },

    // Pillar 2: Social, Structural & Environmental Audits
    complianceAudits: [
      {
        id: 'aud_lwg_01',
        standardName: 'Leather Working Group (LWG)',
        status: 'VALID',
        ratingGrade: 'Gold Rated Tannery (Score: 94.5%)',
        auditBody: 'Eurofins / BLC Leather Tech UK',
        auditDate: '2025-08-30',
        validUntil: '2027-08-30',
        reportNumber: 'LWG-AUD-2025-081',
      },
      {
        id: 'aud_bsci_01',
        standardName: 'BSCI Social Audit',
        status: 'VALID',
        ratingGrade: 'Grade A (Outstanding - Zero Non-Conformance)',
        auditBody: 'SGS Bangladesh',
        auditDate: '2025-03-15',
        validUntil: '2027-03-15',
        reportNumber: 'BSCI-BD-884910',
      },
      {
        id: 'aud_reach_01',
        standardName: 'EU REACH Chemical Compliance',
        status: 'VALID',
        ratingGrade: 'Full Annex XVII Compliance (Cr VI < 3.0 ppm)',
        auditBody: 'TÜV Rheinland Bangladesh',
        auditDate: '2025-11-20',
        validUntil: '2026-11-20',
        reportNumber: 'TUV-REACH-9941',
      },
      {
        id: 'aud_sedex_01',
        standardName: 'Sedex SMETA 4-Pillar',
        status: 'VALID',
        ratingGrade: 'Zero Critical Issues Verified',
        auditBody: 'Intertek Bangladesh',
        auditDate: '2025-06-10',
        validUntil: '2027-06-10',
        reportNumber: 'SMETA-4P-2025-412',
      },
    ],

    // Pillar 3: Raw Material & Traceability Network
    subSupplierNetwork: [
      {
        id: 'sub-01',
        materialType: 'Raw Bovine Full-Grain Wet-Blue Hides',
        supplierName: 'Apex Tannery Relocated Park Unit',
        locationCluster: 'Hemayetpur, Savar, Dhaka',
        complianceTier: 'Certified Tier 1',
        traceabilityVerified: true,
      },
      {
        id: 'sub-02',
        materialType: 'GOTS Organic Cotton Twill Lining',
        supplierName: 'Envoy Textiles Spinning Mill',
        locationCluster: 'Bhaluka, Mymensingh',
        complianceTier: 'Certified Tier 1',
        traceabilityVerified: true,
      },
      {
        id: 'sub-03',
        materialType: 'Cast Solid Antiqued Brass Hardware',
        supplierName: 'Precision Metal Craft Accessories Ltd',
        locationCluster: 'Tongi Industrial Area, Gazipur',
        complianceTier: 'Certified Tier 1',
        traceabilityVerified: true,
      },
    ],

    // Pillar 4: Commercial Banking & B2B L/C Financial Profile
    financialAndBanking: {
      bankName: 'Eastern Bank PLC (EBL)',
      branchName: 'Savar SME Banking Unit',
      routingNumber: '090264182',
      swiftBic: 'EBLBBDDH',
      backToBackLcAccepted: true,
      preferredLcTenorDays: 90,
      nbrBinNumber: '001892837-0101',
      tinNumber: '8492817291',
      epbRegistrationNo: 'EPB-REG-LTH-0941',
      totalSpendYtdBdt: 48500000, // ~৳4.85 Crore BDT YTD
      totalSpendYtdUsd: 404166,
      outstandingPayablesBdt: 6900000, // ৳69 Lakh BDT (linked to PO-2026-FAC-001)
      creditTerms: 'Back-to-Back Letter of Credit (90 Days USANCE) or 30% Advance + 70% FRI Pass',
      paymentPunctualityScorePct: 99.2,
    },

    // Pillar 5: Quality & Operational Scorecard
    qualityScorecard: {
      aqlPassRatePct: 99.1,
      onTimeDeliveryRatePct: 98.4,
      averageDefectRatePct: 0.9,
      sampleApprovalTurnaroundDays: 4.5,
      overallRatingScore: 4.9,
    },

    operationalNotes: 'Benchmark full-fledged manufacturing partner. Maintains raw material stockpile for 30 days of surge capacity. Central effluent treatment plant (CETP) linked.',
  },

  // 2. ENVOY ADVANCED APPAREL & ECO-TEXTILES (Gazipur Hub)
  {
    id: 'fac_app_01',
    factoryCode: 'FAC-GAZ-01',
    factoryName: 'Envoy Advanced Apparel & Eco-Textiles Ltd',
    vendorClassification: 'FULL_FLEDGED_FACTORY',
    sectors: ['TEXTILE'],
    clusterRegion: 'Kashimpur Industrial Area, Gazipur',
    factoryAddress: 'Plot 18–22, Konabari-Kashimpur Road, Gazipur-1700, Bangladesh',
    establishedYear: 2004,
    tier: 'TIER_1_PREFERRED',
    lastUpdated: '2026-10-17',
    keyManagementContacts: [
      {
        name: 'Syed Tanvir Ahmed',
        designation: 'Managing Director & Head of Export Sourcing',
        phone: '+880 1713-102944',
        email: 'tanvir@envoy-apparel-bd.com',
      },
    ],
    digitalChannels: {
      website: 'www.envoy-apparel-bd.com',
      linkedIn: 'linkedin.com/company/envoy-apparel-bd',
    },

    capacityAndMachinery: {
      monthlyCapacityUnits: 180000,
      allocatedCapacityUnits: 145000,
      arielMcReservedCapacityUnits: 40000,
      utilizationRatePct: 80.5,
      activeLinesCount: 22,
      totalWorkforce: 2800,
      shiftStructure: 'Double Shift (8h x 2)',
      machinery: [
        {
          machineName: 'Juki Automated Programmable Pattern Sewing Lines (Japan)',
          originCountry: 'Japan',
          quantity: 120,
          purpose: 'High precision collar & pocket welting',
        },
        {
          machineName: 'Lectra Vector Automated Fabric Spreading & Cutting System',
          originCountry: 'France',
          quantity: 6,
          purpose: 'Computerized multi-ply high ply fabric cutting',
        },
      ],
    },

    complianceAudits: [
      {
        id: 'aud_env_01',
        standardName: 'RSC (RMG Sustainability Council) Structural & Fire',
        status: 'VALID',
        ratingGrade: 'Platinum Certification (Zero Safety Gaps)',
        auditBody: 'RSC Bangladesh Technical Unit',
        auditDate: '2025-01-10',
        validUntil: '2027-01-10',
        reportNumber: 'RSC-2025-9918',
      },
      {
        id: 'aud_gots_01',
        standardName: 'Global Organic Textile Standard (GOTS)',
        status: 'VALID',
        ratingGrade: 'GOTS Version 7.0 Certified',
        auditBody: 'Control Union Bangladesh',
        auditDate: '2025-09-01',
        validUntil: '2027-09-01',
        reportNumber: 'CU-GOTS-88410',
      },
    ],

    subSupplierNetwork: [
      {
        id: 'sub-app-01',
        materialType: 'GOTS Organic Ring-Spun Cotton Yarn',
        supplierName: 'Badar Spinning Mills Ltd',
        locationCluster: 'Narayanganj',
        complianceTier: 'Certified Tier 1',
        traceabilityVerified: true,
      },
    ],

    financialAndBanking: {
      bankName: 'Standard Chartered Bank Bangladesh',
      branchName: 'Gulshan Corporate Branch',
      routingNumber: '215260941',
      swiftBic: 'SCBLBDDX',
      backToBackLcAccepted: true,
      preferredLcTenorDays: 90,
      nbrBinNumber: '002819384-0102',
      tinNumber: '9182746192',
      epbRegistrationNo: 'EPB-REG-APP-2004',
      totalSpendYtdBdt: 82000000, // ৳8.2 Crore BDT
      totalSpendYtdUsd: 683333,
      outstandingPayablesBdt: 12400000,
      creditTerms: 'Back-to-Back L/C (90 Days USANCE)',
      paymentPunctualityScorePct: 99.6,
    },

    qualityScorecard: {
      aqlPassRatePct: 99.4,
      onTimeDeliveryRatePct: 99.0,
      averageDefectRatePct: 0.6,
      sampleApprovalTurnaroundDays: 3.5,
      overallRatingScore: 4.95,
    },

    operationalNotes: 'State of the art LEED Platinum certified eco-apparel manufacturing complex. Rooftop solar provides 40% of electricity.',
  },

  // 3. GOLDEN BENGAL JUTE & FIBER DIVERSIFIED (Demra Sourcing Hub)
  {
    id: 'fac_jut_01',
    factoryCode: 'FAC-DEM-01',
    factoryName: 'Golden Bengal Jute & Eco-Fiber Crafts',
    vendorClassification: 'FACTORY',
    sectors: ['JUTE'],
    clusterRegion: 'Demra Riverfront Industrial Zone, Dhaka',
    factoryAddress: 'Holding 88, Sultana Kamal Bridge Road, Demra, Dhaka-1360',
    establishedYear: 2012,
    tier: 'TIER_1_PREFERRED',
    lastUpdated: '2026-10-15',
    keyManagementContacts: [
      {
        name: 'Mustafa Al-Mamun',
        designation: 'CEO & Managing Partner',
        phone: '+880 1819-338291',
        email: 'almamun@goldenbengal-jute.com',
      },
    ],
    digitalChannels: {
      website: 'www.goldenbengal-jute.com',
    },

    capacityAndMachinery: {
      monthlyCapacityUnits: 50000,
      allocatedCapacityUnits: 32000,
      arielMcReservedCapacityUnits: 18000,
      utilizationRatePct: 64.0,
      activeLinesCount: 6,
      totalWorkforce: 420,
      shiftStructure: 'Single Shift',
      machinery: [
        {
          machineName: 'High Speed Jute Rapier Looms',
          originCountry: 'India / Belgium',
          quantity: 18,
          purpose: 'Dense 14x15 Hessian & Scrim Jute weaving',
        },
        {
          machineName: 'Eco-Lamination Conveyor Line (PLA Bio-Coating)',
          originCountry: 'Taiwan',
          quantity: 2,
          purpose: '100% biodegradable moisture barrier coating',
        },
      ],
    },

    complianceAudits: [
      {
        id: 'aud_jut_01',
        standardName: 'Sedex SMETA 4-Pillar',
        status: 'VALID',
        ratingGrade: 'Audited & Approved',
        auditBody: 'Bureau Veritas Bangladesh',
        auditDate: '2025-05-20',
        validUntil: '2027-05-20',
        reportNumber: 'BV-JUT-2025-091',
      },
    ],

    subSupplierNetwork: [
      {
        id: 'sub-jut-01',
        materialType: 'Tossa Grade-1 Raw Jute Fiber',
        supplierName: 'Faridpur Raw Jute Growers Cooperative',
        locationCluster: 'Faridpur District',
        complianceTier: 'Certified Tier 1',
        traceabilityVerified: true,
      },
    ],

    financialAndBanking: {
      bankName: 'Islami Bank Bangladesh PLC',
      branchName: 'Demra SME Branch',
      routingNumber: '125260914',
      swiftBic: 'IBBLBDDH',
      backToBackLcAccepted: true,
      preferredLcTenorDays: 60,
      nbrBinNumber: '003918274-0301',
      tinNumber: '7162839102',
      epbRegistrationNo: 'EPB-REG-JUT-1049',
      totalSpendYtdBdt: 24500000, // ৳2.45 Crore BDT
      totalSpendYtdUsd: 204166,
      outstandingPayablesBdt: 3100000,
      creditTerms: '30% Advance, 70% Upon Port Loading BL Issuance',
      paymentPunctualityScorePct: 98.9,
    },

    qualityScorecard: {
      aqlPassRatePct: 98.8,
      onTimeDeliveryRatePct: 97.9,
      averageDefectRatePct: 1.1,
      sampleApprovalTurnaroundDays: 5.0,
      overallRatingScore: 4.8,
    },

    operationalNotes: 'Pioneer in biodegradable PLA-laminated jute bags replacing plastic totes in European and UK retail.',
  },
];
