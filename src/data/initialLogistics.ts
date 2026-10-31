import { LogisticsConsignment, SecurityBudgetLine, SecurityIncident } from '@/types/erp';

export const initialConsignments: LogisticsConsignment[] = [];

export const securityBudgetPlan: SecurityBudgetLine[] = [
  {
    id: 'sec_01',
    component: 'Hardware 2FA Security Keys',
    provider: 'YubiKey 5C NFC (3 units for Key Admins)',
    annualCostGbp: 150,
    annualCostBdt: 23250,
    strategicPurpose: 'Phishing-resistant logins for Wise Business, Stripe UK & Meta Portfolio root',
    status: 'ACTIVE',
  },
  {
    id: 'sec_02',
    component: 'Edge WAF, DNSSEC & Anti-Bot',
    provider: 'Cloudflare Pro Plan (Storefronts & Corporate)',
    annualCostGbp: 240,
    annualCostBdt: 37200,
    strategicPurpose: 'Bot mitigation, WAF card-testing defense on .shop, DNSSEC on .com & .co.uk',
    status: 'ACTIVE',
  },
  {
    id: 'sec_03',
    component: 'Enterprise Password Vault (IAM)',
    provider: '1Password Teams / Bitwarden (5 seats)',
    annualCostGbp: 180,
    annualCostBdt: 27900,
    strategicPurpose: 'Zero master-password sharing across Dhaka HQ and London teams',
    status: 'ACTIVE',
  },
  {
    id: 'sec_04',
    component: 'Secure Business Email & Routing',
    provider: 'Google Workspace Business Starter + 2SV',
    annualCostGbp: 360,
    annualCostBdt: 55800,
    strategicPurpose: 'DMARC p=reject, 2048-bit DKIM, SPF routing to stop invoice spoofing',
    status: 'ACTIVE',
  },
  {
    id: 'sec_05',
    component: 'Storefront Vulnerability Audit',
    provider: 'Third-party PCI-DSS / Web Penetration Scan',
    annualCostGbp: 350,
    annualCostBdt: 54250,
    strategicPurpose: 'Pre-launch Shopify & Stripe tokenization penetration testing',
    status: 'ACTIVE',
  },
];

export const recentSecurityAudits: SecurityIncident[] = [
  {
    id: 'sec_inc_01',
    title: 'Ad Account Phishing Attempt Blocked',
    category: 'PHISHING_ALERT',
    severity: 'HIGH',
    status: 'RESOLVED',
    detectedAt: '2026-03-28 14:15 UTC',
    targetPlatform: 'Meta Business Suite (@arielmc.com)',
    isolationActionTaken: 'Impersonation link flagged by Google Workspace DMARC/SPF; ad account token rotated within 10 minutes.',
    escalationLead: 'Dhaka Tech Lead / MD',
  },
  {
    id: 'sec_inc_02',
    title: 'Savar Tannery Wire Update Request Verification',
    category: 'BEC_WIRE_ALTERATION',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    detectedAt: '2026-04-02 09:30 BDT',
    targetPlatform: 'Dhaka Trade/Finance Desk',
    isolationActionTaken: 'Enforced Out-of-Band Callback Verification SOP: verified executive telephone callback prevented unauthorized wire diversion.',
    escalationLead: 'Dhaka Operations Desk',
  },
];
