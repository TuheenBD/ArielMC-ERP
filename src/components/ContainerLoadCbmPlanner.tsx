import React, { useState, useMemo } from 'react';
import {
  Ship,
  Boxes,
  Truck,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Barcode,
  Anchor,
  Globe2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Sliders,
  Printer,
  Check,
  Droplets,
  Package,
  Scale
} from 'lucide-react';
import {
  LogisticsConsignment,
  ConsignmentItem,
  HubLocation,
  ContainerType,
  ShipmentStatus
} from '@/types/erp';

interface ContainerLoadCbmPlannerProps {
  onAddConsignment?: (newCng: LogisticsConsignment) => void;
  onSelectConsignment?: (cng: LogisticsConsignment) => void;
  existingConsignmentsCount?: number;
}

interface ProductPackingSpec {
  sku: string;
  styleCode: string;
  eanBarcode: string;
  name: string;
  sector: 'LEATHER' | 'TEXTILE' | 'JUTE';
  hsCode: string;
  unitsPerCarton: number;
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  cartonCbm: number; // m3
  cartonGrossWeightKg: number; // kg
  cartonNetWeightKg: number;
  packagingMode: string;
  unitFobUsd: number;
  color: string;
  accentBg: string;
}

const MASTER_PRODUCT_SPECS: ProductPackingSpec[] = [
  {
    sku: 'AMC-LT2-LEA-BUR-SGL',
    styleCode: 'LT2',
    eanBarcode: '05300001006-X',
    name: 'ArielMC Style 2 Structured Leather Tote - Deep Burgundy',
    sector: 'LEATHER',
    hsCode: '4202.21.00',
    unitsPerCarton: 10,
    cartonLengthCm: 60,
    cartonWidthCm: 40,
    cartonHeightCm: 45,
    cartonCbm: 0.108,
    cartonGrossWeightKg: 13.0,
    cartonNetWeightKg: 11.5,
    packagingMode: 'Stuffed, Dustbag + Rigid E-com Box',
    unitFobUsd: 58.0,
    color: '#831843',
    accentBg: 'bg-pink-900',
  },
  {
    sku: 'AMC-LT3-LEA-TAN-SGL',
    styleCode: 'LT3',
    eanBarcode: '05300001007-X',
    name: 'ArielMC Style 3 Heritage Leather Tote - British Tan',
    sector: 'LEATHER',
    hsCode: '4202.21.00',
    unitsPerCarton: 10,
    cartonLengthCm: 60,
    cartonWidthCm: 42,
    cartonHeightCm: 45,
    cartonCbm: 0.114,
    cartonGrossWeightKg: 14.5,
    cartonNetWeightKg: 12.8,
    packagingMode: 'Stuffed, Dustbag + Rigid E-com Box',
    unitFobUsd: 62.0,
    color: '#92400e',
    accentBg: 'bg-amber-800',
  },
  {
    sku: 'AMC-BLM-DL-IND-SGL',
    styleCode: 'BLM',
    eanBarcode: '05300001005-X',
    name: 'ArielMC Bloom 16" Embroidered Laptop Tote - Indigo/Tan',
    sector: 'TEXTILE',
    hsCode: '4202.22.00',
    unitsPerCarton: 20,
    cartonLengthCm: 60,
    cartonWidthCm: 40,
    cartonHeightCm: 35,
    cartonCbm: 0.084,
    cartonGrossWeightKg: 14.0,
    cartonNetWeightKg: 12.2,
    packagingMode: 'Suspended EVA sleeve + Dustbag',
    unitFobUsd: 34.0,
    color: '#1e3a8a',
    accentBg: 'bg-blue-900',
  },
  {
    sku: 'AMC-JCT-SHO-NAT-SGL',
    styleCode: 'JCT',
    eanBarcode: '05300001008-X',
    name: 'ArielMC Natural Jute-Cotton Grocery Shopper',
    sector: 'JUTE',
    hsCode: '4202.92.98',
    unitsPerCarton: 50,
    cartonLengthCm: 50,
    cartonWidthCm: 40,
    cartonHeightCm: 30,
    cartonCbm: 0.060,
    cartonGrossWeightKg: 21.0,
    cartonNetWeightKg: 19.5,
    packagingMode: 'Flat poly-bundle, 50pcs',
    unitFobUsd: 5.20,
    color: '#065f46',
    accentBg: 'bg-emerald-900',
  },
  {
    sku: 'AMC-CRD-LEA-BLK-SGL',
    styleCode: 'CRD',
    eanBarcode: '05300001009-X',
    name: 'ArielMC Savar Artisan Leather Cardholder & Wallet',
    sector: 'LEATHER',
    hsCode: '4202.31.00',
    unitsPerCarton: 100,
    cartonLengthCm: 40,
    cartonWidthCm: 30,
    cartonHeightCm: 30,
    cartonCbm: 0.036,
    cartonGrossWeightKg: 14.0,
    cartonNetWeightKg: 12.0,
    packagingMode: 'Flat poly-sleeve, 1pc',
    unitFobUsd: 6.50,
    color: '#374151',
    accentBg: 'bg-gray-800',
  },
];

