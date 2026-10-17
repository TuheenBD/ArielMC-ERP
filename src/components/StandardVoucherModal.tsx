'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Share2,
  X,
  Upload,
  Plus,
  Trash2,
  Paperclip,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Copy,
  ExternalLink,
  Save,
  FolderTree
} from 'lucide-react';
import { StandardVoucher, VoucherLineItem, VoucherType, VoucherCurrency, VoucherPaymentMode, PhysicalAttachment } from '@/types/voucher';
import { AccountHead } from '@/types/accountHead';
import { amountToWords } from '@/utils/numberToWords';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import { ArielMC } from '@/lib/brand';
import { PhysicalMemoViewerModal } from '@/components/PhysicalMemoViewerModal';

interface StandardVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher?: StandardVoucher | null;
  mode?: 'VIEW' | 'EDIT' | 'CREATE';
  initialType?: VoucherType;
  onSaveVoucher: (savedVoucher: StandardVoucher) => void;
  accountHeads?: AccountHead[];
  onOpenAccountHeadManager?: () => void;
}

const DEFAULT_PURCHASE_HEADS = [
  '1. Direct Sourcing & Supply Chain Costs (COGS)',
  '2. Logistics & Port Freight Operations',
  '3. Business Development & Compliance Audits',
  '4. Admin, Tech & Office Overhead',
];

const DEFAULT_RECEIVE_HEADS = [
  'Export Sales Revenue: Foreign Buyer Advance Payment (30%)',
  'Export Sales Revenue: Commercial Bulk L/C Settlement (70%)',
  'Sampling & R&D Development Revenue',
  'Retail & Showroom Commercial Sales (B2C)',
  'B2B Private Label Product Engineering Retainer',
];

const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  '1. Direct Sourcing & Supply Chain Costs (COGS)': [
    'Raw Material Sourcing: Full-Grain Leather & Tanneries',
    'Raw Material Sourcing: Golden Jute & Sustainable Canvas',
    'Hardware: Cast Metal Buckles, Rivets & YKK Zippers',
    'Packaging Materials: Corrugated Cartons, Pallets & Silica',
    'Fumigation & Phytosanitary Organic Treatment Expenses',
    'Third-Party Processing: Dyeing, Splitting & Kiln Firings',
  ],
  '2. Logistics & Port Freight Operations': [
    'Inland Freight & Trucking: Savar/Gazipur to CTG Port Off-Dock',
    'C&F Agent Charges: Customs Processing & Port Clearing',
    'Port & Loading Levies: CPA Terminal Handling & Stuffing',
    'Air Freight: International Express Specimen Courier (DHL/FedEx)',
    'Maritime Documentation & Bill of Lading Endorsement',
  ],
  '3. Business Development & Compliance Audits': [
    'Testing & Lab Certification Fees: Leach, REACH & Crocking Tests',
    'Factory Inspection & Audit Fees: Sedex, BSCI & ISO Updates',
    'B2B Marketing & Client Hospitality: Buyer Working Luncheons',
    'Trade Chamber Membership Renewals: LFMEAB & DCCI Dues',
  ],
  '4. Admin, Tech & Office Overhead': [
    'Niketon Executive Office: High-Speed Fiber Internet & Utilities',
    'Technology: Cloud ERP Hosting, Database Security & Multi-Station SSL',
    'Banking & Treasury: Foreign Exchange Wire Commissions & Swift MT700',
    'Statutory Legal Retainer & RJSC Corporate Annual Filings',
  ],
  'Export Sales Revenue: Foreign Buyer Advance Payment (30%)': [
    'Commercial Order Advance: Confirmed Inward TT Foreign Remittance',
    'Master L/C Advising & Pre-Production Financial Escrow',
  ],
  'Export Sales Revenue: Commercial Bulk L/C Settlement (70%)': [
    'Confirmed Irrevocable L/C at Sight Document Negotiation',
    'Commercial Invoice Port Clearance Final Wire Settlement',
  ],
  'Sampling & R&D Development Revenue': [
    'Specimen Prototype Fabrication & Express Courier Retainer',
    'Design Specification Tech-Pack Engineering Fee',
  ],
  'Retail & Showroom Commercial Sales (B2C)': [
    'Dhaka Flagship VIP Gallery: Direct Walk-in Client Cash Receipt',
    'London Mayfair Showroom Client Card / POS Transaction',
  ],
  'B2B Private Label Product Engineering Retainer': [
    'Corporate Gifting & Private Label Brand License Advance',
  ],
};

