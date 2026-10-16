'use client';

import React, { useState } from 'react';
import { ProductItem, ProductSector, SectorAttributes } from '@/types/erp';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  const [sector, setSector] = useState<ProductSector>('LEATHER');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [hsCode, setHsCode] = useState('4202.11.00');
  const [description, setDescription] = useState('');
  const [factoryName, setFactoryName] = useState('');
  const [factoryLocation, setFactoryLocation] = useState('Savar, Dhaka');
  const [factoryCostBdt, setFactoryCostBdt] = useState<number>(2500);
  const [marginPct, setMarginPct] = useState<number>(30);
  const [moq, setMoq] = useState<number>(300);
  const [leadTime, setLeadTime] = useState<number>(45);

  // Sector-specific state
  // Leather
  const [leatherType, setLeatherType] = useState<'Full-Grain' | 'Top-Grain' | 'Split' | 'Nubuck' | 'Suede'>('Full-Grain');
  const [tanningMethod, setTanningMethod] = useState<'Vegetable Tanned' | 'Chrome Tanned' | 'Semi-Chrome' | 'Chrome-Free'>('Vegetable Tanned');
  const [hideOrigin, setHideOrigin] = useState<'Cowhide' | 'Buffalo' | 'Goat' | 'Sheep'>('Cowhide');
  const [hardwareFinish, setHardwareFinish] = useState<'Antique Brass' | 'Gunmetal' | 'Brushed Nickel' | 'Matte Black'>('Antique Brass');

  // Jute
  const [construction, setConstruction] = useState<'Hessian' | 'Sacking' | 'CBC (Carpet Backing)' | 'Twill' | 'Geo-Jute'>('Hessian');
  const [weightGsm, setWeightGsm] = useState<number>(350);
  const [lamination, setLamination] = useState<'Biodegradable PLA' | 'Food-Grade PP' | 'Unlaminated Natural' | 'Waxed'>('Biodegradable PLA');

  // Textile
  const [composition, setComposition] = useState<'100% Combed Cotton' | 'Organic Cotton (GOTS)' | 'Linen-Cotton Blend' | 'Mulberry Silk Blend'>('100% Combed Cotton');
  const [threadCount, setThreadCount] = useState<number>(400);
  const [weaveType, setWeaveType] = useState<'Sateen' | 'Percale' | 'Waffle' | 'Herringbone' | 'Jacquard'>('Sateen');

  // Ceramics
  const [clayBody, setClayBody] = useState<'High-Fired Stoneware' | 'Fine Porcelain' | 'Terracotta' | 'Earthenware'>('High-Fired Stoneware');
  const [glazeType, setGlazeType] = useState<'Reactive Mineral Glaze' | 'Satin Matte' | 'Glossy Crystalline' | 'Unglazed Terra'>('Reactive Mineral Glaze');
  const [firingTemp, setFiringTemp] = useState<number>(1240);

  // Computed Costing
  const factoryCostUsd = Number((factoryCostBdt / 121.5).toFixed(2));
  const b2bFobPriceUsd = Number((factoryCostUsd * (1 + marginPct / 100)).toFixed(2));
  const d2cRetailPriceUsd = Number((b2bFobPriceUsd * 2.8).toFixed(2));

  // Auto-generate SKU
  const generateSku = () => {
    const secPrefix = sector === 'LEATHER' ? 'LTH' : sector === 'JUTE' ? 'JUT' : sector === 'TEXTILE' ? 'TEX' : 'CER';
    const catCode = category ? category.substring(0, 3).toUpperCase() : 'GEN';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${secPrefix}-${catCode}-${rand}`;
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
    } else {
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
    }

    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      sku: generateSku(),
      name,
      sector,
      category: category || 'Export Collection',
      hsCode,
      description: description || `Premium Bangladeshi ${sector.toLowerCase()} product exported by ArielMC.`,
      unit: sector === 'TEXTILE' || sector === 'CERAMICS' ? 'SETS' : 'PCS',
      dimensions: 'Standard Export Packing',
      weightKg: 1.2,
      tags: [sector, 'ArielMC Export', 'Bangladesh Sourced'],
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
      complianceCertificates: ['EPB Export Registration', 'ISO 9001:2015', 'Bangladesh Chamber of Commerce'],
      partnerFactory: {
        factoryName: factoryName || 'ArielMC Contracted Vendor Hub',
        location: factoryLocation,
        leadTimeDays: leadTime,
        moq,
        rating: 4.8,
      },
      sampleStatus: 'DEVELOPMENT_PASSED',
      images: [],
      createdDate: new Date().toISOString().split('T')[0],
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A2E]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-[#C8A96A] border border-white/20 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat">Create New Master SKU</h2>
              <p className="text-xs text-white/80">Add an export product with sector technical attributes & Bangladesh factory costing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1 bg-[#F4F6F4]">
          {/* Sector Selection */}
          <div>
            <label className="block text-[#1F3A2E] font-bold uppercase text-[11px] mb-2 font-montserrat">Select Product Sector</label>
            <div className="grid grid-cols-4 gap-2.5">
              {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS'] as ProductSector[]).map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => {
                    setSector(sec);
                    if (sec === 'LEATHER') setHsCode('4202.11.00');
                    if (sec === 'JUTE') setHsCode('6305.10.00');
                    if (sec === 'TEXTILE') setHsCode('6302.21.00');
                    if (sec === 'CERAMICS') setHsCode('6912.00.10');
                  }}
                  className={`p-3 rounded-xl border text-center font-medium transition-all shadow-sm ${
                    sector === sec
                      ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white ring-2 ring-[#C8A96A]'
                      : 'bg-white border-[#DDE3DD] text-[#1A1A1A] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="text-lg">
                    {sec === 'LEATHER' ? '👞' : sec === 'JUTE' ? '🌾' : sec === 'TEXTILE' ? '🧵' : '🏺'}
                  </div>
                  <div className="text-xs font-bold mt-1 font-montserrat">{sec}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vintage Full-Grain Leather Weekender Bag"
                className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] placeholder:text-[#6B7269]/60 focus:outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Travel Goods, Tableware, Bedding"
                className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] placeholder:text-[#6B7269]/60 focus:outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1">HS Tariff Code</label>
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1">Description / Spec Summary</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key export selling points & materials"
                className="w-full bg-white border border-[#DDE3DD] rounded-lg px-3 py-2 text-[#1A1A1A] placeholder:text-[#6B7269]/60 focus:outline-none focus:border-[#1F3A2E] focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Dynamic Sector Attributes Box */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
            <div className="font-bold text-[#1F3A2E] flex items-center gap-1.5 font-montserrat">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>{sector} Sector Technical Manufacturing Attributes</span>
            </div>

            {sector === 'LEATHER' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Leather Type</label>
                  <select
                    value={leatherType}
                    onChange={(e: any) => setLeatherType(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Full-Grain">Full-Grain</option>
                    <option value="Top-Grain">Top-Grain</option>
                    <option value="Split">Split</option>
                    <option value="Nubuck">Nubuck</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Tanning Method</label>
                  <select
                    value={tanningMethod}
                    onChange={(e: any) => setTanningMethod(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Vegetable Tanned">Vegetable Tanned</option>
                    <option value="Chrome-Free">Chrome-Free</option>
                    <option value="Chrome Tanned">Chrome Tanned</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Hide Origin</label>
                  <select
                    value={hideOrigin}
                    onChange={(e: any) => setHideOrigin(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Cowhide">Cowhide</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Hardware Finish</label>
                  <select
                    value={hardwareFinish}
                    onChange={(e: any) => setHardwareFinish(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Antique Brass">Antique Brass</option>
                    <option value="Gunmetal">Gunmetal</option>
                    <option value="Brushed Nickel">Brushed Nickel</option>
                  </select>
                </div>
              </div>
            )}

            {sector === 'JUTE' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Construction</label>
                  <select
                    value={construction}
                    onChange={(e: any) => setConstruction(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Hessian">Hessian</option>
                    <option value="Sacking">Sacking</option>
                    <option value="CBC (Carpet Backing)">CBC</option>
                    <option value="Twill">Twill</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Fabric Weight (GSM)</label>
                  <input
                    type="number"
                    value={weightGsm}
                    onChange={(e) => setWeightGsm(Number(e.target.value))}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Inner Lamination</label>
                  <select
                    value={lamination}
                    onChange={(e: any) => setLamination(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Biodegradable PLA">Biodegradable PLA</option>
                    <option value="Food-Grade PP">Food-Grade PP</option>
                    <option value="Unlaminated Natural">Unlaminated Natural</option>
                  </select>
                </div>
              </div>
            )}

            {sector === 'TEXTILE' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Composition</label>
                  <select
                    value={composition}
                    onChange={(e: any) => setComposition(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="100% Combed Cotton">100% Combed Cotton</option>
                    <option value="Organic Cotton (GOTS)">Organic Cotton (GOTS)</option>
                    <option value="Linen-Cotton Blend">Linen-Cotton Blend</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Thread Count (TC)</label>
                  <input
                    type="number"
                    value={threadCount}
                    onChange={(e) => setThreadCount(Number(e.target.value))}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Weave Type</label>
                  <select
                    value={weaveType}
                    onChange={(e: any) => setWeaveType(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Sateen">Sateen</option>
                    <option value="Percale">Percale</option>
                    <option value="Waffle">Waffle</option>
                    <option value="Jacquard">Jacquard</option>
                  </select>
                </div>
              </div>
            )}

            {sector === 'CERAMICS' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Clay Body</label>
                  <select
                    value={clayBody}
                    onChange={(e: any) => setClayBody(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="High-Fired Stoneware">High-Fired Stoneware</option>
                    <option value="Fine Porcelain">Fine Porcelain</option>
                    <option value="Terracotta">Terracotta</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Glaze Treatment</label>
                  <select
                    value={glazeType}
                    onChange={(e: any) => setGlazeType(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  >
                    <option value="Reactive Mineral Glaze">Reactive Mineral Glaze</option>
                    <option value="Satin Matte">Satin Matte</option>
                    <option value="Glossy Crystalline">Glossy Crystalline</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Firing Temp (°C)</label>
                  <input
                    type="number"
                    value={firingTemp}
                    onChange={(e) => setFiringTemp(Number(e.target.value))}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Factory & Costing Engine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
              <span className="font-bold text-[#1F3A2E] block uppercase text-[11px] font-montserrat">Bangladesh Sourcing Factory</span>
              <div>
                <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Contracted Vendor Name</label>
                <input
                  type="text"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  placeholder="e.g. Apex Tannery / Sonar Bangla Mills"
                  className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">MOQ (Units)</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(Number(e.target.value))}
                    className="w-full bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-[#FDFBF7] border border-[#C8A96A] shadow-sm">
              <span className="font-bold text-[#8A6D3B] block uppercase text-[11px] font-montserrat">Costing & Margin Calculator</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">Factory Cost (BDT)</label>
                  <input
                    type="number"
                    value={factoryCostBdt}
                    onChange={(e) => setFactoryCostBdt(Number(e.target.value))}
                    className="w-full bg-white border border-[#DDE3DD] rounded-lg p-2 text-[#1A1A1A] font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[#6B7269] text-[10px] block mb-1 uppercase font-medium">ArielMC Margin (%)</label>
                  <input
                    type="number"
                    value={marginPct}
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full bg-white border border-[#C8A96A] rounded-lg p-2 text-[#1F3A2E] font-mono font-bold"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-[#DDE3DD] space-y-1 text-[11px]">
                <div className="flex justify-between text-[#1A1A1A]">
                  <span>Factory Gate (USD @ 121.5):</span>
                  <span className="font-mono font-bold text-[#1F3A2E]">${factoryCostUsd}</span>
                </div>
                <div className="flex justify-between text-[#1F3A2E] font-medium">
                  <span>Calculated B2B FOB Chattogram:</span>
                  <span className="font-mono font-bold text-[#1F3A2E]">${b2bFobPriceUsd}</span>
                </div>
                <div className="flex justify-between text-[#8A6D3B]">
                  <span>Estimated D2C Retail MSRP:</span>
                  <span className="font-mono font-bold">${d2cRetailPriceUsd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-[#DDE3DD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-[#DDE3DD] hover:bg-slate-100 text-[#1A1A1A] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold shadow-md shadow-[#1F3A2E]/20 transition-all font-montserrat"
            >
              Save & Register Master SKU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
