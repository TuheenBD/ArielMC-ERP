'use client';

import React, { useState } from 'react';
import { SupplierFactory, VendorB2bProfile, VendorEnlistmentDocument, VendorEnlistmentDocType, ProductSector, VendorClassification } from '@/types/erp';
import {
  Building2,
  Factory,
  Upload,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  X,
  CreditCard,
  ShieldCheck,
  Ship,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  Check,
  Trash2,
  Eye,
  File,
  Mail,
  Globe,
  Share2
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { OfficialVendorProfilePdfModal } from './OfficialVendorProfilePdfModal';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

interface VendorEnlistmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnlistVendor: (newFactory: SupplierFactory) => void;
  initialFactory?: SupplierFactory | null;
}

export const VendorEnlistmentModal: React.FC<VendorEnlistmentModalProps> = ({
  isOpen,
  onClose,
  onEnlistVendor,
  initialFactory,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPreviewPdfOpen, setIsPreviewPdfOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 1. Company Basic Identity & Legal Profile
  const [vendorType, setVendorType] = useState<VendorClassification>(
    initialFactory?.vendorType || (initialFactory?.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY')
  );
  const [companyName, setCompanyName] = useState(initialFactory?.name || '');
  const [tradeLicenseNo, setTradeLicenseNo] = useState(initialFactory?.tradeLicenseNo || 'TRAD/SAV/004819/2026');
  const [ercNumber, setErcNumber] = useState(initialFactory?.epbRegistrationNo || 'ERC-0094819-EXP');
  const [customsBin, setCustomsBin] = useState(initialFactory?.binNumber || '001892837-0101');
  const [tinNumber, setTinNumber] = useState(initialFactory?.tinNumber || '8492817291');
  const [registeredOfficeAddress, setRegisteredOfficeAddress] = useState(
    initialFactory?.factoryAddress || 'House 14, Road 4, Sector 3, Uttara, Dhaka-1230'
  );
  const [factoryPlantAddress, setFactoryPlantAddress] = useState(
    initialFactory?.factoryAddress || 'Plot 42-45, Tannery Industrial Park, Hemayetpur, Savar, Dhaka'
  );
  const [managingDirectorName, setManagingDirectorName] = useState(initialFactory?.contactPerson || 'Engr. Mahfuzur Rahman');
  const [yearEstablished, setYearEstablished] = useState('2014');
  const [corporateEmail, setCorporateEmail] = useState(
    initialFactory?.email || initialFactory?.vendorProfile?.corporateEmail || 'export@apexartisan-bd.com'
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialFactory?.website || initialFactory?.vendorProfile?.websiteUrl || 'www.apexartisan-bd.com'
  );
  const [facebookUrl, setFacebookUrl] = useState(
    initialFactory?.facebookUrl || initialFactory?.vendorProfile?.facebookUrl || 'facebook.com/apexartisan.bd'
  );
  const [linkedInUrl, setLinkedInUrl] = useState(
    initialFactory?.linkedInUrl || initialFactory?.vendorProfile?.linkedInUrl || 'linkedin.com/company/apex-artisan-bd'
  );
  const [contactName, setContactName] = useState(initialFactory?.contactPerson || 'Engr. Mahfuzur Rahman');
  const [contactDesignation, setContactDesignation] = useState(initialFactory?.designation || 'General Manager (Compliance)');
  const [contactEmail, setContactEmail] = useState(initialFactory?.email || 'm.rahman@apexartisan-bd.com');
  const [contactPhone, setContactPhone] = useState(initialFactory?.phone || '+880 1711-482910');

  // 2. Core Production Categories & Capacity Segmentation
  const [selectedSectors, setSelectedSectors] = useState<ProductSector[]>(
    initialFactory?.sectors || ['LEATHER']
  );
  const [floorAreaSqFt, setFloorAreaSqFt] = useState<number>(85000);
  const [mgmtWorkforce, setMgmtWorkforce] = useState<number>(45);
  const [skilledWorkforce, setSkilledWorkforce] = useState<number>(480);
  const [annualCapacityLeather, setAnnualCapacityLeather] = useState<number>(350000);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(initialFactory?.leadTimeDays || 45);
  const [repeatOrderDays, setRepeatOrderDays] = useState<number>(30);
  const [moqUnits, setMoqUnits] = useState<number>(initialFactory?.minimumOrderQuantity || 300);

  // 3. Logistics, Packaging & Shipping Data
  const [incoterms, setIncoterms] = useState<('FOB' | 'CIF' | 'CFR' | 'EXW')[]>(['FOB', 'CIF']);
  const [loadingPorts, setLoadingPorts] = useState<string[]>([
    'Chattogram Seaport (Off-Dock ICD, CGP)',
    'Dhaka Hazrat Shahjalal Airport (DAC)'
  ]);
  const [dailyDispatch, setDailyDispatch] = useState('2,500 Pcs / 12 Metric Tons');
  const [containerAbility, setContainerAbility] = useState<('20ft FCL' | '40ft HQ' | 'LCL')[]>([
    '20ft FCL',
    '40ft HQ'
  ]);

  // 4. Global Compliance & Audits
  const [hasLwg, setHasLwg] = useState(true);
  const [lwgGrade, setLwgGrade] = useState<'Gold' | 'Silver' | 'Bronze' | 'Audited'>('Gold');
  const [hasBsci, setHasBsci] = useState(true);
  const [hasSedex, setHasSedex] = useState(true);
  const [hasOekoTex, setHasOekoTex] = useState(true);
  const [hasCtpat, setHasCtpat] = useState(true);
  const [hasFdaLeaching, setHasFdaLeaching] = useState(false);

  // 5. International Banking & Remittance Channels
  const [bankName, setBankName] = useState(initialFactory?.bankDetails.bankName || 'Eastern Bank PLC');
  const [branchName, setBranchName] = useState(initialFactory?.bankDetails.branch || 'Principal Corporate Branch, Dhaka');
  const [adBranchCode, setAdBranchCode] = useState(initialFactory?.bankDetails.adBranchCode || '0142');
  const [swiftCode, setSwiftCode] = useState(initialFactory?.bankDetails.swiftCode || 'EBLNBDDH');
  const [routingNumber, setRoutingNumber] = useState(initialFactory?.bankDetails.routingNumber || '090260012');
  const [accountNumber, setAccountNumber] = useState(initialFactory?.bankDetails.accountNumber || '1041060089214');

  // 6. Vendor Solemn Declaration
  const [declarationName, setDeclarationName] = useState(initialFactory?.contactPerson || 'Engr. Mahfuzur Rahman');
  const [declarationTitle, setDeclarationTitle] = useState(initialFactory?.designation || 'General Manager');
  const [placeOfSigning, setPlaceOfSigning] = useState('Dhaka, Bangladesh');
  const [isAgreed, setIsAgreed] = useState(true);

  // 7. Mandatory Statutory Document Uploads (The 7 requested items)
  const [documents, setDocuments] = useState<VendorEnlistmentDocument[]>([
    {
      id: 'doc-upload-1',
      docType: 'TRADE_LICENSE',
      title: 'Trade Licence (TIN/ETIN) Copy with Renewal',
      fileName: 'Trade_License_Renewal_2026_Certified.pdf',
      fileSize: '1.8 MB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'Valid until June 30, 2027. Savar Municipality Ward 4.',
    },
    {
      id: 'doc-upload-2',
      docType: 'CERTIFICATE_OF_INCORPORATION',
      title: 'Certificates of Incorporation (If LTD)',
      fileName: 'RJSC_Certificate_of_Incorporation_C-89214.pdf',
      fileSize: '2.4 MB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'RJSC Registration # C-89214/2014.',
    },
    {
      id: 'doc-upload-3',
      docType: 'NID_CERTIFICATE',
      title: 'NID Certificate',
      fileName: 'MD_Smart_NID_Verified_Copy.pdf',
      fileSize: '950 KB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'Smart NID 10-digit biometric verified.',
    },
    {
      id: 'doc-upload-4',
      docType: 'BIN_CERTIFICATE',
      title: 'BIN Certificate',
      fileName: 'NBR_Customs_13_Digit_BIN_001892837.pdf',
      fileSize: '1.1 MB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: '13-digit online VAT registration # 001892837-0101.',
    },
    {
      id: 'doc-upload-5',
      docType: 'BANK_SOLVENCY',
      title: 'Bank Solvency Statements',
      fileName: 'Eastern_Bank_PLC_Solvency_Certificate.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'Clean rating, BDT 50,000,000 credit limit verified.',
    },
    {
      id: 'doc-upload-6',
      docType: 'BANK_DETAIL',
      title: 'Bank Detail',
      fileName: 'EBL_AD_Branch_Remittance_Account_Sheet.pdf',
      fileSize: '780 KB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'AD Branch Code 0142, SWIFT: EBLNBDDH.',
    },
    {
      id: 'doc-upload-7',
      docType: 'CHEQUE_SCAN',
      title: 'Scan Copy of Cheque',
      fileName: 'Voided_Cheque_Leaf_Account_1041060089214.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2026-10-15',
      status: 'VERIFIED',
      mandatory: true,
      notes: 'MICR routing verified for BEFTN / RTGS / L/C clearing.',
    },
  ]);

  if (!isOpen) return null;

  // Toggle sector selection
  const toggleSector = (sec: ProductSector) => {
    if (selectedSectors.includes(sec)) {
      if (selectedSectors.length > 1) {
        setSelectedSectors(selectedSectors.filter((s) => s !== sec));
      }
    } else {
      setSelectedSectors([...selectedSectors, sec]);
    }
  };

  // Simulate file upload replacement
  const handleSimulateUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadedAt: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            }
          : d
      )
    );
  };

  // Compile full factory object
  const compileFactoryObject = (): SupplierFactory => {
    const code =
      initialFactory?.code ||
      (vendorType === 'SUPPLIER'
        ? `SUP-BD-${Math.floor(10 + Math.random() * 90)}`
        : vendorType === 'FULL_FLEDGED_FACTORY'
          ? `FAC-VRT-${Math.floor(10 + Math.random() * 90)}`
          : `FAC-BD-${Math.floor(10 + Math.random() * 90)}`);
    const defaultCompanyName =
      vendorType === 'SUPPLIER'
        ? 'Apex Artisan Global Sourcing Ltd'
        : vendorType === 'FULL_FLEDGED_FACTORY'
          ? 'Apex Artisan Integrated Tannery & Leatherworks Ltd'
          : 'Apex Artisan Leatherworks Ltd';
    const compiledProfile: VendorB2bProfile = {
      vendorType,
      registeredCompanyName: companyName || defaultCompanyName,
      tradeLicenseNo,
      ercNumber,
      customsBin13Digit: customsBin,
      tinNumber,
      registeredOfficeAddress,
      factoryPlantAddress,
      managingDirectorName,
      yearOfEstablishment: yearEstablished,
      websiteUrl,
      corporateEmail,
      facebookUrl,
      linkedInUrl,
      primaryContact: {
        name: contactName,
        designation: contactDesignation,
        email: contactEmail,
        mobile: contactPhone,
      },
      authorizedSignatory: {
        name: contactName,
        designation: contactDesignation,
        email: contactEmail,
        mobile: contactPhone,
      },
      selectedSectors,
      factoryFloorAreaSqFt: floorAreaSqFt,
      workforce: {
        management: mgmtWorkforce,
        skilledLabor: skilledWorkforce,
        total: mgmtWorkforce + skilledWorkforce,
      },
      capacities: {
        leather: {
          rawFinishes: 'Full-Grain Cowhide, Vegetable & Chrome-Tanned',
          annualCapacitySqFt: annualCapacityLeather,
          leadTimeDays,
        },
      },
      leadTimes: {
        initialOrderDays: leadTimeDays,
        repeatOrderDays,
      },
      preferredIncoterms: incoterms,
      loadingPortLocations: loadingPorts,
      dailyDispatchCapacity: dailyDispatch,
      containerLoadingAbility: containerAbility,
      complianceFrameworks: {
        ukEu: {
          sedexSmeta: { certified: hasSedex, idExpiry: 'SEDEX-2027' },
          bsci: { certified: hasBsci, idExpiry: 'BSCI-A-2027' },
          oekoTex: { certified: hasOekoTex, idExpiry: 'OEKO-TEX-100' },
          gots: { certified: false },
        },
        usa: {
          ctpat: { certified: hasCtpat, status: 'Tier 2 Certified' },
          fdaLeaching: { certified: hasFdaLeaching },
          lwg: { certified: hasLwg, grade: lwgGrade },
        },
        australia: {
          aqis: { compliant: true, regNo: 'AQIS-BD-0941' },
          fumigation: { approved: true, facilityCode: 'FUM-CTG-88' },
        },
      },
      banking: {
        beneficiaryBankName: bankName,
        branchName,
        adBranchCode,
        swiftCode,
        routingNumber,
        accountNumber,
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
        signatoryFullName: declarationName,
        designation: declarationTitle,
        date: new Date().toISOString().split('T')[0],
        placeOfSigning,
        isSigned: isAgreed,
      },
      documents,
    };

    return {
      id: initialFactory?.id || `fac_${Date.now()}`,
      code,
      name: companyName || defaultCompanyName,
      vendorType,
      website: websiteUrl,
      facebookUrl,
      linkedInUrl,
      sectors: selectedSectors,
      cluster: vendorType === 'SUPPLIER' ? 'Commercial Trade District, Dhaka' : 'Hemayetpur Tannery Estate, Savar',
      factoryAddress: factoryPlantAddress,
      contactPerson: contactName,
      designation: contactDesignation,
      phone: contactPhone,
      email: corporateEmail || contactEmail,
      tradeLicenseNo,
      binNumber: customsBin,
      tinNumber,
      epbRegistrationNo: ercNumber,
      tier: 'TIER_1_PREFERRED',
      capacity: {
        monthlyCapacityUnits: Math.floor(annualCapacityLeather / 12),
        allocatedUnits: Math.floor((annualCapacityLeather / 12) * 0.7),
        activeLines: 8,
        machineryList: [
          'Durkopp Adler Heavy Duty Lockstitch Lines',
          'Atom CNC Automatic Die Cutting Tables',
          'Camoga Bandknife Splitting Units',
        ],
      },
      scorecard: initialFactory?.scorecard || {
        onTimeDeliveryPct: 98.4,
        aqlPassRatePct: 99.1,
        ratingScore: 4.9,
        priceCompetitiveness: 4.7,
      },
      complianceAudits: [
        {
          id: 'aud-lwg-01',
          standardName: 'Leather Working Group (LWG)',
          status: 'VALID',
          ratingGrade: `${lwgGrade} Rated Tannery`,
          auditBody: 'Eurofins / BLC Leather Tech',
          validUntil: '2027-08-30',
          reportNumber: 'LWG-AUD-2025-081',
        },
      ],
      leadTimeDays,
      minimumOrderQuantity: moqUnits,
      paymentTerms: 'Confirmed L/C at Sight / 30% TT Deposit',
      bankDetails: {
        bankName,
        branch: branchName,
        routingNumber,
        accountNumber,
        swiftCode,
        adBranchCode,
      },
      associatedSkus: initialFactory?.associatedSkus || [],
      vendorProfile: compiledProfile,
      enlistmentDocuments: documents,
    };
  };

  const handleSaveAndEnlist = (e: React.FormEvent) => {
    e.preventDefault();
    const compiled = compileFactoryObject();
    onEnlistVendor(compiled);
    onClose();
  };

  const currentCompiledFactory = compileFactoryObject();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden text-white">
          
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#162B22] border-b-2 border-[#C8A96A] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A]">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 font-bold uppercase tracking-wider">
                    VENDOR ONBOARDING &bull; GLOBAL EXPORT
                  </span>
                  <span className="text-xs text-[#CFE0D5] font-medium">B2B Vendor Profile &amp; Statutory Enlistment</span>
                </div>
                <h2 className="text-lg font-bold font-heading text-white mt-0.5 flex items-center gap-1.5">
                  <ArielMC />
                  <span>Vendor Detail Entry &amp; Enlistment Workflow</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewPdfOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-[#C8A96A]/40 text-xs font-bold text-[#C8A96A] transition-all"
                title="Preview printable 2-page B2B Vendor Profile Form PDF"
              >
                <Printer className="w-4 h-4" />
                <span>Preview PDF Form</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all border border-emerald-400/30 cursor-pointer"
                title="Share Vendor Enlistment Dossier for Verification & Acknowledgement"
              >
                <Share2 className="w-4 h-4 text-emerald-100" />
                <span>Share (Verify / Ack)</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Step Navigation Ribbon */}
          <div className="px-6 py-2.5 bg-[#0D1913] border-b border-[#2C5240] flex items-center justify-between overflow-x-auto text-xs shrink-0">
            {[
              { num: 1, label: '1. Basic Identity' },
              { num: 2, label: '2. Capacity & Sectors' },
              { num: 3, label: '3. Logistics & Ports' },
              { num: 4, label: '4. Compliance Audits' },
              { num: 5, label: '5. AD Banking' },
              { num: 6, label: '6. Document Uploads (7)' },
              { num: 7, label: '7. Declaration' },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  activeStep === st.num
                    ? 'bg-[#1F3A2E] text-[#C8A96A] border border-[#C8A96A]/40 font-bold shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeStep === st.num ? 'bg-[#C8A96A] text-[#1F3A2E]' : 'bg-white/10 text-gray-300'
                }`}>
                  {st.num}
                </span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Form Body Container */}
          <form onSubmit={handleSaveAndEnlist} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* STEP 1: COMPANY BASIC IDENTITY & LEGAL PROFILE */}
            {activeStep === 1 && (
              <div className="space-y-5 max-w-4xl mx-auto">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 1: Company Basic Identity &amp; Legal Profile
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Select vendor entity classification and enter registered corporate, digital, and legal credentials in accordance with RJSC and NBR Bangladesh.
                  </p>
                </div>

                {/* Vendor Entity Type Selection: 3-Tier Classification */}
                <div className="bg-[#0D1913] border-2 border-[#2C5240] rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#C8A96A] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Vendor Entity Classification *</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Selected: <strong className="text-white uppercase">{vendorType.replace(/_/g, ' ')}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {/* 1. Full-Fledged Factory */}
                    <button
                      type="button"
                      onClick={() => setVendorType('FULL_FLEDGED_FACTORY')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        vendorType === 'FULL_FLEDGED_FACTORY'
                          ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-2 ring-[#C8A96A]/70 shadow-lg'
                          : 'bg-[#12231B] border-[#2C5240] text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-xl shrink-0 ${vendorType === 'FULL_FLEDGED_FACTORY' ? 'bg-[#C8A96A]/20 text-[#C8A96A]' : 'bg-black/30 text-gray-400'}`}>
                          🏭
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white flex items-center gap-1.5 flex-wrap">
                            <span>Full-Fledged Factory</span>
                            {vendorType === 'FULL_FLEDGED_FACTORY' && (
                              <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] font-extrabold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#C8A96A] font-medium mt-0.5">
                            Own Raw Materials &bull; In-House Production
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* 2. Factory (Manufacturer) */}
                    <button
                      type="button"
                      onClick={() => setVendorType('FACTORY')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        vendorType === 'FACTORY'
                          ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-2 ring-[#C8A96A]/70 shadow-lg'
                          : 'bg-[#12231B] border-[#2C5240] text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-xl shrink-0 ${vendorType === 'FACTORY' ? 'bg-[#C8A96A]/20 text-[#C8A96A]' : 'bg-black/30 text-gray-400'}`}>
                          🏗️
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white flex items-center gap-1.5 flex-wrap">
                            <span>Factory (Manufacturer)</span>
                            {vendorType === 'FACTORY' && (
                              <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] font-extrabold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#86EFAC] font-medium mt-0.5">
                            Open Market Raw Materials &bull; Finished Goods
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* 3. Supplier */}
                    <button
                      type="button"
                      onClick={() => setVendorType('SUPPLIER')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        vendorType === 'SUPPLIER'
                          ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-2 ring-[#C8A96A]/70 shadow-lg'
                          : 'bg-[#12231B] border-[#2C5240] text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-xl shrink-0 ${vendorType === 'SUPPLIER' ? 'bg-[#C8A96A]/20 text-[#C8A96A]' : 'bg-black/30 text-gray-400'}`}>
                          🏢
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white flex items-center gap-1.5 flex-wrap">
                            <span>Supplier</span>
                            {vendorType === 'SUPPLIER' && (
                              <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] font-extrabold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-blue-300 font-medium mt-0.5">
                            Finished Goods Collection &bull; Sourcing
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Company Legal Identity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">
                      Registered Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={
                        vendorType === 'SUPPLIER'
                          ? 'e.g. Apex Artisan Global Sourcing Ltd'
                          : vendorType === 'FULL_FLEDGED_FACTORY'
                            ? 'e.g. Apex Artisan Integrated Tannery & Leatherworks Ltd'
                            : 'e.g. Apex Artisan Leatherworks Ltd'
                      }
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Trade License No (City Corp / Municipality) *</label>
                    <input
                      type="text"
                      required
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                      placeholder="e.g. TRAD/SAV/004819/2026"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Customs 13-Digit BIN (Business ID Number) *</label>
                    <input
                      type="text"
                      required
                      value={customsBin}
                      onChange={(e) => setCustomsBin(e.target.value)}
                      placeholder="e.g. 001892837-0101"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Export Registration Certificate (ERC) No *</label>
                    <input
                      type="text"
                      required
                      value={ercNumber}
                      onChange={(e) => setErcNumber(e.target.value)}
                      placeholder="e.g. ERC-0094819-EXP"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 font-semibold block mb-1">Registered Head Office Address *</label>
                    <input
                      type="text"
                      required
                      value={registeredOfficeAddress}
                      onChange={(e) => setRegisteredOfficeAddress(e.target.value)}
                      placeholder="Corporate registered office address in Bangladesh"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 font-semibold block mb-1">
                      {vendorType === 'SUPPLIER' ? 'Operating Facility / Warehouse Address *' : 'Factory / Physical Plant Address *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={factoryPlantAddress}
                      onChange={(e) => setFactoryPlantAddress(e.target.value)}
                      placeholder="Plot & Industrial Cluster Address (e.g. Savar Tannery Estate / Gazipur / Uttara)"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Managing Director / CEO Full Name *</label>
                    <input
                      type="text"
                      required
                      value={managingDirectorName}
                      onChange={(e) => setManagingDirectorName(e.target.value)}
                      placeholder="e.g. Engr. Mahfuzur Rahman"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">TIN (e-TIN 12-Digit) *</label>
                    <input
                      type="text"
                      required
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      placeholder="e.g. 8492817291"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Commercial Contact Person &amp; Title</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Primary contact person name"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Contact Mobile &amp; WhatsApp</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 1711-482910"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>

                {/* Digital & Social Communication Channels: Email, Web, Facebook, LinkedIn */}
                <div className="bg-[#0D1913] border border-[#2C5240] rounded-xl p-4 space-y-3">
                  <div className="border-b border-[#2C5240] pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#C8A96A] font-bold text-xs uppercase tracking-wide">
                      <Globe className="w-4 h-4 text-[#C8A96A]" />
                      <span>Corporate Communication &amp; Social Channels</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Printed on Official Vendor Profile Form
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Email */}
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span>Corporate Email *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={corporateEmail}
                        onChange={(e) => setCorporateEmail(e.target.value)}
                        placeholder="e.g. export@apexartisan-bd.com"
                        className="w-full bg-[#12231B] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A] font-mono"
                      />
                    </div>

                    {/* Web */}
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>Official Web (Website URL) *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="e.g. www.apexartisan-bd.com"
                        className="w-full bg-[#12231B] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A] font-mono"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1 flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                          f
                        </span>
                        <span>Facebook Business Page URL</span>
                      </label>
                      <input
                        type="text"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="e.g. facebook.com/apexartisan.bd"
                        className="w-full bg-[#12231B] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A] font-mono"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1 flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded bg-[#0A66C2] text-white flex items-center justify-center text-[9px] font-bold">
                          in
                        </span>
                        <span>LinkedIn Company Profile URL</span>
                      </label>
                      <input
                        type="text"
                        value={linkedInUrl}
                        onChange={(e) => setLinkedInUrl(e.target.value)}
                        placeholder="e.g. linkedin.com/company/apex-artisan-bd"
                        className="w-full bg-[#12231B] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CORE PRODUCTION CATEGORIES & CAPACITY SEGMENTATION */}
            {activeStep === 2 && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 2: Core Production Categories &amp; Capacity Segmentation
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Select manufacturing industry sectors and specify verified monthly output volumes.
                  </p>
                </div>

                {/* Sector Selector Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleSector('LEATHER')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSectors.includes('LEATHER')
                        ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                        : 'bg-[#0D1913] border-[#2C5240] text-gray-400'
                    }`}
                  >
                    <div className="text-lg">💼</div>
                    <div className="font-bold text-white mt-1">Leather Goods</div>
                    <div className="text-[10px] text-[#C8A96A]">Bags, Briefcases, Small Leather Goods</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSector('JUTE')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSectors.includes('JUTE')
                        ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                        : 'bg-[#0D1913] border-[#2C5240] text-gray-400'
                    }`}
                  >
                    <div className="text-lg">🌿</div>
                    <div className="font-bold text-white mt-1">Jute &amp; Fibers</div>
                    <div className="text-[10px] text-[#C8A96A]">Totes, Hessian, Mats, Biodegradable</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSector('TEXTILE')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSectors.includes('TEXTILE')
                        ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                        : 'bg-[#0D1913] border-[#2C5240] text-gray-400'
                    }`}
                  >
                    <div className="text-lg">🧵</div>
                    <div className="font-bold text-white mt-1">Home Textiles</div>
                    <div className="text-[10px] text-[#C8A96A]">Bedding, Linens, Organic Cotton</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSector('CERAMICS')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSectors.includes('CERAMICS')
                        ? 'bg-[#1F3A2E] border-[#C8A96A] text-white ring-1 ring-[#C8A96A]'
                        : 'bg-[#0D1913] border-[#2C5240] text-gray-400'
                    }`}
                  >
                    <div className="text-lg">🍽️</div>
                    <div className="font-bold text-white mt-1">Ceramics &amp; Pottery</div>
                    <div className="text-[10px] text-[#C8A96A]">Fine Tableware, Porcelain, Terracotta</div>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Total Factory Floor Area (Sq. Ft.)</label>
                    <input
                      type="number"
                      value={floorAreaSqFt}
                      onChange={(e) => setFloorAreaSqFt(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Skilled Production Workforce</label>
                    <input
                      type="number"
                      value={skilledWorkforce}
                      onChange={(e) => setSkilledWorkforce(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Management / QA Staff</label>
                    <input
                      type="number"
                      value={mgmtWorkforce}
                      onChange={(e) => setMgmtWorkforce(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Annual Capacity (sq. ft. / Pcs)</label>
                    <input
                      type="number"
                      value={annualCapacityLeather}
                      onChange={(e) => setAnnualCapacityLeather(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Standard Initial Lead Time (Days)</label>
                    <input
                      type="number"
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Minimum Order Qty (MOQ Units)</label>
                    <input
                      type="number"
                      value={moqUnits}
                      onChange={(e) => setMoqUnits(Number(e.target.value))}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LOGISTICS, PACKAGING & SHIPPING DATA */}
            {activeStep === 3 && (
              <div className="space-y-4 max-w-4xl mx-auto text-xs">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 3: Logistics, Packaging &amp; Shipping Data
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Incoterms, loading port connectivity, container loading abilities, and dispatch capacity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-2">Accepted Incoterms</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['FOB', 'CIF', 'CFR', 'EXW'].map((term) => (
                        <label key={term} className="flex items-center gap-2 p-2 rounded-lg bg-[#0D1913] border border-[#2C5240] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={incoterms.includes(term as any)}
                            onChange={() => {
                              if (incoterms.includes(term as any)) {
                                setIncoterms(incoterms.filter((t) => t !== term));
                              } else {
                                setIncoterms([...incoterms, term as any]);
                              }
                            }}
                            className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                          />
                          <span className="font-mono font-bold text-white">{term}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-2">Container Loading Ability</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['20ft FCL', '40ft HQ', 'LCL'].map((ctn) => (
                        <label key={ctn} className="flex items-center gap-2 p-2 rounded-lg bg-[#0D1913] border border-[#2C5240] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={containerAbility.includes(ctn as any)}
                            onChange={() => {
                              if (containerAbility.includes(ctn as any)) {
                                setContainerAbility(containerAbility.filter((c) => c !== ctn));
                              } else {
                                setContainerAbility([...containerAbility, ctn as any]);
                              }
                            }}
                            className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                          />
                          <span className="font-mono text-white text-[11px]">{ctn}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 font-semibold block mb-1">Primary Loading Ports &amp; ICDs</label>
                    <input
                      type="text"
                      value={loadingPorts.join(', ')}
                      onChange={(e) => setLoadingPorts(e.target.value.split(',').map((s) => s.trim()))}
                      placeholder="e.g. Chattogram Seaport (Off-Dock ICD, CGP), Dhaka Airport (DAC)"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 font-semibold block mb-1">Daily Ex-Factory Dispatch Capacity</label>
                    <input
                      type="text"
                      value={dailyDispatch}
                      onChange={(e) => setDailyDispatch(e.target.value)}
                      placeholder="e.g. 2,500 Pcs / 12 Metric Tons per day"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: GLOBAL COMPLIANCE, AUDITS & REGULATORY FRAMEWORKS */}
            {activeStep === 4 && (
              <div className="space-y-4 max-w-4xl mx-auto text-xs">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 4: Global Compliance, Audits &amp; Regulatory Frameworks
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Declare certifications required for UK, EU, USA, and Australian export destinations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Leather Working Group */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasLwg}
                        onChange={(e) => setHasLwg(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>Leather Working Group (LWG) Audit</span>
                    </label>
                    {hasLwg && (
                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-gray-400">Awarded Grade:</span>
                        <select
                          value={lwgGrade}
                          onChange={(e: any) => setLwgGrade(e.target.value)}
                          className="bg-black border border-[#2C5240] rounded-lg px-2 py-1 text-[#C8A96A] font-bold"
                        >
                          <option value="Gold">Gold Rated Tannery</option>
                          <option value="Silver">Silver Rated</option>
                          <option value="Bronze">Bronze Rated</option>
                          <option value="Audited">Audited</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* BSCI */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasBsci}
                        onChange={(e) => setHasBsci(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>amfori BSCI Social Audit (Grade A / B)</span>
                    </label>
                    <div className="text-[10px] text-gray-400">
                      Standard for EU / UK social compliance, labor rights, and working hour limits.
                    </div>
                  </div>

                  {/* Sedex SMETA */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasSedex}
                        onChange={(e) => setHasSedex(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>Sedex SMETA 4-Pillar Ethical Audit</span>
                    </label>
                    <div className="text-[10px] text-gray-400">
                      Required by high-street department stores (Harrods, Selfridges, Marks &amp; Spencer).
                    </div>
                  </div>

                  {/* OEKO-TEX */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasOekoTex}
                        onChange={(e) => setHasOekoTex(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>OEKO-TEX Standard 100 / EU REACH (Annex XVII)</span>
                    </label>
                    <div className="text-[10px] text-gray-400">
                      Chromium VI &lt;3.0 mg/kg, zero azo dyes, nickel-free brass hardware.
                    </div>
                  </div>

                  {/* CTPAT */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasCtpat}
                        onChange={(e) => setHasCtpat(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>CTPAT Supply Chain Security (US Customs)</span>
                    </label>
                    <div className="text-[10px] text-gray-400">
                      Perimeter security, 7-point container inspection protocols for US exports.
                    </div>
                  </div>

                  {/* FDA Food-Grade */}
                  <div className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                      <input
                        type="checkbox"
                        checked={hasFdaLeaching}
                        onChange={(e) => setHasFdaLeaching(e.target.checked)}
                        className="rounded border-[#2C5240] bg-black text-[#C8A96A]"
                      />
                      <span>FDA Lead &amp; Cadmium Leaching Test (Ceramics)</span>
                    </label>
                    <div className="text-[10px] text-gray-400">
                      Mandatory for all food-contact tableware and glazed ceramic exports.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: INTERNATIONAL BANKING & REMITTANCE CHANNELS */}
            {activeStep === 5 && (
              <div className="space-y-4 max-w-4xl mx-auto text-xs">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 5: International Banking &amp; Remittance Channels (AD Branch Only)
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Authorized Dealer (AD) branch details for Back-to-Back L/C issuance and foreign currency clearing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Beneficiary Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Eastern Bank PLC"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Corporate Branch &amp; AD Code *</label>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="e.g. Principal Corporate Branch, Dhaka (AD Code: 0142)"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">SWIFT / BIC Code *</label>
                    <input
                      type="text"
                      required
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      placeholder="e.g. EBLNBDDH"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Routing Transit Number (9-Digit) *</label>
                    <input
                      type="text"
                      required
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="e.g. 090260012"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 font-semibold block mb-1">Export Account Number (FCY / BDT Clearing) *</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 1041060089214"
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: MANDATORY STATUTORY DOCUMENT UPLOADS (THE 7 ITEMS) */}
            {activeStep === 6 && (
              <div className="space-y-4 max-w-4xl mx-auto text-xs">
                <div className="border-b border-[#2C5240] pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                      Section 6: Mandatory Statutory Document Uploads
                    </h3>
                    <p className="text-xs text-[#CFE0D5]">
                      Upload high-resolution scans of all 7 mandatory enlistment documents for legal audit.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/30">
                    {documents.filter((d) => d.status === 'VERIFIED').length} of {documents.length} Uploaded
                  </span>
                </div>

                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl bg-[#0D1913] border border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#C8A96A]/60 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#1F3A2E] text-[#C8A96A] shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{idx + 1}. {doc.title}</span>
                            {doc.mandatory && (
                              <span className="text-[9px] text-rose-400 font-bold uppercase">* Required</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                            <span>{doc.fileName}</span>
                            <span>&bull;</span>
                            <span>{doc.fileSize}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-400 flex items-center gap-1 font-sans">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{doc.status}</span>
                            </span>
                          </div>
                          {doc.notes && (
                            <div className="text-[10px] text-gray-500 mt-0.5">{doc.notes}</div>
                          )}
                        </div>
                      </div>

                      {/* Upload / Replace Action Button */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all">
                          <Upload className="w-3.5 h-3.5 text-[#C8A96A]" />
                          <span>Replace / Re-upload</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => handleSimulateUpload(doc.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: VENDOR SOLEMN DECLARATION & SIGN-OFF */}
            {activeStep === 7 && (
              <div className="space-y-4 max-w-4xl mx-auto text-xs">
                <div className="border-b border-[#2C5240] pb-2">
                  <h3 className="font-heading font-bold text-base text-[#C8A96A] uppercase tracking-wide">
                    Section 7: Vendor Solemn Declaration &amp; Authorized Sign-off
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Final legal verification under international procurement and export covenants.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-[#C8A96A]/40 text-amber-200 text-xs leading-relaxed">
                  <p className="font-semibold mb-2">SOLEMN DECLARATION UNDERTAKING:</p>
                  <p>
                    &quot;We hereby declare and confirm that all information, certification records, production capacities, and compliance values provided in this Profile Form are true, accurate, and completely verifiable. We acknowledge that any false representation discovered during remote review or physical facility verification audits will result in immediate disqualification and cancellation of the onboarding track.&quot;
                  </p>
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0D1913] border border-[#2C5240] cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2C5240] bg-black text-[#C8A96A]"
                  />
                  <span className="font-bold text-white">
                    I, on behalf of the registered vendor company, certify and agree to the declaration above.
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Signatory Full Name *</label>
                    <input
                      type="text"
                      required
                      value={declarationName}
                      onChange={(e) => setDeclarationName(e.target.value)}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Designation / Title *</label>
                    <input
                      type="text"
                      required
                      value={declarationTitle}
                      onChange={(e) => setDeclarationTitle(e.target.value)}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1">Place of Execution *</label>
                    <input
                      type="text"
                      required
                      value={placeOfSigning}
                      onChange={(e) => setPlaceOfSigning(e.target.value)}
                      className="w-full bg-[#0D1913] border border-[#2C5240] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Navigation Buttons */}
            <div className="pt-4 border-t border-[#2C5240] flex items-center justify-between">
              <div>
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white border border-[#C8A96A]/40 text-xs font-bold"
                  >
                    <span>Next: Step {activeStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1F3A2E] text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Enlistment &amp; Save Vendor</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Official 2-Page Vector PDF Modal */}
      {isPreviewPdfOpen && (
        <OfficialVendorProfilePdfModal
          isOpen={isPreviewPdfOpen}
          onClose={() => setIsPreviewPdfOpen(false)}
          factory={currentCompiledFactory}
        />
      )}

      {/* Official Verification & Acknowledgement Share Modal */}
      {isShareModalOpen && (
        <ShareDocumentModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          document={{
            id: `doc-enlist-${currentCompiledFactory.id}`,
            title: `Official B2B Vendor Profile & Enlistment Dossier — ${currentCompiledFactory.name || 'Vendor Profile'}`,
            docCode: `VPD-${currentCompiledFactory.code || 'PENDING'}`,
            documentNumber: currentCompiledFactory.code || 'VPD-2026',
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
          }}
        />
      )}
    </>
  );
};