const CONTAINER_SPECS: Record<ContainerType, {
  name: string;
  grossVolumeCbm: number;
  usableVolumeCbm: number; // Accounting for 10-12% broken stowage & air channels
  maxPayloadKg: number;
  maxPalletsUk: number; // 1200x1000mm
  maxPalletsEuro: number; // 1200x800mm
  oceanFreightBaseUsd: number;
  recommendedDesiccantPoles: number;
}> = {
  '20FT': {
    name: '20ft General Purpose (GP)',
    grossVolumeCbm: 33.2,
    usableVolumeCbm: 28.5,
    maxPayloadKg: 21700,
    maxPalletsUk: 10,
    maxPalletsEuro: 11,
    oceanFreightBaseUsd: 1850,
    recommendedDesiccantPoles: 4,
  },
  '40FT': {
    name: '40ft General Purpose (GP)',
    grossVolumeCbm: 67.7,
    usableVolumeCbm: 58.0,
    maxPayloadKg: 26500,
    maxPalletsUk: 21,
    maxPalletsEuro: 24,
    oceanFreightBaseUsd: 2600,
    recommendedDesiccantPoles: 6,
  },
  '40HC': {
    name: '40ft High Cube (40HC)',
    grossVolumeCbm: 76.4,
    usableVolumeCbm: 68.0,
    maxPayloadKg: 26500,
    maxPalletsUk: 21,
    maxPalletsEuro: 25,
    oceanFreightBaseUsd: 2850,
    recommendedDesiccantPoles: 8,
  },
  'LCL': {
    name: 'LCL (Less than Container Load - CFS Consolidation)',
    grossVolumeCbm: 20.0,
    usableVolumeCbm: 18.0,
    maxPayloadKg: 12000,
    maxPalletsUk: 8,
    maxPalletsEuro: 9,
    oceanFreightBaseUsd: 950,
    recommendedDesiccantPoles: 2,
  },
};

