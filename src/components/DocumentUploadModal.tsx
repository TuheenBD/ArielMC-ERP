'use client';

import React, { useState } from 'react';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { DocumentSection, OfficialDocument, RenewalTask, ComplianceChecklistItem } from '@/types/documentPortal';
import {
  UploadCloud,
  X,
  FileText,
  Calendar,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ShieldAlert,
  FileCheck2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: OfficialDocument) => void;
  companies: CompanyEntity[];
  preSelectedStation?: EntityCode;
  preSelectedSection?: DocumentSection;
  initialChecklistItem?: ComplianceChecklistItem;
}

// Pre-configured major document templates from Bangladesh Legal Compliance Blueprint (Items 1-34)
const STATUTORY_DOCUMENT_TEMPLATES = [
  // 1. Foundational Corporate
  {
    title: 'RJSC Certificate of Incorporation & Form XII',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Corporate Statutory & Legal Constitution',
    issuingAuthority: 'Registrar of Joint Stock Companies and Firms (RJSC)',
    leadDays: 30,
    defaultNotes: 'Certified true copy of Certificate of Incorporation, Memorandum & Articles of Association (specifying international trade), and current Form XII board of directors schedule.',
    taskTitle: 'File RJSC Annual Return (Schedule X) with Audited Balance Sheet',
    assignedRole: 'Head of Legal & Corporate Affairs',
  },
  {
    title: 'Municipal Trade License',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Municipal Operating License',
    issuingAuthority: 'Dhaka City Corporation (DNCC / DSCC)',
    leadDays: 7,
    defaultNotes: 'Commercial trade license on verified commercial lease agreement for cross-border export sourcing.',
    taskTitle: 'Urgent: Deposit Trade License Renewal Challan & Obtain Sticker',
    assignedRole: 'Admin & Statutory Liaison Lead',
  },
  {
    title: 'NBR Electronic Taxpayer Identification Number (e-TIN)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Corporate Income Tax',
    issuingAuthority: 'National Board of Revenue (NBR), Taxes Zone 05',
    leadDays: 30,
    defaultNotes: '12-digit corporate TIN issued by NBR, alongside individual TINs for all company directors.',
    taskTitle: 'Obtain Annual Tax Clearance Certificate after Audit Submission',
    assignedRole: 'Chief Financial Officer',
  },
  {
    title: 'NBR 13-Digit BIN / VAT Registration (Form VAT 2.8)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Tax & VAT Statutory Registry',
    issuingAuthority: 'NBR Customs, Excise & VAT Commissionerate',
    leadDays: 30,
    defaultNotes: '13-digit BIN certificate mandatory for customs clearing, zero-rated export declarations, and banking transactions.',
    taskTitle: 'Submit Monthly VAT Return (Mushak 9.1) on NBR Portal',
    assignedRole: 'Taxation & VAT Manager',
  },
  {
    title: 'Corporate AD Bank Account & Solvency Certificate',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Corporate Treasury & FX Facility',
    issuingAuthority: 'Authorized Dealer Commercial Bank (Eastern Bank PLC / SCB)',
    leadDays: 14,
    defaultNotes: 'Corporate current account with Authorized Dealer (AD) license and formal Bank Solvency Certificate.',
    taskTitle: 'Annual Bank KYC & Corporate Credit Line Review',
    assignedRole: 'Head of Treasury',
  },

  // 2. Core Export Trade
  {
    title: 'CCI&E Export Registration Certificate (ERC)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Customs & Cross-Border Regulatory Clearance',
    issuingAuthority: 'Chief Controller of Imports and Exports (CCI&E via OLM)',
    leadDays: 30,
    defaultNotes: 'Mandatory legal permit required to export physical merchandise from Bangladesh via Online Licensing Module.',
    taskTitle: 'Renew ERC Passbook Endorsement on OLM for New Fiscal Year',
    assignedRole: 'Commercial & Customs Manager',
  },
  {
    title: 'Chamber of Commerce Membership (DCCI / MCCI / CCCI)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Chamber of Commerce & Global Trade',
    issuingAuthority: 'Dhaka Chamber of Commerce & Industry (DCCI)',
    leadDays: 30,
    defaultNotes: 'Accredited Chamber of Commerce membership required as mandatory prerequisite for ERC renewal and Certificate of Origin (CoO).',
    taskTitle: 'Pay Annual DCCI Chamber Subscription & Update Representative List',
    assignedRole: 'Corporate Secretary',
  },
  {
    title: 'Export Promotion Bureau (EPB) Enrolment & REX Registration',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Export Association & Sector Guild',
    issuingAuthority: 'Export Promotion Bureau (EPB) & European Commission',
    leadDays: 30,
    defaultNotes: 'EPB enrolment and Registered Exporter System (REX) number for self-certifying duty-free origin under EU EBA and UK DCTS.',
    taskTitle: 'File Annual Export Volume Statement with EPB',
    assignedRole: 'Export Logistics Lead',
  },

  // 3. B2C & Cross-Border E-Commerce
  {
    title: 'Digital Business Identification (DBID)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'E-Commerce & Digital Trade Regulation',
    issuingAuthority: 'Ministry of Commerce (MoC), Bangladesh',
    leadDays: 30,
    defaultNotes: 'Mandatory registration for online storefronts, digital export portals, and cross-border e-commerce (Amazon, Etsy, Shopify).',
    taskTitle: 'Annual DBID Digital Platform Verification Audit',
    assignedRole: 'E-Commerce Operations Lead',
  },
  {
    title: 'Bangladesh Bank B2B2C Framework Clearance (FE Circular 48/31)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Foreign Exchange Regulation & Central Bank Mandate',
    issuingAuthority: 'Bangladesh Bank Foreign Exchange Policy Department',
    leadDays: 30,
    defaultNotes: 'AD bank clearance for Amazon FBA/3PL warehousing agreements and EXP waiver for micro-parcels up to $1,000.',
    taskTitle: 'Submit Annual 3PL Fulfillment Agreement Proof to AD Bank',
    assignedRole: 'Head of Treasury & FX Compliance',
  },
  {
    title: 'Export Retention Quota (ERQ) Foreign Currency Account',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Corporate Treasury & FX Facility',
    issuingAuthority: 'Authorized Dealer Commercial Bank (under BB FE Policy)',
    leadDays: 14,
    defaultNotes: 'ERQ USD/EUR account retaining export earnings to pay overseas 3PL storage, software subscriptions, and digital marketing.',
    taskTitle: 'Reconcile ERQ Retention Balances and International Ad Payments',
    assignedRole: 'Head of Treasury',
  },
  {
    title: 'e-CAB Membership (e-Commerce Association of Bangladesh)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Export Association & Sector Guild',
    issuingAuthority: 'e-Commerce Association of Bangladesh (e-CAB)',
    leadDays: 30,
    defaultNotes: 'Digital remittance facilitation, dispute mediation, and international payment gateway integration support.',
    taskTitle: 'Renew Annual e-CAB Subscription & Digital Trade Accreditation',
    assignedRole: 'Digital Commerce Lead',
  },

  // 4. Customs & Shipping
  {
    title: 'Customs ASYCUDA World Registration',
    section: 'LOGISTICS_CUSTOMS' as DocumentSection,
    category: 'Customs & Cross-Border Regulatory Clearance',
    issuingAuthority: 'Bangladesh Customs & Port Authorities',
    leadDays: 30,
    defaultNotes: 'Electronic Bill of Export submission portal access via C&F agent or courier integration.',
    taskTitle: 'Verify ASYCUDA World Port User Account & Digital Signature',
    assignedRole: 'Customs Broker & Clearing Agent',
  },
  {
    title: 'Online EXP Form Filing Authority (OEMS - Bangladesh Bank)',
    section: 'LOGISTICS_CUSTOMS' as DocumentSection,
    category: 'Customs & Cross-Border Regulatory Clearance',
    issuingAuthority: 'Bangladesh Bank Online Export Monitoring System (OEMS)',
    leadDays: 14,
    defaultNotes: 'Online electronic export declaration authorization for container consignments.',
    taskTitle: 'Monitor OEMS EXP Realization Timelines within 120 Days',
    assignedRole: 'Commercial Export Manager',
  },

  // 5. Product-Specific Clearances
  {
    title: 'Jute Exporter / Dealer License (Directorate General of Jute)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Export Association & Sector Guild',
    issuingAuthority: 'Directorate General of Jute, Ministry of Textiles & Jute',
    leadDays: 7,
    defaultNotes: 'Mandatory license for processing and exporting jute goods; required for 20% export cash subsidy claim.',
    taskTitle: 'Renew Jute Exporter License with Directorate General of Jute',
    assignedRole: 'Jute Supply Chain Lead',
  },
  {
    title: 'Phytosanitary Certificate (Plant Quarantine Wing, DAE)',
    section: 'LOGISTICS_CUSTOMS' as DocumentSection,
    category: 'Plant Health & Quarantine Inspection',
    issuingAuthority: 'Plant Quarantine Wing, Department of Agricultural Extension (DAE)',
    leadDays: 7,
    defaultNotes: 'Mandatory quarantine clearance strictly audited by Australia DAFF, US USDA, and EU agricultural customs.',
    taskTitle: 'Schedule Plant Quarantine Inspection for Jute Consignment',
    assignedRole: 'Export Shipping Officer',
  },
  {
    title: 'Fumigation Certificate (DAE-Approved Pest Agency)',
    section: 'LOGISTICS_CUSTOMS' as DocumentSection,
    category: 'Bio-Security & Fumigation Treatment',
    issuingAuthority: 'DAE-Approved Pest Control Agency',
    leadDays: 7,
    defaultNotes: 'Container fumigation treatment proof to prevent bio-contamination on raw plant fibers.',
    taskTitle: 'Execute Pre-Shipment Container Fumigation & Secure Certificate',
    assignedRole: 'Logistics Operations Lead',
  },
  {
    title: 'LWG Audit Documentation (Leather Working Group Certification)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Environmental & Traceability Audit',
    issuingAuthority: 'Leather Working Group (LWG) Accredited Auditor',
    leadDays: 30,
    defaultNotes: 'Supply chain audit proving leather is sourced from LWG Gold/Silver certified tanneries with full traceability.',
    taskTitle: 'Collect LWG Certification Passbook from Finished Leather Tanneries',
    assignedRole: 'Leather Sourcing Executive',
  },
  {
    title: 'REACH Compliance Certificate (EU/UK Chemical Limits)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Chemical Safety & Laboratory Testing',
    issuingAuthority: 'SGS / Intertek / TÜV SÜD Accredited Lab',
    leadDays: 30,
    defaultNotes: 'Lab test verification ensuring zero banned azo dyes, nickel release, and chromium VI below detection thresholds.',
    taskTitle: 'Dispatch Material Swatches to SGS Lab for Annual REACH Testing',
    assignedRole: 'Quality Assurance & Lab Specialist',
  },
  {
    title: 'BSTI Conformity Certificate (Ceramics & Tableware)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'National Quality Standards Conformity',
    issuingAuthority: 'Bangladesh Standards and Testing Institution (BSTI)',
    leadDays: 30,
    defaultNotes: 'Quality conformity certificate for ceramic tableware, porcelain, bone china, and stoneware manufacturing.',
    taskTitle: 'Submit Tableware Samples to BSTI for Quality Recertification',
    assignedRole: 'Factory Quality Manager',
  },
  {
    title: 'FDA Food Contact Surface (FCS) Certification (USA)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Food Safety & Destination Market Approval',
    issuingAuthority: 'U.S. Food and Drug Administration (FDA) Testing Protocol',
    leadDays: 30,
    defaultNotes: 'Compliance certificate proving ceramic glaze safety and zero toxic food contact migration under 21 CFR.',
    taskTitle: 'Submit Annual FDA Food Contact Surface Declaration',
    assignedRole: 'Regulatory Affairs Manager',
  },
  {
    title: 'California Prop 65 Lead & Cadmium Leach Testing',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Heavy Metal Toxicity & Destination Clearance',
    issuingAuthority: 'Accredited Lab (SGS / Intertek California Prop 65)',
    leadDays: 30,
    defaultNotes: 'Rigorous leach test verifying tableware glazes do not exceed California Proposition 65 lead/cadmium limits.',
    taskTitle: 'Renew California Prop 65 Lab Leach Test Report',
    assignedRole: 'Quality Assurance Lead',
  },
  {
    title: 'EFSA Declaration of Compliance (EU/UK Food Contact)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Food Safety & Destination Market Approval',
    issuingAuthority: 'European Food Safety Authority (EFSA) Harmonized Standards',
    leadDays: 30,
    defaultNotes: 'Declaration of compliance under EU Regulation (EC) No 1935/2004 for materials contacting food/beverage.',
    taskTitle: 'Renew EFSA Declaration of Compliance for European Shipments',
    assignedRole: 'European Compliance Officer',
  },
  {
    title: 'OEKO-TEX Standard 100 Certificate (Home Textiles)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Harmful Substance Testing & Eco Certification',
    issuingAuthority: 'Hohenstein / TESTEX on behalf of OEKO-TEX',
    leadDays: 30,
    defaultNotes: 'World-renowned certificate proving fabrics, threads, and dyes are free from harmful substances.',
    taskTitle: 'Schedule Annual OEKO-TEX Standard 100 Recertification Audit',
    assignedRole: 'Textile Compliance Lead',
  },
  {
    title: 'GOTS Certification (Global Organic Textile Standard)',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Organic Textile & Social Responsibility',
    issuingAuthority: 'Control Union / OneCert / GOTS Accredited Body',
    leadDays: 30,
    defaultNotes: 'Processing standard for organic cotton fibers, including strict ecological and social welfare criteria.',
    taskTitle: 'Prepare GOTS Chain of Custody (Scope Certificate) Review',
    assignedRole: 'Sustainability Director',
  },
  {
    title: 'FTC Flammability & Care Labeling Compliance Certificate',
    section: 'FACTORY_COMPLIANCE' as DocumentSection,
    category: 'Consumer Product Safety & Labeling Compliance',
    issuingAuthority: 'US Consumer Product Safety Commission (CPSC) / FTC 16 CFR Part 1610',
    leadDays: 30,
    defaultNotes: 'Class 1 Normal Flammability test report and verified care labeling in English/metric units.',
    taskTitle: 'Submit Fabric Flammability Test Swatches to Accredited Lab',
    assignedRole: 'Quality Assurance Lead',
  },
  {
    title: 'DIFE Factory Operating License (Owned Production Units)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Building & Factory Safety Compliance',
    issuingAuthority: 'Department of Inspection for Factories and Establishments (DIFE)',
    leadDays: 30,
    defaultNotes: 'Factory operating license under Ministry of Labour and Employment for owned manufacturing premises.',
    taskTitle: 'Submit Worker Safety & Welfare Audit Records to DIFE Inspectorate',
    assignedRole: 'Factory HR & Compliance Director',
  },
  {
    title: 'BHTPA Membership (Home Textile Products Association)',
    section: 'STATION_STATUTORY' as DocumentSection,
    category: 'Export Association & Sector Guild',
    issuingAuthority: 'Bangladesh Home Textile Products Association (BHTPA)',
    leadDays: 30,
    defaultNotes: 'Home textile sector guild accreditation for export incentives on bed linens, curtains, and towels.',
    taskTitle: 'Renew Annual BHTPA Association Membership Subscription',
    assignedRole: 'Home Textiles Commercial Lead',
  },
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  companies,
  preSelectedStation = 'ARIEL_BD',
  preSelectedSection = 'STATION_STATUTORY',
  initialChecklistItem,
}) => {
  const [station, setStation] = useState<EntityCode>(preSelectedStation);
  const [section, setSection] = useState<DocumentSection>(preSelectedSection);
  const [title, setTitle] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [category, setCategory] = useState('Corporate Statutory & Legal Constitution');
  const [issueDate, setIssueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  });
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [renewalLeadDays, setRenewalLeadDays] = useState<number>(7);
  const [fileFormat, setFileFormat] = useState<'PDF' | 'PNG' | 'JPG' | 'DOCX' | 'XLSX'>('PDF');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [verified, setVerified] = useState(true);
  const [notes, setNotes] = useState('');
  const [uploadedBy, setUploadedBy] = useState('Syed Akramul Hassan (Admin)');
  const [checklistItemId, setChecklistItemId] = useState<number | undefined>(initialChecklistItem?.id);

  // Automated Renewal Task State
  const [enableRenewalTask, setEnableRenewalTask] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedRole, setAssignedRole] = useState('Head of Legal & Statutory Compliance');
  const [actionRequired, setActionRequired] = useState('Submit renewal application, deposit statutory fees, and secure updated seal/certificate.');
  const [taskPriority, setTaskPriority] = useState<'HIGH' | 'CRITICAL' | 'MEDIUM'>('CRITICAL');

  // Pre-fill if initialChecklistItem passed
  React.useEffect(() => {
    if (initialChecklistItem) {
      setTitle(initialChecklistItem.title);
      setIssuingAuthority(initialChecklistItem.issuingAuthority);
      setCategory(initialChecklistItem.categoryLabel);
      setNotes(initialChecklistItem.description);
      setChecklistItemId(initialChecklistItem.id);
      setTaskTitle(`Renew ${initialChecklistItem.title}`);
      if (initialChecklistItem.category === 'CUSTOMS_SHIPPING') {
        setSection('LOGISTICS_CUSTOMS');
      } else if (
        initialChecklistItem.category === 'SECTOR_LEATHER' ||
        initialChecklistItem.category === 'SECTOR_CERAMICS' ||
        initialChecklistItem.category === 'SECTOR_TEXTILES'
      ) {
        setSection('FACTORY_COMPLIANCE');
      } else {
        setSection('STATION_STATUTORY');
      }
    }
  }, [initialChecklistItem]);

  // Apply template
  const handleApplyTemplate = (tmpl: typeof STATUTORY_DOCUMENT_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setSection(tmpl.section);
    setCategory(tmpl.category);
    setIssuingAuthority(tmpl.issuingAuthority);
    setRenewalLeadDays(tmpl.leadDays);
    setNotes(tmpl.defaultNotes);
    setTaskTitle(tmpl.taskTitle);
    setAssignedRole(tmpl.assignedRole);
  };

  // Calculate dynamic days left
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !documentNumber.trim()) {
      alert('Please enter both Document Title and Document / Certificate Number.');
      return;
    }

    // Determine status
    let status: 'ACTIVE' | 'EXPIRING_SOON' | 'CRITICAL' | 'EXPIRED' = 'ACTIVE';
    if (daysLeft < 0) {
      status = 'EXPIRED';
    } else if (daysLeft <= 7) {
      status = 'CRITICAL';
    } else if (daysLeft <= 30) {
      status = 'EXPIRING_SOON';
    }

    const docId = `DOC-${station.replace('ARIEL_', '')}-${Date.now().toString().slice(-6)}`;
    const docCode = `${title.slice(0, 4).toUpperCase()}-${documentNumber.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;

    const renewalTaskObj: RenewalTask | undefined = enableRenewalTask ? {
      id: `TASK-${docId}`,
      taskTitle: taskTitle.trim() || `Renew ${title}`,
      assignedRole: assignedRole.trim() || 'Compliance Lead',
      actionRequired: actionRequired.trim() || 'Process renewal requirements.',
      renewalDeadline: expiryDate,
      isCompleted: false,
      priority: daysLeft <= 7 ? 'CRITICAL' : taskPriority,
    } : undefined;

    const newDoc: OfficialDocument = {
      id: docId,
      title: title.trim(),
      docCode,
      section,
      station,
      issuingAuthority: issuingAuthority.trim() || 'Authorized Government Authority',
      documentNumber: documentNumber.trim(),
      category: category.trim() || 'Official Statutory License',
      issueDate,
      expiryDate,
      renewalLeadDays,
      status,
      fileFormat,
      fileSize: fileSize || '2.1 MB',
      fileUrl: `/documents/${docCode.toLowerCase()}.pdf`,
      verified,
      uploadedBy,
      uploadedAt: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
      renewalTask: renewalTaskObj,
      checklistItemId,
    };

    onUploadSuccess(newDoc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/50 flex items-center justify-center text-[#C8A96A] shadow-sm">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96A]">
                  Central Document Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2C5240] text-[#CFE0D5] font-mono">
                  All Stations &amp; Sections
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading text-white">
                Upload &amp; Register Official Document
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 text-xs">
          {/* Quick Statutory Template Picker */}
          <div className="p-3.5 rounded-xl bg-[#1B3327] border border-[#2C5240] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#C8A96A] flex items-center gap-1.5 uppercase font-heading tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Quick Official Template Auto-Fill (Click to Pre-Populate)</span>
              </span>
              <span className="text-[10px] text-gray-300">Saves time on RJSC, BIN, Trade, LFMEAB, BJMA</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {STATUTORY_DOCUMENT_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-[#14261D] hover:bg-[#2C5240] border border-[#345943] text-[#CFE0D5] hover:text-white text-[11px] font-medium transition-colors text-left"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Operating Station & Section Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Target Operating Station <span className="text-rose-400">*</span>
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value as EntityCode)}
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
              >
                {companies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.legalName} ({c.code} - {c.city}, {c.country})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">
                This document will be permanently filed under this jurisdiction station.
              </p>
            </div>

            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                ERP Section / Department <span className="text-rose-400">*</span>
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as DocumentSection)}
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
              >
                <option value="STATION_STATUTORY">Station Statutory, Incorporation &amp; Association Dossier</option>
                <option value="FACTORY_COMPLIANCE">Factory Compliance, Social Audits (Sedex/BSCI) &amp; Safety</option>
                <option value="RND_SAMPLING">R&amp;D, Tech Packs &amp; Buyer Approved Swatches</option>
                <option value="COMMERCIAL_ORDERS">Commercial Contracts, Export L/C &amp; Proforma Invoices</option>
                <option value="LOGISTICS_CUSTOMS">Logistics, Customs, Ocean Bill of Lading &amp; EXP/IRC</option>
                <option value="FINANCE_TAX">Finance, Bank Facility Sanctions &amp; Corporate Taxes</option>
              </select>
              <p className="text-[10px] text-gray-400 mt-1">
                Stored systematically in the Document Portal and accessible in that section.
              </p>
            </div>
          </div>

          {/* Document Title & Document Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Official Document Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Municipal Trade License (Dhaka North City Corporation)"
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Registration / Certificate # <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. TRAD/DNCC/049281/2025"
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white font-mono focus:border-[#C8A96A] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Issuing Authority & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Issuing Regulatory Authority / Chamber / Bank
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g. Dhaka North City Corporation, RJSC, LFMEAB, BJMA"
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Document Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Municipal Operating License, Export Association Guild"
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
              />
            </div>
          </div>

          {/* Dates & 7-Day Renewal Lead Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded-xl bg-[#0F1E17] border border-[#2C5240]">
            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Issue / Effective Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Expiry / Renewal Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#CFE0D5] font-semibold mb-1">
                Renewal Alert Reminder Lead
              </label>
              <select
                value={renewalLeadDays}
                onChange={(e) => setRenewalLeadDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
              >
                <option value={7}>🚨 At least 7 Days Before (Mandatory Alert)</option>
                <option value={14}>⚠️ 14 Days Before (Standard Corporate)</option>
                <option value={30}>🗓️ 30 Days Before (Recommended for Trade License/RJSC)</option>
                <option value={60}>📋 60 Days Before (Audited Financials/Chamber)</option>
              </select>
            </div>
          </div>

          {/* Real-time Expiry Status Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#14261D] border border-[#2C5240]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8A96A]" />
              <span className="text-white font-medium">Computed Validity Status:</span>
            </div>
            <div>
              {daysLeft < 0 ? (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Expired {Math.abs(daysLeft)} days ago
                </span>
              ) : daysLeft <= 7 ? (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  CRITICAL: Renewal Due in {daysLeft} Days (Within 7-Day Alert Threshold!)
                </span>
              ) : daysLeft <= 30 ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Expiring Soon: {daysLeft} Days Remaining
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Active &amp; Compliant ({daysLeft} Days Left)
                </span>
              )}
            </div>
          </div>

          {/* Automated Renewal Task Generator */}
          <div className="p-4 rounded-xl bg-[#13281E] border border-[#2C5240] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableRenewalTask"
                  checked={enableRenewalTask}
                  onChange={(e) => setEnableRenewalTask(e.target.checked)}
                  className="rounded w-4 h-4 accent-[#C8A96A]"
                />
                <label htmlFor="enableRenewalTask" className="text-white font-bold cursor-pointer">
                  Auto-Generate Renewal Task for Compliance Team
                </label>
              </div>
              <span className="text-[10px] text-[#C8A96A] font-semibold">
                Will alert team 7+ days before deadline
              </span>
            </div>

            {enableRenewalTask && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#244232]">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Renewal Task Title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Renew Trade License with Dhaka City Corporation"
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Assigned Officer / Role
                  </label>
                  <input
                    type="text"
                    value={assignedRole}
                    onChange={(e) => setAssignedRole(e.target.value)}
                    placeholder="e.g. Head of Legal & Statutory Compliance"
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Action Plan &amp; Statutory Requirements
                  </label>
                  <input
                    type="text"
                    value={actionRequired}
                    onChange={(e) => setActionRequired(e.target.value)}
                    placeholder="e.g. Pay municipal treasury challan, attach updated rental deed, collect renewed hologram"
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* File Upload / Digital Attachment Simulation */}
          <div className="p-4 rounded-xl border-2 border-dashed border-[#2C5240] bg-[#0A140F]/60 flex flex-col items-center justify-center text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-[#C8A96A]" />
            <div className="text-white font-semibold">
              Select or Drop Scanned Official Certificate / License File
            </div>
            <p className="text-[11px] text-gray-400">
              Supports PDF, PNG, JPG, DOCX, XLSX (Secure encrypted cloud vault storage)
            </p>
            <div className="flex items-center gap-3 pt-2">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] border border-[#C8A96A]/40 font-bold transition-colors">
                Browse Document Files
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFileName(f.name);
                      setFileSize(`${(f.size / (1024 * 1024)).toFixed(1)} MB`);
                      const ext = f.name.split('.').pop()?.toUpperCase();
                      if (ext === 'PDF' || ext === 'PNG' || ext === 'JPG' || ext === 'DOCX' || ext === 'XLSX') {
                        setFileFormat(ext);
                      }
                    }
                  }}
                />
              </label>
              {fileName && (
                <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {fileName} ({fileSize})
                </span>
              )}
            </div>
          </div>

          {/* Notes & Description */}
          <div>
            <label className="block text-[#CFE0D5] font-semibold mb-1">
              Major Description, Legal Remarks &amp; Scope of Registration
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide all major descriptions, regulatory scope, associated factory or warehouse premises, and conditions of license..."
              className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
            />
          </div>

          {/* Verification Check & Uploaded By */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#2C5240]">
            <label className="flex items-center gap-2 cursor-pointer text-[#CFE0D5]">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="rounded w-4 h-4 accent-emerald-500"
              />
              <span className="font-medium text-xs">
                Verified Certified True Copy by Managing Director / Company Secretary
              </span>
            </label>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Uploader:</span>
              <input
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                className="p-1 px-2 rounded bg-[#0A140F] border border-[#2C5240] text-white text-xs w-48"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C5240]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#2C5240] text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2C5240] via-[#1F3A2E] to-[#12231B] text-[#C8A96A] hover:text-white border border-[#C8A96A]/60 hover:border-[#C8A96A] font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Save &amp; Store in Document Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
