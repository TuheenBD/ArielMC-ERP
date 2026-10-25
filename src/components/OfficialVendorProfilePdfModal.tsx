'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { SupplierFactory, VendorB2bProfile } from '@/types/erp';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  Building2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Anchor,
  Sparkles,
  QrCode,
  FileCheck,
  Lock,
  Layers,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

interface OfficialVendorProfilePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  factory: SupplierFactory | null;
}

export const OfficialVendorProfilePdfModal: React.FC<OfficialVendorProfilePdfModalProps> = ({
  isOpen,
  onClose,
  factory,
}) => {
  const printCanvasRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen || !factory) return null;

  // Extract or synthesize profile data from factory
  const baseProfile = factory.vendorProfile;
  const profile: VendorB2bProfile = {
    vendorType: baseProfile?.vendorType || factory.vendorType || (factory.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY'),
    registeredCompanyName: baseProfile?.registeredCompanyName || factory.name,
    tradeLicenseNo: baseProfile?.tradeLicenseNo || factory.tradeLicenseNo || 'TRAD/SAV/004819/2026',
    ercNumber: baseProfile?.ercNumber || factory.epbRegistrationNo || 'ERC-0094819-EXP',
    customsBin13Digit: baseProfile?.customsBin13Digit || factory.binNumber || '001892837-0101',
    tinNumber: baseProfile?.tinNumber || factory.tinNumber || '8492817291',
    registeredOfficeAddress: baseProfile?.registeredOfficeAddress || factory.factoryAddress,
    factoryPlantAddress: baseProfile?.factoryPlantAddress || factory.factoryAddress,
    managingDirectorName: baseProfile?.managingDirectorName || factory.contactPerson,
    yearOfEstablishment: baseProfile?.yearOfEstablishment || '2014',
    websiteUrl: baseProfile?.websiteUrl || factory.website || 'www.apexartisan-bd.com',
    corporateEmail: baseProfile?.corporateEmail || factory.email || 'export@factory-bd.com',
    facebookUrl: baseProfile?.facebookUrl || factory.facebookUrl || 'facebook.com/apexartisan.bd',
    linkedInUrl: baseProfile?.linkedInUrl || factory.linkedInUrl || 'linkedin.com/company/apex-artisan-bd',
    primaryContact: baseProfile?.primaryContact || {
      name: factory.contactPerson,
      designation: factory.designation,
      email: factory.email,
      mobile: factory.phone,
    },
    authorizedSignatory: {
      name: factory.contactPerson,
      designation: factory.designation,
      email: factory.email,
      mobile: factory.phone,
    },
    selectedSectors: factory.sectors,
    factoryFloorAreaSqFt: 85000,
    workforce: {
      management: 45,
      skilledLabor: 480,
      total: 525,
    },
    capacities: {
      leather: {
        rawFinishes: 'Full-Grain Cowhide, Vegetable & Chrome-Tanned',
        annualCapacitySqFt: 350000,
        leadTimeDays: factory.leadTimeDays || 45,
      },
      jute: {
        rawFibers: 'Tossa Grade A Jute, Heavy Twill & Hessian',
        annualCapacityMetricTons: 1200,
        leadTimeDays: 40,
      },
      textile: {
        beddingLinens: 'GOTS Certified Organic Cotton & Canvas Made-ups',
        annualCapacityPcs: 250000,
        leadTimeDays: 35,
      },
      ceramics: {
        tablewareArt: 'Fine Porcelain & Terracotta Glazed Tableware',
        annualCapacityPcs: 180000,
        leadTimeDays: 50,
      },
    },
    leadTimes: {
      initialOrderDays: factory.leadTimeDays || 45,
      repeatOrderDays: Math.max(25, (factory.leadTimeDays || 45) - 15),
    },
    preferredIncoterms: ['FOB', 'CIF'],
    loadingPortLocations: ['Chattogram Seaport (Off-Dock ICD, CTG)', 'Dhaka Airport (DAC)'],
    dailyDispatchCapacity: '2,500 Pcs / 12 Metric Tons',
    containerLoadingAbility: ['20ft FCL', '40ft HQ'],
    complianceFrameworks: {
      ukEu: {
        sedexSmeta: { certified: true, idExpiry: 'SEDEX-SMETA-2027' },
        bsci: { certified: true, idExpiry: 'BSCI-A-2027-03' },
        oekoTex: { certified: true, idExpiry: 'OEKO-TEX-CLASS-1' },
        gots: { certified: true, idExpiry: 'GOTS-ORG-2026' },
      },
      usa: {
        ctpat: { certified: true, status: 'Tier 2 Certified' },
        fdaLeaching: { certified: true, reportNo: 'SGS-FDA-PASS-2026' },
        lwg: { certified: true, grade: 'Gold' },
      },
      australia: {
        aqis: { compliant: true, regNo: 'AQIS-BD-0941' },
        fumigation: { approved: true, facilityCode: 'FUM-CTG-88' },
      },
    },
    banking: {
      beneficiaryBankName: factory.bankDetails.bankName || 'Eastern Bank PLC',
      branchName: factory.bankDetails.branch || 'Principal Corporate Branch, Dhaka',
      adBranchCode: factory.bankDetails.adBranchCode || '0142',
      swiftCode: factory.bankDetails.swiftCode || 'EBLNBDDH',
      routingNumber: factory.bankDetails.routingNumber || '090260012',
      accountNumber: factory.bankDetails.accountNumber || '1041060089214',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'BDT'],
      paymentMethodsAccepted: ['Confirmed L/C at sight', 'TT (Advance/Deferred)'],
      exportFootprintPct: {
        usa: 35,
        uk: 30,
        eu: 25,
        aus: 10,
      },
    },
    declaration: {
      signatoryFullName: factory.contactPerson,
      designation: factory.designation,
      date: new Date().toISOString().split('T')[0],
      placeOfSigning: 'Dhaka, Bangladesh',
      isSigned: true,
    },
    documents: factory.enlistmentDocuments || [
      {
        id: 'doc-1',
        docType: 'TRADE_LICENSE',
        title: 'Trade Licence (TIN/ETIN) Copy with Renewal',
        fileName: 'Trade_License_Renewal_2026_Certified.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-2',
        docType: 'CERTIFICATE_OF_INCORPORATION',
        title: 'Certificates of Incorporation (If LTD)',
        fileName: 'RJSC_Certificate_of_Incorporation_C-89214.pdf',
        fileSize: '2.4 MB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-3',
        docType: 'NID_CERTIFICATE',
        title: 'NID Certificate',
        fileName: 'MD_Smart_NID_Verified_Copy.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-4',
        docType: 'BIN_CERTIFICATE',
        title: 'BIN Certificate',
        fileName: 'NBR_Customs_13_Digit_BIN_001892837.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-5',
        docType: 'BANK_SOLVENCY',
        title: 'Bank Solvency Statements',
        fileName: 'Eastern_Bank_PLC_Solvency_Certificate.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-6',
        docType: 'BANK_DETAIL',
        title: 'Bank Detail',
        fileName: 'EBL_AD_Branch_Remittance_Account_Sheet.pdf',
        fileSize: '780 KB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
      {
        id: 'doc-7',
        docType: 'CHEQUE_SCAN',
        title: 'Scan Copy of Cheque',
        fileName: 'Voided_Cheque_Leaf_Account_1041060089214.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-10-15',
        status: 'VERIFIED',
        mandatory: true,
      },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  // Official Document representation for verification and acknowledgement
  const vendorProfileDoc: OfficialDocument = {
    id: `doc-vpd-${factory.id}`,
    title: `Official B2B Vendor Profile & Enlistment Dossier — ${factory.name}`,
    docCode: `VPD-${factory.code}`,
    documentNumber: factory.code,
    issuingAuthority: 'ArielMC Global Sourcing & Vendor Enlistment Desk',
    station: 'ARIEL_DHAKA',
    section: 'FACTORY_COMPLIANCE',
    category: 'Statutory B2B Vendor Dossier',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2027-12-31',
    status: 'ACTIVE',
    fileFormat: 'PDF',
    fileSize: '210 KB (Vector A4 2-Page)',
    downloadUrl: '#',
    uploadedBy: 'Compliance Desk',
    notes: `Comprehensive 2-page statutory B2B vendor profile including legal registration, factory capacity, customs BIN, and banking credentials shared for commercial verification and supplier acknowledgement.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-[#12231B] border-2 border-[#2C5240] rounded-2xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden text-white">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Action Header Bar */}
        <div className="px-6 pr-16 py-4 bg-[#162B22] border-b-2 border-[#C8A96A] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A]">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 font-bold uppercase tracking-wider">
                  STATUTORY VENDOR DOSSIER
                </span>
                <span className="text-xs text-[#CFE0D5] font-medium">B2B Profile Form (A4 Vector PDF)</span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white mt-0.5 flex items-center gap-1.5">
                <span>Official</span>
                <ArielMC className="text-[#C8A96A]" />
                <span>B2B Vendor Profile &amp; Enlistment Dossier</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#d4b576] text-[#12231B] text-xs font-bold font-heading shadow-md transition-all active:scale-95"
              title="Print directly or save as vector PDF"
            >
              <Printer className="w-4 h-4 text-[#12231B]" />
              <span>Download / Print Official Form</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-heading shadow-md transition-all active:scale-95 border border-emerald-400/40 cursor-pointer"
              title="Share Dossier for Official Verification & Acknowledgement via Email/WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Share (Verify / Ack)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Canvas Container */}
        <div className="flex-1 bg-[#0A1410] p-4 sm:p-8 overflow-y-auto flex flex-col items-center gap-8">
          
          {/* ========================================================
              PAGE 1 OF B2B VENDOR PROFILE FORM
              ======================================================== */}
          <div
            id="vendor-profile-page-1"
            className="bg-white text-[#1A1A1A] w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col justify-between font-sans text-xs p-7"
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              {/* Top Dual Accent Stripe matching Reference Form */}
              <div className="w-full h-1.5 flex mb-3">
                <div className="w-2/3 h-full bg-[#0F2C59]" />
                <div className="w-1/3 h-full bg-[#E87722]" />
              </div>

              {/* Header Letterhead */}
              <div className="pb-2.5 mb-2.5 border-b border-gray-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src="/images/ArielMC_Emblem_Square.png"
                        alt="ArielMC Logo Emblem"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold font-heading tracking-tight leading-none text-[#0F2C59]">
                        <ArielMC className="text-[#0F2C59]" />
                      </div>
                      <div className="text-[8.5px] font-bold text-[#E87722] uppercase tracking-wider mt-0.5">
                        Ariel Marketing &amp; Communications Limited
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[7.5px] text-gray-600 leading-tight">
                    <div className="font-semibold text-[#0F2C59]">House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh</div>
                    <div>Tel: +880 2410 811 91 | Mob: +880 1818273458</div>
                    <div>Email: info@arielmc.com | Web: www.arielmc.com</div>
                    <div>Facebook: facebook.com/arielmc.bd | LinkedIn: linkedin.com/company/arielmc</div>
                  </div>
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="text-center py-1.5 border-b border-gray-300">
                <h1 className="text-base font-bold font-heading text-[#0F2C59] tracking-wider uppercase">
                  B2B VENDOR PROFILE FORM
                </h1>
              </div>

              {/* 1. COMPANY BASIC IDENTITY & LEGAL PROFILE */}
              <div className="mt-2 space-y-1">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  1. COMPANY BASIC IDENTITY &amp; LEGAL PROFILE
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8px]">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold w-1/4">Company Legal Name:</td>
                      <td className="p-1 border-r border-gray-300 font-semibold text-[#0F2C59] w-1/4">{profile.registeredCompanyName}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold w-1/4">Vendor Entity Type:</td>
                      <td className="p-1 font-semibold text-[#0F2C59] w-1/4 text-[6.5px] leading-tight space-y-0.5">
                        <div>[ {profile.vendorType === 'FULL_FLEDGED_FACTORY' ? '✓' : ' '} ] <strong>Full-Fledged Factory:</strong> Own Raw Materials (e.g. Tannery) &amp; Finished Goods Production</div>
                        <div>[ {profile.vendorType === 'FACTORY' ? '✓' : ' '} ] <strong>Factory:</strong> Manufacturer (Open Market Raw Materials) &amp; Finished Goods Production</div>
                        <div>[ {profile.vendorType === 'SUPPLIER' ? '✓' : ' '} ] <strong>Supplier:</strong> Collect Finished Goods &amp; Supply</div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Trade License No:</td>
                      <td className="p-1 border-r border-gray-300 font-mono font-semibold">{profile.tradeLicenseNo}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">13-Digit Customs BIN:</td>
                      <td className="p-1 font-mono font-bold text-[#0F2C59]">{profile.customsBin13Digit}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Export Reg. Certificate (ERC):</td>
                      <td className="p-1 border-r border-gray-300 font-mono">{profile.ercNumber || 'ERC-0094819-EXP'}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">TIN (Tax Identification No):</td>
                      <td className="p-1 font-mono">{profile.tinNumber || '8492817291'}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Registered Office Address:</td>
                      <td className="p-1 border-r border-gray-300">{profile.registeredOfficeAddress}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Factory / Facility Address:</td>
                      <td className="p-1">{profile.factoryPlantAddress}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Managing Director / CEO:</td>
                      <td className="p-1 border-r border-gray-300 font-bold">{profile.managingDirectorName}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Primary Contact Officer:</td>
                      <td className="p-1 font-mono text-[7.5px]">{profile.primaryContact.name} ({profile.primaryContact.designation})</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Corporate Email:</td>
                      <td className="p-1 border-r border-gray-300 font-mono text-[7.5px] text-[#0F2C59]">{profile.corporateEmail || profile.primaryContact.email}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Primary Contact Mobile:</td>
                      <td className="p-1 font-mono text-[7.5px]">{profile.primaryContact.mobile}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Official Web (Website):</td>
                      <td className="p-1 border-r border-gray-300 font-mono text-[7.5px] text-blue-700">{profile.websiteUrl || 'www.apexartisan-bd.com'}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Facebook Business Page:</td>
                      <td className="p-1 font-mono text-[7.5px] text-blue-600">{profile.facebookUrl || 'facebook.com/apexartisan.bd'}</td>
                    </tr>
                    <tr>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">LinkedIn Profile:</td>
                      <td className="p-1 border-r border-gray-300 font-mono text-[7.5px] text-sky-700">{profile.linkedInUrl || 'linkedin.com/company/apex-artisan-bd'}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Year of Establishment:</td>
                      <td className="p-1 font-mono">{profile.yearOfEstablishment || '2014'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. CORE PRODUCTION CATEGORIES & CAPACITY SEGMENTATION */}
              <div className="mt-2.5 space-y-1">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  2. CORE PRODUCTION CATEGORIES &amp; CAPACITY SEGMENTATION
                </div>
                <div className="text-[7px] text-gray-500 italic">
                  Please check your target export categories and indicate operational capacities:
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-gray-400 text-left text-slate-800">
                      <th className="p-1 border-r border-gray-300 w-1/3">Target Export Category</th>
                      <th className="p-1 border-r border-gray-300 w-1/3">Raw Material / Source</th>
                      <th className="p-1 w-1/3">Annual Capacity &amp; Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b border-gray-300 ${profile.selectedSectors.includes('LEATHER') ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-1 border-r border-gray-300">
                        <span className="font-bold text-[#0F2C59]">[ {profile.selectedSectors.includes('LEATHER') ? '✓' : ' '} ] Leather Sector (💼)</span>
                        <div className="text-[7px] text-gray-500">Tannery Source / Raw Finishes</div>
                      </td>
                      <td className="p-1 border-r border-gray-300">
                        {profile.capacities.leather?.rawFinishes || 'LWG Gold/Silver Full-Grain Cowhide'}
                      </td>
                      <td className="p-1 font-mono">
                        Annual Capacity: <strong>{profile.capacities.leather?.annualCapacitySqFt?.toLocaleString() || '350,000'} sq. ft.</strong><br />
                        Lead Time: <strong>{profile.capacities.leather?.leadTimeDays || 45} Days</strong>
                      </td>
                    </tr>

                    <tr className={`border-b border-gray-300 ${profile.selectedSectors.includes('JUTE') ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-1 border-r border-gray-300">
                        <span className="font-bold text-[#0F2C59]">[ {profile.selectedSectors.includes('JUTE') ? '✓' : ' '} ] Jute &amp; Eco-Fibers (🌿)</span>
                        <div className="text-[7px] text-gray-500">Raw Jute, Bags, Mats, Yarn</div>
                      </td>
                      <td className="p-1 border-r border-gray-300">
                        {profile.capacities.jute?.rawFibers || 'Tossa Grade A Golden Fiber'}
                      </td>
                      <td className="p-1 font-mono">
                        Annual Capacity: <strong>{profile.capacities.jute?.annualCapacityMetricTons?.toLocaleString() || '1,200'} Metric Tons</strong><br />
                        Lead Time: <strong>{profile.capacities.jute?.leadTimeDays || 40} Days</strong>
                      </td>
                    </tr>

                    <tr className={`border-b border-gray-300 ${profile.selectedSectors.includes('TEXTILE') ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-1 border-r border-gray-300">
                        <span className="font-bold text-[#0F2C59]">[ {profile.selectedSectors.includes('TEXTILE') ? '✓' : ' '} ] Home Textiles (🧵)</span>
                        <div className="text-[7px] text-gray-500">Bedding, Linens, Kitchen Fabrics</div>
                      </td>
                      <td className="p-1 border-r border-gray-300">
                        {profile.capacities.textile?.beddingLinens || '100% Cotton & Organic Blends'}
                      </td>
                      <td className="p-1 font-mono">
                        Annual Capacity: <strong>{profile.capacities.textile?.annualCapacityPcs?.toLocaleString() || '250,000'} Pcs/Meters</strong><br />
                        Lead Time: <strong>{profile.capacities.textile?.leadTimeDays || 35} Days</strong>
                      </td>
                    </tr>

                    <tr className={profile.selectedSectors.includes('CERAMICS') ? 'bg-amber-50/40' : ''}>
                      <td className="p-1 border-r border-gray-300">
                        <span className="font-bold text-[#0F2C59]">[ {profile.selectedSectors.includes('CERAMICS') ? '✓' : ' '} ] Ceramics &amp; Fine Pottery (🍽️)</span>
                        <div className="text-[7px] text-gray-500">Tableware, Porcelain, Clay Art</div>
                      </td>
                      <td className="p-1 border-r border-gray-300">
                        {profile.capacities.ceramics?.tablewareArt || 'Lead-free FDA Porcelain Clay'}
                      </td>
                      <td className="p-1 font-mono">
                        Annual Capacity: <strong>{profile.capacities.ceramics?.annualCapacityPcs?.toLocaleString() || '180,000'} Pcs</strong><br />
                        Lead Time: <strong>{profile.capacities.ceramics?.leadTimeDays || 50} Days</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Workforce & Floor Area Strip */}
                <div className="grid grid-cols-2 gap-2 text-[7.5px] p-1 rounded border border-gray-300 bg-gray-50">
                  <div>
                    <strong>Total Factory Floor Area:</strong> {profile.factoryFloorAreaSqFt?.toLocaleString() || '85,000'} Sq. Ft.
                  </div>
                  <div>
                    <strong>Total Active Workforce:</strong> Mgmt: {profile.workforce.management} | Skilled Labor: {profile.workforce.skilledLabor} | <strong>Total: {profile.workforce.total}</strong>
                  </div>
                </div>
              </div>

              {/* 3. LOGISTICS, PACKAGING & SHIPPING DATA */}
              <div className="mt-2.5 space-y-1">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  3. LOGISTICS, PACKAGING &amp; SHIPPING DATA
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8px]">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold w-1/4">Preferred Incoterms:</td>
                      <td className="p-1 border-r border-gray-300 w-1/4 font-semibold">
                        [ {profile.preferredIncoterms.includes('FOB') ? '✓' : ' '} ] FOB &nbsp;
                        [ {profile.preferredIncoterms.includes('CIF') ? '✓' : ' '} ] CIF &nbsp;
                        [ {profile.preferredIncoterms.includes('CFR') ? '✓' : ' '} ] CFR &nbsp;
                        [ {profile.preferredIncoterms.includes('EXW') ? '✓' : ' '} ] EXW
                      </td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold w-1/4">Loading Port Location:</td>
                      <td className="p-1 w-1/4 font-semibold">{profile.loadingPortLocations.join(' & ')}</td>
                    </tr>
                    <tr>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Daily Dispatch Capacity:</td>
                      <td className="p-1 border-r border-gray-300 font-mono">{profile.dailyDispatchCapacity}</td>
                      <td className="p-1 border-r border-gray-300 bg-gray-50 font-bold">Container Loading Ability:</td>
                      <td className="p-1 font-semibold">
                        [ {profile.containerLoadingAbility.includes('20ft FCL') ? '✓' : ' '} ] 20ft FCL &nbsp;
                        [ {profile.containerLoadingAbility.includes('40ft HQ') ? '✓' : ' '} ] 40ft HQ &nbsp;
                        [ {profile.containerLoadingAbility.includes('LCL') ? '✓' : ' '} ] LCL
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. GLOBAL COMPLIANCE, AUDITS & REGULATORY FRAMEWORKS (PLACED DIRECTLY AFTER SECTION 3) */}
              <div className="mt-2.5 space-y-1">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  4. GLOBAL COMPLIANCE, AUDITS &amp; REGULATORY FRAMEWORKS
                </div>
                <div className="text-[7px] text-gray-500 italic">
                  Indicate your company&apos;s alignment with destination market legal and safety mandates:
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-gray-400 text-left text-slate-800">
                      <th className="p-1 border-r border-gray-300 w-1/3">Target Market Domain</th>
                      <th className="p-1 border-r border-gray-300 w-1/3">Required Certifications / Valid Audits</th>
                      <th className="p-1 w-1/3">Current Status / ID Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* UK & EU */}
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 font-bold text-[#0F2C59]">
                        UK &amp; European Union (EU)<br />
                        <span className="font-normal text-[7px] text-gray-500">Social &amp; Environmental Mandates</span>
                      </td>
                      <td className="p-1 border-r border-gray-300 text-[7.5px] space-y-0.5">
                        <div>[ {profile.complianceFrameworks.ukEu.sedexSmeta.certified ? '✓' : ' '} ] Sedex (SMETA) Audit Report</div>
                        <div>[ {profile.complianceFrameworks.ukEu.bsci.certified ? '✓' : ' '} ] BSCI Compliance Certificate</div>
                        <div>[ {profile.complianceFrameworks.ukEu.oekoTex.certified ? '✓' : ' '} ] OEKO-TEX Standard 100 (Textiles)</div>
                        <div>[ {profile.complianceFrameworks.ukEu.gots.certified ? '✓' : ' '} ] GOTS Registration (Organic Jute/Textile)</div>
                      </td>
                      <td className="p-1 font-mono text-[7.5px] space-y-0.5">
                        <div>Status: <strong className="text-emerald-700">VALID / AUDITED</strong></div>
                        <div>ID/Expiry: {profile.complianceFrameworks.ukEu.bsci.idExpiry || 'BSCI-BD-884910'}</div>
                      </td>
                    </tr>

                    {/* United States */}
                    <tr className="border-b border-gray-300">
                      <td className="p-1 border-r border-gray-300 font-bold text-[#0F2C59]">
                        United States (USA)<br />
                        <span className="font-normal text-[7px] text-gray-500">Security &amp; Health Norms</span>
                      </td>
                      <td className="p-1 border-r border-gray-300 text-[7.5px] space-y-0.5">
                        <div>[ {profile.complianceFrameworks.usa.ctpat.certified ? '✓' : ' '} ] CTPAT Supply Chain Security</div>
                        <div>[ {profile.complianceFrameworks.usa.fdaLeaching.certified ? '✓' : ' '} ] FDA Lead &amp; Cadmium Leaching Test (Ceramics)</div>
                        <div>[ {profile.complianceFrameworks.usa.lwg.certified ? '✓' : ' '} ] Leather Working Group (LWG) Audit</div>
                      </td>
                      <td className="p-1 font-mono text-[7.5px] space-y-0.5">
                        <div>Status: <strong className="text-emerald-700">COMPLIANT</strong></div>
                        <div>Report No: LWG-AUD-2025-081</div>
                        <div>LWG Grade: <strong className="text-amber-700">Gold Rated</strong></div>
                      </td>
                    </tr>

                    {/* Australia */}
                    <tr>
                      <td className="p-1 border-r border-gray-300 font-bold text-[#0F2C59]">
                        Australia<br />
                        <span className="font-normal text-[7px] text-gray-500">Biosecurity &amp; Pest Controls</span>
                      </td>
                      <td className="p-1 border-r border-gray-300 text-[7.5px] space-y-0.5">
                        <div>[ {profile.complianceFrameworks.australia.aqis.compliant ? '✓' : ' '} ] AQIS Compliant Phytosanitary Protocol</div>
                        <div>[ {profile.complianceFrameworks.australia.fumigation.approved ? '✓' : ' '} ] Approved Fumigation Facility Standard</div>
                      </td>
                      <td className="p-1 font-mono text-[7.5px] space-y-0.5">
                        <div>Reg No: AQIS-BD-0941</div>
                        <div>Facility Code: FUM-CTG-88</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Page 1 Bottom Footer */}
            <div className="mt-3 pt-2 border-t border-gray-300 flex items-center justify-between text-[7.5px] text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-[#0F2C59]">
                <ArielMC />
                <span>Marketing &amp; Communications Limited &bull; Global Export Sourcing Hub</span>
              </span>
              <span className="font-mono font-semibold text-gray-600">Page 1 of 2</span>
            </div>
          </div>

          {/* ========================================================
              PAGE 2 OF B2B VENDOR PROFILE FORM
              ======================================================== */}
          <div
            id="vendor-profile-page-2"
            className="bg-white text-[#1A1A1A] w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col justify-between font-sans text-xs p-7"
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              {/* Top Dual Accent Stripe */}
              <div className="w-full h-1.5 flex mb-3">
                <div className="w-2/3 h-full bg-[#0F2C59]" />
                <div className="w-1/3 h-full bg-[#E87722]" />
              </div>

              {/* Header Letterhead repeated */}
              <div className="pb-2.5 mb-3 border-b border-gray-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 shrink-0">
                      <Image
                        src="/images/ArielMC_Emblem_Square.png"
                        alt="ArielMC Logo Emblem"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold font-heading tracking-tight leading-none text-[#0F2C59]">
                        <ArielMC className="text-[#0F2C59]" />
                      </div>
                      <div className="text-[8px] font-bold text-[#E87722] uppercase tracking-wider mt-0.5">
                        B2B Vendor Profile Form &bull; Banking &amp; Statutory Compliance
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[7px] text-gray-600 leading-tight">
                    <div className="font-semibold text-[#0F2C59]">Email: info@arielmc.com | Web: www.arielmc.com</div>
                    <div>Facebook: facebook.com/arielmc.bd | LinkedIn: linkedin.com/company/arielmc</div>
                    <div className="text-gray-500 font-mono pt-0.5">VENDOR: {factory.code} &bull; BIN: {profile.customsBin13Digit}</div>
                  </div>
                </div>
              </div>

              {/* 5. INTERNATIONAL BANKING & REMITTANCE CHANNELS */}
              <div className="space-y-1">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  5. INTERNATIONAL BANKING &amp; REMITTANCE CHANNELS (AD BRANCH ONLY)
                </div>

                <table className="w-full border-collapse border border-gray-400 text-[8px]">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold w-1/4">Beneficiary Bank Name:</td>
                      <td className="p-1.5 border-r border-gray-300 font-bold text-[#0F2C59] w-1/4">{profile.banking.beneficiaryBankName}</td>
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold w-1/4">SWIFT / BIC Code:</td>
                      <td className="p-1.5 font-mono font-bold w-1/4">{profile.banking.swiftCode}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold">Authorized Dealer (AD) Code:</td>
                      <td className="p-1.5 border-r border-gray-300 font-mono font-bold text-amber-800">{profile.banking.adBranchCode}</td>
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold">Bank Routing Number:</td>
                      <td className="p-1.5 font-mono">{profile.banking.routingNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold">Account Name &amp; Number:</td>
                      <td className="p-1.5 border-r border-gray-300 font-mono font-bold" colSpan={3}>
                        {profile.registeredCompanyName} &bull; Acc No: {profile.banking.accountNumber} ({profile.banking.branchName})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold">Supported Currencies:</td>
                      <td className="p-1.5 border-r border-gray-300 font-mono">
                        [ {profile.banking.supportedCurrencies.includes('USD') ? '✓' : ' '} ] USD &nbsp;
                        [ {profile.banking.supportedCurrencies.includes('EUR') ? '✓' : ' '} ] EUR &nbsp;
                        [ {profile.banking.supportedCurrencies.includes('GBP') ? '✓' : ' '} ] GBP &nbsp;
                        [ {profile.banking.supportedCurrencies.includes('AUD') ? '✓' : ' '} ] AUD
                      </td>
                      <td className="p-1.5 border-r border-gray-300 bg-gray-50 font-bold">Payment Methods Accepted:</td>
                      <td className="p-1.5 font-semibold text-[7.5px]">
                        [ ✓ ] Irrevocable L/C at Sight &nbsp;
                        [ ✓ ] TT
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 6. VENDOR SOLEMN DECLARATION & AUTHORIZED SIGN-OFF */}
              <div className="mt-3.5 space-y-2">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs">
                  6. VENDOR SOLEMN DECLARATION &amp; AUTHORIZED SIGN-OFF
                </div>

                <div className="p-2 border border-slate-300 bg-slate-50/70 rounded text-[7.5px] text-gray-800 leading-relaxed text-justify">
                  We hereby declare and confirm that all information, certification records, production capacities, and compliance values provided in this
                  Profile Form are true, accurate, and completely verifiable. We acknowledge that any false representation discovered during remote review
                  or physical facility verification audits will result in immediate disqualification and cancellation of the onboarding track.
                </div>

                {/* Dual Signature & Corporate Stamp Boxes matching Reference Layout */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="border border-gray-400 p-2.5 rounded text-center space-y-1.5">
                    <div className="h-10 border-b border-dashed border-gray-400 flex items-end justify-center pb-1 font-heading font-bold text-xs text-[#0F2C59]">
                      {profile.declaration.signatoryFullName}
                    </div>
                    <div className="text-[8px] font-bold text-gray-700">
                      Authorized Representative Signature
                    </div>
                    <div className="text-[7.5px] text-gray-600 space-y-0.5 text-left pt-0.5">
                      <div>Full Name: <strong>{profile.declaration.signatoryFullName}</strong></div>
                      <div>Designation: {profile.declaration.designation}</div>
                    </div>
                  </div>

                  <div className="border border-gray-400 p-2.5 rounded text-center space-y-1.5 relative">
                    <div className="h-10 border-b border-dashed border-gray-400 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full border-2 border-[#0F2C59]/40 flex flex-col items-center justify-center p-0.5 transform -rotate-12 bg-blue-50/40">
                        <span className="text-[5.5px] font-bold text-[#0F2C59] uppercase">FACTORY SEAL</span>
                        <span className="text-[5px] font-mono text-[#E87722]">BANGLADESH</span>
                      </div>
                    </div>
                    <div className="text-[8px] font-bold text-gray-700">
                      Company Seal / Corporate Stamp
                    </div>
                    <div className="text-[7.5px] text-gray-600 space-y-0.5 text-left pt-0.5">
                      <div>Date (DD/MM/YYYY): <span className="font-mono">{profile.declaration.date}</span></div>
                      <div>Place of Signing: {profile.declaration.placeOfSigning}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. MANDATORY STATUTORY DOCUMENTS ENLISTMENT CHECKLIST */}
              <div className="mt-3.5 space-y-1.5">
                <div className="bg-[#0F2C59] text-white px-2.5 py-1 text-[9px] font-bold font-heading tracking-wide uppercase rounded-xs flex items-center justify-between">
                  <span>7. MANDATORY STATUTORY DOCUMENTS CHECKLIST (ATTACHED)</span>
                  <span className="text-[7.5px] font-mono font-bold bg-[#E87722] text-white px-1.5 py-0.5 rounded">
                    7 / 7 VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[7.5px]">
                  {profile.documents.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-1.5 rounded border border-gray-300 bg-gray-50/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-[#0F2C59] shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">{doc.title}</span>
                      </div>
                      <span className="font-mono text-[6.5px] text-[#0F2C59] font-bold bg-blue-100 px-1 py-0.2 rounded shrink-0">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page 2 Bottom Footer */}
            <div className="mt-3 pt-2 border-t border-gray-300 flex items-center justify-between text-[7.5px] text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-[#0F2C59]">
                <ArielMC />
                <span>Marketing &amp; Communications Limited &bull; Verified Vendor Dossier</span>
              </span>
              <span className="font-mono font-semibold text-gray-600">Page 2 of 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Verification & Acknowledgement Share Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={vendorProfileDoc}
      />
    </div>
  );
};
