export type VoucherType = 'CASH_PURCHASE' | 'CASH_RECEIVE';

export type VoucherCurrency = 'BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD';

export type VoucherPaymentMode = 
  | 'CASH' 
  | 'BEFTN_BANK' 
  | 'SWIFT_WIRE' 
  | 'CHEQUE' 
  | 'LC_AT_SIGHT' 
  | 'CORP_CARD';

export interface VoucherLineItem {
  id: string;
  sl: number;
  description: string;
  amount: number;
  foreignAmount?: number;
}

export interface PhysicalAttachment {
  id: string;
  fileName: string;
  fileUrl: string; // Data URL or asset path
  fileType: 'IMAGE_PNG' | 'IMAGE_JPG' | 'PDF';
  fileSize: string;
  uploadedAt: string;
  memoNumber?: string;
  memoDate?: string;
  supplierShopName?: string;
  notes?: string;
}

export interface StandardVoucher {
  id: string;
  voucherNumber: string; // e.g. "AMC - EXP - 2026 - 0346" or "AMC - RCV - 2026 - 0101"
  type: VoucherType;
  date: string; // YYYY-MM-DD
  mainAccountHead: string;
  subCategoryHead: string;
  currency: VoucherCurrency;
  exchangeRateToBdt: number;
  
  // Party info
  partyName: string; // Paid To (Supplier/Claimant) or Received From (Buyer/Client)
  partyDetails?: string; // e.g. "Savar Tannery Estate" or "Harrods London (UK)"
  linkedOrderNumber?: string; // e.g. "SO-2026-UK-001" or "INV-2026-084"
  buyerCountry?: string; // For receive vouchers

  // Payment instrument
  paymentMode: VoucherPaymentMode;
  bankReference?: string; // Bank, branch, cheque no, TT ref
  taxChalanRef?: string; // Mushak 6.3 or VAT ref

  // Overseas / Station Bank attribution (for real-time B2C/D2C settlement)
  stationCode?: 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | 'ARIEL_BD' | string;
  stationBankName?: string;
  stationAccountNumber?: string;
  channel?: string;
  channelTransactionRef?: string;
  isStationB2CInflow?: boolean;

  // Particulars table
  items: VoucherLineItem[];
  totalAmount: number;
  totalAmountBdt: number;
  amountInWords: string;

  // 4 Signatures
  preparedBy: string; // Accounts Assistant
  verifiedBy: string; // Accounts / Finance Lead
  approvedBy: string; // Managing Director / CEO
  claimantOrDepositor: string; // Claimant Signature or Received by Depositor

  // Physical document scan / memo upload
  physicalAttachment?: PhysicalAttachment;

  // Compliance & audit
  auditStatus: 'VERIFIED' | 'PENDING_ACK' | 'FLAGGED';
  isLocalValueAddition: boolean; // Counts towards 40%+ domestic value addition for EPB
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherFilterOptions {
  searchQuery: string;
  voucherType: 'ALL' | VoucherType;
  accountHead: string; // 'ALL' or specific head
  paymentMode: 'ALL' | VoucherPaymentMode;
  attachmentStatus: 'ALL' | 'WITH_ATTACHMENT' | 'WITHOUT_ATTACHMENT';
  dateRange: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'FY_2026' | 'CUSTOM';
  customStartDate?: string;
  customEndDate?: string;
  minAmount?: number;
  maxAmount?: number;
  stationFilter?: 'ALL' | 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | 'ARIEL_BD' | string;
}
