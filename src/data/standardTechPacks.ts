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
    '/images/products/bangla_eco/bloom/bloom-front.jpg',
    '/images/techpacks/blm-ref-photo.png',
    '/images/techpacks/TP-AMC-BLM-1612-p1.png'
  ],
  referencePictureCaptions: [
    'Bloom Series Front Assembly: Full-Grain Leather & Embroidered Denim',
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
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// 2B. BANGLA ECO — BLOSSOM FLORAL EMBROIDERED DENIM & LEATHER BAG
// =============================================================
export const TECH_PACK_BLS_1801: StandardFactoryTechPack = {
  id: 'tp-bls-1801',
  documentRef: 'TP-AMC-BLS-1801',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Blossom Floral Embroidered Denim & Leather Bag',
  styleCode: 'BLS-1801',
  targetDeviceOrFit: 'Everyday Shoulder Bag / 10" Tablet / Cosmetics & Essentials',
  originHub: 'Dhaka / Hazaribagh & Savar Export Cluster',
  referencePictures: [
    '/images/products/bangla_eco/blossom/1-11.png',
    '/images/products/bangla_eco/blossom/1-12.jpg',
    '/images/products/bangla_eco/blossom/1-13.jpg',
    '/images/products/bangla_eco/blossom/1-14.jpg',
  ],
  referencePictureCaptions: [
    'Front Isometric Studio View: Deep Indigo Denim with Botanical Floral Embroidery',
    'Hardware Detail: Imported Gold-Tone Zipper Pulls & Chain Accents',
    'Back View: Secure Exterior Metal Zipper Compartment',
    'Interior Organization: Brown Fabric Lining with 1 Zip & 1 Slip Pocket',
  ],
  billOfMaterials: [
    {
      id: 'bom-bls-1',
      component: 'Shell Body',
      materialAndConstruction: '12–14 oz Heavyweight Cotton Denim',
      specificationOrGrade: 'Pre-shrunk, enzyme-washed deep indigo denim with anti-bleed wash',
      colorwayOptions: 'Deep Indigo Blue',
    },
    {
      id: 'bom-bls-2',
      component: 'Leather Trim & Base',
      materialAndConstruction: '1.4–1.6 mm 100% Genuine Full-Grain Cowhide Leather',
      specificationOrGrade: 'LWG Audited; REACH Annex XVII certified tannery origin',
      colorwayOptions: 'Classic Cognac Tan',
    },
    {
      id: 'bom-bls-3',
      component: 'Floral Embroidery',
      materialAndConstruction: 'Multi-head precision botanical floral embroidery',
      specificationOrGrade: 'High-tensile polyester embroidery thread with heat-fused 80 GSM stabilizer backing',
      colorwayOptions: 'Multi-color Botanical (Ivory, Rust, Mustard, Sage)',
    },
    {
      id: 'bom-bls-4',
      component: 'Carry System',
      materialAndConstruction: 'Dual Carry: Short Top Handle + Detachable Adjustable Leather Strap',
      specificationOrGrade: 'Full-grain cowhide with burnished, hand-painted sealed edges',
      colorwayOptions: 'Cognac Tan with Antique Gold Hardware',
    },
    {
      id: 'bom-bls-5',
      component: 'Zippers & Hardware',
      materialAndConstruction: 'Imported Heavy-Duty Metallic Gold Hardware & Chain Zippers',
      specificationOrGrade: 'Corrosion-resistant anti-tarnish dip; smooth glide teeth',
      colorwayOptions: 'Polished Gold Tone',
    },
    {
      id: 'bom-bls-6',
      component: 'Interior Lining',
      materialAndConstruction: 'Heavyweight Dyed Cotton-Twill Fabric',
      specificationOrGrade: 'Abrasion-resistant 210T lining with bound interior seams',
      colorwayOptions: 'Warm Earth Brown',
    },
    {
      id: 'bom-bls-7',
      component: 'Exterior Pocket',
      materialAndConstruction: 'Full-width rear zipped quick-access compartment',
      specificationOrGrade: 'Smooth gold-tone metal zipper with leather pull tab',
      colorwayOptions: 'Matched to denim body',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-bls-1',
      measurementPoint: 'Body Width (Top)',
      specInches: '9.5"',
      specMetric: '24.1 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Comfortable hand and arm clearance',
    },
    {
      id: 'ms-bls-2',
      measurementPoint: 'Body Height',
      specInches: '10.0"',
      specMetric: '25.4 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Accommodates 10" tablet, journal, and daily essentials',
    },
    {
      id: 'ms-bls-3',
      measurementPoint: 'Base Gusset Depth',
      specInches: '5.0"',
      specMetric: '12.7 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Firm base structure allowing bag to stand freely',
    },
    {
      id: 'ms-bls-4',
      measurementPoint: 'Short Handle Drop',
      specInches: '4.5"',
      specMetric: '11.5 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Ergonomic hand-carry grip',
    },
    {
      id: 'ms-bls-5',
      measurementPoint: 'Adjustable Shoulder Strap',
      specInches: '38.0" – 48.0"',
      specMetric: '96.5 cm – 122.0 cm',
      tolerance: '±1.0 cm',
      productionPurpose: 'Customizable crossbody or shoulder fit with gold roller buckle',
    },
  ],
  constructionDetails: [
    'Embroidery Stabilizer Fusion: 80 GSM tear-away non-woven backing must be heat-fused behind the denim panel prior to multi-head embroidery execution to eliminate fabric puckering or wavy distortion.',
    'Exterior Rear Pocket: The back wall features a horizontal metal zipper with leather frame welt, providing swift and scratch-free phone storage.',
    'Dual Carry Assembly: Short rolled leather top handle is anchored with reinforced bar-tacks; D-rings for the long strap are mounted with dual-riveted leather loops.',
    'Lining Construction: Brown cotton-twill lining is constructed with 1 zippered pocket on the back wall and 1 slip phone pocket on the front wall, finished with clean bias binding.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Clean brass deboss or woven artisan tag at side seam.',
    leatherTagOrClochette: 'Detachable round leather charm debossed with ArielMC insignia.',
    interiorBrandPlate: 'Genuine Leather patch stitched onto interior wall:\nArielMC × Bangla Eco\nHandcrafted in Bangladesh • Savar & Hazaribagh\nCustom Denim & Full-Grain Leather',
    interiorComplianceLabel: 'Textile compliance label:\nShell: 65% Cotton Denim, 35% Genuine Cowhide Leather.\nLining: 100% Cotton.\nMade in Bangladesh.',
    packagingDirectives: 'Each bag stuffed with acid-free tissue paper, wrapped in protective non-woven dustbag, and packed 24 pcs per 5-ply corrugated export master carton.',
  },
  qualityControlClearances: [
    {
      id: 'qc-bls-1',
      testName: 'Indigo Crocking & Color Fastness',
      standardOrRequirement: 'ISO 105-X12 testing',
      passCriteria: 'Dry crocking score >= 4.0; Wet crocking score >= 3.5. Zero dye transfer onto light fabrics.',
    },
    {
      id: 'qc-bls-2',
      testName: 'Handle Pull & Seam Dynamic Load',
      standardOrRequirement: 'Loaded with 6.0 kg dead weight',
      passCriteria: '10 kg tensile pull test without stitch breakdown or rivet deformation.',
    },
    {
      id: 'qc-bls-3',
      testName: 'REACH & Chemical Clearance',
      standardOrRequirement: 'REACH Annex XVII compliance',
      passCriteria: 'Zero banned Azo dyes, Chromium VI < 3.0 mg/kg, zero toxic DMFu.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-11-03',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// 2C. BANGLA ECO — ELORA FLORAL EMBROIDERED TWILL & LEATHER TOTE
// =============================================================
export const TECH_PACK_ELR_2001: StandardFactoryTechPack = {
  id: 'tp-elr-2001',
  documentRef: 'TP-AMC-ELR-2001',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Elora Floral Embroidered Twill & Leather Tote Bag',
  styleCode: 'ELR-2001',
  targetDeviceOrFit: 'Up to 15.6" Laptop / 16" MacBook Pro / Daily Executive Carry',
  originHub: 'Dhaka / Hazaribagh & Savar Export Cluster',
  referencePictures: [
    '/images/products/bangla_eco/elora/1.jpg',
    '/images/products/bangla_eco/elora/2.jpg',
    '/images/products/bangla_eco/elora/3.jpg',
    '/images/products/bangla_eco/elora/4.jpg',
  ],
  referencePictureCaptions: [
    'Front View: Premium Black Twill with Botanical Floral Embroidery & Leather Accents',
    'Interior Architecture: Generous Capacity for Laptop, Bottle, Diary & Essentials',
    'Side Profile: Tapered Structure with Reinforced Leather Base Gusset',
    'Hardware & Zipper Detail: Solid Gold-Tone Finish & Smooth Metal Sliders',
  ],
  billOfMaterials: [
    {
      id: 'bom-elr-1',
      component: 'Shell Fabric',
      materialAndConstruction: 'Premium Heavyweight 16 oz Black Twill Fabric',
      specificationOrGrade: 'High-density weave with water-repellent and stain-resistant finish',
      colorwayOptions: 'Onyx Black',
    },
    {
      id: 'bom-elr-2',
      component: 'Leather Trim & Straps',
      materialAndConstruction: '1.6–1.8 mm Full-Grain Vegetable-Tanned Cowhide',
      specificationOrGrade: 'LWG Gold Audited Savar Tannery; supple hand feel with high tensile strength',
      colorwayOptions: 'Natural Saddle Brown / Cognac',
    },
    {
      id: 'bom-elr-3',
      component: 'Botanical Embroidery',
      materialAndConstruction: 'High-density multi-colored botanical floral pattern',
      specificationOrGrade: 'Tajima 12-color embroidery system with high-luster poly threads',
      colorwayOptions: 'Multi-color Floral (Rose, Cream, Olive, Gold)',
    },
    {
      id: 'bom-elr-4',
      component: 'Shoulder Handles',
      materialAndConstruction: 'Dual Flat Leather Shoulder Handles with Reinforced Base Box-Stitching',
      specificationOrGrade: 'Folded edge construction with bonded nylon Tex 70 stitching',
      colorwayOptions: 'Saddle Brown',
    },
    {
      id: 'bom-elr-5',
      component: 'Main Zipper Closure',
      materialAndConstruction: '#5 Heavy-Duty Metal Zipper with Extended End Tabs',
      specificationOrGrade: 'Gold-tone alloy slider with embossed leather puller',
      colorwayOptions: 'Polished Gold',
    },
    {
      id: 'bom-elr-6',
      component: 'Internal Lining',
      materialAndConstruction: 'Durable 240 GSM Cotton Canvas / Microfiber Blend',
      specificationOrGrade: 'Tear-resistant, wipeable with reinforced seams',
      colorwayOptions: 'Warm Biscuit Tan',
    },
    {
      id: 'bom-elr-7',
      component: 'Pockets & Organizers',
      materialAndConstruction: 'Zippered Rear Pocket + Padded Laptop Sleeve + 2 Slip Organizers',
      specificationOrGrade: 'Internal padded sleeve with elastic Velcro retainer',
      colorwayOptions: 'Tan with Leather Trim Accents',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-elr-1',
      measurementPoint: 'Body Width (Top)',
      specInches: '18.0"',
      specMetric: '45.7 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Generous opening for 16" laptop, folders, and water bottles',
    },
    {
      id: 'ms-elr-2',
      measurementPoint: 'Body Height',
      specInches: '12.0"',
      specMetric: '30.5 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Vertical depth accommodating legal portfolios and tech gear',
    },
    {
      id: 'ms-elr-3',
      measurementPoint: 'Base Depth',
      specInches: '5.5"',
      specMetric: '14.0 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Wide stable base allowing the tote to stand upright',
    },
    {
      id: 'ms-elr-4',
      measurementPoint: 'Shoulder Strap Drop',
      specInches: '10.5"',
      specMetric: '26.7 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Comfortable over-shoulder clearance over jackets and winter coats',
    },
    {
      id: 'ms-elr-5',
      measurementPoint: 'External Back Pocket Width',
      specInches: '8.5"',
      specMetric: '21.6 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Rapid storage for passport, smartphone, and boarding passes',
    },
  ],
  constructionDetails: [
    'Laptop Compartment Suspension: Internal padded laptop compartment is suspended 2.0 cm above the base board to protect laptops from direct vertical drop shocks.',
    'Bottom Panel Reinforcement: Base is reinforced with a triple-layer core: full-grain leather outer + 1.5 mm Texon structural board + interior canvas, fitted with 4 protective antique gold metal feet.',
    'Handle Load Anchoring: Shoulder straps are anchored with reinforced box-X cross-stitching through twill shell, leather reinforcement patches, and inner webbing backer.',
    'Zippered Top Security: Top zipper closure is recessed 1.5 cm below the rim to ensure clean aesthetic lines and protection from rain penetration.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Artisan leather emblem centered below front leather trim band.',
    leatherTagOrClochette: 'Detachable 55 mm leather clochette with debossed ArielMC logo.',
    interiorBrandPlate: 'Interior embossed leather certificate patch:\nArielMC × Bangla Eco\nCrafted in Dhaka, Bangladesh • Export Grade A\nPremium Heavy Twill & Full-Grain Leather',
    interiorComplianceLabel: 'Official compliance label:\nShell: 60% Cotton Twill, 40% Full-Grain Cowhide Leather.\nLining: 100% Cotton.\nMade in Bangladesh.',
    packagingDirectives: 'Packaged in breathable branded cotton dustbag, individual polybag with warning label, 18 pcs per 5-ply export carton.',
  },
  qualityControlClearances: [
    {
      id: 'qc-elr-1',
      testName: 'Dynamic Load Capacity Test',
      standardOrRequirement: 'Completed tote loaded with 10.0 kg weight',
      passCriteria: '1,000 dynamic lift cycles without stitch failure or handle tear.',
    },
    {
      id: 'qc-elr-2',
      testName: 'Twill Rubbing & Abrasion Resistance',
      standardOrRequirement: 'Martindale Abrasion Test (ASTM D4966)',
      passCriteria: 'Exceeds 25,000 cycles without yarn breakage or surface pilling.',
    },
    {
      id: 'qc-elr-3',
      testName: 'Chemical & Environmental Safety',
      standardOrRequirement: 'REACH Annex XVII + BSCI Grade A',
      passCriteria: 'Non-detectable Azo dyes, Chromium VI < 3 ppm, zero banned plasticizers.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-11-03',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// 2D. BANGLA ECO — IRIS DENIM & LEATHER SHOULDER BAG
// =============================================================
export const TECH_PACK_IRS_1401: StandardFactoryTechPack = {
  id: 'tp-irs-1401',
  documentRef: 'TP-AMC-IRS-1401',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Iris Denim & Leather Shoulder Bag with Crochet Charm',
  styleCode: 'IRS-1401',
  targetDeviceOrFit: 'Compact Shoulder Bag / Smartphone, Cardholder, Keys & Cosmetics',
  originHub: 'Dhaka / Hazaribagh & Savar Export Cluster',
  referencePictures: [
    '/images/products/bangla_eco/iris/1.jpg',
    '/images/products/bangla_eco/iris/2.jpg',
    '/images/products/bangla_eco/iris/3.jpeg',
    '/images/products/bangla_eco/iris/4.jpeg',
  ],
  referencePictureCaptions: [
    'Front Perspective: Washed Blue Denim with Genuine Leather Piping & Artisan Crochet Charm',
    'Hardware & Strap Detail: Custom-Colored Metal Chain & Polished Gold Hardware',
    'Interior Organization: Brown Fabric Lining with 1 Chain Compartment & 1 Slip Pocket',
    'Side Architecture: Ergonomic Under-Arm Silhouette with Firm Leather Trim',
  ],
  billOfMaterials: [
    {
      id: 'bom-irs-1',
      component: 'Shell Body',
      materialAndConstruction: '11–12 oz Soft-Washed Sky Blue Cotton Denim',
      specificationOrGrade: 'Enzyme-washed with gentle marble fade and anti-fray selvedge',
      colorwayOptions: 'Sky Blue Wash Denim',
    },
    {
      id: 'bom-irs-2',
      component: 'Leather Trim & Handle',
      materialAndConstruction: '1.2–1.4 mm Supple Full-Grain Cowhide',
      specificationOrGrade: 'LWG Audited Savar Tannery; hand-burnished edges',
      colorwayOptions: 'Rich Cognac Tan',
    },
    {
      id: 'bom-irs-3',
      component: 'Artisan Crochet Charm',
      materialAndConstruction: '100% Hand-Crocheted Botanical Flower Charm',
      specificationOrGrade: 'Organic combed cotton yarn with gold-tone lobster clip',
      colorwayOptions: 'Pastel Floral Accent (Peach, Cream, Mint)',
    },
    {
      id: 'bom-irs-4',
      component: 'Chain & Hardware',
      materialAndConstruction: 'Custom-Colored Metallic Chain + Polished Gold Hardware',
      specificationOrGrade: 'Multi-link chain with scratch-resistant electroplating',
      colorwayOptions: 'Polished Gold & Matched Enamel Links',
    },
    {
      id: 'bom-irs-5',
      component: 'Dual Shoulder Straps',
      materialAndConstruction: 'Short Denim Top Handle + Removable Adjustable Leather Shoulder Strap',
      specificationOrGrade: 'Reinforced nylon core in strap for anti-stretch longevity',
      colorwayOptions: 'Denim & Cognac Leather',
    },
    {
      id: 'bom-irs-6',
      component: 'Internal Lining',
      materialAndConstruction: 'Smooth Brown Poly-Cotton Lining',
      specificationOrGrade: '1 Secure zippered chain compartment + 1 slip pocket for cards/keys',
      colorwayOptions: 'Cocoa Brown',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-irs-1',
      measurementPoint: 'Body Width',
      specInches: '10.5"',
      specMetric: '26.7 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Fits iPhone Pro Max, travel wallet, cosmetics compact',
    },
    {
      id: 'ms-irs-2',
      measurementPoint: 'Body Height',
      specInches: '6.5"',
      specMetric: '16.5 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Sleek under-arm baguette silhouette',
    },
    {
      id: 'ms-irs-3',
      measurementPoint: 'Base Depth',
      specInches: '3.0"',
      specMetric: '7.6 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Streamlined base gusset',
    },
    {
      id: 'ms-irs-4',
      measurementPoint: 'Short Handle Drop',
      specInches: '5.5"',
      specMetric: '14.0 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Chic hand or forearm crook carry',
    },
    {
      id: 'ms-irs-5',
      measurementPoint: 'Removable Long Strap Drop',
      specInches: '20.0" – 24.0"',
      specMetric: '50.8 cm – 61.0 cm',
      tolerance: '±1.0 cm',
      productionPurpose: 'Comfortable crossbody or shoulder conversion',
    },
  ],
  constructionDetails: [
    'Handmade Crochet Charm Attachment: Detachable crochet charm is anchored via custom gold dog-clip to the front left handle loop, allowing buyers to wear it with or without the ornament.',
    'Custom Chain Accent: Chain is engineered with electroplated scratch-proof alloy linked alongside the denim strap for modern boutique styling.',
    'Curved Baguette Contouring: Bag bottom and corners feature internal piping to retain its structured rectangular silhouette even when loaded.',
    'Dual Internal Storage: Interior is partitioned with 1 full-length security zipper wall pocket and 1 quick-reach cardholder pouch.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Gold foil deboss on leather strap end.',
    leatherTagOrClochette: 'Removable artisan crochet charm + miniature brass coin charm.',
    interiorBrandPlate: 'Interior leather patch:\nArielMC × Bangla Eco\nHandcrafted in Dhaka, Bangladesh\nWashed Denim & Artisan Leather',
    interiorComplianceLabel: 'Label inside lining:\nShell: 70% Cotton Denim, 30% Cowhide Leather.\nLining: 100% Polyester/Cotton Blend.\nMade in Bangladesh.',
    packagingDirectives: 'Wrapped in branded tissue, placed in non-woven dustbag, 36 pcs per export carton.',
  },
  qualityControlClearances: [
    {
      id: 'qc-irs-1',
      testName: 'Chain & Ring Tensile Strength',
      standardOrRequirement: 'Chain link pull test',
      passCriteria: 'Withstand 250N tensile pull without link separation or distortion.',
    },
    {
      id: 'qc-irs-2',
      testName: 'Denim Wash Fastness',
      standardOrRequirement: 'ISO 105-C06 wash fastness',
      passCriteria: 'Grade 4.0 minimum; zero color bleeding onto white testing cloth.',
    },
    {
      id: 'qc-irs-3',
      testName: 'Lead & Nickel Compliance',
      standardOrRequirement: 'EN 1811 Nickel Release + REACH SVHC',
      passCriteria: 'Passes nickel-free standard for all skin-contact metallic hardware.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-11-03',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// 2E. BANGLA ECO — KNOX FULL-GRAIN CRAZY HORSE LEATHER WALLET
// =============================================================
export const TECH_PACK_KNX_0801: StandardFactoryTechPack = {
  id: 'tp-knx-0801',
  documentRef: 'TP-AMC-KNX-0801',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Knox Full-Grain Crazy Horse Leather Wallet',
  styleCode: 'KNX-0801',
  targetDeviceOrFit: 'Everyday Bifold Wallet / 3 Cards, 2 Currency Slots, Hidden Pouch & Coins',
  originHub: 'Dhaka / Hazaribagh & Savar Export Cluster',
  referencePictures: [
    '/images/products/bangla_eco/knox/1.jpg',
    '/images/products/bangla_eco/knox/2.jpg',
    '/images/products/bangla_eco/knox/3.jpg',
    '/images/products/bangla_eco/knox/4.jpg',
  ],
  referencePictureCaptions: [
    'Front Exterior: Pull-Up Crazy Horse Leather with Vintage Wax Patina',
    'Open Bifold Interior: 3 Card Slots, Flap Coin Pocket & Dual Currency Divider',
    'Detail Profile: Hand-Burnished Beeswax Sealed Edges & Bonded Thread Stitching',
    'Hidden Pocket & Coin Compartment Clearance',
  ],
  billOfMaterials: [
    {
      id: 'bom-knx-1',
      component: 'Exterior & Interior Shell',
      materialAndConstruction: '1.6–1.8 mm Full-Grain Vegetable-Tanned Crazy Horse Cowhide',
      specificationOrGrade: 'Savar LWG-Audited Tannery; rich oil/wax pull-up finish that self-heals light scratches',
      colorwayOptions: 'Vintage Saddle Brown / Tobacco',
    },
    {
      id: 'bom-knx-2',
      component: 'Card Slots',
      materialAndConstruction: '3 Precision Die-Cut Leather Card Slots',
      specificationOrGrade: 'Skived to 0.6 mm edges with heat-creased rim lines',
      colorwayOptions: 'Saddle Brown',
    },
    {
      id: 'bom-knx-3',
      component: 'Cash Dividers',
      materialAndConstruction: 'Dual Full-Length Bill Compartments',
      specificationOrGrade: 'Separates domestic and international currencies cleanly',
      colorwayOptions: 'Saddle Brown with Raw Suede Backing',
    },
    {
      id: 'bom-knx-4',
      component: 'Coin Pocket & Snaps',
      materialAndConstruction: 'Gusseted Leather Coin Pouch with Hidden Magnetic / Brass Snap',
      specificationOrGrade: 'Solid antique brass snap fastener tested for 5,000 cycles',
      colorwayOptions: 'Antique Brass Hardware',
    },
    {
      id: 'bom-knx-5',
      component: 'Hidden Compartment',
      materialAndConstruction: 'Discreet Sub-Pocket behind card bank',
      specificationOrGrade: 'Provides secure concealment for emergency cash or transit cards',
      colorwayOptions: 'Matched to interior',
    },
    {
      id: 'bom-knx-6',
      component: 'Stitching Thread',
      materialAndConstruction: 'Tex 70 Bonded Nylon Thread',
      specificationOrGrade: 'High-tensile rot-proof waxed nylon with reinforced back-stitching',
      colorwayOptions: 'Warm Golden Tan Contrast',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-knx-1',
      measurementPoint: 'Width (Closed Bifold)',
      specInches: '4.5"',
      specMetric: '11.4 cm',
      tolerance: '±0.2 cm',
      productionPurpose: 'Fits standard back and front pants pockets',
    },
    {
      id: 'ms-knx-2',
      measurementPoint: 'Height',
      specInches: '3.4"',
      specMetric: '8.6 cm',
      tolerance: '±0.2 cm',
      productionPurpose: 'Comfortable hand grip and vertical pocket clearance',
    },
    {
      id: 'ms-knx-3',
      measurementPoint: 'Width (Fully Opened)',
      specInches: '8.8"',
      specMetric: '22.4 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Full flat horizontal spread for paper currency insertion',
    },
    {
      id: 'ms-knx-4',
      measurementPoint: 'Thickness (Empty)',
      specInches: '0.5"',
      specMetric: '1.3 cm',
      tolerance: '±0.1 cm',
      productionPurpose: 'Slim minimalist everyday carry footprint',
    },
  ],
  constructionDetails: [
    'Skiving & Thickness Control: All interior pocket margins must be skived down to 0.6 mm before folding and stitching to avoid bulk accumulation at bifold fold lines.',
    'Edge Burnishing Protocol: Raw leather edges are hand-beveled, burnished with natural organic beeswax, and heat-polished for smooth water-resistant finish.',
    'Corner Stress Bar-Tacks: Card slot entry mouths and cash compartment divider joints must receive dual lock-stitch bar-tacks.',
    'Gusseted Coin Chamber: The coin pouch features an accordion side gusset allowing quick coin selection without deforming the wallet exterior.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Blind deboss of ArielMC monogram on bottom right front corner.',
    leatherTagOrClochette: 'FSC-certified kraft paper hangtag detailing Crazy Horse leather care and patina characteristics.',
    interiorBrandPlate: 'Heat-embossed inside cash divider:\nArielMC × Bangla Eco\nGenuine Full-Grain Crazy Horse Leather\nHandcrafted in Dhaka, Bangladesh',
    interiorComplianceLabel: 'Compliance stamp inside coin pocket: 100% Cowhide Leather • REACH Certified • Made in Bangladesh',
    packagingDirectives: 'Packaged in rigid black gift box with gold foil stamping, protected by soft non-woven dust pouch.',
  },
  qualityControlClearances: [
    {
      id: 'qc-knx-1',
      testName: 'Leather Pull-Up & Oil Saturation',
      standardOrRequirement: 'ASTM D2099 flex and surface scratching check',
      passCriteria: 'Light fingernail scratches rub out cleanly with finger friction; rich pull-up hue transformation.',
    },
    {
      id: 'qc-knx-2',
      testName: 'Card Slot Extraction Fatigue',
      standardOrRequirement: '1,000 card insertion/extraction cycles per slot',
      passCriteria: 'Maintains snug card retention without stitch loosening or pocket tearing.',
    },
    {
      id: 'qc-knx-3',
      testName: 'Chemical & REACH Clearance',
      standardOrRequirement: 'REACH Annex XVII compliance',
      passCriteria: 'Chromium VI strictly non-detectable / < 3 ppm, zero toxic DMFu.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-11-03',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// 2F. BANGLA ECO — LOKO FULL-GRAIN CRAZY HORSE LEATHER LONG WALLET
// =============================================================
export const TECH_PACK_LOK_1201: StandardFactoryTechPack = {
  id: 'tp-lok-1201',
  documentRef: 'TP-AMC-LOK-1201',
  companyHeader: 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK',
  productName: 'ArielMC Loko Full-Grain Crazy Horse Leather Long Wallet',
  styleCode: 'LOK-1201',
  targetDeviceOrFit: 'Long Continental Wallet & Smartphone Clutch / 7 Cards, Phone & Coins',
  originHub: 'Dhaka / Hazaribagh & Savar Export Cluster',
  referencePictures: [
    '/images/products/bangla_eco/loko/1.jpg',
    '/images/products/bangla_eco/loko/2.jpg',
    '/images/products/bangla_eco/loko/3.jpg',
    '/images/products/bangla_eco/loko/4.jpg',
  ],
  referencePictureCaptions: [
    'Front View: Sleek Long Continental Profile with 4-Point Magnetic Closure',
    'Interior Architecture: 7 Card Slots, Smartphone Chamber, Zipped Pocket & Cash Dividers',
    'Zero-Fabric Construction: 100% Pure Genuine Crazy Horse Leather Throughout',
    'Concealed Magnetic Closure Alignment & Smooth Chain Zipper Pull',
  ],
  billOfMaterials: [
    {
      id: 'bom-lok-1',
      component: 'Full Architecture Shell & Interior',
      materialAndConstruction: '1.8–2.0 mm 100% Genuine Full-Grain Crazy Horse Cowhide',
      specificationOrGrade: 'LWG Gold Savar Tannery; premium pull-up leather that develops rich vintage patina',
      colorwayOptions: 'Deep Cognac Brown / Caramel',
    },
    {
      id: 'bom-lok-2',
      component: 'Internal Lining Architecture',
      materialAndConstruction: 'ZERO FABRIC: Crafted entirely from genuine leather with no cloth lining',
      specificationOrGrade: 'Natural velvety flesh-side leather backing eliminates tearing and synthetic wear',
      colorwayOptions: 'Natural Cognac Leather Interior',
    },
    {
      id: 'bom-lok-3',
      component: 'Card Organization',
      materialAndConstruction: '7 Dedicated Staggered Card Slots',
      specificationOrGrade: 'Precision die-cut with burnished and wax-sealed edges',
      colorwayOptions: 'Cognac Leather',
    },
    {
      id: 'bom-lok-4',
      component: 'Smartphone Chamber',
      materialAndConstruction: 'Dedicated Internal Phone Compartment',
      specificationOrGrade: 'Accommodates up to 6.8" smartphones (iPhone 16 Pro Max, Galaxy S25 Ultra)',
      colorwayOptions: 'All-Leather Pocket',
    },
    {
      id: 'bom-lok-5',
      component: 'Zipped Chain Coin Pocket',
      materialAndConstruction: 'Full-Length Security Coin & Key Compartment',
      specificationOrGrade: '#4 Smooth Metal Chain Zipper with custom leather slider pull',
      colorwayOptions: 'Antique Brass / Gold Finish',
    },
    {
      id: 'bom-lok-6',
      component: 'Cash & Document Dividers',
      materialAndConstruction: '2 Full-Length Gusseted Currency / Passport Sections',
      specificationOrGrade: 'Carries unfolding bills, receipts, checks, and travel tickets',
      colorwayOptions: 'Cognac Leather',
    },
    {
      id: 'bom-lok-7',
      component: 'Magnetic Closure System',
      materialAndConstruction: '4-Point High-Strength Concealed Neodymium Magnets',
      specificationOrGrade: 'Embedded invisibly between leather layers for a clean snap lock',
      colorwayOptions: 'Concealed (Invisible)',
    },
  ],
  measurementSpecs: [
    {
      id: 'ms-lok-1',
      measurementPoint: 'Height',
      specInches: '7.5"',
      specMetric: '19.0 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Comfortably clears flat unfolded bills, checkbooks, and passports',
    },
    {
      id: 'ms-lok-2',
      measurementPoint: 'Width (Closed)',
      specInches: '3.75"',
      specMetric: '9.5 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Ergonomic clutch hold in palm or handbag insertion',
    },
    {
      id: 'ms-lok-3',
      measurementPoint: 'Depth / Thickness (Closed)',
      specInches: '0.75"',
      specMetric: '1.9 cm',
      tolerance: '±0.2 cm',
      productionPurpose: 'Slim structured silhouette without bulk',
    },
    {
      id: 'ms-lok-4',
      measurementPoint: 'Width (Fully Opened)',
      specInches: '7.7"',
      specMetric: '19.5 cm',
      tolerance: '±0.3 cm',
      productionPurpose: 'Bi-fold spread for clear access to all 7 cards and phone chamber',
    },
  ],
  constructionDetails: [
    'Zero-Fabric Pure Leather Integrity: No synthetic polyester or nylon lining is permitted. All interior dividers and card slots are crafted from skived 0.7–0.8 mm genuine leather to ensure lifetime durability.',
    '4-Point Magnetic Calibration: Four ultra-strong neodymium disc magnets are sealed inside precision skived leather pockets before perimeter stitching, ensuring consistent snap closure even with a loaded phone.',
    'Full-Length Zipped Vault: Central coin pocket features a metal chain zipper recessed to prevent zipper teeth from scratching cards or smartphone displays.',
    'Edge Sealing & Burnishing: 100% hand-burnished edges sealed with natural beeswax and edge-ironing technique for enduring luxury.',
  ],
  brandingDirectives: {
    frontClaspDie: 'Minimalist blind-debossed ArielMC insignia on bottom front right.',
    leatherTagOrClochette: 'Artisan leather story card explaining Crazy Horse pull-up aging and zero-fabric construction.',
    interiorBrandPlate: 'Interior leather heat deboss:\nArielMC × Bangla Eco\nFull-Grain Crazy Horse Leather • Zero-Fabric Construction\nHandcrafted in Dhaka, Bangladesh',
    interiorComplianceLabel: 'Discreet stamp inside cash compartment: 100% Genuine Leather • LWG Audited • Made in Bangladesh',
    packagingDirectives: 'Packaged in luxury presentation slide-box with debossed foil logo and branded tissue paper wrap.',
  },
  qualityControlClearances: [
    {
      id: 'qc-lok-1',
      testName: 'Magnetic Snap Retention & Cycle Test',
      standardOrRequirement: '5,000 opening and closing cycles loaded with phone and 7 cards',
      passCriteria: 'Zero magnet displacement; closure remains aligned and securely engaged.',
    },
    {
      id: 'qc-lok-2',
      testName: 'Crazy Horse Patina & Abrasion Resistance',
      standardOrRequirement: 'ASTM D2099 flex test and rubbing fastness',
      passCriteria: 'Pull-up effect verified; scratches heal smoothly with thumb rubbing.',
    },
    {
      id: 'qc-lok-3',
      testName: 'Zipper Tensile & Cross-Seam Strength',
      standardOrRequirement: 'BS 3084 zipper test & seam tensile load',
      passCriteria: 'Withstand 200N lateral pull without tooth slippage or stitch burst.',
    },
  ],
  version: 'v1.0 - Factory Master',
  issueDate: '2026-11-03',
  preparedBy: 'ArielMC Technical Sourcing Team',
  factoryName: 'Bangla Eco (FAC-BE-01)',
  factoryLocation: 'East Nakhalpara, Tejgaon, Dhaka-1215 / Factory: Hazaribagh & Savar, Dhaka',
  status: 'APPROVED_FOR_BULK',
};

// =============================================================
// STANDARD TECH PACK REGISTRY LOOKUP MAP
// =============================================================
export const STANDARD_TECH_PACKS_MAP: Record<string, StandardFactoryTechPack> = {
  'TP-AMC-JCT-1612': TECH_PACK_JCT_1612,
  'TP-AMC-BLM-1612': TECH_PACK_BLM_1612,
  'TP-AMC-BLS-1801': TECH_PACK_BLS_1801,
  'TP-AMC-ELR-2001': TECH_PACK_ELR_2001,
  'TP-AMC-IRS-1401': TECH_PACK_IRS_1401,
  'TP-AMC-KNX-0801': TECH_PACK_KNX_0801,
  'TP-AMC-LOK-1201': TECH_PACK_LOK_1201,
  'JD-EDC-17': TECH_PACK_JCT_1612,
  'LD-BLM-16': TECH_PACK_BLM_1612,
  'LD-BLS-18': TECH_PACK_BLS_1801,
  'LD-ELR-20': TECH_PACK_ELR_2001,
  'LD-IRS-14': TECH_PACK_IRS_1401,
  'LD-KNX-08': TECH_PACK_KNX_0801,
  'LD-LOK-12': TECH_PACK_LOK_1201,
  'BLS-1801': TECH_PACK_BLS_1801,
  'ELR-2001': TECH_PACK_ELR_2001,
  'IRS-1401': TECH_PACK_IRS_1401,
  'KNX-0801': TECH_PACK_KNX_0801,
  'LOK-1201': TECH_PACK_LOK_1201,
  'BLM': TECH_PACK_BLM_1612,
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
  // Check if a dedicated master tech pack exists for this SKU or styleCode
  if (input.styleCode && STANDARD_TECH_PACKS_MAP[input.styleCode]) {
    return STANDARD_TECH_PACKS_MAP[input.styleCode];
  }
  const codeKey = Object.keys(STANDARD_TECH_PACKS_MAP).find(
    (k) =>
      (input.styleCode && k.toLowerCase() === input.styleCode.toLowerCase()) ||
      (input.modelName && input.modelName.toLowerCase().includes(k.toLowerCase()))
  );
  if (codeKey && STANDARD_TECH_PACKS_MAP[codeKey]) {
    return STANDARD_TECH_PACKS_MAP[codeKey];
  }

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

  // Default picture logic: prioritize exact product match or uploaded URL
  const pictures: string[] = [];
  const modelLower = (modelName || '').toLowerCase();
  const styleLower = (styleCode || '').toLowerCase();

  if (referencePictureUrl && referencePictureUrl.trim().length > 0) {
    pictures.push(referencePictureUrl.trim());
  } else if (modelLower.includes('blossom') || styleLower.includes('bls')) {
    pictures.push('/images/products/bangla_eco/blossom/1-11.png');
  } else if (modelLower.includes('elora') || styleLower.includes('elr')) {
    pictures.push('/images/products/bangla_eco/elora/1.jpg');
  } else if (modelLower.includes('iris') || styleLower.includes('irs')) {
    pictures.push('/images/products/bangla_eco/iris/1.jpg');
  } else if (modelLower.includes('bloom') || styleLower.includes('blm')) {
    pictures.push('/images/techpacks/blm-ref-photo.png');
  } else if (modelLower.includes('knox') || styleLower.includes('knx')) {
    pictures.push('/images/products/bangla_eco/knox/1.jpg');
  } else if (modelLower.includes('loko') || styleLower.includes('lok')) {
    pictures.push('/images/products/bangla_eco/loko/1.jpg');
  } else if (modelLower.includes('jct') || styleLower.includes('jct') || (sector === 'JUTE' && modelLower.includes('commuter'))) {
    pictures.push('/images/techpacks/jct-ref-photo.png');
  } else {
    // Neutral fallback logo to prevent cross-product photo contamination
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
