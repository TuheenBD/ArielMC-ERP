# ArielMC Enterprise Cyber Security Policy & Online Platform Safeguards

**Document Code**: `SEC-POL-2026-V1`  
**Classification**: `CONFIDENTIAL — BOARDROOM & IT GOVERNANCE`  
**Governing Authority**: Office of the Managing Director & Chief Commercial/IT Directorate  
**Scope**: All ArielMC Digital Assets (`arielmc.com`, `arielmc.co.uk`, `arielmc.shop`, Enterprise ERP, Supabase DB, Corporate Email & Station Infrastructure)  

---

## 1. Executive Mandate & Risk Landscape

As **Ariel Marketing & Communications Limited (ArielMC)** expands its sovereign operating stations across Bangladesh (Dhaka Operations Hub), United Kingdom (UK Ltd), United States (USA LLC), European Union (EU Entity), and Australia (Pty Ltd), digital trust and data integrity represent non-negotiable operational assets.

A security compromise could disrupt factory production schedules, compromise proprietary buyer TechPacks and CAD patterns, expose commercial margins, or result in severe financial diversion (Business Email Compromise).

This policy establishes technical requirements, operational controls, and administrative procedures across five core defense perimeters:
1. **Enterprise ERP & Database Security** (Core Internal Sourcing Engine)
2. **Public Web Portals & E-Commerce Storefronts** (`arielmc.com` & `arielmc.shop`)
3. **Corporate Communications & Email Authentication** (Anti-Phishing & Anti-BEC)
4. **Supply Chain, Factory Data & Intellectual Property** (CAD TechPacks & AQL Reports)
5. **Incident Response, Compliance & Statutory Notification** (GDPR, UK DPA, CCPA, BD DPA)

---

## 2. Perimeter 1: Enterprise ERP & Database Protection

### 2.1 Identity & Access Management (IAM)
* **Mandatory Two-Step Authentication (2SA/MFA)**:
  * All users accessing the Enterprise ERP must enroll in 2SA using Time-based One-Time Password (TOTP) apps (Google Authenticator, Microsoft Authenticator, 1Password).
  * SMS-based verification is restricted to secondary emergency fallback due to SIM-swap vulnerabilities.
* **Granular Role-Based Access Control (RBAC)**:
  * Access rights are strictly partitioned across 6 departmental roles:
    1. `EXECUTIVE` / `SUPER_ADMIN`: Full multi-station governance.
    2. `FINANCE_CONTROLLER`: Banking ledgers, currency hedges, Mushak 6.3 VAT tax invoices.
    3. `SOURCING_MERCHANDISING`: SDO sample orders, factory tech packs, PO costing margins.
    4. `FACTORY_COMPLIANCE`: Audit scorecards, social accreditations (Sedex/BSCI/LWG).
    5. `LOGISTICS_FULFILLMENT`: Daily dispatch manifests, courier AWB tracking, container stuffing.
    6. `BUYER_VIEWER`: Read-only access to customer's specific order status.
* **Station Data Isolation**:
  * Merchandisers and accountants assigned to a sovereign station (e.g., `ARIEL_UK`) are restricted from modifying foreign station records (e.g., `ARIEL_BD` tax accounts) without super-admin elevation.

### 2.2 PostgreSQL / Supabase Database Hardening
* **Row-Level Security (RLS)**:
  * All production tables (`erp_orders`, `erp_products`, `official_documents`, `erp_vouchers`, `dispatch_manifests`) must have RLS enabled with explicit tenant and station policies.
* **Transport Encryption**:
  * Enforce TLS 1.3 encryption for all database connections with `sslmode=require`. Plaintext connections are blocked at the firewall.
* **Credential & Secret Key Scoping**:
  * Service role keys (`SUPABASE_SERVICE_ROLE_KEY`) must never be bundled into client-side JavaScript. Only public anonymous keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) are permitted in browser runtimes.
  * Environment variables must reside in encrypted `.env.local` or hosting secret vaults; committing credentials to Git repositories is strictly prohibited.
* **Automated Encrypted Backups**:
  * Daily automated snapshots with 30-day retention and Point-In-Time Recovery (PITR) to mitigate ransomware or accidental data loss.

### 2.3 API Route & Webhook Protection
* **HMAC Webhook Signatures**:
  * The storefront ingestion route (`/api/orders/webhook`) must validate cryptographic HMAC-SHA256 signatures (`x-shopify-hmac-sha256` or equivalent) against shared secrets before writing orders into the ERP database.
* **Rate Limiting & Anti-Brute Force**:
  * Critical endpoints (`/api/send-email`, `/api/crm`, `/api/forex`, `/api/db/seed`) must employ IP-based sliding window rate limiting (maximum 30 requests/minute per IP) to mitigate denial-of-service and credential stuffing.
* **Strict SQL Injection Defense**:
  * All database operations must utilize parameterized ORM queries (Prisma ORM / Supabase Client SDK). Raw string interpolation in queries is strictly barred.

---

## 3. Perimeter 2: Public Website & Storefront Protection

### 3.1 Edge Architecture & Web Application Firewall (WAF)
* **Cloudflare Enterprise/Pro Proxying**:
  * All public DNS records for `arielmc.com`, `arielmc.co.uk`, and `arielmc.shop` must route through Cloudflare edge proxies.
  * Enable **DDoS Attack Protection**, **Bot Fight Mode**, and automated challenge rules on sensitive forms.
