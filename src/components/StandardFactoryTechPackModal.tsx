'use client';

import React, { useState } from 'react';
import { StandardFactoryTechPack, TechPackBomItem, TechPackMeasurementItem } from '@/types/techPack';
import {
  X,
  Printer,
  Share2,
  Download,
  Edit3,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  FileText,
  Layers,
  Ruler,
  Tag,
  Factory,
  Camera,
  Maximize2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

interface StandardFactoryTechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  techPack: StandardFactoryTechPack | null;
  onUpdateTechPack?: (updated: StandardFactoryTechPack) => void;
}

export const StandardFactoryTechPackModal: React.FC<StandardFactoryTechPackModalProps> = ({
  isOpen,
  onClose,
  techPack,
  onUpdateTechPack,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  if (!isOpen || !techPack) return null;

  const [activeTab, setActiveTab] = useState<'DOCUMENT' | 'EDIT' | 'TRANSMIT'>('DOCUMENT');
  const [editedPack, setEditedPack] = useState<StandardFactoryTechPack>({ ...techPack });
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdits = () => {
    if (onUpdateTechPack) {
      onUpdateTechPack(editedPack);
    }
    setActiveTab('DOCUMENT');
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const updatedPictures = [...(editedPack.referencePictures || []), newPhotoUrl.trim()];
    const updated = { ...editedPack, referencePictures: updatedPictures };
    setEditedPack(updated);
    if (onUpdateTechPack) {
      onUpdateTechPack(updated);
    }
    setNewPhotoUrl('');
  };

  const handleAddBomRow = () => {
    const newBom: TechPackBomItem = {
      id: `bom-${Date.now()}`,
      component: 'New Component',
      materialAndConstruction: 'Specification Details',
      specificationOrGrade: 'Grade / Testing Standard',
      colorwayOptions: 'Matched to shell',
    };
    setEditedPack({
      ...editedPack,
      billOfMaterials: [...editedPack.billOfMaterials, newBom],
    });
  };

  const handleAddMeasurementRow = () => {
    const newMeasurement: TechPackMeasurementItem = {
      id: `ms-${Date.now()}`,
      measurementPoint: 'New Measurement Point',
      specInches: '0.0"',
      specMetric: '0.0 cm',
      tolerance: '±0.5 cm',
      productionPurpose: 'Production fit clearance',
    };
    setEditedPack({
      ...editedPack,
      measurementSpecs: [...editedPack.measurementSpecs, newMeasurement],
    });
  };

  const handleCopyTransmittal = () => {
    const transmittal = `ARIEL MARKETING & COMMUNICATIONS LTD — FACTORY TRANSMITTAL
Document Ref: ${techPack.documentRef}
Product: ${techPack.productName}
Style: ${techPack.styleCode || 'Standard'}
Origin Hub: ${techPack.originHub}
Target Fit: ${techPack.targetDeviceOrFit || 'N/A'}
BOM Components: ${techPack.billOfMaterials.length} spec items
Measurements: ${techPack.measurementSpecs.length} critical points
Quality Clearances: ISO 105-X12 Crocking, 15kg Dynamic Load, REACH/Phytosanitary
Factory Assigned: ${techPack.factoryName || 'Contracted Vendor Hub'}
Issued by: ArielMC Technical Sourcing Team (tuheen@arielmc.com / +8801819273458)`;

    navigator.clipboard.writeText(transmittal);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const currentPicture = techPack.referencePictures && techPack.referencePictures.length > 0
    ? techPack.referencePictures[selectedPhotoIndex] || techPack.referencePictures[0]
    : '/images/ArielMC_Logo.png';

  const techPackDoc: OfficialDocument = {
    id: `doc-tp-${techPack.id}`,
    title: `ArielMC Sampling & Production Tech-Pack — ${techPack.productName} (${techPack.styleCode || techPack.documentRef})`,
    docCode: techPack.documentRef,
    documentNumber: techPack.styleCode || techPack.documentRef,
    issuingAuthority: 'ArielMC Design Studio & Product Engineering',
    station: 'ARIEL_BD',
    section: 'RND_SAMPLING',
    category: 'Factory Production Tech-Pack',
    issueDate: techPack.issueDate || new Date().toISOString().split('T')[0],
    expiryDate: '2027-12-31',
    renewalLeadDays: 30,
    status: 'ACTIVE',
    fileFormat: 'PDF',
    fileSize: '320 KB (Engineering Vector)',
    downloadUrl: '#',
    verified: true,
    uploadedBy: techPack.preparedBy || 'Product Engineering Desk',
    uploadedAt: new Date().toISOString(),
    notes: `Official factory technical specification sheet, BOM inventory, grading tolerance table, and construction guidelines shared for factory technical review, cost sign-off, and production acknowledgement.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#12231B]/75 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:z-auto">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 print:hidden"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 pr-16 py-4 bg-[#1F3A2E] text-white flex items-center justify-between border-b-[3px] border-[#C8A96A] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 text-[#C8A96A] border border-white/20 flex items-center justify-center font-bold text-sm shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#F4E3B8] border border-[#C8A96A]/40 font-bold uppercase tracking-wider">
                  {techPack.documentRef}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/15 text-white/90 border border-white/20 font-semibold">
                  {techPack.version}
                </span>
                <span className="text-xs text-white/70">Standard Factory Tech-Pack</span>
              </div>
              <h2 className="text-base font-bold text-white font-montserrat truncate max-w-xl mt-0.5">
                {techPack.productName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/15 text-xs">
              <button
                onClick={() => setActiveTab('DOCUMENT')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'DOCUMENT'
                    ? 'bg-white text-[#1F3A2E] shadow-sm font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Document View
              </button>
              <button
                onClick={() => setActiveTab('EDIT')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  activeTab === 'EDIT'
                    ? 'bg-white text-[#1F3A2E] shadow-sm font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Specs</span>
              </button>
              <button
                onClick={() => setActiveTab('TRANSMIT')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                  activeTab === 'TRANSMIT'
                    ? 'bg-white text-[#1F3A2E] shadow-sm font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Transmit</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-lg bg-[#C8A96A] hover:bg-[#D8BA7B] text-[#12231B] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Print to PDF / Factory Hardcopy"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-emerald-500/40 cursor-pointer"
              title="Share Tech Pack for Factory Verification, Sign-off & Acknowledgement"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>Share (Verify / Ack)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-[#F4F6F4] print:overflow-visible print:bg-white p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OFFICIAL FACTORY TECH-PACK DOCUMENT */}
          {activeTab === 'DOCUMENT' && (
            <div className="printable-content max-w-4xl mx-auto bg-white rounded-xl border border-[#DDE3DD] shadow-sm p-6 sm:p-8 space-y-8 text-[#1A1A1A] print:shadow-none print:border-none print:p-0 print:space-y-6">
              
              {/* DOCUMENT HEADER */}
              <div className="border-b-2 border-[#1F3A2E] pb-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F3A2E] font-heading uppercase">
                      ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK
                    </h1>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1F3A2E] min-w-[120px]">Document Ref:</span>
                        <span className="font-mono font-bold text-sm text-[#1F3A2E] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                          {techPack.documentRef}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1F3A2E] min-w-[120px]">Product Name:</span>
                        <span className="font-bold text-sm text-[#1A1A1A]">{techPack.productName}</span>
                      </div>
                      {techPack.targetDeviceOrFit && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1F3A2E] min-w-[120px]">Target Device / Fit:</span>
                          <span className="font-medium text-[#1A1A1A]">{techPack.targetDeviceOrFit}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1F3A2E] min-w-[120px]">Origin Hub:</span>
                        <span className="font-medium text-[#1A1A1A]">{techPack.originHub}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-[#6B7269]">Issue Date: <span className="font-medium text-[#1A1A1A]">{techPack.issueDate}</span></div>
                    <div className="text-[11px] text-[#6B7269]">Version: <span className="font-mono font-semibold text-[#1F3A2E]">{techPack.version}</span></div>
                    <div className="text-[11px] text-[#6B7269]">Prepared by: <span className="font-medium text-[#1A1A1A]">{techPack.preparedBy}</span></div>
                    {techPack.factoryName && (
                      <div className="mt-2 px-2.5 py-1 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-[11px] font-semibold text-center">
                        🏭 {techPack.factoryName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: REFERENCE PICTURES (PAGE 1 OFFICIAL HERO) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Reference Picture</span>
                  </h2>
                  {techPack.referencePictures && techPack.referencePictures.length > 1 && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7269]">
                      <span>View angle:</span>
                      {techPack.referencePictures.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhotoIndex(idx)}
                          className={`w-6 h-6 rounded font-mono text-xs font-semibold flex items-center justify-center border transition-all ${
                            selectedPhotoIndex === idx
                              ? 'bg-[#1F3A2E] text-white border-[#1F3A2E]'
                              : 'bg-white text-[#1A1A1A] border-[#DDE3DD] hover:border-[#1F3A2E]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] flex flex-col items-center justify-center">
                  <div className="relative group max-h-[380px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-white border border-[#E8EDE8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPicture}
                      alt={techPack.productName}
                      className="max-h-[360px] max-w-full object-contain p-2 rounded transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <button
                      onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Enlarge Reference Photo"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  {techPack.referencePictureCaptions && techPack.referencePictureCaptions[selectedPhotoIndex] && (
                    <p className="mt-2.5 text-xs text-center text-[#6B7269] italic">
                      {techPack.referencePictureCaptions[selectedPhotoIndex]}
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION: BILL OF MATERIALS (BOM) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Bill of Materials (BOM)</span>
                  </h2>
                  <span className="text-xs text-[#6B7269]">
                    {techPack.billOfMaterials.length} Standard Sourced Components
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1F3A2E] text-white uppercase text-[11px] font-semibold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-heading min-w-[130px]">Component</th>
                        <th className="py-3 px-4 font-heading min-w-[200px]">Material & Construction</th>
                        <th className="py-3 px-4 font-heading min-w-[220px]">Specification / Grade</th>
                        <th className="py-3 px-4 font-heading min-w-[140px]">Colorway Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EDE8]">
                      {techPack.billOfMaterials.map((row, idx) => (
                        <tr
                          key={row.id || idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFA]'}
                        >
                          <td className="py-3 px-4 font-semibold text-[#1F3A2E]">{row.component}</td>
                          <td className="py-3 px-4 text-[#1A1A1A]">{row.materialAndConstruction}</td>
                          <td className="py-3 px-4 text-[#1A1A1A] font-medium">{row.specificationOrGrade}</td>
                          <td className="py-3 px-4 text-[#6B7269]">{row.colorwayOptions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION: FINISHED GARMENT / BAG MEASUREMENT SPECIFICATIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Finished Garment / Bag Measurement Specifications</span>
                  </h2>
                  <span className="text-xs text-[#6B7269]">
                    {techPack.measurementSpecs.length} Dimensional Points
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1F3A2E] text-white uppercase text-[11px] font-semibold tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-heading min-w-[160px]">Measurement Point</th>
                        <th className="py-3 px-3 font-heading min-w-[90px]">Spec (Inches)</th>
                        <th className="py-3 px-3 font-heading min-w-[90px]">Spec (Metric)</th>
                        <th className="py-3 px-3 font-heading min-w-[80px]">Tolerance</th>
                        <th className="py-3 px-4 font-heading min-w-[220px]">Production & Functional Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EDE8]">
                      {techPack.measurementSpecs.map((row, idx) => (
                        <tr
                          key={row.id || idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFA]'}
                        >
                          <td className="py-3 px-4 font-semibold text-[#1F3A2E]">{row.measurementPoint}</td>
                          <td className="py-3 px-3 font-mono font-medium text-[#1A1A1A]">{row.specInches}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#1F3A2E]">{row.specMetric}</td>
                          <td className="py-3 px-3 font-mono text-[#8A6D3B]">{row.tolerance}</td>
                          <td className="py-3 px-4 text-[#6B7269] text-[11px] leading-relaxed">{row.productionPurpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION: ENGINEERING, CONSTRUCTION & ASSEMBLY DETAILS */}
              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#1F3A2E] font-heading">
                  Construction & Assembly Details
                </h2>
                <div className="p-4 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-2.5 text-xs text-[#1A1A1A] leading-relaxed">
                  {techPack.constructionDetails.map((detail, idx) => {
                    const colonIndex = detail.indexOf(':');
                    const title = colonIndex !== -1 ? detail.substring(0, colonIndex + 1) : '';
                    const body = colonIndex !== -1 ? detail.substring(colonIndex + 1) : detail;

                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8A6D3B] font-bold mt-0.5">•</span>
                        <div>
                          {title && <span className="font-bold text-[#1F3A2E]">{title}</span>}
                          <span>{body}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: BRANDING, TRIM & LABELLING DIRECTIVES */}
              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#8A6D3B]" />
                  <span>Branding, Trim & Labelling Directives</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {techPack.brandingDirectives.exteriorBrandTag && (
                    <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-1.5 shadow-sm">
                      <div className="font-bold text-[#1F3A2E]">Exterior Brand Tag</div>
                      <p className="text-[#6B7269] whitespace-pre-line leading-relaxed">
                        {techPack.brandingDirectives.exteriorBrandTag}
                      </p>
                    </div>
                  )}

                  {techPack.brandingDirectives.leatherTagOrClochette && (
                    <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-1.5 shadow-sm">
                      <div className="font-bold text-[#1F3A2E]">Leather Tag & Clochette</div>
                      <p className="text-[#6B7269] whitespace-pre-line leading-relaxed">
                        {techPack.brandingDirectives.leatherTagOrClochette}
                      </p>
                    </div>
                  )}

                  {techPack.brandingDirectives.interiorBrandPlate && (
                    <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-1.5 shadow-sm">
                      <div className="font-bold text-[#1F3A2E]">Interior Brand Plate</div>
                      <p className="text-[#6B7269] whitespace-pre-line leading-relaxed font-mono text-[11px]">
                        {techPack.brandingDirectives.interiorBrandPlate}
                      </p>
                    </div>
                  )}

                  {techPack.brandingDirectives.interiorComplianceLabel && (
                    <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-1.5 shadow-sm">
                      <div className="font-bold text-[#1F3A2E]">Interior Compliance Label</div>
                      <p className="text-[#6B7269] whitespace-pre-line leading-relaxed font-mono text-[11px]">
                        {techPack.brandingDirectives.interiorComplianceLabel}
                      </p>
                    </div>
                  )}

                  {techPack.brandingDirectives.packagingDirectives && (
                    <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-1.5 shadow-sm col-span-1 sm:col-span-2">
                      <div className="font-bold text-[#1F3A2E]">Packaging & Barcode Directives</div>
                      <p className="text-[#6B7269] whitespace-pre-line leading-relaxed">
                        {techPack.brandingDirectives.packagingDirectives}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: QUALITY CONTROL & EXPORT CLEARANCES */}
              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#14512C]" />
                  <span>Quality Control & Export Clearances</span>
                </h2>

                <div className="p-4 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-3 text-xs">
                  {techPack.qualityControlClearances.map((qc, idx) => (
                    <div key={qc.id || idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        ✓
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#1F3A2E]">{qc.testName}</div>
                        <div className="text-[#1A1A1A] font-medium">{qc.standardOrRequirement}</div>
                        <div className="text-[11px] text-[#6B7269]">{qc.passCriteria}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIGN-OFF FOOTER */}
              <div className="pt-6 border-t border-[#DDE3DD] text-[11px] text-[#6B7269] flex flex-wrap justify-between items-end gap-4">
                <div>
                  <div className="font-bold text-[#1F3A2E]">ARIEL MARKETING & COMMUNICATIONS LTD</div>
                  <div>Origin Hub: {techPack.originHub}</div>
                  <div>Sourcing Hub: Dhaka • Narayanganj • Savar Export Corridors</div>
                </div>
                <div className="text-right">
                  <div className="font-mono">Official Spec Version: {techPack.version}</div>
                  <div className="text-[10px] text-[#8A6D3B]">ArielMC Standard Factory Tech-Pack Protocol</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EDIT TECH PACK SPECIFICATIONS */}
          {activeTab === 'EDIT' && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-[#DDE3DD] shadow-sm p-6 sm:p-8 space-y-6 text-xs text-[#1A1A1A]">
              <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E] font-heading">
                    Edit Standard Factory Tech-Pack
                  </h3>
                  <p className="text-xs text-[#6B7269]">
                    Modify document references, BOM components, dimensions, or attach reference photos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('DOCUMENT')}
                    className="px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-[#1A1A1A] hover:bg-[#F4F6F4]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdits}
                    className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] text-white font-bold hover:bg-[#2C5240] flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {/* Photo Management */}
              <div className="p-4 rounded-xl bg-[#FAFCFA] border border-[#DDE3DD] space-y-3">
                <div className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#8A6D3B]" />
                  <span>Reference Photos & Picture URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Enter image URL (e.g. /images/techpacks/jct-ref-photo.png or https://...)"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#DDE3DD] bg-white text-xs focus:outline-none focus:border-[#1F3A2E]"
                  />
                  <button
                    onClick={handleAddPhoto}
                    className="px-3 py-2 rounded-lg bg-[#1F3A2E] text-white font-semibold hover:bg-[#2C5240] shrink-0"
                  >
                    Add Photo
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {editedPack.referencePictures.map((pic, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-lg border border-[#DDE3DD] overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pic} alt={`ref-${idx}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const updated = editedPack.referencePictures.filter((_, i) => i !== idx);
                          setEditedPack({ ...editedPack, referencePictures: updated });
                        }}
                        className="absolute top-1 right-1 p-1 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1F3A2E] mb-1">Document Ref</label>
                  <input
                    type="text"
                    value={editedPack.documentRef}
                    onChange={(e) => setEditedPack({ ...editedPack, documentRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1F3A2E] mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editedPack.productName}
                    onChange={(e) => setEditedPack({ ...editedPack, productName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] text-xs focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1F3A2E] mb-1">Target Device / Fit</label>
                  <input
                    type="text"
                    value={editedPack.targetDeviceOrFit || ''}
                    onChange={(e) => setEditedPack({ ...editedPack, targetDeviceOrFit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] text-xs focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>
              </div>

              {/* BOM Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#1F3A2E]">Bill of Materials (BOM) Rows</div>
                  <button
                    onClick={handleAddBomRow}
                    className="px-2.5 py-1 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-xs font-semibold hover:bg-[#D5ECD9] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add BOM Row</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editedPack.billOfMaterials.map((row, idx) => (
                    <div key={row.id || idx} className="grid grid-cols-12 gap-2 p-2.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] items-center">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={row.component}
                          placeholder="Component"
                          onChange={(e) => {
                            const updated = [...editedPack.billOfMaterials];
                            updated[idx].component = e.target.value;
                            setEditedPack({ ...editedPack, billOfMaterials: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs font-medium"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={row.materialAndConstruction}
                          placeholder="Material"
                          onChange={(e) => {
                            const updated = [...editedPack.billOfMaterials];
                            updated[idx].materialAndConstruction = e.target.value;
                            setEditedPack({ ...editedPack, billOfMaterials: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={row.specificationOrGrade}
                          placeholder="Spec / Grade"
                          onChange={(e) => {
                            const updated = [...editedPack.billOfMaterials];
                            updated[idx].specificationOrGrade = e.target.value;
                            setEditedPack({ ...editedPack, billOfMaterials: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.colorwayOptions}
                          placeholder="Colorway"
                          onChange={(e) => {
                            const updated = [...editedPack.billOfMaterials];
                            updated[idx].colorwayOptions = e.target.value;
                            setEditedPack({ ...editedPack, billOfMaterials: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => {
                            const updated = editedPack.billOfMaterials.filter((_, i) => i !== idx);
                            setEditedPack({ ...editedPack, billOfMaterials: updated });
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurement Specs Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#1F3A2E]">Measurement Specifications Rows</div>
                  <button
                    onClick={handleAddMeasurementRow}
                    className="px-2.5 py-1 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-xs font-semibold hover:bg-[#D5ECD9] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Measurement Row</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editedPack.measurementSpecs.map((row, idx) => (
                    <div key={row.id || idx} className="grid grid-cols-12 gap-2 p-2.5 rounded-lg border border-[#DDE3DD] bg-[#FAFCFA] items-center">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={row.measurementPoint}
                          placeholder="Point (e.g. Width)"
                          onChange={(e) => {
                            const updated = [...editedPack.measurementSpecs];
                            updated[idx].measurementPoint = e.target.value;
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs font-medium"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.specInches}
                          placeholder='Inches (e.g. 16.0")'
                          onChange={(e) => {
                            const updated = [...editedPack.measurementSpecs];
                            updated[idx].specInches = e.target.value;
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.specMetric}
                          placeholder="Metric (e.g. 40.6 cm)"
                          onChange={(e) => {
                            const updated = [...editedPack.measurementSpecs];
                            updated[idx].specMetric = e.target.value;
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.tolerance}
                          placeholder="Tolerance (±0.5 cm)"
                          onChange={(e) => {
                            const updated = [...editedPack.measurementSpecs];
                            updated[idx].tolerance = e.target.value;
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={row.productionPurpose}
                          placeholder="Functional purpose"
                          onChange={(e) => {
                            const updated = [...editedPack.measurementSpecs];
                            updated[idx].productionPurpose = e.target.value;
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="w-full px-2 py-1 rounded border border-[#DDE3DD] text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => {
                            const updated = editedPack.measurementSpecs.filter((_, i) => i !== idx);
                            setEditedPack({ ...editedPack, measurementSpecs: updated });
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branding Text Directives */}
              <div className="space-y-3">
                <div className="font-bold text-[#1F3A2E]">Branding Directives & Compliance</div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3A2E] mb-1">Exterior Brand Tag</label>
                    <textarea
                      rows={2}
                      value={editedPack.brandingDirectives.exteriorBrandTag || ''}
                      onChange={(e) =>
                        setEditedPack({
                          ...editedPack,
                          brandingDirectives: { ...editedPack.brandingDirectives, exteriorBrandTag: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] text-xs focus:outline-none focus:border-[#1F3A2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3A2E] mb-1">Interior Compliance Label</label>
                    <textarea
                      rows={2}
                      value={editedPack.brandingDirectives.interiorComplianceLabel || ''}
                      onChange={(e) =>
                        setEditedPack({
                          ...editedPack,
                          brandingDirectives: { ...editedPack.brandingDirectives, interiorComplianceLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] text-xs focus:outline-none focus:border-[#1F3A2E]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#DDE3DD]">
                <button
                  onClick={() => setActiveTab('DOCUMENT')}
                  className="px-4 py-2 rounded-lg border border-[#DDE3DD] font-semibold text-xs hover:bg-[#F4F6F4]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="px-5 py-2 rounded-lg bg-[#1F3A2E] text-white font-bold text-xs hover:bg-[#2C5240] flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Specifications</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSMIT TO FACTORY */}
          {activeTab === 'TRANSMIT' && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#DDE3DD] shadow-sm p-6 sm:p-8 space-y-6 text-xs text-[#1A1A1A]">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#8A6D3B]" />
                  <span>Transmit Tech-Pack to Bangladesh Factory Partner</span>
                </h3>
                <p className="text-xs text-[#6B7269] mt-1">
                  Send this official spec sheet package directly to partner factories via WhatsApp or official ArielMC Hostinger/Gmail mail systems.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-3">
                <div className="font-bold text-[#1F3A2E] text-sm">Transmittal Package Summary</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6B7269]">Document:</span>{' '}
                    <span className="font-mono font-bold text-[#1F3A2E]">{techPack.documentRef}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269]">Model:</span>{' '}
                    <span className="font-semibold">{techPack.productName}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269]">Assigned Factory:</span>{' '}
                    <span className="font-semibold text-[#14512C]">{techPack.factoryName || 'Contracted Hub'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269]">Origin Hub:</span>{' '}
                    <span>{techPack.originHub}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8EDE8] flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyTransmittal}
                    className="px-4 py-2 rounded-lg bg-[#1F3A2E] text-white font-bold text-xs hover:bg-[#2C5240] flex items-center gap-1.5 transition-all"
                  >
                    {shareSuccess ? <Check className="w-4 h-4 text-[#8A6D3B]" /> : <FileText className="w-4 h-4" />}
                    <span>{shareSuccess ? 'Copied to Clipboard!' : 'Copy Factory Transmittal Text'}</span>
                  </button>

                  <a
                    href={`https://wa.me/8801819273458?text=${encodeURIComponent(
                      `ArielMC Official Factory Tech-Pack Transmittal:\nRef: ${techPack.documentRef}\nModel: ${techPack.productName}\nOrigin: ${techPack.originHub}\nFactory: ${techPack.factoryName}\nBOM Items: ${techPack.billOfMaterials.length}\nMeasurements: ${techPack.measurementSpecs.length}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BA5A] flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp (+8801819273458)</span>
                  </a>

                  <a
                    href={`mailto:tuheen@arielmc.com?subject=${encodeURIComponent(
                      `ArielMC Tech-Pack Transmittal: ${techPack.documentRef} - ${techPack.productName}`
                    )}&body=${encodeURIComponent(
                      `Dear Factory Team,\n\nPlease find attached the official ArielMC Sampling Tech-Pack for ${techPack.productName} (Ref: ${techPack.documentRef}).\n\nOrigin Hub: ${techPack.originHub}\nSpecs: ${techPack.measurementSpecs.length} measurement points and ${techPack.billOfMaterials.length} BOM components.\n\nBest regards,\nArielMC Technical Sourcing Team`
                    )}`}
                    className="px-4 py-2 rounded-lg bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A] font-bold text-xs hover:bg-[#F3EAD8] flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Send via Official Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Official Verification & Acknowledgement Share Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={techPackDoc}
      />
    </div>
  );
};
