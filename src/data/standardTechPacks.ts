import { StandardFactoryTechPack, TechPackBomItem, TechPackMeasurementItem, TechPackQcClearance } from '@/types/techPack';
import { ProductSector } from '@/types/erp';

// -------------------------------------------------------------
// 1. Official Tech Pack 1: TP-AMC-JCT-1612 (Jute-Cotton Tote)
// -------------------------------------------------------------
export const TECH_PACK_JCT_1612: StandardFactoryTechPack = {
  id: 'tp-jct-1612',
  documentRef: 'TP-AMC-JCT-1612',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Structured Jute-Cotton Commuter Shopper Tote',
  styleCode: 'JCT',
  targetDeviceOrFit: 'Horizontal clearance for A4 folios and 15" laptops',
  originHub: 'Dhaka / Narayanganj Textile & Jute Cluster',
  referencePictures: [
    '/images/techpacks/jct-ref-photo.png',
    '/images/techpacks/TP-AMC-JCT-1612-p1.png'
  ],
  referencePictureCaptions: [
    'Colorways: Natural Beige, Navy Blue, Crimson Red with Screen & Embroidered Graphics',
    'Sampling Tech-Pack Document Cover Sheet'
  ],
  billOfMaterials: [
    {
      id: 'bom-jct-1',
      component: 'Main Body Shell',
      materialAndConstruction: 'Heavyweight Jute-Cotton blend fabric',
      specificationOrGrade: '320–350 GSM tight plain weave; structured hand-feel',
      colorwayOptions: 'Natural Beige, Navy Blue, Crimson Red',
    },
    {
      id: 'bom-jct-2',
      component: 'Front Slip Pocket',
      materialAndConstruction: 'Self-fabric (Jute-Cotton blend)',
      specificationOrGrade: 'Single-ply with double-folded 2.0 cm top hem',
      colorwayOptions: 'Matched to body shell',
    },
    {
      id: 'bom-jct-3',
      component: 'Internal Finish',
      materialAndConstruction: 'Food-safe water-resistant barrier',
      specificationOrGrade: '0.02 mm ultra-thin polypropylene (PP) lamination',
      colorwayOptions: 'Clear / Neutral',
    },
    {
      id: 'bom-jct-4',
      component: 'Handles',
      materialAndConstruction: '100% Combed Cotton Webbing tape',
      specificationOrGrade: '3.8 cm (1.5") width; tubular rolled grip at center',
      colorwayOptions: 'Matched or tonal contrast webbing',
    },
    {
      id: 'bom-jct-5',
      component: 'Top Closure',
      materialAndConstruction: '#5 Continuous zipper & alloy runner',
      specificationOrGrade: 'Nylon coil or brass-tone metal teeth with metal puller',
      colorwayOptions: 'Matched to body fabric',
    },
    {
      id: 'bom-jct-6',
      component: 'Seam Binding',
      materialAndConstruction: '100% Cotton twill tape',
      specificationOrGrade: '2.0 cm wide internal binding tape for raw edges',
      colorwayOptions: 'Neutral Cream / Tonal',
    },
    {
      id: 'bom-jct-7',
      component: 'Stitching Thread',
      materialAndConstruction: 'High-tensile bonded polyester thread',
      specificationOrGrade: 'Ticket 40 (Tex 70); heavy-duty gauge',
      colorwayOptions: 'Tonal matching stitching',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-jct-1',
      measurementPoint: 'Total Body Width (W)',
      specInches: '16.0"',
      specMetric: '40.6 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Horizontal clearance for A4 folios and 15" laptops',
    },
    {
      id: 'ms-jct-2',
      measurementPoint: 'Total Body Height (H)',
      specInches: '12.0"',
      specMetric: '30.5 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Vertical depth for groceries and daily commuter goods',
    },
    {
      id: 'ms-jct-3',
      measurementPoint: 'Gusset Depth (D)',
      specInches: '6.0"',
      specMetric: '15.2 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Continuous base & side gusset; allows tote to stand upright',
    },
    {
      id: 'ms-jct-4',
      measurementPoint: 'Front Pocket Width',
      specInches: '16.0"',
      specMetric: '40.6 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Full-width external storage pocket across front panel',
    },
    {
      id: 'ms-jct-5',
      measurementPoint: 'Front Pocket Height',
      specInches: '7.5"',
      specMetric: '19.0 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Quick-access depth for umbrella, phone, or transit card',
    },
    {
      id: 'ms-jct-6',
      measurementPoint: 'Handle Total Length',
      specInches: '24.0"',
      specMetric: '61.0 cm',
      tolerance: '±1.0 cm',
      productionPurpose: 'Overall cut length per strap',
    },
    {
      id: 'ms-jct-7',
      measurementPoint: 'Handle Drop Height',
      specInches: '10.5"',
      specMetric: '26.7 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Ample clearance for shoulder carry over UK winter coats',
    },
    {
      id: 'ms-jct-8',
      measurementPoint: 'Handle Width',
      specInches: '1.5"',
      specMetric: '3.8 cm',
      tolerance: '±0.1 cm',
      productionPurpose: 'Flat webbing at base, folded/stitched into tubular grip',
    },
    {
      id: 'ms-jct-9',
      measurementPoint: 'Handle Spacing',
      specInches: '6.0"',
      specMetric: '15.2 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Distance between inside handle attachment points',
    },
    {
      id: 'ms-jct-10',
      measurementPoint: 'Top Zipper Opening',
      specInches: '15.5"',
      specMetric: '39.4 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Recessed 1.5 cm below top rim for weather protection',
    },
  ],
  constructionDetails: [
    'Freestanding Structural Base: The 6-inch side gussets and bottom base panel must be joined with double-stitched reinforced seams to create a flat, self-standing rectangular floor.',
    'Handle Reinforcement: Handle anchor bases must extend 5.0 cm down into the upper body rim, secured with a reinforced Box-X cross-stitch pattern to prevent tear-out under heavy loads.',
    'Edge & Seam Cleanliness: All exposed interior fabric edges must be encased in 100% cotton binding tape; raw frayed jute fibers inside the bag cavity are unacceptable.',
    'Zipper End-Stops: The top zipper closure must feature clean fabric-folded end-tabs (2.5 cm × 2.5 cm) on both sides to prevent the runner from catching or pulling free from the seam.',
  ],
  brandingDirectives: {
    exteriorBrandTag: 'Sew a discrete folded woven damask label into the right-hand side seam:\nFace: ArielMC (clean geometric wordmark)\nReverse: Monogram icon',
    interiorComplianceLabel: 'Stitched directly into the interior side seam compliant with UK Textile Labelling Regulations:\nArielMC\nCrafted in Bangladesh\n60% Jute • 40% Cotton\nWipe Clean Only • Do Not Machine Wash',
    packagingDirectives: 'Flat-pack in moisture-resistant poly-sleeves (2 units per bundle for Amazon FBA multi-packs). Affix scannable GS1 EAN/FNSKU barcode stickers on the exterior sleeve.',
  },
  qualityControlClearances: [
    {
      id: 'qc-jct-1',
      testName: 'Dynamic Load-Bearing Test',
      standardOrRequirement: '15 kg dynamic pull-and-drop test (500 cycles)',
      passCriteria: 'Zero handle seam separation or fabric deformation under repetitive shock',
    },
    {
      id: 'qc-jct-2',
      testName: 'Color Fastness & Crocking Test',
      standardOrRequirement: 'ISO 105-X12 crocking tests on Navy Blue and Crimson Red dyed fabrics',
      passCriteria: 'Minimum Grade 4.0 dry / 3.5 wet to prevent color bleed onto clothing',
    },
    {
      id: 'qc-jct-3',
      testName: 'Agricultural Quarantine Clearances',
      standardOrRequirement: 'Every commercial export batch to UK/EU/US',
      passCriteria: 'DAE Plant Quarantine Phytosanitary Certification & Chittagong Port Fumigation Certificate',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-10-15',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bengal Jute Mills Ltd',
  factoryLocation: 'Ghorashal, Narsingdi / Narayanganj Cluster',
  status: 'APPROVED_FOR_BULK',
};

// -------------------------------------------------------------
// 2. Official Tech Pack 2: TP-AMC-BLM-1612 (Bloom Laptop Tote)
// -------------------------------------------------------------
export const TECH_PACK_BLM_1612: StandardFactoryTechPack = {
  id: 'tp-blm-1612',
  documentRef: 'TP-AMC-BLM-1612',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC 16" Embroidered Commuter Laptop Tote ("Bloom" Series)',
  styleCode: 'BLM',
  targetDeviceOrFit: 'Up to 15.6" Laptop / 16" MacBook Pro',
  originHub: 'Dhaka / Narayanganj / Savar',
  referencePictures: [
    '/images/techpacks/blm-ref-photo.png',
    '/images/techpacks/TP-AMC-BLM-1612-p1.png'
  ],
  referencePictureCaptions: [
    'Deep Indigo Denim Body with Wildflower Embroidery & Cognac Harness Leather',
    'Official Factory Sampling Tech-Pack Document'
  ],
  billOfMaterials: [
    {
      id: 'bom-blm-1',
      component: 'Shell Body',
      materialAndConstruction: '12–14 oz Heavyweight Cotton Denim',
      specificationOrGrade: 'Narayanganj Mills; pre-shrunk, enzyme-washed',
      colorwayOptions: 'Deep Indigo Navy',
    },
    {
      id: 'bom-blm-2',
      component: 'Embroidery',
      materialAndConstruction: 'High-tensile rayon/poly thread (Botanical Wildflower motif)',
      specificationOrGrade: 'Heat-fused 80 GSM non-woven backing stabilizer',
      colorwayOptions: 'Multi-tonal (White, Tan, Brown)',
    },
    {
      id: 'bom-blm-3',
      component: 'Leather Trim',
      materialAndConstruction: '1.4–1.6 mm Full-Grain Vegetable-Tanned Cowhide',
      specificationOrGrade: 'Savar LWG-Audited Tannery; REACH-certified',
      colorwayOptions: 'Classic Cognac Tan (#A85724)',
    },
    {
      id: 'bom-blm-4',
      component: 'Handles & Strap',
      materialAndConstruction: '2.8 mm Full-Grain Harness Leather',
      specificationOrGrade: 'Savar; burnished and sealed edges',
      colorwayOptions: 'Classic Cognac Tan',
    },
    {
      id: 'bom-blm-5',
      component: 'Internal Lining',
      materialAndConstruction: '220 GSM Brushed Cotton Twill',
      specificationOrGrade: 'Scratch-resistant microfiber/cotton blend',
      colorwayOptions: 'Sand Beige',
    },
    {
      id: 'bom-blm-6',
      component: 'Laptop Protection',
      materialAndConstruction: '8 mm High-Density Shock-Absorbing EVA Foam',
      specificationOrGrade: 'Internal compartment walls & cradle',
      colorwayOptions: 'N/A (Internal)',
    },
    {
      id: 'bom-blm-7',
      component: 'Main Zipper',
      materialAndConstruction: '#5 Heavy-Duty Metal Zipper (Recessed top closure)',
      specificationOrGrade: 'YKK or equivalent brass teeth with leather puller',
      colorwayOptions: 'Brushed Antique Brass',
    },
    {
      id: 'bom-blm-8',
      component: 'Hardware Trim',
      materialAndConstruction: 'Turn-lock front clasp, D-rings, swivel snaps, 4× base studs',
      specificationOrGrade: 'Solid alloy/zinc brass; salt-spray anti-tarnish dip',
      colorwayOptions: 'Brushed Antique Brass',
    },
    {
      id: 'bom-blm-9',
      component: 'Thread',
      materialAndConstruction: 'Heavy-duty bonded nylon thread (Tex 70 / Ticket 40)',
      specificationOrGrade: 'Contrast stitching on leather; tonal on denim seams',
      colorwayOptions: 'Cream / Gold Tan',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-blm-1',
      measurementPoint: 'Total Body Width (Top Rim)',
      specInches: '16.0"',
      specMetric: '40.5 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Clean horizontal entry for laptops & folios',
    },
    {
      id: 'ms-blm-2',
      measurementPoint: 'Total Body Width (Base)',
      specInches: '15.0"',
      specMetric: '38.0 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Structured tapered silhouette',
    },
    {
      id: 'ms-blm-3',
      measurementPoint: 'Total Body Height',
      specInches: '12.0"',
      specMetric: '30.5 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Sufficient clearance over a 16" device',
    },
    {
      id: 'ms-blm-4',
      measurementPoint: 'Bottom Gusset Depth',
      specInches: '4.75"',
      specMetric: '12.0 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Allows tote to stand upright on flat surfaces',
    },
    {
      id: 'ms-blm-5',
      measurementPoint: 'Laptop Sleeve Width',
      specInches: '15.0"',
      specMetric: '38.0 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Accommodates up to 36 cm device width',
    },
    {
      id: 'ms-blm-6',
      measurementPoint: 'Laptop Sleeve Depth/Height',
      specInches: '10.5"',
      specMetric: '26.5 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Suspended 1.5 cm above bag floor',
    },
    {
      id: 'ms-blm-7',
      measurementPoint: 'Handle Drop (Shoulder)',
      specInches: '10.25"',
      specMetric: '26.0 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Fits comfortably over UK winter trench coats',
    },
    {
      id: 'ms-blm-8',
      measurementPoint: 'Handle Width & Thickness',
      specInches: '0.87" × 0.11"',
      specMetric: '2.2 cm × 2.8 mm',
      tolerance: '±0.1 mm',
      productionPurpose: 'Ergonomic rolled grip; load-tested',
    },
    {
      id: 'ms-blm-9',
      measurementPoint: 'Detachable Crossbody Strap',
      specInches: '45.0" – 52.0"',
      specMetric: '114 cm – 132 cm',
      tolerance: '±1.0 cm',
      productionPurpose: 'Adjustable with 5 punched eyelets',
    },
    {
      id: 'ms-blm-10',
      measurementPoint: 'Recessed Zipper Drop',
      specInches: '0.80"',
      specMetric: '2.0 cm',
      tolerance: '±0.2 cm',
      productionPurpose: 'Recessed beneath rim for rain shedding',
    },
  ],
  constructionDetails: [
    'Suspended Protection Cradle: The internal laptop chamber must be stitched into the side seams and suspended exactly 1.5 cm above the bottom panel. Do not stitch the laptop sleeve directly into the floor of the bag; dropping the bag must never transmit impact shock to the laptop edge.',
    'Dual Closure System: The main compartment must feature a full-length antique brass recessed zipper running edge-to-edge beneath the leather upper band to keep UK drizzle out. The exterior front leather flap folds over this zipper and secures with the mechanical turn-lock clasp.',
    'Handle Riveting & Box-X Anchoring: The two main handles must be secured through both the leather upper band and the denim body with double box-X cross-stitching, backed by solid antique brass washer-rivets.',
    'Floor Reinforcement: Build a reinforced bottom sandwich: 1.4 mm leather outer patches + stiffener board (1.2 mm Texon board) + 4 domed metal feet to keep denim elevated off wet train and cafe floors.',
    'Interior Organization: Rear wall has suspended 8 mm EVA laptop sleeve with elasticated leather retention snap-tab; Front wall has 1 zippered passport/phone pocket (20 cm wide) + 2 slip pockets for mouse and chargers.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Blind-deboss the ArielMC primary logo (clean geometric wordmark) onto the vertical Cognac leather closure strap.',
    leatherTagOrClochette: 'Include a detachable 50 mm Cognac leather round hangtag/clochette debossed with the ArielMC monogram, hanging from the front left handle base via a leather thong.',
    interiorBrandPlate: 'Sew a 6.5 cm × 3.5 cm Cognac leather patch centered on the laptop chamber face, blind-debossed with:\nArielMC\nCrafted in Bangladesh • Curated for the World\nGenuine Leather & Combed Cotton',
    interiorComplianceLabel: 'Stitched inside the interior zip pocket compliant with UK Textile Labelling Regulations:\nShell: 70% Cotton Denim, 30% Cowhide Leather.\nLining: 100% Cotton.\nMade in Bangladesh.',
    packagingDirectives: 'Pack inside soft dustbag with braided drawstring, packed in heavy-duty e-commerce carton with branded tissue wrap and scannable GS1 EAN/FNSKU barcode.',
  },
  qualityControlClearances: [
    {
      id: 'qc-blm-1',
      testName: 'Color Fastness / Crocking Test (Mandatory)',
      standardOrRequirement: 'Denim fabric must pass ISO 105-X12 testing',
      passCriteria: 'Minimum dry rating of 4.5 and wet rating of 4.0. No indigo dye residue may transfer onto white cloth during 50 friction cycles.',
    },
    {
      id: 'qc-blm-2',
      testName: 'Dynamic Load Drop Test',
      standardOrRequirement: 'Completed prototype loaded with 7.5 kg dead weight',
      passCriteria: 'Withstand a 15 kg dynamic pull-and-drop test (500 cycles) without seam stretching or rivet slippage.',
    },
    {
      id: 'qc-blm-3',
      testName: 'Chemical Clearance',
      standardOrRequirement: 'REACH Annex XVII compliance certification from tannery',
      passCriteria: 'Absence of banned Azo colorants and Chromium VI levels strictly below 3.0 mg/kg.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-10-16',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Apex Artisan Leatherworks Ltd',
  factoryLocation: 'Hemayetpur, Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// -------------------------------------------------------------
// 3. Sector Defaults for Automatic Factory Tech-Pack Builder
// -------------------------------------------------------------
export const SECTOR_TECH_PACK_TEMPLATES: Record<ProductSector, {
  defaultOriginHub: string;
  defaultTargetDevice: string;
  defaultBom: Omit<TechPackBomItem, 'id'>[];
  defaultMeasurements: Omit<TechPackMeasurementItem, 'id'>[];
  defaultConstruction: string[];
  defaultBranding: {
    exteriorTag: string;
    interiorCompliance: string;
    packaging: string;
  };
  defaultQc: Omit<TechPackQcClearance, 'id'>[];
}> = {
  JUTE: {
    defaultOriginHub: 'Dhaka / Narayanganj Textile & Jute Cluster',
    defaultTargetDevice: 'Horizontal clearance for A4 folios and 15" laptops',
    defaultBom: [
      {
        component: 'Main Body Shell',
        materialAndConstruction: 'Heavyweight Jute-Cotton blend fabric',
        specificationOrGrade: '320–350 GSM tight plain weave; structured hand-feel',
        colorwayOptions: 'Natural Beige, Navy Blue, Crimson Red',
      },
      {
        component: 'Front Slip Pocket',
        materialAndConstruction: 'Self-fabric (Jute-Cotton blend)',
        specificationOrGrade: 'Single-ply with double-folded 2.0 cm top hem',
        colorwayOptions: 'Matched to body shell',
      },
      {
        component: 'Internal Finish',
        materialAndConstruction: 'Food-safe water-resistant barrier',
        specificationOrGrade: '0.02 mm ultra-thin polypropylene (PP) lamination',
        colorwayOptions: 'Clear / Neutral',
      },
      {
        component: 'Handles',
        materialAndConstruction: '100% Combed Cotton Webbing tape',
        specificationOrGrade: '3.8 cm (1.5") width; tubular rolled grip at center',
        colorwayOptions: 'Matched or tonal contrast webbing',
      },
      {
        component: 'Top Closure',
        materialAndConstruction: '#5 Continuous zipper & alloy runner',
        specificationOrGrade: 'Nylon coil or brass-tone metal teeth with metal puller',
        colorwayOptions: 'Matched to body fabric',
      },
      {
        component: 'Seam Binding',
        materialAndConstruction: '100% Cotton twill tape',
        specificationOrGrade: '2.0 cm wide internal binding tape for raw edges',
        colorwayOptions: 'Neutral Cream / Tonal',
      },
      {
        component: 'Stitching Thread',
        materialAndConstruction: 'High-tensile bonded polyester thread',
        specificationOrGrade: 'Ticket 40 (Tex 70); heavy-duty gauge',
        colorwayOptions: 'Tonal matching stitching',
      },
    ],
    defaultMeasurements: [
      {
        measurementPoint: 'Total Body Width (W)',
        specInches: '16.0"',
        specMetric: '40.6 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Horizontal clearance for A4 folios and 15" laptops',
      },
      {
        measurementPoint: 'Total Body Height (H)',
        specInches: '12.0"',
        specMetric: '30.5 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Vertical depth for commuter goods and accessories',
      },
      {
        measurementPoint: 'Gusset Depth (D)',
        specInches: '6.0"',
        specMetric: '15.2 cm',
        tolerance: '±0.3 cm',
        productionPurpose: 'Continuous base & side gusset; allows tote to stand upright',
      },
      {
        measurementPoint: 'Front Pocket Width & Height',
        specInches: '16.0" × 7.5"',
        specMetric: '40.6 cm × 19.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Full-width external quick-access compartment',
      },
      {
        measurementPoint: 'Handle Total Length & Drop',
        specInches: '24.0" (10.5" drop)',
        specMetric: '61.0 cm (26.7 cm drop)',
        tolerance: '±1.0 cm',
        productionPurpose: 'Over-shoulder clearance over outerwear and coats',
      },
      {
        measurementPoint: 'Top Zipper Opening',
        specInches: '15.5"',
        specMetric: '39.4 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Recessed 1.5 cm below top rim for weather protection',
      },
    ],
    defaultConstruction: [
      'Freestanding Structural Base: The 6-inch side gussets and bottom base panel must be joined with double-stitched reinforced seams to create a flat, self-standing rectangular floor.',
      'Handle Reinforcement: Handle anchor bases must extend 5.0 cm down into the upper body rim, secured with a reinforced Box-X cross-stitch pattern to prevent tear-out under heavy loads.',
      'Edge & Seam Cleanliness: All exposed interior fabric edges must be encased in 100% cotton binding tape; raw frayed jute fibers inside the bag cavity are unacceptable.',
      'Zipper End-Stops: The top zipper closure must feature clean fabric-folded end-tabs (2.5 cm × 2.5 cm) on both sides to prevent the runner from catching or pulling free.',
    ],
    defaultBranding: {
      exteriorTag: 'Discrete folded woven damask label into right-hand side seam. Face: ArielMC wordmark, Reverse: Monogram icon.',
      interiorCompliance: 'Interior compliance label: ArielMC • Crafted in Bangladesh • 60% Jute, 40% Cotton • Wipe Clean Only • Do Not Machine Wash.',
      packaging: 'Flat-pack in moisture-resistant poly-sleeves (2 units per bundle for Amazon FBA multi-packs). Scannable GS1 EAN/FNSKU barcode on exterior sleeve.',
    },
    defaultQc: [
      {
        testName: 'Dynamic Load-Bearing Test',
        standardOrRequirement: '15 kg dynamic pull-and-drop test (500 cycles)',
        passCriteria: 'Zero handle seam separation or fabric deformation',
      },
      {
        testName: 'Color Fastness & Crocking Test',
        standardOrRequirement: 'ISO 105-X12 crocking test',
        passCriteria: 'Minimum Grade 4.0 dry / 3.5 wet to prevent color bleed',
      },
      {
        testName: 'Agricultural Quarantine Clearances',
        standardOrRequirement: 'Export clearance before port container loading',
        passCriteria: 'DAE Plant Quarantine Phytosanitary Certification & Chittagong Port Fumigation Certificate',
      },
    ],
  },

  LEATHER: {
    defaultOriginHub: 'Dhaka / Narayanganj / Savar Tannery Estate',
    defaultTargetDevice: 'Up to 15.6" Laptop / 16" MacBook Pro',
    defaultBom: [
      {
        component: 'Shell Body',
        materialAndConstruction: '1.4–1.6 mm Full-Grain Vegetable-Tanned Cowhide',
        specificationOrGrade: 'Savar LWG-Audited Tannery; REACH-certified',
        colorwayOptions: 'Classic Cognac Tan / Burgundy / Espresso',
      },
      {
        component: 'Handles & Shoulder Strap',
        materialAndConstruction: '2.8 mm Full-Grain Harness Leather',
        specificationOrGrade: 'Savar; burnished and sealed edges with Italian edge dye',
        colorwayOptions: 'Matching body leather',
      },
      {
        component: 'Internal Lining',
        materialAndConstruction: '220 GSM Brushed Cotton Twill',
        specificationOrGrade: 'Scratch-resistant microfiber/cotton blend',
        colorwayOptions: 'Sand Beige / British Racing Green',
      },
      {
        component: 'Laptop Protection',
        materialAndConstruction: '8 mm High-Density Shock-Absorbing EVA Foam',
        specificationOrGrade: 'Internal compartment walls & suspended floor cradle',
        colorwayOptions: 'Internal padding',
      },
      {
        component: 'Main Zipper',
        materialAndConstruction: '#5 Heavy-Duty Metal Zipper (Recessed top closure)',
        specificationOrGrade: 'YKK or equivalent brass teeth with leather puller',
        colorwayOptions: 'Brushed Antique Brass',
      },
      {
        component: 'Hardware Trim',
        materialAndConstruction: 'Solid alloy/zinc brass turn-locks, D-rings, 4× base studs',
        specificationOrGrade: 'Salt-spray anti-tarnish dip (48-hour rated)',
        colorwayOptions: 'Brushed Antique Brass',
      },
      {
        component: 'Stitching Thread',
        materialAndConstruction: 'Heavy-duty bonded nylon thread (Tex 70 / Ticket 40)',
        specificationOrGrade: 'High-tensile saddle stitching',
        colorwayOptions: 'Contrast Cream / Gold Tan',
      },
    ],
    defaultMeasurements: [
      {
        measurementPoint: 'Total Body Width (Top Rim)',
        specInches: '16.0"',
        specMetric: '40.5 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Clean horizontal entry for laptops & folios',
      },
      {
        measurementPoint: 'Total Body Width (Base)',
        specInches: '15.0"',
        specMetric: '38.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Structured tapered silhouette',
      },
      {
        measurementPoint: 'Total Body Height',
        specInches: '12.0"',
        specMetric: '30.5 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Sufficient clearance over a 16" device',
      },
      {
        measurementPoint: 'Bottom Gusset Depth',
        specInches: '4.75"',
        specMetric: '12.0 cm',
        tolerance: '±0.3 cm',
        productionPurpose: 'Allows tote to stand upright on flat surfaces',
      },
      {
        measurementPoint: 'Laptop Sleeve Width & Height',
        specInches: '15.0" × 10.5"',
        specMetric: '38.0 cm × 26.5 cm',
        tolerance: '±0.3 cm',
        productionPurpose: 'Suspended 1.5 cm above floor for zero drop-impact shock',
      },
      {
        measurementPoint: 'Handle Drop Height',
        specInches: '10.25"',
        specMetric: '26.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Fits comfortably over UK winter trench coats',
      },
      {
        measurementPoint: 'Recessed Zipper Drop',
        specInches: '0.80"',
        specMetric: '2.0 cm',
        tolerance: '±0.2 cm',
        productionPurpose: 'Recessed beneath leather upper band for drizzle shedding',
      },
    ],
    defaultConstruction: [
      'Suspended Protection Cradle: The internal laptop chamber must be stitched into the side seams and suspended exactly 1.5 cm above the bottom panel. Do not stitch the laptop sleeve directly into the floor.',
      'Handle Riveting & Box-X Anchoring: Handle anchor bases must extend down into the upper rim, secured with double box-X cross-stitching and backed by solid antique brass washer-rivets.',
      'Floor Reinforcement: Build a reinforced bottom sandwich: 1.4 mm leather outer patches + stiffener board (1.2 mm Texon board) + 4 domed metal feet to keep leather elevated off wet surfaces.',
      'Edge Finishing: Multi-coat hand-applied Italian edge paint, heat-creased and sanded between coats for enduring luxury finish.',
    ],
    defaultBranding: {
      exteriorTag: 'Blind-debossed ArielMC wordmark on front closure strap; detachable 50mm leather clochette on handle base.',
      interiorCompliance: 'Blind-debossed leather brand plate: ArielMC • Crafted in Bangladesh • Curated for the World • Genuine Leather & Combed Cotton. Care label in interior pocket.',
      packaging: 'Soft protective branded dustbag with woven drawstrings, packed in heavyweight rigid e-commerce mailer box with GS1 barcode.',
    },
    defaultQc: [
      {
        testName: 'Dynamic Load Drop Test',
        standardOrRequirement: '7.5 kg dead weight load (500 cycles dynamic pull-and-drop)',
        passCriteria: 'Zero handle seam stretching, rivet slippage, or leather elongation',
      },
      {
        testName: 'Chemical Clearance (REACH)',
        standardOrRequirement: 'EU REACH Annex XVII laboratory test',
        passCriteria: 'Chromium VI strictly below 3.0 mg/kg; zero banned Azo colorants or DMFu',
      },
      {
        testName: 'Hardware Corrosion Resistance',
        standardOrRequirement: 'ASTM B117 neutral salt spray test',
        passCriteria: '48 hours zero green verdigris or surface tarnish',
      },
    ],
  },

  TEXTILE: {
    defaultOriginHub: 'Narayanganj / Gazipur Textile Corridor',
    defaultTargetDevice: 'Export Bedding & Home Living Collection',
    defaultBom: [
      {
        component: 'Fabric Body',
        materialAndConstruction: '100% Long-Staple Combed Cotton',
        specificationOrGrade: '400 Thread Count Single-Ply Sateen Weave',
        colorwayOptions: 'Natural Ivory, Slate Grey, Sage Mist',
      },
      {
        component: 'Border Hem / Trim',
        materialAndConstruction: 'Hemstitch or Double Merrowed Edge',
        specificationOrGrade: 'Precision French seams with 12 stitches per inch',
        colorwayOptions: 'Tonal matched',
      },
      {
        component: 'Sewing Thread',
        materialAndConstruction: '100% Mercerized Cotton Thread',
        specificationOrGrade: 'Tex 40 high-luster thread',
        colorwayOptions: 'Tonal matched',
      },
    ],
    defaultMeasurements: [
      {
        measurementPoint: 'Finished Length',
        specInches: '108.0"',
        specMetric: '274.0 cm',
        tolerance: '±1.0 cm',
        productionPurpose: 'UK Super-King / US King standard fit',
      },
      {
        measurementPoint: 'Finished Width',
        specInches: '96.0"',
        specMetric: '244.0 cm',
        tolerance: '±1.0 cm',
        productionPurpose: 'Full coverage drape with generous tuck-in allowance',
      },
      {
        measurementPoint: 'Top Hem Depth',
        specInches: '4.0"',
        specMetric: '10.2 cm',
        tolerance: '±0.2 cm',
        productionPurpose: 'Classic European luxury tailored header',
      },
    ],
    defaultConstruction: [
      'Pre-Shrunk Processing: Fabric pre-washed and sanforized; maximum residual shrinkage under 2.5% across 40°C washing.',
      'French Seam Encasement: Zero raw overlock threads; all corners mitred at 45 degrees with reinforced lock-stitching.',
    ],
    defaultBranding: {
      exteriorTag: 'Woven damask corner label with ArielMC wordmark and British flag icon.',
      interiorCompliance: 'OEKO-TEX Standard 100 Class 1 label with GOTS organic certification seal and washing temperature care instructions.',
      packaging: 'Self-fabric envelope pouch with branded card insert and recyclable FSC sleeve.',
    },
    defaultQc: [
      {
        testName: 'Dimensional Stability & Shrinkage',
        standardOrRequirement: 'ISO 6330 5-cycle washing test',
        passCriteria: 'Shrinkage strictly under 2.5% in warp and weft directions',
      },
      {
        testName: 'Color Fastness to Rubbing',
        standardOrRequirement: 'ISO 105-X12 testing',
        passCriteria: 'Grade 4-5 dry rubbing, Grade 4 wet rubbing pass',
      },
      {
        testName: 'Toxicological Safety',
        standardOrRequirement: 'OEKO-TEX 100 Annex 6 testing',
        passCriteria: 'Zero formaldehyde, heavy metals, or carcinogenic arylamines',
      },
    ],
  },

  CERAMICS: {
    defaultOriginHub: 'Mirpur Ceramics Industrial Estate, Dhaka',
    defaultTargetDevice: 'High-Fired Stoneware Tableware Series',
    defaultBom: [
      {
        component: 'Clay Body',
        materialAndConstruction: 'High-Fired Mineral Stoneware Clay',
        specificationOrGrade: 'Matured at 1240°C cone 6 firing; < 0.5% porosity',
        colorwayOptions: 'Natural Terra Sand / Charcoal Basalt',
      },
      {
        component: 'Interior Glaze',
        materialAndConstruction: 'Lead-Free Food-Safe Reactive Glaze',
        specificationOrGrade: 'Silica-alumina balanced non-leaching glass matrix',
        colorwayOptions: 'Semi-Matte Cream / Nordic Speckle',
      },
      {
        component: 'Foot Ring',
        materialAndConstruction: 'Diamond-ground unglazed raw clay foot',
        specificationOrGrade: 'Polished to prevent scratching tabletop surfaces',
        colorwayOptions: 'Natural buff clay',
      },
    ],
    defaultMeasurements: [
      {
        measurementPoint: 'Rim Diameter',
        specInches: '10.5"',
        specMetric: '26.7 cm',
        tolerance: '±0.2 cm',
        productionPurpose: 'Standard European dinner plate service diameter',
      },
      {
        measurementPoint: 'Base Footprint',
        specInches: '7.0"',
        specMetric: '17.8 cm',
        tolerance: '±0.2 cm',
        productionPurpose: 'Stable center-of-gravity to prevent tipping',
      },
      {
        measurementPoint: 'Rim Height',
        specInches: '1.25"',
        specMetric: '3.2 cm',
        tolerance: '±0.1 cm',
        productionPurpose: 'Organic curved lip to contain sauces and dressing',
      },
    ],
    defaultConstruction: [
      'High-Temperature Vitrification: 1240°C kiln firing achieving complete vitrification for dishwasher and microwave safety.',
      'Surface Grinding: Every piece passes automated diamond grit foot buffing to ensure 100% scratch-free contact.',
    ],
    defaultBranding: {
      exteriorTag: 'Blind debossed ArielMC maker hallmark on underside of ceramic foot ring.',
      interiorCompliance: 'Backstamp: ArielMC • Crafted in Bangladesh • Dishwasher & Microwave Safe • Oven Safe to 220°C.',
      packaging: 'Molded biodegradable sugarcane pulp clamshell with kraft outer box drop-test approved for courier delivery.',
    },
    defaultQc: [
      {
        testName: 'Food Contact Safety (Lead & Cadmium)',
        standardOrRequirement: 'FDA 21 CFR 175.300 and EU 84/500/EEC',
        passCriteria: 'Zero detectable lead (< 0.1 mg/L) and cadmium (< 0.01 mg/L)',
      },
      {
        testName: 'Thermal Shock Resistance',
        standardOrRequirement: 'ASTM C554 hot-to-cold immersion test (200°C to 20°C)',
        passCriteria: 'Zero crazing, micro-cracking, or thermal fracture',
      },
      {
        testName: 'Water Absorption Rate',
        standardOrRequirement: 'ASTM C373 boiling test',
        passCriteria: 'Absorption strictly under 0.5% (fully vitrified stoneware standard)',
      },
    ],
  },
  POTTERY: {
    defaultOriginHub: 'Dhamrai / Mirpur Clay & Terracotta Cluster',
    defaultTargetDevice: 'Breathable architectural planters & thermodynamic evaporative cooling vessels',
    defaultBom: [
      {
        component: 'Primary Body Shell',
        materialAndConstruction: '100% Indigenous Earthen Clay / Red Terracotta',
        specificationOrGrade: 'Fine alluvial silt clay body; kiln-fired at 980°C–1020°C',
        colorwayOptions: 'Natural Terracotta Red, Smoked Carbon Black, Buff Ochre',
      },
      {
        component: 'Wall Construction',
        materialAndConstruction: 'Porous micro-capillary wall structure',
        specificationOrGrade: '8.0–12.0 mm uniform thickness for natural evaporative cooling',
        colorwayOptions: 'Natural matte earthen',
      },
      {
        component: 'Exterior Finish',
        materialAndConstruction: 'Hand-burnished or architectural fluted ribbing',
        specificationOrGrade: 'Smooth natural river-stone burnish; zero artificial paints',
        colorwayOptions: 'Natural raw earth',
      },
      {
        component: 'Protective Base',
        materialAndConstruction: 'Silicone protective cushion pads / nesting saucer',
        specificationOrGrade: 'High-density scratch-prevention pads for delicate furniture protection',
        colorwayOptions: 'Clear / Neutral',
      },
    ],
    defaultMeasurements: [
      {
        measurementPoint: 'Exterior Top Diameter',
        specInches: '6.3"',
        specMetric: '16.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Accommodates standard 750ml wine bottles / nursery grow pots',
      },
      {
        measurementPoint: 'Total Height',
        specInches: '8.3"',
        specMetric: '21.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Sufficient vertical depth for evaporative cooling chamber',
      },
      {
        measurementPoint: 'Wall Thickness',
        specInches: '0.40"',
        specMetric: '1.0 cm',
        tolerance: '±0.1 cm',
        productionPurpose: 'Engineered thermal mass to sustain prolonged cooling transpiration',
      },
      {
        measurementPoint: 'Base Diameter',
        specInches: '5.9"',
        specMetric: '15.0 cm',
        tolerance: '±0.3 cm',
        productionPurpose: 'Stable weighted footprint prevents tipping on dining tables or patios',
      },
    ],
    defaultConstruction: [
      'Authentic Wheel-Thrown / Slip-Cast Form: Hand-finished by master artisans in Dhamrai or automated high-pressure mold casting for dimensional stability.',
      'Controlled Low-Temperature Firing: Fired at 980°C–1020°C in regulated wood/gas kilns to maintain optimum porosity for natural evaporative transpiration.',
      'Lead-Free All-Natural Mineral Composition: 100% free from chemical binders, synthetic glazes, or toxic pigments.',
      'Surface Burnishing: Hand-burnished using polished river stones while leather-hard to create a silken organic feel without sealing microscopic pores.',
    ],
    defaultBranding: {
      exteriorTag: 'Impressed ArielMC monogram seal stamped into the lower exterior base rim prior to kiln firing.',
      interiorCompliance: 'Crafted in Bangladesh • 100% Indigenous Earthen Clay • Wipe Clean Only • Soak in Cold Water Prior to Evaporative Use',
      packaging: 'Individually wrapped in 100% recyclable molded honeycomb sleeves, packaged in heavy-duty 5-ply export master cartons with ISTA-1A drop test certification.',
    },
    defaultQc: [
      {
        testName: 'Lead & Cadmium Chemical Clearance',
        standardOrRequirement: 'US FDA CPG Sec. 545.400 / German LFGB testing',
        passCriteria: 'Zero detectable toxic heavy metals; safe for culinary and botanical use',
      },
      {
        testName: 'Natural Evaporative Transpiration Rate',
        standardOrRequirement: 'Water saturation and thermal cooling test',
        passCriteria: 'Evaporative cooling lowers internal liquid temperature by 3°C–6°C below ambient without surface weeping',
      },
      {
        testName: 'Drop-Test & Breakage Verification',
        standardOrRequirement: 'ISTA-1A certified export packaging drop sequence',
        passCriteria: 'Zero transit chipping or structural cracking across 10-drop standard test protocol',
      },
    ],
  },
};

// -------------------------------------------------------------
// 4. Automatic Tech Pack Generator Function
// -------------------------------------------------------------
export interface BuildTechPackInput {
  modelName: string;
  styleCode?: string;
  sector: ProductSector;
  category?: string;
  referencePictureUrl?: string;
  targetDeviceOrFit?: string;
  originHub?: string;
  factoryName?: string;
  factoryLocation?: string;
  customBom?: TechPackBomItem[];
  customMeasurements?: TechPackMeasurementItem[];
  customConstruction?: string[];
  customBranding?: {
    exteriorBrandTag?: string;
    interiorComplianceLabel?: string;
    packagingDirectives?: string;
  };
  customQc?: TechPackQcClearance[];
}

export function buildStandardFactoryTechPack(input: BuildTechPackInput): StandardFactoryTechPack {
  const {
    modelName,
    styleCode = 'AMC-MOD',
    sector,
    referencePictureUrl,
    targetDeviceOrFit,
    originHub,
    factoryName = 'ArielMC Contracted Vendor Hub',
    factoryLocation = 'Dhaka Industrial Cluster, Bangladesh',
    customBom,
    customMeasurements,
    customConstruction,
    customBranding,
    customQc,
  } = input;

  const template = SECTOR_TECH_PACK_TEMPLATES[sector] || SECTOR_TECH_PACK_TEMPLATES.JUTE;
  const docRef = `TP-AMC-${(styleCode || sector.substring(0, 3)).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Default picture logic: use uploaded URL, or if jute/bloom use default photos, or fall back to sector reference
  const pictures: string[] = [];
  if (referencePictureUrl && referencePictureUrl.trim().length > 0) {
    pictures.push(referencePictureUrl.trim());
  } else if (sector === 'JUTE') {
    pictures.push('/images/techpacks/jct-ref-photo.png');
  } else if (sector === 'LEATHER') {
    pictures.push('/images/techpacks/blm-ref-photo.png');
  } else {
    pictures.push('/images/ArielMC_Logo.png');
  }

  const bom: TechPackBomItem[] = customBom && customBom.length > 0
    ? customBom
    : template.defaultBom.map((item, idx) => ({
        id: `bom-gen-${idx + 1}`,
        ...item,
      }));

  const measurements: TechPackMeasurementItem[] = customMeasurements && customMeasurements.length > 0
    ? customMeasurements
    : template.defaultMeasurements.map((item, idx) => ({
        id: `ms-gen-${idx + 1}`,
        ...item,
      }));

  const construction: string[] = customConstruction && customConstruction.length > 0
    ? customConstruction
    : [...template.defaultConstruction];

  const qc: TechPackQcClearance[] = customQc && customQc.length > 0
    ? customQc
    : template.defaultQc.map((item, idx) => ({
        id: `qc-gen-${idx + 1}`,
        ...item,
      }));

  return {
    id: `tp-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    documentRef: docRef,
    companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
    productName: modelName || `ArielMC ${sector} Export Prototype`,
    styleCode: styleCode || `${sector.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
    targetDeviceOrFit: targetDeviceOrFit || template.defaultTargetDevice,
    originHub: originHub || template.defaultOriginHub,
    referencePictures: pictures,
    referencePictureCaptions: [
      `Official reference photo for ${modelName || styleCode}`,
    ],
    billOfMaterials: bom,
    measurementSpecs: measurements,
    constructionDetails: construction,
    brandingDirectives: {
      exteriorBrandTag: customBranding?.exteriorBrandTag || template.defaultBranding.exteriorTag,
      interiorComplianceLabel: customBranding?.interiorComplianceLabel || template.defaultBranding.interiorCompliance,
      packagingDirectives: customBranding?.packagingDirectives || template.defaultBranding.packaging,
    },
    qualityControlClearances: qc,
    version: 'v1.0 - Factory Master',
    issueDate: new Date().toISOString().split('T')[0],
    preparedBy: 'ArielMC Technical Sourcing Team',
    factoryName,
    factoryLocation,
    status: 'READY_FOR_FACTORY',
  };
}
