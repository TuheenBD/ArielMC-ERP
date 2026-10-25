'use client';

import React, { useState } from 'react';
import { ProductItem, ProductSector, SectorAttributes, PotteryAttributes } from '@/types/erp';
import { TechPackBomItem, TechPackMeasurementItem, TechPackQcClearance } from '@/types/techPack';
import { buildStandardFactoryTechPack, SECTOR_TECH_PACK_TEMPLATES } from '@/data/standardTechPacks';
import { MASTER_PRODUCT_ROADMAP, ProductRoadmapItem } from '@/data/productRoadmap';
import {
  X,
  Plus,
  Sparkles,
  Layers,
  Ruler,
  Camera,
  ShieldCheck,
  Tag,
  Factory,
  FileText,
  Trash2,
  CheckCircle2,
  Info,
  BookOpen
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
  onOpenGeneratedTechPack?: (techPack: any) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onOpenGeneratedTechPack,
}) => {
  if (!isOpen) return null;

  const [activeFormTab, setActiveFormTab] = useState<'IDENTITY' | 'TECHPACK_BOM' | 'TECHPACK_MEASURE' | 'CONSTRUCTION_BRANDING' | 'COSTING'>('IDENTITY');

  // Basic Information
  const [sector, setSector] = useState<ProductSector>('JUTE');
  const [name, setName] = useState('ArielMC Structured Jute-Cotton Commuter Shopper Tote');
  const [styleCode, setStyleCode] = useState('JCT-1612');
  const [category, setCategory] = useState('Jute-Cotton Bags');
  const [subCategory, setSubCategory] = useState('Market Shoppers & Lifestyle Totes');
  const [roadmapCode, setRoadmapCode] = useState<string>('JD-EDC-17');
  const [prodtId, setProdtId] = useState<number>(17);
  const [hsCode, setHsCode] = useState('6305.10.00');
  const [description, setDescription] = useState('Heavyweight tight plain weave natural jute-cotton blend tote with water-resistant lamination, webbing handles, and recessed zipper opening.');
  const [referencePictureUrl, setReferencePictureUrl] = useState('/images/techpacks/jct-ref-photo.png');
  const [targetDeviceOrFit, setTargetDeviceOrFit] = useState('Horizontal clearance for A4 folios and 15" laptops');
  const [originHub, setOriginHub] = useState('Dhaka / Narayanganj Textile & Jute Cluster');

  // Factory & Sourcing
  const [factoryName, setFactoryName] = useState('Bengal Jute Mills Ltd');
  const [factoryLocation, setFactoryLocation] = useState('Ghorashal, Narsingdi / Narayanganj Cluster');
  const [factoryCostBdt, setFactoryCostBdt] = useState<number>(450);
  const [marginPct, setMarginPct] = useState<number>(30); // Policy: Minimum 25%-30%
  const [b2bDiscountFromD2cPct, setB2bDiscountFromD2cPct] = useState<number>(45); // Policy: B2B is 40%-50% less than D2C
  const [moq, setMoq] = useState<number>(500);
  const [leadTime, setLeadTime] = useState<number>(30);

  // Sector-specific technical attributes
  const [leatherType, setLeatherType] = useState<'Full-Grain' | 'Top-Grain' | 'Split' | 'Nubuck' | 'Suede'>('Full-Grain');
  const [tanningMethod, setTanningMethod] = useState<'Vegetable Tanned' | 'Chrome Tanned' | 'Semi-Chrome' | 'Chrome-Free'>('Vegetable Tanned');
  const [hideOrigin, setHideOrigin] = useState<'Cowhide' | 'Buffalo' | 'Goat' | 'Sheep'>('Cowhide');
  const [hardwareFinish, setHardwareFinish] = useState<'Antique Brass' | 'Gunmetal' | 'Brushed Nickel' | 'Matte Black'>('Antique Brass');

  const [construction, setConstruction] = useState<'Hessian' | 'Sacking' | 'CBC (Carpet Backing)' | 'Twill' | 'Geo-Jute'>('Hessian');
  const [weightGsm, setWeightGsm] = useState<number>(340);
  const [lamination, setLamination] = useState<'Biodegradable PLA' | 'Food-Grade PP' | 'Unlaminated Natural' | 'Waxed'>('Food-Grade PP');

  const [composition, setComposition] = useState<'100% Combed Cotton' | 'Organic Cotton (GOTS)' | 'Linen-Cotton Blend' | 'Mulberry Silk Blend'>('100% Combed Cotton');
  const [threadCount, setThreadCount] = useState<number>(400);
  const [weaveType, setWeaveType] = useState<'Sateen' | 'Percale' | 'Waffle' | 'Herringbone' | 'Jacquard'>('Sateen');

  const [clayBody, setClayBody] = useState<'High-Fired Stoneware' | 'Fine Porcelain' | 'Terracotta' | 'Earthenware'>('High-Fired Stoneware');
  const [glazeType, setGlazeType] = useState<'Reactive Mineral Glaze' | 'Satin Matte' | 'Glossy Crystalline' | 'Unglazed Terra'>('Reactive Mineral Glaze');
  const [firingTemp, setFiringTemp] = useState<number>(1240);

  // Pottery & Terracotta Specifics
  const [clayType, setClayType] = useState<PotteryAttributes['clayType']>('Indigenous Earthen Clay');
  const [potteryFinish, setPotteryFinish] = useState<PotteryAttributes['finishStyle']>('Raw Natural Terra');
  const [frostResistance, setFrostResistance] = useState<PotteryAttributes['frostResistance']>('Frost Resistant to -10°C');
  const [evaporativeRating, setEvaporativeRating] = useState<string>('High Transpiration (Natural Evaporative Cooling)');

  // Standard Factory Tech-Pack Fields (preloaded with sector template)
  const initialTemplate = SECTOR_TECH_PACK_TEMPLATES.JUTE;
  const [bomRows, setBomRows] = useState<TechPackBomItem[]>(
    initialTemplate.defaultBom.map((item, idx) => ({ id: `bom-new-${idx + 1}`, ...item }))
  );
  const [measurementRows, setMeasurementRows] = useState<TechPackMeasurementItem[]>(
    initialTemplate.defaultMeasurements.map((item, idx) => ({ id: `ms-new-${idx + 1}`, ...item }))
  );
  const [constructionNotes, setConstructionNotes] = useState<string[]>(
    [...initialTemplate.defaultConstruction]
  );
  const [exteriorBrandTag, setExteriorBrandTag] = useState<string>(
    initialTemplate.defaultBranding.exteriorTag
  );
  const [interiorComplianceLabel, setInteriorComplianceLabel] = useState<string>(
    initialTemplate.defaultBranding.interiorCompliance
  );
  const [packagingDirectives, setPackagingDirectives] = useState<string>(
    initialTemplate.defaultBranding.packaging
  );

  // Handle Sector Change and reload sector defaults
  const handleSelectSector = (newSec: ProductSector) => {
    setSector(newSec);
    const tmpl = SECTOR_TECH_PACK_TEMPLATES[newSec] || SECTOR_TECH_PACK_TEMPLATES.JUTE;
    setOriginHub(tmpl.defaultOriginHub);
    setTargetDeviceOrFit(tmpl.defaultTargetDevice);
    setBomRows(tmpl.defaultBom.map((item, idx) => ({ id: `bom-new-${idx + 1}`, ...item })));
    setMeasurementRows(tmpl.defaultMeasurements.map((item, idx) => ({ id: `ms-new-${idx + 1}`, ...item })));
    setConstructionNotes([...tmpl.defaultConstruction]);
    setExteriorBrandTag(tmpl.defaultBranding.exteriorTag);
    setInteriorComplianceLabel(tmpl.defaultBranding.interiorCompliance);
    setPackagingDirectives(tmpl.defaultBranding.packaging);

    if (newSec === 'LEATHER') {
      setHsCode('4202.11.00');
      setName('ArielMC 16" Embroidered Commuter Laptop Tote ("Bloom" Series)');
      setStyleCode('BLM-1612');
      setCategory('Denim-Leather Hybrid');
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setFactoryName('Apex Artisan Leatherworks Ltd');
      setFactoryLocation('Hemayetpur, Savar, Dhaka');
      setFactoryCostBdt(2400);
    } else if (newSec === 'JUTE') {
      setHsCode('6305.10.00');
      setName('ArielMC Structured Jute-Cotton Commuter Shopper Tote');
      setStyleCode('JCT-1612');
      setCategory('Jute-Cotton Bags');
      setReferencePictureUrl('/images/techpacks/jct-ref-photo.png');
      setFactoryName('Bengal Jute Mills Ltd');
      setFactoryLocation('Ghorashal, Narsingdi / Narayanganj Cluster');
      setFactoryCostBdt(450);
    } else if (newSec === 'TEXTILE') {
      setHsCode('6302.21.00');
      setName('ArielMC Luxury Organic Cotton Hemstitch Bedding');
      setStyleCode('TEX-400');
      setCategory('Home Living');
      setReferencePictureUrl('/images/techpacks/TP-AMC-JCT-1612-p1.png');
      setFactoryName('Noman Terry Towel Mills Ltd');
      setFactoryLocation('Narayanganj / Gazipur Textile Corridor');
      setFactoryCostBdt(1800);
    } else if (newSec === 'CERAMICS') {
      setHsCode('6912.00.10');
      setName('ArielMC 27 cm Reactive Glaze Coupe Dinner Plate ("The Artisan")');
      setStyleCode('CT-DNT-49');
      setRoadmapCode('CT-DNT-49');
      setProdtId(49);
      setCategory('Dinnerware & Tabletop');
      setSubCategory('Hospitality & Retail Tableware Suites');
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setFactoryName('Monno Ceramics Ltd');
      setFactoryLocation('Mirpur Ceramics Estate, Dhaka');
      setFactoryCostBdt(310);
    } else if (newSec === 'POTTERY') {
      setHsCode('6914.90.00');
      setName('ArielMC Natural Evaporative Wine Cooler & Carafe');
      setStyleCode('PT-TTH-65');
      setRoadmapCode('PT-TTH-65');
      setProdtId(65);
      setCategory('Tabletop & Hospitality');
      setSubCategory('Evaporative Serving & Dining Pieces');
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setFactoryName('Dhamrai Traditional Pottery Cluster');
      setFactoryLocation('Dhamrai / Savar Heritage Craft Corridor');
      setFactoryCostBdt(370);
    }
  };

  // Quick-Pick from official 74 roadmap items
  const handleSelectRoadmapItem = (itemCode: string) => {
    const item = MASTER_PRODUCT_ROADMAP.find((i) => i.code === itemCode);
    if (!item) return;
    setSector(item.sector);
    setRoadmapCode(item.code);
    setProdtId(item.prodtId);
    setName(item.productHeading || item.productName);
    setStyleCode(item.code);
    setCategory(item.category);
    setSubCategory(item.subCategory);
    setHsCode(item.hsCode || '');
    setTargetDeviceOrFit(item.targetDeviceOrFit || '');
    if (item.typicalMoq) {
      const parsedMoq = parseInt(item.typicalMoq.replace(/\D/g, ''), 10);
      if (!isNaN(parsedMoq)) setMoq(parsedMoq);
    }
    const pricing = item.tierPricing || item.volumePricing;
    if (pricing) {
      const targetBuyUsd = pricing.tier1.targetBuyUsd;
      setFactoryCostBdt(Math.round(targetBuyUsd * 121.5));
    }
  };

  // Costing calculations adhering to:
  // 1. Profit Margin: minimum 25%-30% (Price = Cost / (1 - Margin%))
  // 2. B2B Price based on 40%-50% less than B2C/D2C Price (D2C = B2B / (1 - Discount%))
  const factoryCostUsd = Number((factoryCostBdt / 121.5).toFixed(2));
  const safeMargin = Math.min(Math.max(marginPct, 1), 85);
  const b2bFobPriceUsd = Number((factoryCostUsd / (1 - safeMargin / 100)).toFixed(2));
  const safeDiscount = Math.min(Math.max(b2bDiscountFromD2cPct, 10), 80);
  const d2cRetailPriceUsd = Number((b2bFobPriceUsd / (1 - safeDiscount / 100)).toFixed(2));

  // Dynamic BOM handlers
  const handleAddBomItem = () => {
    setBomRows([
      ...bomRows,
      {
        id: `bom-${Date.now()}`,
        component: 'Additional Component',
        materialAndConstruction: 'Spec Material Details',
        specificationOrGrade: 'Testing Grade / Standard',
        colorwayOptions: 'Matched to shell',
      },
    ]);
  };

  const handleRemoveBomItem = (index: number) => {
    setBomRows(bomRows.filter((_, i) => i !== index));
  };

  // Dynamic Measurement handlers
  const handleAddMeasurementItem = () => {
    setMeasurementRows([
      ...measurementRows,
      {
        id: `ms-${Date.now()}`,
        measurementPoint: 'Additional Measurement Point',
        specInches: '0.0"',
        specMetric: '0.0 cm',
        tolerance: '±0.5 cm',
        productionPurpose: 'Functional clearance',
      },
    ]);
  };

  const handleRemoveMeasurementItem = (index: number) => {
    setMeasurementRows(measurementRows.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let sectorAttr: SectorAttributes;
    if (sector === 'LEATHER') {
      sectorAttr = {
        sector: 'LEATHER',
        data: {
          leatherType,
          tanningMethod,
          hideOrigin,
          thicknessMm: '1.2 - 1.4 mm',
          hardwareFinish,
          edgeFinish: 'Italian Edge Painted',
          reachCompliant: true,
          lwgCertification: 'Silver',
        },
      };
    } else if (sector === 'JUTE') {
      sectorAttr = {
        sector: 'JUTE',
        data: {
          construction,
          yarnCount: '14 lbs / 480 spindle',
          weightGsm,
          lamination,
          bleachStatus: 'Natural Golden',
          biodegradabilityRate: '100% Biodegradable',
          fumigationStandard: 'ISPM-15 Certified',
        },
      };
    } else if (sector === 'TEXTILE') {
      sectorAttr = {
        sector: 'TEXTILE',
        data: {
          composition,
          threadCount,
          gsm: 160,
          weaveType,
          dyeStandard: 'OEKO-TEX Standard 100 Class 1',
          shrinkageLimit: '< 3.0%',
          finishType: 'Bio-Polished',
        },
      };
    } else if (sector === 'CERAMICS') {
      sectorAttr = {
        sector: 'CERAMICS',
        data: {
          clayBody,
          glazeType,
          firingTempCelsius: firingTemp,
          waterAbsorption: '< 0.5%',
          foodContactSafety: 'FDA 21 CFR 175.300 Compliant',
          thermalShockResistance: 'Safe up to 220°C',
        },
      };
    } else {
      sectorAttr = {
        sector: 'POTTERY',
        data: {
          clayType,
          finishStyle: potteryFinish,
          firingTempCelsius: 980,
          frostResistance,
          foodSafeUse: 'Lead & Cadmium Free (Traditional Cooking Grade)',
          evaporativeCoolingRating: evaporativeRating,
        },
      };
    }

    const newSku = roadmapCode ? `AMC-${roadmapCode}` : `AMC-${(styleCode || sector.substring(0, 3)).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Build the Official Standard Factory Tech-Pack
    const generatedTechPack = buildStandardFactoryTechPack({
      modelName: name,
      styleCode,
      sector,
      category,
      referencePictureUrl,
      targetDeviceOrFit,
      originHub,
      factoryName,
      factoryLocation,
      customBom: bomRows,
      customMeasurements: measurementRows,
      customConstruction: constructionNotes,
      customBranding: {
        exteriorBrandTag,
        interiorComplianceLabel,
        packagingDirectives,
      },
    });

    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      sku: newSku,
      styleCode,
      prodtId: prodtId || undefined,
      roadmapCode: roadmapCode || undefined,
      subCategory: subCategory || undefined,
      eanBarcode: `0530000${Math.floor(1000 + Math.random() * 9000)}-X`,
      packagingMode: sector === 'JUTE' ? 'Flat poly-sleeve, 1pc' : sector === 'POTTERY' || sector === 'CERAMICS' ? 'Honeycomb Corrugated + EPE Foam' : 'Dustbag + E-com Box',
      name,
      sector,
      category: category || 'Export Collection',
      hsCode,
      description: description || `Premium Bangladeshi ${sector.toLowerCase()} product exported by ArielMC.`,
      unit: sector === 'TEXTILE' || sector === 'CERAMICS' ? 'SETS' : 'PCS',
      dimensions: 'Standard Export Packing',
      weightKg: sector === 'JUTE' ? 0.38 : sector === 'LEATHER' ? 1.15 : 0.85,
      tags: [sector, 'ArielMC Export', 'Factory Tech-Pack Built', styleCode],
      targetMarkets: ['UK', 'EU', 'US', 'AU'],
      costing: {
        factoryCostBdt,
        factoryCostUsd,
        arielSourcingMarginPct: marginPct,
        b2bFobPriceUsd,
        b2bCifPriceGbp: Number((b2bFobPriceUsd * 0.84).toFixed(2)),
        b2bCifPriceEur: Number((b2bFobPriceUsd * 0.98).toFixed(2)),
        b2bDdpPriceUsd: Number((b2bFobPriceUsd * 1.25).toFixed(2)),
        d2cRetailPriceUsd,
      },
      attributes: sectorAttr,
      complianceCertificates: [
        'ArielMC Factory Sampling Protocol Passed',
        'ISO 105-X12 Crocking Certified',
        'REACH Annex XVII Compliant',
        'EPB Bangladesh Registered'
      ],
      partnerFactory: {
        factoryName: factoryName || 'ArielMC Contracted Vendor Hub',
        location: factoryLocation,
        leadTimeDays: leadTime,
        moq,
        rating: 4.85,
      },
      sampleStatus: 'DEVELOPMENT_PASSED',
      images: [referencePictureUrl],
      createdDate: new Date().toISOString().split('T')[0],
      standardTechPack: generatedTechPack,
    };

    onAddProduct(newProduct);
    if (onOpenGeneratedTechPack) {
      onOpenGeneratedTechPack(generatedTechPack);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#12231B]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/30 hover:bg-black/60 text-white/90 hover:text-white border border-white/20 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="p-5 pr-16 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 text-[#C8A96A] border border-white/20 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A]/25 text-[#F4E3B8] border border-[#C8A96A]/40 font-bold uppercase tracking-wider">
                  Standard Factory Protocol
                </span>
                <span className="text-xs text-white/70">ArielMC Sourcing Hub</span>
              </div>
              <h2 className="text-base font-bold text-white font-montserrat mt-0.5">
                Develop New Model & Auto-Build Factory Tech-Pack
              </h2>
            </div>
          </div>
        </div>

        {/* Form Intake Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-[#DDE3DD] bg-[#F8FAF8] gap-4 text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFormTab('IDENTITY')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeFormTab === 'IDENTITY'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>1. Model & Reference Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('TECHPACK_BOM')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeFormTab === 'TECHPACK_BOM'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8A6D3B]" />
            <span>2. Tech Pack BOM ({bomRows.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('TECHPACK_MEASURE')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeFormTab === 'TECHPACK_MEASURE'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-[#8A6D3B]" />
            <span>3. Measurement Specs ({measurementRows.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('CONSTRUCTION_BRANDING')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeFormTab === 'CONSTRUCTION_BRANDING'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#14512C]" />
            <span>4. Construction & Directives</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('COSTING')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeFormTab === 'COSTING'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>5. Factory Costing & MOQ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1 bg-[#F4F6F4]">
          
          {/* TAB 1: IDENTITY & REFERENCE PHOTO */}
          {activeFormTab === 'IDENTITY' && (
            <div className="space-y-5">
              {/* Sector Selection */}
              <div>
                <label className="block text-[#1F3A2E] font-bold uppercase text-[11px] mb-2 font-montserrat">
                  Product Sector (Loads Industry Standard Tech-Pack Specifications)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS', 'POTTERY'] as ProductSector[]).map((sec) => (
                    <button
                      type="button"
                      key={sec}
                      onClick={() => handleSelectSector(sec)}
                      className={`p-3 rounded-xl border text-center font-medium transition-all shadow-sm ${
                        sector === sec
                          ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white ring-2 ring-[#C8A96A]'
                          : 'bg-white border-[#DDE3DD] text-[#1A1A1A] hover:bg-[#F8FAF8]'
                      }`}
                    >
                      <div className="text-xl">
                        {sec === 'LEATHER' ? '💼' : sec === 'JUTE' ? '🛍️' : sec === 'TEXTILE' ? '🧵' : sec === 'CERAMICS' ? '🍽️' : '🏺'}
                      </div>
                      <div className="text-xs font-bold mt-1 font-montserrat">
                        {sec === 'LEATHER'
                          ? 'Leather'
                          : sec === 'JUTE'
                          ? 'Jute'
                          : sec === 'TEXTILE'
                          ? 'Textiles'
                          : sec === 'CERAMICS'
                          ? 'Ceramics'
                          : 'Pottery'}
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${sector === sec ? 'text-[#C8A96A]' : 'text-[#6B7269]'}`}>
                        {sec === 'LEATHER'
                          ? 'Div 01'
                          : sec === 'JUTE'
                          ? 'Div 02'
                          : sec === 'TEXTILE'
                          ? 'Div 03'
                          : sec === 'CERAMICS'
                          ? 'Div 04'
                          : 'Div 05'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Road Map Quick-Pick Selector */}
              <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#E8CD96] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#8A6D3B] text-xs font-montserrat">
                    <BookOpen className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Quick-Pick from Official 74-Line Catalog Road Map</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#8A6D3B] border border-[#C8A96A] font-semibold">
                    Auto-Fills Tech Specs & Buy Line
                  </span>
                </div>
                <select
                  value={roadmapCode}
                  onChange={(e) => handleSelectRoadmapItem(e.target.value)}
                  className="w-full bg-white border border-[#C8A96A] rounded-lg px-3 py-2 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:ring-1 focus:ring-[#8A6D3B]"
                >
                  <option value="">-- Choose an Official Road Map Line to Auto-Fill --</option>
                    {MASTER_PRODUCT_ROADMAP.filter(i => i.sector === sector).map((item) => (
                      <option key={item.code} value={item.code}>
                        #{item.prodtId} [{item.code}] - {item.productHeading || item.productName} ({item.category})
                      </option>
                    ))}
                </select>
              </div>

              {/* Reference Picture Display & Upload */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#1F3A2E] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Tech-Pack Reference Picture *</span>
                  </div>
                  <span className="text-[11px] text-[#6B7269]">
                    Rendered on Page 1 of the Standard Factory Tech-Pack
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="col-span-1 h-36 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] overflow-hidden flex items-center justify-center relative group p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={referencePictureUrl || '/images/ArielMC_Logo.png'}
                      alt="Reference Model"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div>
                      <label className="block text-[#1A1A1A] font-semibold mb-1">
                        Reference Picture URL or S3/CDN Link
                      </label>
                      <input
                        type="text"
                        value={referencePictureUrl}
                        onChange={(e) => setReferencePictureUrl(e.target.value)}
                        placeholder="e.g. /images/techpacks/jct-ref-photo.png"
                        className="w-full bg-[#FAFCFA] border border-[#DDE3DD] rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] text-[#6B7269]">Quick Factory Samples:</span>
                      <button
                        type="button"
                        onClick={() => setReferencePictureUrl('/images/techpacks/jct-ref-photo.png')}
                        className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] text-[10px] font-semibold border border-[#BBE3C7]"
                      >
                        🛍️ Jute Shopper Tote
                      </button>
                      <button
                        type="button"
                        onClick={() => setReferencePictureUrl('/images/techpacks/blm-ref-photo.png')}
                        className="px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] text-[10px] font-semibold border border-[#C8A96A]"
                      >
                        👜 Bloom Laptop Tote
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Identification Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">Model / Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ArielMC Structured Jute-Cotton Commuter Shopper Tote"
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">Style Code *</label>
                  <input
                    type="text"
                    required
                    value={styleCode}
                    onChange={(e) => setStyleCode(e.target.value)}
                    placeholder="e.g. JCT-1612, BLM-1612, LT2-2026"
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">Target Device / User Fit</label>
                  <input
                    type="text"
                    value={targetDeviceOrFit}
                    onChange={(e) => setTargetDeviceOrFit(e.target.value)}
                    placeholder="e.g. Up to 15.6&quot; Laptop / 16&quot; MacBook Pro"
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">Origin Sourcing Hub in BD</label>
                  <input
                    type="text"
                    value={originHub}
                    onChange={(e) => setOriginHub(e.target.value)}
                    placeholder="e.g. Dhaka / Narayanganj Textile &amp; Jute Cluster"
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Jute-Cotton Bags, Commuter Totes"
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1">HS Tariff Code</label>
                  <input
                    type="text"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-semibold mb-1">Model Description & Specification Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TECH PACK BILL OF MATERIALS (BOM) */}
          {activeFormTab === 'TECHPACK_BOM' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F3A2E] text-sm font-montserrat flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Bill of Materials (BOM) Table</span>
                  </h3>
                  <p className="text-[11px] text-[#6B7269]">
                    Components, material specifications, and colorways as formatted in the ArielMC Standard Tech-Pack
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBomItem}
                  className="px-3 py-1.5 rounded-lg bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-xs font-semibold hover:bg-[#D5ECD9] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Component</span>
                </button>
              </div>

              <div className="space-y-2">
                {bomRows.map((row, idx) => (
                  <div key={row.id || idx} className="grid grid-cols-12 gap-2 p-3 rounded-xl border border-[#DDE3DD] bg-white items-center shadow-sm">
                    <div className="col-span-3">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Component</label>
                      <input
                        type="text"
                        value={row.component}
                        onChange={(e) => {
                          const updated = [...bomRows];
                          updated[idx].component = e.target.value;
                          setBomRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs font-semibold text-[#1F3A2E]"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Material & Construction</label>
                      <input
                        type="text"
                        value={row.materialAndConstruction}
                        onChange={(e) => {
                          const updated = [...bomRows];
                          updated[idx].materialAndConstruction = e.target.value;
                          setBomRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs text-[#1A1A1A]"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Specification / Grade</label>
                      <input
                        type="text"
                        value={row.specificationOrGrade}
                        onChange={(e) => {
                          const updated = [...bomRows];
                          updated[idx].specificationOrGrade = e.target.value;
                          setBomRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs text-[#1A1A1A]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Colorway</label>
                      <input
                        type="text"
                        value={row.colorwayOptions}
                        onChange={(e) => {
                          const updated = [...bomRows];
                          updated[idx].colorwayOptions = e.target.value;
                          setBomRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs text-[#6B7269]"
                      />
                    </div>
                    <div className="col-span-1 text-right pt-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveBomItem(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEASUREMENT SPECIFICATIONS */}
          {activeFormTab === 'TECHPACK_MEASURE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F3A2E] text-sm font-montserrat flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Finished Garment / Bag Measurement Specifications</span>
                  </h3>
                  <p className="text-[11px] text-[#6B7269]">
                    Dimensional targets in Inches and Metric with manufacturing tolerances & functional justifications
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMeasurementItem}
                  className="px-3 py-1.5 rounded-lg bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-xs font-semibold hover:bg-[#D5ECD9] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Measurement</span>
                </button>
              </div>

              <div className="space-y-2">
                {measurementRows.map((row, idx) => (
                  <div key={row.id || idx} className="grid grid-cols-12 gap-2 p-3 rounded-xl border border-[#DDE3DD] bg-white items-center shadow-sm">
                    <div className="col-span-3">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Measurement Point</label>
                      <input
                        type="text"
                        value={row.measurementPoint}
                        onChange={(e) => {
                          const updated = [...measurementRows];
                          updated[idx].measurementPoint = e.target.value;
                          setMeasurementRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs font-semibold text-[#1F3A2E]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Spec (Inches)</label>
                      <input
                        type="text"
                        value={row.specInches}
                        onChange={(e) => {
                          const updated = [...measurementRows];
                          updated[idx].specInches = e.target.value;
                          setMeasurementRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Spec (Metric)</label>
                      <input
                        type="text"
                        value={row.specMetric}
                        onChange={(e) => {
                          const updated = [...measurementRows];
                          updated[idx].specMetric = e.target.value;
                          setMeasurementRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs font-mono font-bold text-[#1F3A2E]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Tolerance</label>
                      <input
                        type="text"
                        value={row.tolerance}
                        onChange={(e) => {
                          const updated = [...measurementRows];
                          updated[idx].tolerance = e.target.value;
                          setMeasurementRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs font-mono text-[#8A6D3B]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-[#6B7269] font-medium mb-0.5">Functional Purpose</label>
                      <input
                        type="text"
                        value={row.productionPurpose}
                        onChange={(e) => {
                          const updated = [...measurementRows];
                          updated[idx].productionPurpose = e.target.value;
                          setMeasurementRows(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs text-[#6B7269]"
                      />
                    </div>
                    <div className="col-span-1 text-right pt-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveMeasurementItem(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONSTRUCTION & BRANDING DIRECTIVES */}
          {activeFormTab === 'CONSTRUCTION_BRANDING' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="font-bold text-[#1F3A2E] text-xs font-montserrat flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#14512C]" />
                  <span>Engineering & Assembly Directives</span>
                </div>
                <div className="space-y-2">
                  {constructionNotes.map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => {
                          const updated = [...constructionNotes];
                          updated[idx] = e.target.value;
                          setConstructionNotes(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs text-[#1A1A1A]"
                      />
                      <button
                        type="button"
                        onClick={() => setConstructionNotes(constructionNotes.filter((_, i) => i !== idx))}
                        className="p-1.5 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setConstructionNotes([...constructionNotes, 'New Engineering Directive: '])}
                    className="text-xs font-semibold text-[#1F3A2E] hover:text-[#8A6D3B] flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Assembly Directive</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <label className="font-bold text-[#1F3A2E] block">Exterior Brand Tag</label>
                  <textarea
                    rows={3}
                    value={exteriorBrandTag}
                    onChange={(e) => setExteriorBrandTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <label className="font-bold text-[#1F3A2E] block">Interior Compliance & Care Label</label>
                  <textarea
                    rows={3}
                    value={interiorComplianceLabel}
                    onChange={(e) => setInteriorComplianceLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2 md:col-span-2">
                  <label className="font-bold text-[#1F3A2E] block">Packaging & Barcode Directives</label>
                  <textarea
                    rows={2}
                    value={packagingDirectives}
                    onChange={(e) => setPackagingDirectives(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FACTORY COSTING & MOQ */}
          {activeFormTab === 'COSTING' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                  <div className="font-bold text-[#1F3A2E] text-xs font-montserrat flex items-center gap-1.5">
                    <Factory className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Bangladesh Sourcing Partner</span>
                  </div>
                  <div>
                    <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Contracted Vendor Name</label>
                    <input
                      type="text"
                      value={factoryName}
                      onChange={(e) => setFactoryName(e.target.value)}
                      placeholder="e.g. Bengal Jute Mills Ltd"
                      className="w-full bg-[#FAFCFA] border border-[#DDE3DD] rounded-lg p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Factory Location / Cluster</label>
                    <input
                      type="text"
                      value={factoryLocation}
                      onChange={(e) => setFactoryLocation(e.target.value)}
                      placeholder="e.g. Ghorashal, Narsingdi / Narayanganj"
                      className="w-full bg-[#FAFCFA] border border-[#DDE3DD] rounded-lg p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Lead Time (Days)</label>
                      <input
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(Number(e.target.value))}
                        className="w-full bg-[#FAFCFA] border border-[#DDE3DD] rounded-lg p-2 text-xs text-[#1A1A1A]"
                      />
                    </div>
                    <div>
                      <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">MOQ (Units)</label>
                      <input
                        type="number"
                        value={moq}
                        onChange={(e) => setMoq(Number(e.target.value))}
                        className="w-full bg-[#FAFCFA] border border-[#DDE3DD] rounded-lg p-2 text-xs text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#C8A96A] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8A6D3B] uppercase text-[11px] font-montserrat">
                      Pricing & Margin Policy Engine
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        marginPct >= 25
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {marginPct >= 25 ? '✓ Margin ≥ 25%–30%' : '⚠️ Below 25% Min'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Factory Cost (BDT)</label>
                      <input
                        type="number"
                        value={factoryCostBdt}
                        onChange={(e) => setFactoryCostBdt(Number(e.target.value))}
                        className="w-full bg-white border border-[#DDE3DD] rounded-lg p-2 text-xs text-[#1A1A1A] font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#6B7269] text-[10px] uppercase font-medium">Margin (% Min 25-30)</label>
                        <div className="flex gap-1 text-[9px]">
                          <button
                            type="button"
                            onClick={() => setMarginPct(25)}
                            className="px-1 py-0.2 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono"
                          >
                            25%
                          </button>
                          <button
                            type="button"
                            onClick={() => setMarginPct(30)}
                            className="px-1 py-0.2 rounded bg-[#1F3A2E] text-white font-mono font-bold"
                          >
                            30%
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="85"
                        value={marginPct}
                        onChange={(e) => setMarginPct(Number(e.target.value))}
                        className={`w-full bg-white border rounded-lg p-2 text-xs font-mono font-bold ${
                          marginPct >= 25 ? 'border-[#C8A96A] text-[#1F3A2E]' : 'border-amber-400 text-amber-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* B2B vs D2C Discount Ratio Control */}
                  <div className="pt-2 border-t border-[#DDE3DD]/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[#6B7269] text-[10px] uppercase font-medium">
                        B2B vs D2C Discount (Policy: 40%–50% less)
                      </label>
                      <div className="flex gap-1 text-[9px]">
                        {[40, 45, 50].map((disc) => (
                          <button
                            key={disc}
                            type="button"
                            onClick={() => setB2bDiscountFromD2cPct(disc)}
                            className={`px-1.5 py-0.5 rounded font-mono font-semibold transition ${
                              b2bDiscountFromD2cPct === disc
                                ? 'bg-[#C8A96A] text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            {disc}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#8A6D3B] font-mono bg-amber-50/60 p-1.5 rounded border border-amber-200/60 flex items-center justify-between">
                      <span>Wholesale Discount from MSRP:</span>
                      <strong>{b2bDiscountFromD2cPct}% OFF Retail</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DDE3DD] space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-[#1A1A1A]">
                      <span>Factory Gate (USD @ 121.5):</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">${factoryCostUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#1F3A2E] font-medium bg-[#E4F3E9] p-1.5 rounded">
                      <span>Calculated B2B FOB Chattogram:</span>
                      <span className="font-mono font-extrabold text-[#14512C]">${b2bFobPriceUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#8A6D3B]">
                      <span>Estimated D2C / B2C Retail MSRP:</span>
                      <span className="font-mono font-bold">${d2cRetailPriceUsd.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-[#6B7269] text-right">
                      Margin: {(((b2bFobPriceUsd - factoryCostUsd) / (b2bFobPriceUsd || 1)) * 100).toFixed(1)}% | B2B is {b2bDiscountFromD2cPct}% below D2C
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="pt-4 border-t border-[#DDE3DD] flex items-center justify-between">
            <div className="text-[11px] text-[#6B7269] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#14512C]" />
              <span>Standard Factory Tech-Pack will be automatically built with reference picture</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-[#DDE3DD] hover:bg-slate-100 text-[#1A1A1A] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold shadow-md shadow-[#1F3A2E]/20 transition-all font-montserrat flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                <span>Save Model & Build Factory Tech-Pack</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
