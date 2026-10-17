import { EntityCode } from './erp';

export type DocumentSection = 
  | 'STATION_STATUTORY' 
  | 'FACTORY_COMPLIANCE' 
  | 'RND_SAMPLING' 
  | 'COMMERCIAL_ORDERS' 
  | 'LOGISTICS_CUSTOMS' 
  | 'FINANCE_TAX';

export type DocumentStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'CRITICAL' | 'EXPIRED' | 'PENDING_UPLOAD';

export type ComplianceCategory =
  | 'FOUNDATIONAL_CORPORATE'
  | 'CORE_EXPORT_TRADE'
  | 'B2C_CROSS_BORDER_ECOMMERCE'
  | 'CUSTOMS_SHIPPING'
  | 'SECTOR_JUTE'
  | 'SECTOR_LEATHER'
  | 'SECTOR_CERAMICS'
  | 'SECTOR_TEXTILES';

export interface ComplianceChecklistItem {
  id: number;
  title: string;
  category: ComplianceCategory;
  categoryLabel: string;
  issuingAuthority: string;
  description: string;
  stepSequence: number; // 1 to 6
  stepTitle: string;
  govtFeeEstimate: string; // e.g. "BDT 12,500 – 16,000"
  agencyFeeEstimate: string; // e.g. "BDT 18,000 – 25,000"
  totalBudgetEstimate: string; // e.g. "BDT 30,000 – 41,000"
  destinationMarketAudit?: string; // e.g. "US, UK, EU, AU"
  documentId?: string; // Linked document ID if already uploaded
  isMandatory: boolean;
  status: 'COMPLIANT' | 'EXPIRING_7_DAYS' | 'EXPIRING_30_DAYS' | 'EXPIRED' | 'PENDING_UPLOAD';
}

export interface RenewalTask {
  id: string;
  taskTitle: string;
  assignedRole: string;
  actionRequired: string;
  renewalDeadline: string;
  isCompleted: boolean;
  priority: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export interface OfficialDocument {
  id: string;
  title: string;
  docCode: string;
  section: DocumentSection;
  station: EntityCode;
  issuingAuthority: string;
  documentNumber: string;
  category: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  renewalLeadDays?: number; // e.g. 7, 14, 30
  status: DocumentStatus;
  fileFormat?: 'PDF' | 'PNG' | 'JPG' | 'DOCX' | 'XLSX' | string;
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  verified?: boolean;
  uploadedBy?: string;
  uploadedAt?: string;
  notes?: string;
  renewalTask?: RenewalTask;
  checklistItemId?: number; // 1 to 34 mapping
  entityCode?: string;
  countryCode?: string;
  downloadUrl?: string;
  qrCodeData?: string;
  verificationUrl?: string;
  version?: string;
  tags?: string[];
  isStatutoryRequirement?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