export const ContainerLoadCbmPlanner: React.FC<ContainerLoadCbmPlannerProps> = ({
  onAddConsignment,
  onSelectConsignment,
  existingConsignmentsCount = 2,
}) => {
  // Configuration State
  const [containerType, setContainerType] = useState<ContainerType>('40HC');
  const [destinationHub, setDestinationHub] = useState<HubLocation>('WH-UK');
  const [palletType, setPalletType] = useState<'UK_PALLET' | 'EURO_PALLET'>('UK_PALLET');
  const [vesselName, setVesselName] = useState('MSC MAYA / Voyage 2604W');
  const [etdCtg, setEtdCtg] = useState('2026-04-05');
  const [etaDestination, setEtaDestination] = useState('2026-05-16');

  // Quantities in Cartons
  const [cartonQuantities, setCartonQuantities] = useState<Record<string, number>>({
    'AMC-LT2-LEA-BUR-SGL': 40,  // 400 pcs
    'AMC-LT3-LEA-TAN-SGL': 40,  // 400 pcs
    'AMC-BLM-DL-IND-SGL': 30,   // 600 pcs
    'AMC-JCT-SHO-NAT-SGL': 16,  // 800 pcs
    'AMC-CRD-LEA-BLK-SGL': 5,   // 500 pcs
  });

  const [createdNotification, setCreatedNotification] = useState<string | null>(null);

  // Apply Pre-Pack Loadout Presets
  const applyPreset = (presetKey: 'BALANCED_UK' | 'MAX_HAMBURG' | 'RAPID_20FT' | 'JUTE_BULK') => {
    if (presetKey === 'BALANCED_UK') {
      setContainerType('40HC');
      setDestinationHub('WH-UK');
      setCartonQuantities({
        'AMC-LT2-LEA-BUR-SGL': 40, // 400 pcs (14.2 CBM)
        'AMC-LT3-LEA-TAN-SGL': 30, // 300 pcs (11.4 CBM)
        'AMC-BLM-DL-IND-SGL': 40,  // 800 pcs (11.2 CBM)
        'AMC-JCT-SHO-NAT-SGL': 20, // 1000 pcs (10.0 CBM)
        'AMC-CRD-LEA-BLK-SGL': 10, // 1000 pcs (1.8 CBM)
      });
    } else if (presetKey === 'MAX_HAMBURG') {
      setContainerType('40HC');
      setDestinationHub('WH-DE');
      setCartonQuantities({
        'AMC-LT2-LEA-BUR-SGL': 60,  // 600 pcs
        'AMC-LT3-LEA-TAN-SGL': 50,  // 500 pcs
        'AMC-BLM-DL-IND-SGL': 70,   // 1400 pcs
        'AMC-JCT-SHO-NAT-SGL': 40,  // 2000 pcs
        'AMC-CRD-LEA-BLK-SGL': 20,  // 2000 pcs
      });
    } else if (presetKey === 'RAPID_20FT') {
      setContainerType('20FT');
      setDestinationHub('WH-UK');
      setCartonQuantities({
        'AMC-LT2-LEA-BUR-SGL': 25, // 250 pcs
        'AMC-LT3-LEA-TAN-SGL': 20, // 200 pcs
        'AMC-BLM-DL-IND-SGL': 25,  // 500 pcs
        'AMC-JCT-SHO-NAT-SGL': 15, // 750 pcs
        'AMC-CRD-LEA-BLK-SGL': 5,  // 500 pcs
      });
    } else if (presetKey === 'JUTE_BULK') {
      setContainerType('LCL');
      setDestinationHub('WH-DE');
      setCartonQuantities({
        'AMC-LT2-LEA-BUR-SGL': 0,
        'AMC-LT3-LEA-TAN-SGL': 0,
        'AMC-BLM-DL-IND-SGL': 0,
        'AMC-JCT-SHO-NAT-SGL': 60, // 3000 pcs (~18 CBM)
        'AMC-CRD-LEA-BLK-SGL': 0,
      });
    }
  };

  // Aggregated Load Calculations
  const loadMetrics = useMemo(() => {
    let totalCartons = 0;
    let totalUnits = 0;
    let totalCbm = 0;
    let totalGrossWeightKg = 0;
    let totalNetWeightKg = 0;
    let totalFobValueUsd = 0;
    let totalSilicaCavityPackets = 0;
    let hasJute = false;
    let hasLeather = false;

    const breakdownBySpec: {
      spec: ProductPackingSpec;
      cartons: number;
      units: number;
      cbm: number;
      grossWeightKg: number;
      fobUsd: number;
    }[] = [];

    MASTER_PRODUCT_SPECS.forEach((spec) => {
      const cartons = cartonQuantities[spec.sku] || 0;
      if (cartons > 0) {
        const units = cartons * spec.unitsPerCarton;
        const cbm = Math.round(cartons * spec.cartonCbm * 100) / 100;
        const grossWeight = cartons * spec.cartonGrossWeightKg;
        const netWeight = cartons * spec.cartonNetWeightKg;
        const fob = units * spec.unitFobUsd;

        totalCartons += cartons;
        totalUnits += units;
        totalCbm += cbm;
        totalGrossWeightKg += grossWeight;
        totalNetWeightKg += netWeight;
        totalFobValueUsd += fob;

        if (spec.sector === 'JUTE') hasJute = true;
        if (spec.sector === 'LEATHER') hasLeather = true;

        // Desiccants
        if (spec.sector === 'LEATHER' || spec.sector === 'TEXTILE') {
          totalSilicaCavityPackets += units; // 1 packet per bag cavity
        }

        breakdownBySpec.push({
          spec,
          cartons,
          units,
          cbm,
          grossWeightKg: grossWeight,
          fobUsd: fob,
        });
      }
    });

    totalCbm = Math.round(totalCbm * 10) / 10;
    const currentContainer = CONTAINER_SPECS[containerType];
    const volumeUtilizationPct = Math.min(100, Math.round((totalCbm / currentContainer.usableVolumeCbm) * 1000) / 10);
    const weightUtilizationPct = Math.min(100, Math.round((totalGrossWeightKg / currentContainer.maxPayloadKg) * 1000) / 10);
    const isVolumeOverloaded = totalCbm > currentContainer.usableVolumeCbm;
    const isWeightOverloaded = totalGrossWeightKg > currentContainer.maxPayloadKg;

    // Approximate Pallet Footprint (average 16-20 cartons per pallet layer stack)
    const avgCartonsPerPallet = 16;
    const estimatedPallets = Math.ceil(totalCartons / avgCartonsPerPallet);

    return {
      totalCartons,
      totalUnits,
      totalCbm,
      totalGrossWeightKg,
      totalNetWeightKg,
      totalFobValueUsd,
      volumeUtilizationPct,
      weightUtilizationPct,
      isVolumeOverloaded,
      isWeightOverloaded,
      estimatedPallets,
      totalSilicaCavityPackets,
      hasJute,
      hasLeather,
      breakdownBySpec,
      containerSpec: currentContainer,
    };
  }, [containerType, cartonQuantities]);

  // Generate & Add New Ocean Consignment
  const handleConfirmAndCreateConsignment = () => {
    const consignmentSeq = existingConsignmentsCount + 1;
    const cngNum = `EXP-2026-CTG-${destinationHub === 'WH-UK' ? 'UK' : 'DE'}-0${consignmentSeq}`;
    const destinationPort = destinationHub === 'WH-UK'
      ? 'Port of Felixstowe / London Gateway, UK'
      : 'Port of Hamburg / Rotterdam, Germany';
    const hubName = destinationHub === 'WH-UK'
      ? 'WH-UK (Davies Turner Logistics Northampton Hub)'
      : 'WH-DE (Dachser European Logistics Hamburg Hub)';
    const hubAddress = destinationHub === 'WH-UK'
      ? 'Unit 4, Northampton Logistics Park, Northamptonshire NN4 9BA, United Kingdom'
      : 'Dachser SE, Logistikzentrum Hamburg, Hamburg 21079, Germany';

    const items: ConsignmentItem[] = loadMetrics.breakdownBySpec.map((b, idx) => ({
      id: `cng_item_${Date.now()}_${idx}`,
      sku: b.spec.sku,
      styleCode: b.spec.styleCode,
      eanBarcode: b.spec.eanBarcode,
      productName: b.spec.name,
      sector: b.spec.sector,
      hsCode: b.spec.hsCode,
      cartons: b.cartons,
      unitsPerCarton: b.spec.unitsPerCarton,
      totalUnits: b.units,
      grossWeightKg: b.grossWeightKg,
      netWeightKg: b.cartons * b.spec.cartonNetWeightKg,
      cbm: b.cbm,
      packagingMode: b.spec.packagingMode,
      unitPriceUsd: b.spec.unitFobUsd,
      totalPriceUsd: b.fobUsd,
      fbaTransferUnits: b.spec.sector === 'LEATHER' ? 0 : Math.round(b.units * 0.4),
      fbmInventoryUnits: b.spec.sector === 'LEATHER' ? Math.round(b.units * 0.75) : Math.round(b.units * 0.4),
      b2bWholesaleUnits: b.spec.sector === 'LEATHER' ? Math.round(b.units * 0.25) : Math.round(b.units * 0.2),
    }));

    const newConsignment: LogisticsConsignment = {
      id: `cng_${Date.now()}`,
      consignmentNumber: cngNum,
      linkedSoNumbers: [`SO-2026-${destinationHub.slice(3)}-001`, `SO-2026-${destinationHub.slice(3)}-002`],
      destinationHub,
      hubName,
      hubAddress,
      originPort: 'Chattogram Port (CTG), Bangladesh',
      destinationPort,
      carrierVessel: vesselName,
      billOfLadingNo: `MSCU-CTG-${Math.floor(1000000 + Math.random() * 9000000)}`,
      containerNumber: `MSCU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1 + Math.random() * 9)}`,
      sealNumber: `SL-BD-${Math.floor(100000 + Math.random() * 900000)}`,
      containerType,
      status: 'CUSTOMS_CLEARED_CTG' as ShipmentStatus,
      etdCtg,
      etaDestination,
      desiccantProtocol: {
        containerPolesCount: loadMetrics.containerSpec.recommendedDesiccantPoles,
        cavityPacketsCount: loadMetrics.totalSilicaCavityPackets,
        verified: true,
      },
      phytosanitaryClearance: {
        required: loadMetrics.hasJute,
        daeCertificateNo: loadMetrics.hasJute ? `DAE-CTG-PHYTO-2026-0${Math.floor(100 + Math.random() * 900)}` : undefined,
        fumigationTreatment: 'ISPM-15 Phosphine / Heat Treatment Standard',
        status: loadMetrics.hasJute ? 'CERTIFIED' : 'EXEMPT',
      },
      customsDutyRatePct: 0.0,
      rexStatementOfOrigin: destinationHub === 'WH-UK'
        ? 'The exporter of the products covered by this document declares that, except where otherwise clearly indicated, these products are of Bangladesh preferential origin under Developing Countries Trading Scheme (DCTS Comprehensive Preferences Tier).'
        : 'The exporter of the products covered by this document declares that, except where otherwise clearly indicated, these products are of Bangladesh preferential origin under EU Everything But Arms (EBA / GSP) preferential trade arrangement.',
      bangladeshBankFormExp: `EXP-2026-BB-0${Math.floor(10000 + Math.random() * 90000)}`,
      authorizedDealerBank: 'Eastern Bank PLC (Principal Branch, Dilkusha, Dhaka)',
      oceanFreightUsd: loadMetrics.containerSpec.oceanFreightBaseUsd,
      customsClearanceFee: destinationHub === 'WH-UK' ? 95 : 110,
      portHandlingCfsFee: 280,
      inbound3plReceivingFee: 310,
      currency: destinationHub === 'WH-UK' ? 'GBP' : 'EUR',
      totalCartons: loadMetrics.totalCartons,
      totalUnits: loadMetrics.totalUnits,
      totalGrossWeightKg: loadMetrics.totalGrossWeightKg,
      totalCbm: loadMetrics.totalCbm,
      totalFobValueUsd: loadMetrics.totalFobValueUsd,
      items,
    };

    if (onAddConsignment) {
      onAddConsignment(newConsignment);
    }
    if (onSelectConsignment) {
      onSelectConsignment(newConsignment);
    }

    setCreatedNotification(`Consignment ${cngNum} created and added to Active Ocean Tracking fleet!`);
    setTimeout(() => setCreatedNotification(null), 5000);
  };

  // Download Container Stowage Manifest (CSV)
  const handleDownloadManifest = () => {
    const headers = [
      'SKU',
      'Style Code',
      'Product Name',
      'Sector',
      'HS Code',
      'Cartons',
      'Units/Carton',
      'Total Units',
      'Gross Weight (kg)',
      'Total CBM (m3)',
      'FOB Price (USD)',
      'FOB Total (USD)',
    ];

    const rows = loadMetrics.breakdownBySpec.map((b) => [
      b.spec.sku,
      b.spec.styleCode,
      `"${b.spec.name}"`,
      b.spec.sector,
      b.spec.hsCode,
      b.cartons,
      b.spec.unitsPerCarton,
      b.units,
      b.grossWeightKg,
      b.cbm,
      b.spec.unitFobUsd.toFixed(2),
      b.fobUsd.toFixed(2),
    ]);

    const summaryRows = [
      [],
      ['--- SUMMARY CONTAINER MANIFEST ---'],
      ['Container Type', CONTAINER_SPECS[containerType].name],
      ['Destination Port & 3PL Hub', destinationHub === 'WH-UK' ? 'Felixstowe (WH-UK Davies Turner)' : 'Hamburg (WH-DE Dachser)'],
      ['Total Cartons', loadMetrics.totalCartons],
      ['Total Units', loadMetrics.totalUnits],
      ['Total Gross Weight (kg)', loadMetrics.totalGrossWeightKg],
      ['Total Volume (CBM)', loadMetrics.totalCbm],
      ['Total FOB Value (USD)', `$${loadMetrics.totalFobValueUsd.toLocaleString()}`],
      ['Volume Utilization (%)', `${loadMetrics.volumeUtilizationPct}%`],
      ['Weight Utilization (%)', `${loadMetrics.weightUtilizationPct}%`],
      ['Absortech CaCl2 Poles Count', loadMetrics.containerSpec.recommendedDesiccantPoles],
      ['Silica Cavity Packets Count', loadMetrics.totalSilicaCavityPackets],
      ['Bangladesh Bank Form EXP', 'EXP-2026-BB-048219 (Eastern Bank PLC)'],
      ['DAE Phytosanitary Status', loadMetrics.hasJute ? 'DAE-CTG-PHYTO-2026-CERTIFIED' : 'EXEMPT'],
      ['Preferential Customs Duty', '0.0% (Origin: Bangladesh under DCTS/EBA)'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(',')), ...summaryRows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ArielMC_Stowage_Manifest_${containerType}_${destinationHub}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-['Montserrat']">
      {/* Top Banner / Feature Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#244637] to-[#1F3A2E] text-white border-b-[3px] border-[#C8A96A] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[11px] font-bold">
                OPERATIONAL MILESTONE 4
              </span>
              <span className="text-xs text-white/80 font-mono">
                Chittagong Port ➔ Felixstowe &amp; Hamburg Sea Corridors
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#C8A96A]" />
              Sea Freight Container Load &amp; CBM Stowage Planner
            </h2>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed font-['Open_Sans']">
              Optimizes 20ft / 40ft HC ocean container stowage, calculates broken stowage allowances, mandates tropical monsoon desiccant poles (Absortech CaCl2), and prepares 1-click Bangladesh Bank Form EXP and Chittagong DAE Phytosanitary export filings.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadManifest}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-semibold text-xs transition-all shadow-sm cursor-pointer"
              title="Download Container Stowage & Packing Manifest (CSV)"
            >
              <Download className="w-4 h-4" />
              <span>Download Manifest (CSV)</span>
            </button>

            <button
              onClick={handleConfirmAndCreateConsignment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#8A6D3B] text-[#1F3A2E] font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              <span>Confirm &amp; Stage Consignment</span>
            </button>
          </div>
        </div>

        {/* Loadout Presets Bar */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 overflow-x-auto text-xs">
          <span className="text-[11px] uppercase font-bold text-white/60 shrink-0">
            1-Click Loadout Presets:
          </span>
          <button
            onClick={() => applyPreset('BALANCED_UK')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all shrink-0 cursor-pointer border border-white/10"
          >
            40HC Balanced UK Felixstowe (1,800 units)
          </button>
          <button
            onClick={() => applyPreset('MAX_HAMBURG')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all shrink-0 cursor-pointer border border-white/10"
          >
            40HC Max Hamburg FCL (3,800 units)
          </button>
          <button
            onClick={() => applyPreset('RAPID_20FT')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all shrink-0 cursor-pointer border border-white/10"
          >
            20ft GP Rapid Transit (1,300 units)
          </button>
          <button
            onClick={() => applyPreset('JUTE_BULK')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all shrink-0 cursor-pointer border border-white/10"
          >
            LCL Jute Shoppers (3,000 units)
          </button>
        </div>
      </div>

      {createdNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">{createdNotification}</div>
        </div>
      )}

      {/* Main Grid: Parameters & 3D Stowage Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Container Spec & Routing Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="text-sm font-bold text-[#1F3A2E]">Container &amp; Port Corridor</h3>
              </div>
              <span className="text-xs font-mono text-[#6B7269]">Origin: Port of Chittagong</span>
            </div>

            {/* Container Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                Select Shipping Container Type:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['20FT', '40FT', '40HC', 'LCL'] as ContainerType[]).map((type) => {
                  const spec = CONTAINER_SPECS[type];
                  const isSelected = containerType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContainerType(type)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C8A96A] bg-[#FEF6E4]/40 shadow-sm'
                          : 'border-[#DDE3DD] bg-white hover:bg-[#F8FAF8]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1F3A2E]">{type}</span>
                        <span className="text-[10px] font-mono text-[#8A5A00] font-bold">
                          {spec.usableVolumeCbm} m³
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B7269] mt-0.5 truncate">
                        Max: {(spec.maxPayloadKg / 1000).toFixed(1)}t payload
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destination Hub & Port */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                Destination Port &amp; 3PL Hub:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDestinationHub('WH-UK')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    destinationHub === 'WH-UK'
                      ? 'border-[#1F3A2E] bg-[#1F3A2E] text-white shadow-sm'
                      : 'border-[#DDE3DD] bg-white text-[#1F3A2E] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>WH-UK (Felixstowe)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-[#C8A96A]">0% DCTS</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${destinationHub === 'WH-UK' ? 'text-white/80' : 'text-[#6B7269]'}`}>
                    Davies Turner, Northampton
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationHub('WH-DE')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    destinationHub === 'WH-DE'
                      ? 'border-[#1F3A2E] bg-[#1F3A2E] text-white shadow-sm'
                      : 'border-[#DDE3DD] bg-white text-[#1F3A2E] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>WH-DE (Hamburg)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-[#C8A96A]">0% EBA</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${destinationHub === 'WH-DE' ? 'text-white/80' : 'text-[#6B7269]'}`}>
                    Dachser Logistics Hub, Hamburg
                  </div>
                </button>
              </div>
            </div>

            {/* Voyage Details */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                  Vessel &amp; Voyage:
                </label>
                <input
                  type="text"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-mono text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                  Pallet Standard:
                </label>
                <select
                  value={palletType}
                  onChange={(e) => setPalletType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-xl text-xs font-semibold text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
                >
                  <option value="UK_PALLET">UK Pallet (1200 x 1000mm)</option>
                  <option value="EURO_PALLET">Euro Pallet (1200 x 800mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                  ETD Chittagong (CTG):
                </label>
                <input
                  type="date"
                  value={etdCtg}
                  onChange={(e) => setEtdCtg(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-mono text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                  ETA Destination Port:
                </label>
                <input
                  type="date"
                  value={etaDestination}
                  onChange={(e) => setEtaDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-mono text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            {/* Maritime Climate & Desiccant Checklist */}
            <div className="pt-3 border-t border-[#DDE3DD] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span>Absortech CaCl2 Desiccant Protocol</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                  35-45d Sea Transit
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#134E4A]">
                  <span className="font-medium">Container Wall Desiccant Poles (1.5kg CaCl2):</span>
                  <strong className="font-mono">{loadMetrics.containerSpec.recommendedDesiccantPoles} Poles</strong>
                </div>
                <div className="flex items-center justify-between text-[#134E4A]">
                  <span className="font-medium">Individual Bag Cavity Packets (10g Silica):</span>
                  <strong className="font-mono">{loadMetrics.totalSilicaCavityPackets.toLocaleString()} Packets</strong>
                </div>
                <div className="text-[11px] text-cyan-700 pt-1 border-t border-cyan-200/60 leading-snug">
                  ✓ Guarantees Relative Humidity &lt; 60% across monsoon equator crossings. Completely prevents mould bloom on Savar vegetable-tanned cowhide.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Real-time Stowage & Fill Rate Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="text-sm font-bold text-[#1F3A2E]">
                  Stowage Utilization: {loadMetrics.containerSpec.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#1F3A2E]">
                {loadMetrics.totalCbm} / {loadMetrics.containerSpec.usableVolumeCbm} CBM
              </span>
            </div>

            {/* Visual Container Cross Section Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Volume Capacity Fill (Usable Packing CBM)</span>
                </span>
                <span className={`font-mono font-bold ${
                  loadMetrics.isVolumeOverloaded ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {loadMetrics.volumeUtilizationPct}% {loadMetrics.isVolumeOverloaded && '(OVERLOAD)'}
                </span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full h-8 bg-[#F4F6F4] rounded-xl overflow-hidden border border-[#DDE3DD] p-1 flex items-center gap-1">
                {loadMetrics.breakdownBySpec.map((b) => {
                  const sharePct = (b.cbm / loadMetrics.containerSpec.usableVolumeCbm) * 100;
                  if (sharePct <= 0) return null;
                  return (
                    <div
                      key={b.spec.sku}
                      style={{ width: `${sharePct}%`, backgroundColor: b.spec.color }}
                      className="h-full rounded-lg transition-all duration-300 relative group cursor-pointer"
                      title={`${b.spec.name}: ${b.cartons} Cartons (${b.cbm} CBM)`}
                    >
                      <span className="sr-only">{b.spec.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#6B7269] font-mono">
                <span>0.0 m³</span>
                <span>Usable Max: {loadMetrics.containerSpec.usableVolumeCbm} m³ (Gross: {loadMetrics.containerSpec.grossVolumeCbm} m³)</span>
              </div>
            </div>

            {/* Weight Payload Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600" />
                  <span>Weight Payload Limit ({loadMetrics.totalGrossWeightKg.toLocaleString()} kg)</span>
                </span>
                <span className={`font-mono font-bold ${
                  loadMetrics.isWeightOverloaded ? 'text-rose-600' : 'text-blue-700'
                }`}>
                  {loadMetrics.weightUtilizationPct}% (Max: {(loadMetrics.containerSpec.maxPayloadKg / 1000).toFixed(1)}t)
                </span>
              </div>
              <div className="w-full h-3 bg-[#F4F6F4] rounded-full overflow-hidden border border-[#DDE3DD]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    loadMetrics.isWeightOverloaded ? 'bg-rose-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, loadMetrics.weightUtilizationPct)}%` }}
                />
              </div>
            </div>

            {/* Load Metrics 4-Box Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                <div className="text-[10px] uppercase font-bold text-[#6B7269]">Total Cartons</div>
                <div className="text-base font-bold font-mono text-[#1F3A2E] mt-0.5">
                  {loadMetrics.totalCartons}
                </div>
                <div className="text-[10px] text-[#6B7269]">~{loadMetrics.estimatedPallets} Pallets</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                <div className="text-[10px] uppercase font-bold text-[#6B7269]">Total Units</div>
                <div className="text-base font-bold font-mono text-[#1F3A2E] mt-0.5">
                  {loadMetrics.totalUnits.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#6B7269]">Finished Products</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                <div className="text-[10px] uppercase font-bold text-[#6B7269]">FOB Cargo Value</div>
                <div className="text-base font-bold font-mono text-[#8A5A00] mt-0.5">
                  ${loadMetrics.totalFobValueUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#6B7269]">Dhaka FOB Baseline</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                <div className="text-[10px] uppercase font-bold text-[#6B7269]">Ocean Freight</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  ${loadMetrics.containerSpec.oceanFreightBaseUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#6B7269]">Port-to-Port W/M</div>
              </div>
            </div>

            {/* Regulatory Export Dossier Quick Pack */}
            <div className="p-4 rounded-xl bg-[#FEF6E4]/50 border border-[#FBE3B0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A5508] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C8A96A]" />
                  <span>Mandatory Statutory Export Pack (Chittagong Customs)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  0% Tariff Compliant
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#7A5508]">
                <div className="p-2 rounded-lg bg-white/80 border border-[#FBE3B0]/60">
                  <div className="font-bold">Bangladesh Bank Form EXP</div>
                  <div className="text-[10px] text-[#8A5A00] font-mono">EXP-2026-BB-048219 (Eastern Bank)</div>
                </div>
                <div className="p-2 rounded-lg bg-white/80 border border-[#FBE3B0]/60">
                  <div className="font-bold">DAE Phytosanitary Cert</div>
                  <div className="text-[10px] text-[#8A5A00] font-mono">
                    {loadMetrics.hasJute ? 'DAE-CTG-PHYTO-2026-0941' : 'Exempt (Leather/Denim)'}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/80 border border-[#FBE3B0]/60">
                  <div className="font-bold">REX Statement of Origin</div>
                  <div className="text-[10px] text-[#8A5A00] font-mono">
                    {destinationHub === 'WH-UK' ? 'UK DCTS 0.0% Duty' : 'EU EBA 0.0% Duty'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Line Carton Quantity Sliders & Stacking Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C8A96A]" />
            <h3 className="text-sm font-bold text-[#1F3A2E]">Product Stacking &amp; Carton Allocation</h3>
          </div>
          <span className="text-xs text-[#6B7269]">
            Adjust packed master cartons to match batch ex-factory availability
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-[#6B7269] uppercase text-[10px] tracking-wider border-b border-[#E2E8E2]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">SKU &amp; Style</th>
                <th className="py-2.5 px-3 font-semibold">Packaging Mode</th>
                <th className="py-2.5 px-3 font-semibold">HS Code</th>
                <th className="py-2.5 px-3 font-semibold">Carton Dim &amp; CBM</th>
                <th className="py-2.5 px-3 font-semibold">Units/Ctn</th>
                <th className="py-2.5 px-3 font-semibold text-center w-48">Allocated Cartons</th>
                <th className="py-2.5 px-3 font-semibold">Total Units</th>
                <th className="py-2.5 px-3 font-semibold">Volume (CBM)</th>
                <th className="py-2.5 px-3 font-semibold">Gross Weight</th>
                <th className="py-2.5 px-3 font-semibold">FOB Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E2]">
              {MASTER_PRODUCT_SPECS.map((spec) => {
                const cartons = cartonQuantities[spec.sku] || 0;
                const units = cartons * spec.unitsPerCarton;
                const cbm = Math.round(cartons * spec.cartonCbm * 100) / 100;
                const grossWeight = cartons * spec.cartonGrossWeightKg;
                const fob = units * spec.unitFobUsd;

                return (
                  <tr key={spec.sku} className="hover:bg-[#F4F6F4]/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: spec.color }}
                        />
                        <div>
                          <div className="font-bold text-[#1F3A2E]">{spec.name}</div>
                          <div className="text-[10px] font-mono text-[#6B7269]">{spec.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#1F3A2E] text-[11px]">
                      {spec.packagingMode}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#6B7269]">
                      {spec.hsCode}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#1F3A2E]">
                      {spec.cartonLengthCm}×{spec.cartonWidthCm}×{spec.cartonHeightCm}cm
                      <div className="text-[10px] text-[#6B7269]">({spec.cartonCbm} m³/ctn)</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#1F3A2E] font-semibold">
                      {spec.unitsPerCarton}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCartonQuantities((prev) => ({
                              ...prev,
                              [spec.sku]: Math.max(0, (prev[spec.sku] || 0) - 5),
                            }))
                          }
                          className="w-6 h-6 rounded-lg bg-[#F4F6F4] hover:bg-[#E2E8E2] text-[#1F3A2E] font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={cartons}
                          onChange={(e) =>
                            setCartonQuantities({
                              ...cartonQuantities,
                              [spec.sku]: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-16 px-2 py-1 text-center font-mono font-bold text-xs border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#C8A96A]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCartonQuantities((prev) => ({
                              ...prev,
                              [spec.sku]: (prev[spec.sku] || 0) + 5,
                            }))
                          }
                          className="w-6 h-6 rounded-lg bg-[#F4F6F4] hover:bg-[#E2E8E2] text-[#1F3A2E] font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#1F3A2E]">
                      {units.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#1F3A2E]">
                      {cbm} m³
                    </td>
                    <td className="py-3 px-3 font-mono text-[#1F3A2E]">
                      {grossWeight.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#8A5A00]">
                      ${fob.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
