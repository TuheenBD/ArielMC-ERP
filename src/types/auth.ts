import { EntityCode } from './erp';

export type UserDepartment = 
  | 'EXECUTIVE'
  | 'SOURCING_MERCHANDISING'
  | 'FACTORY_COMPLIANCE'
  | 'FINANCE_COMMERCIAL'
  | 'LOGISTICS_FULFILLMENT'
  | 'IT_SYSTEMS_ADMIN';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'MANAGING_DIRECTOR'
  | 'SOURCING_DIRECTOR'
  | 'COMPLIANCE_AUDITOR'
  | 'FINANCE_CONTROLLER'
  | 'LOGISTICS_MANAGER'
  | 'BUYER_VIEWER';

export type TwoFactorMethod = 'AUTHENTICATOR_APP' | 'SMS_WHATSAPP' | 'NONE';

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface SecurityLogItem {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  location: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: UserDepartment;
  role: UserRole;
  entityAccess: EntityCode[];
  primaryEntity: EntityCode;
  avatarInitials: string;
  avatarColor: string;
  avatarUrl?: string;
  signatureText?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  twoFactorSecret?: string;
  recoveryCodes?: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  lastLogin: string;
  createdDate: string;
  passwordHash?: string; // Mock or encrypted
  securityLogs: SecurityLogItem[];
  activeSessions: UserSession[];
}

export interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}
