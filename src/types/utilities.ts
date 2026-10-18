export type UtilityTab = 
  | 'CALCULATOR'
  | 'NOTEPAD'
  | 'TODO_CALENDAR'
  | 'MESSAGES'
  | 'CONTACTS'
  | 'WALLET'
  | 'MAPS'
  | 'TRANSLATOR';

// =========================================================================
// 1. TO-DO & CALENDAR (Flowlu-Inspired Task Engine)
// =========================================================================

export type TaskStage = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface UtilityTask {
  id: string;
  title: string;
  description: string;
  stage: TaskStage;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  owner: string;
  assignee: string;
  tags: string[];
  checklist: TaskChecklistItem[];
  estimatedHours: number;
  trackedSeconds: number;
  isTimerRunning?: boolean;
  hourlyRate?: number; // In active currency or USD/GBP for cost calculation
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultEstimatedHours: number;
  defaultChecklist: string[];
  tags: string[];
  defaultPriority: TaskPriority;
}

// =========================================================================
// 2. NOTE PAD
// =========================================================================

export type NoteCategory = 'GENERAL' | 'MEETING' | 'TECHPACK' | 'FINANCE' | 'SOURCING';

export interface OfficeNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  color?: string; // Hex or tailwind identifier
  updatedAt: string;
}

// =========================================================================
// 3. CONTACTS DIRECTORY (Buyer, Suppliers, Factory, Employees)
// =========================================================================

export type ContactCategory = 'BUYER' | 'SUPPLIER' | 'FACTORY' | 'EMPLOYEE';

export interface EnterpriseContact {
  id: string;
  name: string;
  company: string;
  role: string;
  category: ContactCategory;
  station: string; // e.g., 'Dhaka HQ', 'London Ltd', 'Savar Industrial', 'New York'
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  taxOrVatId?: string;
  notes?: string;
  avatarUrl?: string;
  leadTimeOrCapacity?: string; // e.g. "50,000 pcs/mo" for factory or "30 days" for supplier
}

// =========================================================================
// 4. WALLET & BANKING VAULT
// =========================================================================

export interface BankWalletAccount {
  id: string;
  station: string; // e.g. 'ARIEL_UK', 'ARIEL_BD', 'ARIEL_US', 'ARIEL_EU', 'ARIEL_AU'
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCodeOrRouting: string;
  swiftBic: string;
  iban?: string;
  currency: string;
  branchAddress: string;
  notes: string;
  isPrimarySettlement: boolean;
  erqAccountNumber?: string;
}

// =========================================================================
// 5. MESSAGE CENTER
// =========================================================================

export type MessagePriority = 'ANNOUNCEMENT' | 'URGENT' | 'POLICY' | 'OPERATION';

export interface OfficeMessage {
  id: string;
  sender: string;
  senderRole: string;
  title: string;
  content: string;
  priority: MessagePriority;
  targetStation: string; // 'ALL_STATIONS' | 'DHAKA_HQ' | 'LONDON_OFFICE' etc.
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// =========================================================================
// 6. SUPPLY CHAIN & MAPS
// =========================================================================

export type MapPinType = 'STATION' | 'FACTORY' | 'SUPPLIER' | 'PORT' | 'AIRPORT';

export interface SupplyChainMapPin {
  id: string;
  name: string;
  type: MapPinType;
  city: string;
  country: string;
  lat: number;
  lng: number;
  address: string;
  leadTimeDays?: number;
  operatingHours?: string;
  contactPerson?: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'HIGH_VOLUME' | 'ON_SCHEDULE';
}

// =========================================================================
// 7. GARMENT & EXPORT TRADE TRANSLATOR
// =========================================================================

export interface GarmentGlossaryTerm {
  id: string;
  english: string;
  bengali: string;
  phoneticBengali?: string;
  category: 'FABRIC' | 'TECHPACK' | 'QUALITY' | 'SHIPPING' | 'FINANCIAL';
  definition: string;
  french?: string;
  german?: string;
  chinese?: string;
}