export const StandardVoucherModal: React.FC<StandardVoucherModalProps> = ({
  isOpen,
  onClose,
  voucher,
  mode: initialModalMode = 'VIEW',
  initialType = 'CASH_PURCHASE',
  onSaveVoucher,
  accountHeads = [],
  onOpenAccountHeadManager,
}) => {
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT'>(initialModalMode === 'CREATE' ? 'EDIT' : initialModalMode);
  const [voucherType, setVoucherType] = useState<VoucherType>(voucher?.type || initialType);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMemoViewerOpen, setIsMemoViewerOpen] = useState(false);
  const [printTwoPerSheet, setPrintTwoPerSheet] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Dynamically resolve Available Heads based on voucherType and accountHeads
  const availableHeads = React.useMemo(() => {
    if (accountHeads && accountHeads.length > 0) {
      const targetType: 'EXPENSE' | 'INCOME' = voucherType === 'CASH_PURCHASE' ? 'EXPENSE' : 'INCOME';
      const matched = accountHeads.filter((h) => h.type === targetType);
      if (matched.length > 0) {
        return matched.map((h) => h.name);
      }
    }
    return voucherType === 'CASH_PURCHASE' ? DEFAULT_PURCHASE_HEADS : DEFAULT_RECEIVE_HEADS;
  }, [accountHeads, voucherType]);

  // Form State
  const [voucherNumber, setVoucherNumber] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mainAccountHead, setMainAccountHead] = useState('');
  const [subCategoryHead, setSubCategoryHead] = useState('');

  // Dynamically resolve Subcategories based on selected mainAccountHead
  const availableSubCategories = React.useMemo(() => {
    if (accountHeads && accountHeads.length > 0) {
      const found = accountHeads.find((h) => h.name === mainAccountHead || h.code === mainAccountHead);
      if (found && found.subCategories && found.subCategories.length > 0) {
        return found.subCategories;
      }
    }
    return SUB_CATEGORIES_MAP[mainAccountHead] || [];
  }, [accountHeads, mainAccountHead]);
  const [currency, setCurrency] = useState<VoucherCurrency>('BDT');
  const [exchangeRateToBdt, setExchangeRateToBdt] = useState<number>(1.0);
  const [partyName, setPartyName] = useState('');
  const [partyDetails, setPartyDetails] = useState('');
  const [linkedOrderNumber, setLinkedOrderNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState<VoucherPaymentMode>('CASH');
  const [bankReference, setBankReference] = useState('');
  const [taxChalanRef, setTaxChalanRef] = useState('');
  const [preparedBy, setPreparedBy] = useState('Shahidul Alam (Accounts Assistant)');
  const [verifiedBy, setVerifiedBy] = useState('Tanvir Hossain (Accounts / Finance Lead)');
  const [approvedBy, setApprovedBy] = useState('Syed Akramul Hassan (Managing Director / CEO)');
  const [claimantOrDepositor, setClaimantOrDepositor] = useState('');
  const [isLocalValueAddition, setIsLocalValueAddition] = useState(true);
  const [notes, setNotes] = useState('');

  // Line items state
  const [items, setItems] = useState<VoucherLineItem[]>([
    { id: 'item-1', sl: 1, description: 'Operational expense particulars...', amount: 0 },
  ]);

  // Physical memo attachment state
  const [physicalAttachment, setPhysicalAttachment] = useState<PhysicalAttachment | undefined>(undefined);
  const [memoNumberInput, setMemoNumberInput] = useState('');
  const [memoShopInput, setMemoShopInput] = useState('');
  const [memoDateInput, setMemoDateInput] = useState('');

  // Sync state when voucher prop changes
  useEffect(() => {
    if (voucher) {
      setVoucherType(voucher.type);
      setVoucherNumber(voucher.voucherNumber);
      setDate(voucher.date);
      setMainAccountHead(voucher.mainAccountHead);
      setSubCategoryHead(voucher.subCategoryHead);
      setCurrency(voucher.currency);
      setExchangeRateToBdt(voucher.exchangeRateToBdt || (voucher.currency === 'USD' ? 121.5 : 1.0));
      setPartyName(voucher.partyName);
      setPartyDetails(voucher.partyDetails || '');
      setLinkedOrderNumber(voucher.linkedOrderNumber || '');
      setPaymentMode(voucher.paymentMode);
      setBankReference(voucher.bankReference || '');
      setTaxChalanRef(voucher.taxChalanRef || '');
      setPreparedBy(voucher.preparedBy);
      setVerifiedBy(voucher.verifiedBy);
      setApprovedBy(voucher.approvedBy);
      setClaimantOrDepositor(voucher.claimantOrDepositor);
      setIsLocalValueAddition(voucher.isLocalValueAddition);
      setNotes(voucher.notes || '');
      setItems(voucher.items && voucher.items.length > 0 ? voucher.items : [
        { id: 'item-1', sl: 1, description: '', amount: 0 }
      ]);
      setPhysicalAttachment(voucher.physicalAttachment);
      if (voucher.physicalAttachment) {
        setMemoNumberInput(voucher.physicalAttachment.memoNumber || '');
        setMemoShopInput(voucher.physicalAttachment.supplierShopName || '');
        setMemoDateInput(voucher.physicalAttachment.memoDate || '');
      }
      setModalMode(initialModalMode === 'EDIT' ? 'EDIT' : 'VIEW');
    } else {
      // Create new voucher defaults
      const isExp = initialType === 'CASH_PURCHASE';
      const seq = Math.floor(1000 + Math.random() * 9000);
      setVoucherType(initialType);
      setVoucherNumber(isExp ? `AMC - EXP - 2026 - ${seq}` : `AMC - RCV - 2026 - ${seq}`);
      setDate(new Date().toISOString().split('T')[0]);
      let defaultHead = isExp ? DEFAULT_PURCHASE_HEADS[0] : DEFAULT_RECEIVE_HEADS[0];
      if (accountHeads && accountHeads.length > 0) {
        const targetType = isExp ? 'EXPENSE' : 'INCOME';
        const matched = accountHeads.filter((h) => h.type === targetType);
        if (matched.length > 0) defaultHead = matched[0].name;
      }
      setMainAccountHead(defaultHead);
      let subList: string[] = [];
      if (accountHeads && accountHeads.length > 0) {
        const found = accountHeads.find((h) => h.name === defaultHead || h.code === defaultHead);
        if (found && found.subCategories && found.subCategories.length > 0) {
          subList = found.subCategories;
        }
      }
      if (subList.length === 0) {
        subList = SUB_CATEGORIES_MAP[defaultHead] || [];
      }
      setSubCategoryHead(subList[0] || 'General Operational Particulars');
      setCurrency('BDT');
      setExchangeRateToBdt(1.0);
      setPartyName('');
      setPartyDetails('');
      setLinkedOrderNumber(isExp ? '' : 'SO-2026-UK-001');
      setPaymentMode(isExp ? 'CASH' : 'SWIFT_WIRE');
      setBankReference('');
      setTaxChalanRef('');
      setPreparedBy('Shahidul Alam (Accounts Assistant)');
      setVerifiedBy('Tanvir Hossain (Accounts / Finance Lead)');
      setApprovedBy('Syed Akramul Hassan (Managing Director / CEO)');
      setClaimantOrDepositor('');
      setIsLocalValueAddition(true);
      setNotes('');
      setItems([
        { id: 'item-1', sl: 1, description: '', amount: 0 },
      ]);
      setPhysicalAttachment(undefined);
      setMemoNumberInput('');
      setMemoShopInput('');
      setMemoDateInput(new Date().toISOString().split('T')[0]);
      setModalMode('EDIT');
    }
  }, [voucher, initialModalMode, initialType, isOpen]);

  if (!isOpen) return null;

  // Calculate Totals and Amount in Words
  const totalAmount = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const totalAmountBdt = currency === 'BDT' ? totalAmount : Math.round(totalAmount * (exchangeRateToBdt || 121.5));
  const generatedWords = currency === 'BDT'
    ? amountToWords(totalAmount, 'BDT')
    : `${amountToWords(totalAmount, currency)} (Equivalent to ${amountToWords(totalAmountBdt, 'BDT')})`;

  // Add Item Row
  const handleAddItem = () => {
    const nextSl = items.length + 1;
    setItems([
      ...items,
      { id: `item-${Date.now()}`, sl: nextSl, description: '', amount: 0 },
    ]);
  };

  // Remove Item Row
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    const remaining = items.filter((it) => it.id !== id);
    // Re-index serials
    setItems(remaining.map((it, idx) => ({ ...it, sl: idx + 1 })));
  };

  // Update Item Row
  const handleItemChange = (id: string, field: 'description' | 'amount', value: any) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            [field]: field === 'amount' ? Number(value) || 0 : value,
          };
        }
        return it;
      })
    );
  };

  // Handle Head change
  const handleMainHeadChange = (head: string) => {
    setMainAccountHead(head);
    let subList: string[] = [];
    if (accountHeads && accountHeads.length > 0) {
      const found = accountHeads.find((h) => h.name === head || h.code === head);
      if (found && found.subCategories && found.subCategories.length > 0) {
        subList = found.subCategories;
      }
    }
    if (subList.length === 0) {
      subList = SUB_CATEGORIES_MAP[head] || [];
    }
    setSubCategoryHead(subList[0] || 'General Operational Particulars');
  };

  // Handle Mock or Real File Upload for Physical Cash Memo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newAtt: PhysicalAttachment = {
      id: `att-${Date.now()}`,
      fileName: file.name,
      fileUrl: fileUrl,
      fileType: file.type.includes('pdf') ? 'PDF' : file.type.includes('png') ? 'IMAGE_PNG' : 'IMAGE_JPG',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      memoNumber: memoNumberInput || `MEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      memoDate: memoDateInput || date,
      supplierShopName: memoShopInput || partyName || 'Vendor Cash Counter',
      notes: 'Original physical receipt/cash memo uploaded and attached to transaction voucher.',
    };

    setPhysicalAttachment(newAtt);
  };

  // Save Voucher Form (Callable from form submit or header/footer Save buttons)
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!partyName.trim()) {
      alert(`Please specify the ${voucherType === 'CASH_PURCHASE' ? 'Payee (Paid To)' : 'Buyer (Received From)'} name.`);
      return;
    }

    const validItems = items.filter(it => it.description.trim() || it.amount > 0);
    const finalItems = validItems.length > 0 ? validItems : [
      { id: 'item-1', sl: 1, description: voucherType === 'CASH_PURCHASE' ? 'Direct Sourcing & Operational Procurement' : 'Foreign Buyer Commercial Advance / Inflow', amount: totalAmount || 0 }
    ];

    const generatedVoucherNumber = voucherNumber.trim() || `AMC-${voucherType === 'CASH_PURCHASE' ? 'EXP' : 'RCV'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const compiledVoucher: StandardVoucher = {
      id: voucher?.id || `vch-${Date.now()}`,
      voucherNumber: generatedVoucherNumber,
      type: voucherType,
      date: date || new Date().toISOString().split('T')[0],
      mainAccountHead: mainAccountHead || (voucherType === 'CASH_PURCHASE' ? DEFAULT_PURCHASE_HEADS[0] : DEFAULT_RECEIVE_HEADS[0]),
      subCategoryHead: subCategoryHead || '',
      currency,
      exchangeRateToBdt: currency === 'BDT' ? 1.0 : (exchangeRateToBdt || 121.5),
      partyName: partyName.trim(),
      partyDetails: partyDetails.trim(),
      linkedOrderNumber: linkedOrderNumber.trim(),
      paymentMode,
      bankReference: bankReference.trim(),
      taxChalanRef: taxChalanRef.trim(),
      items: finalItems,
      totalAmount,
      totalAmountBdt,
      amountInWords: generatedWords,
      preparedBy,
      verifiedBy,
      approvedBy,
      claimantOrDepositor: claimantOrDepositor.trim() || (voucherType === 'CASH_PURCHASE' ? 'Shahidul Alam (Accounts Assistant)' : 'Buyer Authorized Representative'),
      physicalAttachment,
      auditStatus: 'VERIFIED',
      isLocalValueAddition,
      notes: notes.trim(),
      createdAt: voucher?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveVoucher(compiledVoucher);
    setModalMode('VIEW');
    setSaveSuccessMessage(`Voucher ${compiledVoucher.voucherNumber} (${compiledVoucher.type === 'CASH_PURCHASE' ? 'Cash Purchase' : 'Money Receive'}) successfully saved!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4500);
  };

  // Build OfficialDocument representation for Share & Verification Modal
  const voucherOfficialDoc: OfficialDocument = {
    id: `DOC-${voucher?.id || voucherNumber}`,
    docCode: voucherNumber,
    documentNumber: voucherNumber,
    title: `ArielMC ${voucherType === 'CASH_PURCHASE' ? 'Cash Purchase Voucher' : 'Money / Cash Receive Voucher'} - ${voucherNumber}`,
    category: voucherType === 'CASH_PURCHASE' ? 'Cash Purchase & Disbursement Voucher' : 'Money Receipt & Inflow Voucher',
    section: 'STATION_STATUTORY',
    issuingAuthority: 'ArielMC Directorate of Accounts & Finance (Dhaka Central Station)',
    station: 'ARIEL_BD',
    countryCode: 'BD',
    issueDate: date,
    expiryDate: '2026-12-31',
    renewalLeadDays: 30,
    status: 'ACTIVE',
    fileFormat: 'PDF',
    fileSize: '240 KB (Vector A4 Voucher)',
    verified: true,
    uploadedBy: preparedBy,
    uploadedAt: new Date().toISOString(),
    verificationUrl: `https://erp.arielmc.com/verify-doc?code=${encodeURIComponent(voucherNumber)}&ack=true`,
    qrCodeData: `${voucherNumber}|${voucherType}|TOTAL_${currency}_${totalAmount}|VERIFIED`,
    tags: ['Voucher', voucherType, currency, 'Accounts & Finance', 'Statutory Audit'],
    notes: `Official ${voucherType === 'CASH_PURCHASE' ? 'expenditure disbursement' : 'buyer revenue realization'} voucher in amount of ${currency} ${totalAmount.toLocaleString()} (${generatedWords}). Verified for statutory accounts ledger and EPB value-addition calculations.`,
    isStatutoryRequirement: true,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:z-auto">
      <div className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-white print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        
        {/* Top Control Header Bar (Hidden during Print) */}
        <div className="px-6 py-4 bg-[#0A140F] border-b border-[#2C5240] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${voucherType === 'CASH_PURCHASE' ? 'bg-amber-950/40 border-amber-500/30 text-[#C8A96A]' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'}`}>
              {voucherType === 'CASH_PURCHASE' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  {voucherType === 'CASH_PURCHASE' ? 'Cash Purchase Voucher' : 'Money / Cash Receive Voucher'}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#C8A96A] font-bold">
                  {voucherNumber}
                </span>
                {physicalAttachment && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    <Paperclip className="w-3 h-3" />
                    <span>Memo Attached</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Ariel Marketing & Communications Limited • Dhaka Central Finance Station
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Save Voucher Button (Prominent in EDIT mode for Both Vouchers) */}
            {modalMode === 'EDIT' && (
              <button
                type="button"
                id="btn-header-save-voucher"
                onClick={() => handleSave()}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-[#C8A96A]/60 transition-all cursor-pointer font-['Montserrat']"
                title={`Save ${voucherType === 'CASH_PURCHASE' ? 'Cash Purchase' : 'Money Receive'} Voucher`}
              >
                <Save className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Save Voucher</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="bg-[#12231B] border border-[#2C5240] p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setModalMode('VIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalMode === 'VIEW'
                    ? 'bg-[#1E6B3A] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Standard View
              </button>
              <button
                type="button"
                onClick={() => setModalMode('EDIT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalMode === 'EDIT'
                    ? 'bg-[#C8A96A] text-[#12231B] shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Fill Up / Edit
              </button>
            </div>

            {/* View Attached Memo Button if present */}
            {physicalAttachment && (
              <button
                type="button"
                onClick={() => setIsMemoViewerOpen(true)}
                className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="View Uploaded Physical Cash Memo / Bill"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Memo</span>
              </button>
            )}

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Clean Standard Voucher"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Print</span>
            </button>

            {/* Share Option (Verify / Ack) Placed Right Beside Print */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-emerald-400/40"
              title="Share Voucher for Official Verification & Formal Sign-Off"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share (Verify / Ack)</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs font-mono shrink-0 animate-fadeIn print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
              <span className="font-bold text-white">{saveSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMessage(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#060D09] print:bg-white print:p-0 print:overflow-visible">
          
          {modalMode === 'EDIT' ? (
            /* =========================================================
               1. INTERACTIVE FILL-UP & EDIT FORM (Save in System)
               ========================================================= */
            <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-6 print:hidden">
              
              {/* Voucher Type & Number Strip */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                    Voucher Classification
                  </label>
                  <select
                    value={voucherType}
                    onChange={(e) => {
                      const newT = e.target.value as VoucherType;
                      setVoucherType(newT);
                      const isExp = newT === 'CASH_PURCHASE';
                      let defaultH = isExp ? DEFAULT_PURCHASE_HEADS[0] : DEFAULT_RECEIVE_HEADS[0];
                      if (accountHeads && accountHeads.length > 0) {
                        const targetType = isExp ? 'EXPENSE' : 'INCOME';
                        const matched = accountHeads.filter((h) => h.type === targetType);
                        if (matched.length > 0) defaultH = matched[0].name;
                      }
                      setMainAccountHead(defaultH);
                      let subList: string[] = [];
                      if (accountHeads && accountHeads.length > 0) {
                        const found = accountHeads.find((h) => h.name === defaultH || h.code === defaultH);
                        if (found && found.subCategories && found.subCategories.length > 0) {
                          subList = found.subCategories;
                        }
                      }
                      if (subList.length === 0) {
                        subList = SUB_CATEGORIES_MAP[defaultH] || [];
                      }
                      setSubCategoryHead(subList[0] || 'General Operational Particulars');
                      const seq = voucherNumber.split('-')[3] || String(Math.floor(1000 + Math.random() * 9000));
                      setVoucherNumber(`AMC - ${isExp ? 'EXP' : 'RCV'} - 2026 - ${seq.trim()}`);
                    }}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono font-bold focus:border-[#C8A96A] outline-none"
                  >
                    <option value="CASH_PURCHASE">Cash Purchase Voucher (Disbursement)</option>
                    <option value="CASH_RECEIVE">Money / Cash Receive Voucher (Buyer Inflow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                    Voucher Number
                  </label>
                  <input
                    type="text"
                    value={voucherNumber}
                    onChange={(e) => setVoucherNumber(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-[#C8A96A] text-xs font-mono font-bold focus:border-[#C8A96A] outline-none"
                    placeholder="AMC - EXP - 2026 - [XXXX]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                    Date of Issue / Transaction
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] outline-none"
                  />
                </div>
              </div>

              {/* Account Head & Sub-Category */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono">
                        Main Account Head
                      </label>
                      {onOpenAccountHeadManager && (
                        <button
                          type="button"
                          onClick={onOpenAccountHeadManager}
                          className="text-[10px] text-[#C8A96A] hover:text-[#d5b97d] flex items-center gap-1 font-mono font-bold transition-colors cursor-pointer"
                          title="Open Account Head Management to Create, Rename, or Delete Heads"
                        >
                          <FolderTree className="w-3 h-3 text-[#C8A96A]" />
                          <span>+ Manage Heads</span>
                        </button>
                      )}
                    </div>
                    <select
                      value={mainAccountHead}
                      onChange={(e) => handleMainHeadChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-medium focus:border-[#C8A96A] outline-none"
                    >
                      {availableHeads.map((head) => (
                        <option key={head} value={head}>
                          {head}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Sub-Category Head / Ledger Line
                    </label>
                    <select
                      value={subCategoryHead}
                      onChange={(e) => setSubCategoryHead(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-medium focus:border-[#C8A96A] outline-none"
                    >
                      {availableSubCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="General Operational Particulars">General Operational Particulars</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Currency
                    </label>
                    <div className="flex items-center gap-2">
                      {(['BDT', 'USD', 'GBP', 'EUR', 'AUD'] as VoucherCurrency[]).map((cur) => (
                        <button
                          key={cur}
                          type="button"
                          onClick={() => {
                            setCurrency(cur);
                            setExchangeRateToBdt(cur === 'USD' ? 121.5 : cur === 'GBP' ? 152.0 : cur === 'EUR' ? 132.0 : cur === 'AUD' ? 80.0 : 1.0);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            currency === cur
                              ? 'bg-[#C8A96A] text-[#12231B]'
                              : 'bg-[#0A140F] border border-[#2C5240] text-gray-400 hover:text-white'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currency !== 'BDT' && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                        Exchange Rate (1 {currency} = BDT)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={exchangeRateToBdt}
                        onChange={(e) => setExchangeRateToBdt(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Payment Instrument
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as VoucherPaymentMode)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] outline-none"
                    >
                      <option value="CASH">Cash in Hand / Counter Cash</option>
                      <option value="BEFTN_BANK">Bank Transfer (BEFTN / RTGS)</option>
                      <option value="SWIFT_WIRE">SWIFT Wire / Foreign TT</option>
                      <option value="CHEQUE">Bank Cheque / Pay Order</option>
                      <option value="LC_AT_SIGHT">Irrevocable L/C at Sight</option>
                      <option value="CORP_CARD">Corporate Visa / Mastercard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Party Information (Paid To / Received From) */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      {voucherType === 'CASH_PURCHASE' ? 'Paid To (Particulars / Payee)' : 'Received From (Buyer / Company)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder={voucherType === 'CASH_PURCHASE' ? 'e.g. Apex Tannery Ltd / Sonali Jute Mills' : 'e.g. Harrods London / Selfridges & Co'}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-semibold focus:border-[#C8A96A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Linked Order / L/C / Invoice Ref
                    </label>
                    <input
                      type="text"
                      value={linkedOrderNumber}
                      onChange={(e) => setLinkedOrderNumber(e.target.value)}
                      placeholder="e.g. SO-2026-UK-001 or LC-HSBC-LON-9481"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-[#C8A96A] text-xs font-mono focus:border-[#C8A96A] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Bank Ref / Cheque No / Cash Register
                    </label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="e.g. Eastern Bank PLC (Principal Branch) / Cheque #8812"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Tax Chalan / Mushak 6.3 / PRC Ref
                    </label>
                    <input
                      type="text"
                      value={taxChalanRef}
                      onChange={(e) => setTaxChalanRef(e.target.value)}
                      placeholder="e.g. NBR-VAT-6.3-99120 or BB-PRC-2026-084"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Line Items / Particulars Table */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="font-heading font-bold text-sm text-white">
                    Particulars &amp; Operational Expenses
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-lg bg-[#1E6B3A] hover:bg-[#258247] text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 bg-[#0A140F] p-2 rounded-xl border border-[#2C5240]">
                      <div className="w-8 text-center font-mono font-bold text-xs text-[#C8A96A]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Description of Operational Expenses / Particulars"
                          className="w-full p-2 rounded-lg bg-transparent text-white text-xs font-mono focus:bg-white/5 outline-none"
                        />
                      </div>
                      <div className="w-36">
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 font-mono text-xs text-[#C8A96A] font-bold">
                            {currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€'}
                          </span>
                          <input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono text-right font-bold focus:border-[#C8A96A] outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1.5 rounded text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal and Real-Time Amount in Words */}
                <div className="p-4 rounded-xl bg-black/40 border border-[#2C5240] space-y-2 mt-4 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase text-gray-400 font-bold">
                      {voucherType === 'CASH_PURCHASE' ? 'Total Amount Available For Reimbursement:' : 'Total Amount Received:'}
                    </span>
                    <span className="text-lg font-bold text-[#C8A96A]">
                      {currency === 'BDT' ? '৳ ' : `${currency} `}
                      {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {currency !== 'BDT' && (
                    <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-1">
                      <span>Equivalent in Bangladesh Taka (Rate: {exchangeRateToBdt}):</span>
                      <span className="font-bold text-white">৳ {totalAmountBdt.toLocaleString()} BDT</span>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-2 text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase">Amount in Words:</span>
                    <span className="text-[#F5EEDC] font-semibold italic">{generatedWords}</span>
                  </div>
                </div>
              </div>

              {/* Physical Cash Memo / Bill Attachment Upload */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-[#C8A96A]" />
                    <h4 className="font-heading font-bold text-sm text-white">
                      Upload Physical Cash Purchase Voucher / Cash Memo / Supplier Bill
                    </h4>
                  </div>
                  {physicalAttachment && (
                    <button
                      type="button"
                      onClick={() => setPhysicalAttachment(undefined)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      Remove Attachment
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Physical Memo / Bill No.
                    </label>
                    <input
                      type="text"
                      value={memoNumberInput}
                      onChange={(e) => setMemoNumberInput(e.target.value)}
                      placeholder="e.g. MEMO-2026-8812"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Supplier / Shop Name
                    </label>
                    <input
                      type="text"
                      value={memoShopInput}
                      onChange={(e) => setMemoShopInput(e.target.value)}
                      placeholder="e.g. Apex Tannery / Sonali Jute"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Physical Memo Date
                    </label>
                    <input
                      type="date"
                      value={memoDateInput}
                      onChange={(e) => setMemoDateInput(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Upload Dropzone */}
                <div className="border-2 border-dashed border-[#2C5240] hover:border-[#C8A96A] rounded-xl p-4 text-center transition-colors bg-[#0A140F]/60">
                  <input
                    type="file"
                    id="memo-file-upload"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="memo-file-upload" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-[#C8A96A] mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">
                      Click to Browse or Drag Physical Cash Memo Scan / PDF
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Supports JPG, PNG, Scanned Slips, VAT Chalan &amp; PDF Receipts (Max 15MB)
                    </span>
                  </label>

                  {physicalAttachment && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-left">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-bold text-white">{physicalAttachment.fileName}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {physicalAttachment.fileSize} • {physicalAttachment.memoNumber || 'Attached'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMemoViewerOpen(true)}
                        className="px-2.5 py-1 rounded bg-[#2C5240] text-white text-[11px] font-bold hover:bg-[#396851]"
                      >
                        Preview Scan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Signatory Officers */}
              <div className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] space-y-3">
                <h4 className="font-heading font-bold text-sm text-white border-b border-white/10 pb-2">
                  Official Signatures &amp; Approvals
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">
                      1. Prepared By
                    </label>
                    <input
                      type="text"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">
                      2. Verified By
                    </label>
                    <input
                      type="text"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">
                      3. Approved By
                    </label>
                    <input
                      type="text"
                      value={approvedBy}
                      onChange={(e) => setApprovedBy(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">
                      4. Received By (Claimant)
                    </label>
                    <input
                      type="text"
                      value={claimantOrDepositor}
                      onChange={(e) => setClaimantOrDepositor(e.target.value)}
                      placeholder="Claimant / Depositor Name"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C5240]">
                <button
                  type="button"
                  onClick={() => setModalMode('VIEW')}
                  className="px-5 py-2.5 rounded-xl border border-gray-600 text-gray-300 font-semibold text-xs hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-form-save-voucher"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] text-white font-bold text-xs shadow-lg hover:from-[#258247] hover:to-[#1a6637] transition-all cursor-pointer flex items-center gap-2 border border-[#C8A96A]/40 font-['Montserrat']"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                  <span>
                    Save {voucherType === 'CASH_PURCHASE' ? 'Cash Purchase Voucher' : 'Money Receive Voucher'} In System
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* =========================================================
               2. CLEAN & STANDARD PRINTABLE VOUCHER VIEW
               (Exact match to physical scan PDF provided by user)
               ========================================================= */
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Optional 2-Per-Sheet Toggle for Printing */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#12231B] border border-[#2C5240] print:hidden">
                <span className="text-xs text-gray-300 font-mono">
                  Print Format: Clean Standard A4 Sheet (Matches ArielMC Official Printed Pad)
                </span>
                <label className="flex items-center gap-2 text-xs font-mono text-[#C8A96A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printTwoPerSheet}
                    onChange={(e) => setPrintTwoPerSheet(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-[#C8A96A]"
                  />
                  <span>Two Vouchers Per Sheet (With Cut Line)</span>
                </label>
              </div>

              {/* ---------------- VOUCHER COPY 1 ---------------- */}
              <div className="bg-white text-gray-900 rounded-xl p-6 sm:p-8 shadow-xl font-['Open_Sans'] border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0">
                
                {/* Header (Exact PDF match) */}
                <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight text-[#1F3A2E] leading-none uppercase">
                      {voucherType === 'CASH_PURCHASE' ? (
                        <>
                          CASH PURCHASE<br />
                          <span className="text-[#17456F]">VOUCHER</span>
                        </>
                      ) : (
                        <>
                          MONEY / CASH RECEIVE<br />
                          <span className="text-[#1E6B3A]">VOUCHER</span>
                        </>
                      )}
                    </h1>
                  </div>

                  <div className="text-right space-y-0.5">
                    {/* Brand ArielMC: Single solid color */}
                    <div className="text-xl sm:text-2xl font-black font-['Montserrat'] text-[#1F3A2E] tracking-tight">
                      ArielMC
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-gray-700">
                      Ariel Marketing &amp; Communications Limited
                    </div>
                    <div className="text-[9px] text-gray-600 leading-tight">
                      House - 30 (1st Floor), Road - 07, Block - C,<br />
                      Niketon, Gulshan, Dhaka-1212, Bangladesh
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                      Email: info@arielmc.com | www.arielmc.com
                    </div>
                  </div>
                </div>

                {/* Metadata Fields (Dotted Lines layout from User PDF) */}
                <div className="py-4 space-y-2.5 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-baseline">
                      <span className="font-bold text-gray-900 w-28 shrink-0">Voucher No:</span>
                      <span className="font-bold text-[#1F3A2E] border-b border-dotted border-gray-800 flex-1 px-1">
                        {voucherNumber}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-bold text-gray-900 w-16 shrink-0">Date:</span>
                      <span className="font-semibold text-gray-800 border-b border-dotted border-gray-800 flex-1 px-1">
                        {date}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex items-baseline">
                      <span className="font-bold text-gray-900 w-36 shrink-0">Main Account Head:</span>
                      <span className="font-semibold text-gray-800 border-b border-dotted border-gray-800 flex-1 px-1 truncate">
                        {mainAccountHead}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-end gap-3">
                      <span className="font-bold text-gray-900">Currency:</span>
                      <span className="font-bold">
                        BDT [ {currency === 'BDT' ? '✓' : ' '} ]
                      </span>
                      <span className="font-bold">
                        USD [ {currency === 'USD' ? '✓' : ' '} ]
                      </span>
                      {currency !== 'BDT' && currency !== 'USD' && (
                        <span className="font-bold text-[#1E6B3A]">
                          {currency} [ ✓ ]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-baseline">
                      <span className="font-bold text-gray-900 w-36 shrink-0">Sub-Category Head:</span>
                      <span className="font-semibold text-gray-800 border-b border-dotted border-gray-800 flex-1 px-1 truncate">
                        {subCategoryHead}
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="font-bold text-gray-900 w-32 shrink-0">
                        {voucherType === 'CASH_PURCHASE' ? 'Paid To (Payee):' : 'Received From:'}
                      </span>
                      <span className="font-bold text-[#1F3A2E] border-b border-dotted border-gray-800 flex-1 px-1 truncate">
                        {partyName}
                      </span>
                    </div>
                  </div>

                  {(linkedOrderNumber || bankReference) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-600">
                      {linkedOrderNumber && (
                        <div className="flex items-baseline">
                          <span className="font-medium text-gray-700 w-28 shrink-0">Linked Order / LC:</span>
                          <span className="border-b border-dotted border-gray-400 flex-1 px-1 font-bold text-emerald-800">
                            {linkedOrderNumber}
                          </span>
                        </div>
                      )}
                      {bankReference && (
                        <div className="flex items-baseline">
                          <span className="font-medium text-gray-700 w-28 shrink-0">Payment Instrument:</span>
                          <span className="border-b border-dotted border-gray-400 flex-1 px-1 font-semibold text-gray-800">
                            {paymentMode} • {bankReference}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Particulars Table (Matching exact User PDF layout) */}
                <div className="border-2 border-[#1F3A2E] rounded overflow-hidden">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1F3A2E] text-white font-mono text-[11px]">
                        <th className="py-2.5 px-3 text-center border-r border-[#2C5240] w-12 font-bold">
                          Sl.
                        </th>
                        <th className="py-2.5 px-4 text-left border-r border-[#2C5240] font-bold">
                          Description of Operational Expenses / Particulars
                        </th>
                        <th className="py-2.5 px-4 text-right w-40 font-bold">
                          Amount ({currency})
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 text-gray-900 font-mono">
                      {items.map((it) => (
                        <tr key={it.id} className="min-h-[44px]">
                          <td className="py-3 px-3 text-center border-r border-gray-300 font-bold text-gray-600 align-top">
                            {it.sl}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-300 text-gray-800 align-top">
                            <div className="font-medium text-xs text-gray-900">{it.description}</div>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900 align-top whitespace-nowrap">
                            {it.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}

                      {/* Fill empty rows to match physical paper voucher height */}
                      {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
                        <tr key={`empty-${idx}`} className="h-10">
                          <td className="border-r border-gray-300 text-center text-gray-400 text-[10px]">
                            {items.length + idx + 1}
                          </td>
                          <td className="border-r border-gray-300"></td>
                          <td className="border-gray-300"></td>
                        </tr>
                      ))}

                      {/* Total Row */}
                      <tr className="border-t-2 border-[#1F3A2E] bg-gray-100 font-bold">
                        <td colSpan={2} className="py-3 px-4 uppercase text-gray-900 border-r border-gray-300 text-[11px] tracking-wide">
                          {voucherType === 'CASH_PURCHASE'
                            ? 'TOTAL AMOUNT AVAILABLE FOR REIMBURSEMENT'
                            : 'TOTAL AMOUNT RECEIVED'}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-[#1F3A2E] font-black whitespace-nowrap">
                          {currency === 'BDT' ? '৳ ' : `${currency} `}
                          {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Amount in Words */}
                <div className="pt-3 pb-6 flex items-baseline text-xs font-mono">
                  <span className="font-bold text-gray-900 shrink-0 w-32">Amount in Words:</span>
                  <span className="border-b border-dotted border-gray-800 flex-1 px-2 font-semibold text-gray-900 italic">
                    {generatedWords}
                  </span>
                </div>

                {/* 4 Signatures Block (Exact match to User PDF) */}
                <div className="grid grid-cols-4 gap-4 pt-10 text-center font-mono text-[10px] text-gray-700">
                  <div className="space-y-1">
                    <div className="border-b border-dotted border-gray-800 pb-1 font-bold text-gray-900 min-h-[18px]">
                      {preparedBy.split('(')[0]}
                    </div>
                    <div className="font-bold uppercase text-[9px] text-gray-800">Prepared By</div>
                    <div className="text-[8px] text-gray-500">Accounts Assistant</div>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-dotted border-gray-800 pb-1 font-bold text-gray-900 min-h-[18px]">
                      {verifiedBy.split('(')[0]}
                    </div>
                    <div className="font-bold uppercase text-[9px] text-gray-800">Verified By</div>
                    <div className="text-[8px] text-gray-500">Accounts / Finance Lead</div>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-dotted border-gray-800 pb-1 font-bold text-gray-900 min-h-[18px]">
                      {approvedBy.split('(')[0]}
                    </div>
                    <div className="font-bold uppercase text-[9px] text-gray-800">Approved By</div>
                    <div className="text-[8px] text-gray-500">Managing Director / CEO</div>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-dotted border-gray-800 pb-1 font-bold text-gray-900 min-h-[18px]">
                      {claimantOrDepositor || 'Signature / Stamp'}
                    </div>
                    <div className="font-bold uppercase text-[9px] text-gray-800">
                      {voucherType === 'CASH_PURCHASE' ? 'Received By' : 'Received With Thanks'}
                    </div>
                    <div className="text-[8px] text-gray-500">
                      {voucherType === 'CASH_PURCHASE' ? 'Claimant Signature' : 'Buyer / Depositor'}
                    </div>
                  </div>
                </div>

                {/* Physical Attachment Notice if attached */}
                {physicalAttachment && (
                  <div className="mt-6 pt-3 border-t border-gray-300 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Attached Physical Memo: <strong>{physicalAttachment.memoNumber || physicalAttachment.fileName}</strong> ({physicalAttachment.supplierShopName})</span>
                    </div>
                    <span className="text-emerald-700 font-bold">✓ Physical Receipt Scanned &amp; Archived</span>
                  </div>
                )}
              </div>

              {/* Cut Line (If 2 per sheet is enabled) */}
              {printTwoPerSheet && (
                <>
                  <div className="py-6 text-center">
                    <div className="border-t-2 border-dashed border-gray-400 relative">
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#060D09] px-4 font-mono text-[10px] uppercase text-gray-400 font-bold print:bg-white print:text-gray-600">
                        ✂ CUT HERE FOR TWO INDEPENDENT VOUCHERS PER SHEET ✂
                      </span>
                    </div>
                  </div>

                  {/* ---------------- VOUCHER COPY 2 (Duplicate Slip) ---------------- */}
                  <div className="bg-white text-gray-900 rounded-xl p-6 sm:p-8 shadow-xl font-['Open_Sans'] border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0">
                    <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight text-[#1F3A2E] leading-none uppercase">
                          {voucherType === 'CASH_PURCHASE' ? (
                            <>CASH PURCHASE<br /><span className="text-[#17456F]">VOUCHER (AUDIT COPY)</span></>
                          ) : (
                            <>MONEY / CASH RECEIVE<br /><span className="text-[#1E6B3A]">VOUCHER (CUSTOMER COPY)</span></>
                          )}
                        </h2>
                      </div>
                      <div className="text-right space-y-0.5">
                        <div className="text-xl sm:text-2xl font-black font-['Montserrat'] text-[#1F3A2E] tracking-tight">
                          ArielMC
                        </div>
                        <div className="text-[10px] font-semibold text-gray-700">
                          Ariel Marketing &amp; Communications Limited
                        </div>
                        <div className="text-[9px] text-gray-600">
                          House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212
                        </div>
                      </div>
                    </div>

                    <div className="py-4 space-y-2 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex"><span className="font-bold w-28">Voucher No:</span><span className="font-bold text-[#1F3A2E] border-b border-dotted border-gray-800 flex-1">{voucherNumber}</span></div>
                        <div className="flex"><span className="font-bold w-16">Date:</span><span className="border-b border-dotted border-gray-800 flex-1">{date}</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex"><span className="font-bold w-28">Account Head:</span><span className="border-b border-dotted border-gray-800 flex-1 truncate">{mainAccountHead}</span></div>
                        <div className="flex"><span className="font-bold w-24">Party:</span><span className="font-bold text-[#1F3A2E] border-b border-dotted border-gray-800 flex-1 truncate">{partyName}</span></div>
                      </div>
                    </div>

                    <div className="border-2 border-[#1F3A2E] rounded overflow-hidden">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="bg-[#1F3A2E] text-white text-[10px]">
                            <th className="py-2 px-2 text-center w-10">Sl.</th>
                            <th className="py-2 px-3 text-left">Particulars</th>
                            <th className="py-2 px-3 text-right w-36">Amount ({currency})</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                          {items.map((it) => (
                            <tr key={`copy2-${it.id}`}>
                              <td className="py-2 px-2 text-center text-gray-600">{it.sl}</td>
                              <td className="py-2 px-3 text-gray-800">{it.description}</td>
                              <td className="py-2 px-3 text-right font-bold">{it.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-[#1F3A2E] bg-gray-100 font-bold">
                            <td colSpan={2} className="py-2.5 px-3 uppercase text-[10px]">TOTAL AMOUNT</td>
                            <td className="py-2.5 px-3 text-right font-black text-[#1F3A2E]">{currency === 'BDT' ? '৳ ' : `${currency} `}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 pb-4 text-xs font-mono flex">
                      <span className="font-bold w-32 shrink-0">In Words:</span>
                      <span className="border-b border-dotted border-gray-800 flex-1 italic">{generatedWords}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-6 text-center font-mono text-[9px]">
                      <div><div className="border-b border-dotted border-gray-700 pb-1">{preparedBy.split('(')[0]}</div><span>Prepared By</span></div>
                      <div><div className="border-b border-dotted border-gray-700 pb-1">{verifiedBy.split('(')[0]}</div><span>Verified By</span></div>
                      <div><div className="border-b border-dotted border-gray-700 pb-1">{approvedBy.split('(')[0]}</div><span>Approved By</span></div>
                      <div><div className="border-b border-dotted border-gray-700 pb-1">{claimantOrDepositor || 'Sign'}</div><span>Claimant / Client</span></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 bg-[#0A140F] border-t border-[#2C5240] flex items-center justify-between text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
            <span>Status:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              {modalMode === 'EDIT' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span>
                    Editing Active • {voucherType === 'CASH_PURCHASE' ? 'Cash Purchase Voucher Entry' : 'Money Receive Voucher Entry'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Audited &amp; Saved • Ready for Print / Share / Ack</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {modalMode === 'VIEW' ? (
              <>
                <button
                  type="button"
                  id="btn-footer-edit-voucher"
                  onClick={() => setModalMode('EDIT')}
                  className="px-4 py-2 rounded-xl bg-[#2C5240] hover:bg-[#396851] text-white font-bold transition-all cursor-pointer text-xs"
                >
                  Edit Voucher Fields
                </button>
                <button
                  type="button"
                  id="btn-footer-duplicate-voucher"
                  onClick={() => {
                    const isExp = voucherType === 'CASH_PURCHASE';
                    const seq = Math.floor(1000 + Math.random() * 9000);
                    setVoucherNumber(`AMC - ${isExp ? 'EXP' : 'RCV'} - 2026 - ${seq}`);
                    setDate(new Date().toISOString().split('T')[0]);
                    setModalMode('EDIT');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                  title="Duplicate as new voucher entry"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Duplicate Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Print Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share (Verify / Ack)</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode('VIEW')}
                  className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white/5 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel / View Slip
                </button>
                <button
                  type="button"
                  id="btn-footer-save-voucher"
                  onClick={() => handleSave()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-[#C8A96A]/50 font-['Montserrat']"
                >
                  <Save className="w-4 h-4 text-[#C8A96A]" />
                  <span>
                    Save {voucherType === 'CASH_PURCHASE' ? 'Cash Purchase' : 'Money Receive'} Voucher
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Document Modal configured for Verified / Acknowledgement */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={voucherOfficialDoc}
      />

      {/* Physical Cash Memo / Bill Viewer Modal */}
      {physicalAttachment && (
        <PhysicalMemoViewerModal
          isOpen={isMemoViewerOpen}
          onClose={() => setIsMemoViewerOpen(false)}
          attachment={physicalAttachment}
          voucherNumber={voucherNumber}
          voucherType={voucherType}
          partyName={partyName}
        />
      )}
    </div>
  );
};
