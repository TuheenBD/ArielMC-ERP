import { ProductSector } from '@/types/erp';

export interface RndModelItem {
  id: string;
  sku: string;
  sector: ProductSector;
  divisionNumber: string;
  divisionTitle: string;
  category: string;
  title: string;
  architectureDescription: string;
  materials: string[];
  colorways: string[];
  hardwareSpec: string;
  liningSpec: string;
  vaultPath: string;
  coverImage: string;
  lookbookPdf?: string;
  blueprintRefs?: string[];
  incubationStage: 'STAGE_1_CONCEPT_TECH_PACK' | 'STAGE_2_PATTERN_ENGINEERING' | 'STAGE_3_PROTOTYPE_SAMPLING' | 'STAGE_4_COMMERCIAL_EXPORT';
  visibilityMode: 'MODE_1_PRIVATE_ERP' | 'MODE_2_CAPSULE_PREVIEW' | 'MODE_3_COMMERCIAL_EXPORT';
  targetMoq: string;
  targetSamplingLeadTime: string;
  targetProductionLeadTime: string;
  notes: string;
}

export const RND_LAB_MODELS: RndModelItem[] = [
  // -------------------------------------------------------------
  // Division 01: The Leather Compendium
  // -------------------------------------------------------------
  {
    id: 'rnd-ld-01',
    sku: 'RND-LD-01',
    sector: 'LEATHER',
    divisionNumber: '01',
    divisionTitle: 'The Leather Compendium',
    category: 'Structured Carry & Bags',
    title: 'The Sovereign Grained Calfskin Structured Carryall',
    architectureDescription: 'Architectural structured satchel with dual rolled handles, detachable shoulder strap, turnkey brass clasp, leather clochette, and accordion interior organizer.',
    materials: ['Full-grain milled calfskin bovine leather (1.2–1.4 mm)', 'LWG Gold tannery certified', 'Heat-burnished matte edge paint'],
    colorways: ['Cognac Tan', 'Forest Emerald Green', 'Oyster Taupe'],
    hardwareSpec: 'Solid brass turnkey lock, D-rings, and bottom feet with satin gold anti-tarnish finish',
    liningSpec: 'Water-repellent bonded suede microfiber with dual zip compartments',
    vaultPath: 'shared-assets/rnd-lab/01-leather/RND-LD-01-pebbled-leather-carryall/',
    coverImage: '/shared-assets/rnd-lab/01-leather/RND-LD-01-pebbled-leather-carryall/cover-hero.jpg',
    lookbookPdf: '/shared-assets/rnd-lab/01-leather/RND-LD-01-pebbled-leather-carryall/lookbook-rnd-ld-01.pdf',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '300 units per colorway',
    targetSamplingLeadTime: '7–10 days',
    targetProductionLeadTime: '35–40 days per 2,000 units',
    notes: 'Technical package extracted from 10-page portfolio lookbook. Ready for physical sampling yield calculation.',
  },
  {
    id: 'rnd-ld-02',
    sku: 'RND-LD-02',
    sector: 'LEATHER',
    divisionNumber: '01',
    divisionTitle: 'The Leather Compendium',
    category: 'Structured Carry & Bags',
    title: 'The Executive Foldover Flap Wine Calfskin Doctor Satchel',
    architectureDescription: 'Curved foldover security flap with continuous top zipper, extended flapped wings with gold studs, and quick-access smartphone slit pocket with curved drop pull.',
    materials: ['Heavy-gauge pebbled bovine leather (1.3–1.5 mm)', 'LWG Gold audited tannery origin'],
    colorways: ['Rich Bordeaux Wine Red'],
    hardwareSpec: 'Brushed gold heavy-duty zipper, custom curved metal slider pull, structural stud rivets',
    liningSpec: 'Structured microfiber lining with padded central document partition and dual pen loops',
    vaultPath: 'shared-assets/rnd-lab/01-leather/RND-LD-02-executive-doctor-satchel/',
    coverImage: '/shared-assets/rnd-lab/01-leather/RND-LD-02-executive-doctor-satchel/cover-hero.jpg',
    lookbookPdf: '/shared-assets/rnd-lab/01-leather/RND-LD-02-executive-doctor-satchel/lookbook-rnd-ld-02.pdf',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '300 units',
    targetSamplingLeadTime: '7–10 days',
    targetProductionLeadTime: '30–35 days',
    notes: 'High-end executive doctor satchel styling. Pattern drafting to reference The Pattern House travel bag dimensions.',
  },
  {
    id: 'rnd-ld-03',
    sku: 'RND-LD-03',
    sector: 'LEATHER',
    divisionNumber: '01',
    divisionTitle: 'The Leather Compendium',
    category: 'Handcrafted Leather Bags',
    title: 'The Origami Winged Trapezoid Bordeaux Artisan Shopper',
    architectureDescription: 'Sculptural geometric origami silhouette with expandable inward-folding magnetic gussets, arched top rim, and double tubular rolled shoulder straps.',
    materials: ['Supple Bordeaux pebbled calfskin leather (1.1–1.3 mm)', 'LWG certified'],
    colorways: ['Bordeaux Burgundy'],
    hardwareSpec: '4 solid brass bottom protective studs, concealed magnetic edge snaps',
    liningSpec: 'High-tensile twill cotton lining with dual slip pockets and zipper vault pocket',
    vaultPath: 'shared-assets/rnd-lab/01-leather/RND-LD-03-origami-trapezoid-tote/',
    coverImage: '/shared-assets/rnd-lab/01-leather/RND-LD-03-origami-trapezoid-tote/cover-hero.jpg',
    lookbookPdf: '/shared-assets/rnd-lab/01-leather/RND-LD-03-origami-trapezoid-tote/lookbook-rnd-ld-03.pdf',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '300 units',
    targetSamplingLeadTime: '5–7 days',
    targetProductionLeadTime: '30–35 days',
    notes: 'Geometric origami gusset construction requires precision laser cutting and stiffener inserts.',
  },
  {
    id: 'rnd-ld-04',
    sku: 'RND-LD-04',
    sector: 'LEATHER',
    divisionNumber: '01',
    divisionTitle: 'The Leather Compendium',
    category: 'Handcrafted Leather Bags',
    title: 'The Dual-Handle Sovereign Executive Carryall Tote',
    architectureDescription: 'Multi-functional dual-handle carryall (integrated grab handles + elongated shoulder straps), interior top-zip chamber with magnetic retention tab, and security key leash with snap stud.',
    materials: ['Architectural pebbled calfskin (1.2–1.4 mm)', 'LWG Gold certified'],
    colorways: ['Slate Charcoal Grey', 'Bordeaux Wine Red'],
    hardwareSpec: 'Brass magnetic studs, interior key snap clip, nylon-coil smooth zip closure',
    liningSpec: 'Suede-feel microfiber organizer accommodating up to 15" laptop, water bottle, and folios',
    vaultPath: 'shared-assets/rnd-lab/01-leather/RND-LD-04-dual-handle-executive-carryall/',
    coverImage: '/shared-assets/rnd-lab/01-leather/RND-LD-04-dual-handle-executive-carryall/cover-hero.jpg',
    lookbookPdf: '/shared-assets/rnd-lab/01-leather/RND-LD-04-dual-handle-executive-carryall/lookbook-rnd-ld-04.pdf',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '300 units',
    targetSamplingLeadTime: '7–10 days',
    targetProductionLeadTime: '30–35 days',
    notes: 'Dual handle system requires box-and-cross reinforced stitching to support 15 kg dynamic load.',
  },

  // -------------------------------------------------------------
  // Division 02: The Golden Fiber Edit
  // -------------------------------------------------------------
  {
    id: 'rnd-jd-01',
    sku: 'RND-JD-01',
    sector: 'JUTE',
    divisionNumber: '02',
    divisionTitle: 'The Golden Fiber Edit',
    category: 'Everyday Carry & Bags',
    title: 'The Sovereign Dual-Tone Jute Vertical City Messenger',
    architectureDescription: 'Vertical document messenger bag with Sunset Orange & Natural Golden Jute contrast panels, front zipper pocket, top velcro flap closure, and adjustable cross-body strap.',
    materials: ['100% Biodegradable natural Golden Jute canvas (380 GSM)', 'Azo-free reactive dyed orange jute', 'Polyester webbing strap'],
    colorways: ['Sunset Orange & Natural Golden Jute'],
    hardwareSpec: 'Coated nylon coil zipper, heavy-duty hook-and-loop velcro, plastic strap slider',
    liningSpec: '0.02 mm food-grade LDPE moisture barrier lamination',
    vaultPath: 'shared-assets/rnd-lab/02-jute/RND-JD-01-dual-tone-vertical-messenger/',
    coverImage: '/shared-assets/rnd-lab/02-jute/RND-JD-01-dual-tone-vertical-messenger/concept-hero-orange-tan.jpg',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '1,000 units',
    targetSamplingLeadTime: '3–5 days',
    targetProductionLeadTime: '20–25 days per 10,000 units',
    notes: 'Vertical profile tailored for urban transit and student/office commuter merchandise.',
  },
  {
    id: 'rnd-jd-02',
    sku: 'RND-JD-02',
    sector: 'JUTE',
    divisionNumber: '02',
    divisionTitle: 'The Golden Fiber Edit',
    category: 'Modern Living & Décor',
    title: 'The Bengal Indigo Braided Vanity & Linen Storage Duo',
    architectureDescription: 'Heavy-gauge recycled cotton-jute braided cord storage baskets with scalloped whipstitch rim and integrated carry loops for luxury bathroom and linen storage.',
    materials: ['Recycled cotton cord & braided natural jute core yarn', 'Azo-free indigo dye'],
    colorways: ['Deep Indigo Navy & Bleached Ecru'],
    hardwareSpec: 'None (100% woven fiber artisan construction)',
    liningSpec: 'Unlined open-loop breathable weave',
    vaultPath: 'shared-assets/rnd-lab/02-jute/RND-JD-02-indigo-braided-vanity-duo/',
    coverImage: '/shared-assets/rnd-lab/02-jute/RND-JD-02-indigo-braided-vanity-duo/concept-hero-indigo-duo.jpg',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '500 sets (1,000 pieces)',
    targetSamplingLeadTime: '5–7 days',
    targetProductionLeadTime: '25–30 days',
    notes: 'Set of 2 nesting baskets: Master (34×22×18 cm) + Petite (26×18×14 cm). Hospitality & luxury bathroom focus.',
  },
  {
    id: 'rnd-jd-03',
    sku: 'RND-JD-03',
    sector: 'JUTE',
    divisionNumber: '02',
    divisionTitle: 'The Golden Fiber Edit',
    category: 'Modern Living & Décor',
    title: 'The Bengal Flora Lidded Botanical Canister Trio',
    architectureDescription: 'Artisanal crochet cord cylindrical canisters with snug-fitting lids, vertical loop handles, and handcrafted Terracotta & Moss Green sunflower daisy motifs.',
    materials: ['High-twist ecru cotton cord & jute blend fiber', 'OEKO-TEX Standard 100 dyed accent yarns'],
    colorways: ['Natural Ecru with Terracotta Orange & Forest Green Florals'],
    hardwareSpec: 'None (Fiber-loop finials)',
    liningSpec: 'Reinforced circular wall structure with matching crocheted base',
    vaultPath: 'shared-assets/rnd-lab/02-jute/RND-JD-03-flora-lidded-canister-trio/',
    coverImage: '/shared-assets/rnd-lab/02-jute/RND-JD-03-flora-lidded-canister-trio/concept-hero-flora-canisters.jpg',
    incubationStage: 'STAGE_1_CONCEPT_TECH_PACK',
    visibilityMode: 'MODE_1_PRIVATE_ERP',
    targetMoq: '300 sets (900 pieces)',
    targetSamplingLeadTime: '7–10 days',
    targetProductionLeadTime: '30–35 days',
    notes: 'Set of 3 nesting canisters: Grande (24×22 cm), Midi (20×18 cm), Petite (16×14 cm). Boutique home living décor.',
  },
];