* **Transport Layer Security (TLS)**:
  * Enforce HTTPS with HTTP Strict Transport Security (`HSTS`: `max-age=31536000; includeSubDomains; preload`).
  * Automatic redirection of all HTTP (Port 80) traffic to HTTPS (Port 443).

### 3.2 HTTP Security Headers
Every public web response must include standard defense headers:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
```

### 3.3 Form Abuse & Lead Spam Mitigation
* All public lead capture, RFQ (Request for Quote), sample cart inquiries, and search command palettes must integrate invisible challenge verification (Cloudflare Turnstile) to eliminate automated scrapers and spam bots.

---

## 4. Perimeter 3: Corporate Communications & Anti-Phishing

### 4.1 Email Domain Authentication Protocols
To prevent cyber criminals from spoofing `@arielmc.com` to send fraudulent wire instructions to international buyers, the following DNS records are mandatory:
1. **SPF (Sender Policy Framework)**:
   * Explicitly authorize only Hostinger Mail and Google Workspace servers:
   * `v=spf1 include:_spf.hostinger.com include:_spf.google.com ~all`
2. **DKIM (DomainKeys Identified Mail)**:
   * 2048-bit cryptographic key signing for all outbound email dispatches.
3. **DMARC (Domain-based Message Authentication, Reporting & Conformance)**:
   * Enforce a quarantine or reject policy to block illegitimate impersonators:
   * `v=DMARC1; p=reject; rua=mailto:dmarc-reports@arielmc.com; pct=100; aspf=r;`

### 4.2 Out-of-Band Wire Verification Protocol (Anti-BEC)
* **The Dual-Signatory Mandate**:
  * ArielMC will **never** alter its sovereign bank account wire instructions via email alone.
  * In the event of a banking update, the change must be accompanied by:
    1. An official, digitally signed Letter of Amendment signed by an authorized `StatutoryOfficer`.
    2. A mandatory live video conference or authenticated telephonic confirmation between the buyer's CFO and ArielMC's Managing Director before funds are remitted.

---

## 5. Perimeter 4: Supply Chain & Intellectual Property Defense

### 5.1 TechPack & CAD Pattern Encryption
* Buyer designs, dimensional tolerance sheets, and CAD patterns are proprietary trade secrets.
* TechPack PDFs and CAD DXF files stored in cloud object storage (Cloudflare R2 / AWS S3) must be configured with:
  * Private, non-public bucket policies.
  * Time-limited pre-signed URLs (maximum 24-hour expiration) when shared with partner factories for sampling.

### 5.2 Factory Audit & Vendor Data Protection
* Social audit certifications (Sedex SMETA, BSCI, LWG Gold) and factory pricing agreements must be stored within the encrypted Document Portal and restricted to authorized sourcing personnel.

---

## 6. Perimeter 5: Incident Response & Disaster Recovery

### 6.1 Incident Classification & Severity Matrix
* **Severity 1 (Critical)**: Production database breach, unauthorized data exfiltration, ransomware attack, or compromised root administrator account.
  * *Response Time*: Immediate containment within **60 minutes**.
  * *Escalation*: Direct notification to Managing Director, Chief Technology Lead, and Legal Counsel.
* **Severity 2 (High)**: Compromised staff email account, DDoS degradation, or unauthorized modification of inventory/order records.
  * *Response Time*: Containment within **4 hours**.
* **Severity 3 (Medium/Low)**: Automated scraping attempts, isolated failed login bursts, or low-risk configuration drift.
  * *Response Time*: Review during daily security audit checks.

### 6.2 Statutory Data Breach Notification SLAs
In compliance with international data privacy regulations:
* **UK GDPR / EU GDPR (Article 33)**: Notification to the Information Commissioner's Office (ICO) and relevant EU Data Protection Authorities within **72 hours** of becoming aware of a confirmed personal data breach.
* **Customer / Buyer Notification**: Immediate transparent disclosure to affected enterprise accounts if commercial data or order details are impacted.

---

## 7. Immediate 30-Day Cybersecurity Action Checklist

| Phase | Priority Action Item | Responsible DRI | Target Timeline |
| :--- | :--- | :--- | :--- |
| **Week 1** | Audit DNS records & enforce strict DMARC (`p=reject`), SPF, and DKIM on `arielmc.com` | IT Systems Admin | Days 1–7 |
| **Week 1** | Enforce mandatory 2SA/MFA for all active ERP staff profiles across all stations | Managing Director | Days 1–7 |
| **Week 2** | Activate Cloudflare Edge WAF, HSTS headers, and anti-DDoS proxy on all public web domains | DevOps / IT | Days 8–14 |
| **Week 2** | Implement HMAC signature validation on all external store webhooks (`/api/orders/webhook`) | Lead Full-Stack Dev | Days 8–14 |
| **Week 3** | Verify Supabase PostgreSQL Row-Level Security (RLS) across all production tables | Lead Backend Dev | Days 15–21 |
| **Week 4** | Conduct quarterly staff security awareness briefing on Phishing & Wire Fraud prevention | Executive Directorate | Days 22–30 |

---

*Authored by the Office of the Managing Director & IT Directorate for Ariel Marketing & Communications Limited.*
