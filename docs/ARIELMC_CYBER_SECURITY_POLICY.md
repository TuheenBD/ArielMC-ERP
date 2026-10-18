# ArielMC Enterprise Cyber Security Policy & Cross-Border Platform Governance

**Document Identifier**: `SOP-SEC-2026-V1`  
**Classification**: `CONFIDENTIAL — STATUTORY & IT GOVERNANCE`  
**Target Entities**: 
- Ariel Marketing & Communications Limited (Dhaka Headquarters, Bangladesh — House 30, Road 07, Block C, Niketon, Gulshan, Dhaka-1212)
- Ariel Marketing & Communications Limited (London Subsidiary, United Kingdom — 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ)
**Applies To**: All Dhaka operational staff, London personnel, remote contractors, agency media buyers, and 3PL integration partners  
**Scope**: Storefronts (`arielmc.shop`), corporate web domains (`arielmc.com`, `arielmc.co.uk`), Amazon Seller Central, Etsy UK, Meta/TikTok ad portfolios, corporate banking/settlement pipelines (Wise Business, Stripe UK, Authorized Dealer ERQ accounts), Enterprise ERP, and internal communications.

---

## 1. Purpose & Administrative Scope

Operating a cross-border retail and wholesale sourcing enterprise spanning Dhaka and London creates distinct cybersecurity exposure across multi-channel storefronts, ad engines, and cross-border payment rails.

Distributed operations between Bangladesh and the United Kingdom expose ArielMC to:
- **Account Takeover (ATO)** across distributed management teams.
- **Social Media Ad Account Hijacking & Phishing** via fraudulent "Trademark Infringement" notifications designed to burn corporate balances or Export Retention Quota (ERQ) cards.
- **Checkout & Supply Chain Script Injection (Magecart Attacks)** on direct-to-consumer store (`arielmc.shop`).
- **Wholesale Business Email Compromise (BEC)** spoofing invoices to institutional B2B procurement partners (hospitality and corporate gifting accounts) to divert international wire settlements.
- **International Regulatory Penalties** under the UK Data Protection Act 2018 / UK GDPR and Bangladesh’s Cyber Security Act due to unencrypted shipping data or improper tracking mechanisms.

Compliance with this Standard Operating Procedure (SOP) is mandatory for continued employment or commercial contractor engagement.

---

## 2. Security Implementation Budget (Year 1)

To establish an impenetrable perimeter defense without unnecessary operational overhead, the following core security stack is budgeted and authorized for Year 1 implementation:

| Security Component | Tool / Implementation Provider | Annual Cost (£ GBP) | Annual Cost (BDT @ ৳155/£) | Strategic Purpose |
| :--- | :--- | :---: | :---: | :--- |
| **Hardware 2FA Keys** | YubiKey 5C NFC (3 units for Key Admins) | £150 | ৳23,250 | Phishing-resistant FIDO2 logins for Wise, Stripe UK & Meta Portfolios |
| **Edge WAF & DDoS** | Cloudflare Pro Plan (Storefront domains) | £240 | ৳37,200 | Bot mitigation, card-testing rate limiting, SSL/TLS 1.3 & DNSSEC |
| **Team Password Vault** | Bitwarden Teams / 1Password (5 seats) | £180 | ৳27,900 | Zero-knowledge credential isolation across Dhaka and London teams |
| **Secure Business Email** | Google Workspace Business Starter + 2SV | £360 | ৳55,800 | Phishing defense, 2048-bit DKIM, SPF & strict DMARC (`p=reject`) routing |
| **Vulnerability Audit** | Third-party PCI-DSS / Web Security Scan | £350 | ৳54,250 | Pre-launch store and endpoint penetration audit |
| **Annual Total** | — | **£1,280** | **৳198,400** | **Comprehensive perimeter & access defense** |

---

## 3. Identity, Authentication & Access Management (IAM)

### 3.1 Centralized Password Architecture
- All staff and contractors must use company-provisioned password managers (**1Password** or **Bitwarden Teams**) to generate, store, and autofill credentials.
- Master passwords must be a minimum of **16 characters**, containing uppercase letters, lowercase letters, numbers, and symbols.
- **Prohibited Action**: Saving company credentials directly in browser storage (e.g., Chrome or Safari autofill) or transmitting plaintext passwords via Slack, WhatsApp, Skype, or email is strictly forbidden.

### 3.2 Multi-Factor Authentication (MFA) Standards
- **Tier 1 Accounts (Root / Admin)**: 
  - *Platforms*: Wise Business UK, Stripe UK, Authorized Dealer Bank portals, AWS/Cloudflare DNS, Google Workspace Super-Admin, Shopify Primary Owner, and Meta Business Portfolio Primary Admin.
  - *Mandate*: Must enforce **FIDO2 hardware security keys (YubiKey 5C NFC)** or native device biometric authentication (**Apple Touch ID / Windows Hello**).
  - *Prohibition*: SMS-based 2FA and email OTP verification are strictly prohibited for Tier 1 assets due to SIM-swapping and session interception risks.
- **Tier 2 Accounts (Standard Operational)**:
  - *Platforms*: Amazon Seller Central, Etsy UK, TikTok Business Center, Google Ads, project management dashboards, and daily staff email.
  - *Mandate*: Time-based One-Time Password (TOTP) apps (Google Authenticator, Microsoft Authenticator, or 1Password integrated TOTP).
- **Device Biometrics & Screen Timeout**:
  - All hardware accessing ArielMC systems (MacBook Pro M1, iPhone, Windows workstations) must enforce screen locks that activate after **3 minutes of inactivity**, secured with Touch ID, Face ID, or an alphanumeric passcode.

### 3.3 Principle of Least Privilege (PoLP) Matrix

Access across operational platforms is restricted strictly according to role and jurisdiction:

| Platform / Portal | Permitted Role for Dhaka HQ Staff | Permitted Role for UK Contractors / Media Buyers | Root / Owner Authority |
| :--- | :--- | :--- | :--- |
| **Wise Business UK** | **"Read Only"** (Accountant / View balances for bank reconciliation) | **No Access** (unless designated UK Statutory Director) | Managing Director / Board |
| **Stripe UK** | **"Support Specialist"** or **"Analyst"** (view transactions/refunds) | **"Developer"** (API integration restricted strictly to test keys) | Managing Director / Board |
| **Shopify DTC (`arielmc.shop`)** | **"Staff Member"** (Orders, Customer Service, Inventory editing) | **"Staff Member"** (Marketing, Blog, Theme Design) | Managing Director |
| **Amazon Seller Central** | **Secondary User**: Inventory & Fulfilment Management | **Secondary User**: Advertising & Campaign Optimization | Primary Admin |
| **Meta Business Portfolio** | **Employee Access**: Page content editor, Community manager | **Partner / Agency Access**: Ad Account Advertiser (pre-set daily budget ceilings) | ArielMC Corporate Super-Admin |
| **Bangladesh AD Bank (ERQ)** | **Dhaka Trade/Finance Desk**: View/Prepare Bangladesh Bank EXP filings | **No Access** | Authorized Director Signatories |

---

## 4. Storefront & Domain Infrastructure Security

### 4.1 Shopify DTC Security (`arielmc.shop`)
- **App Ecosystem Hygiene**: No application may be installed on Shopify without prior technical review by the Dhaka Lead or Managing Director. Only apps carrying the official **"Built for Shopify"** badge or enterprise-grade **SOC 2 Type II** certifications may be deployed.
- **Payment Gateway Isolation**: No credit card, debit card, or CVV data may ever touch, be recorded on, or pass through ArielMC internal servers or spreadsheets. All customer checkout flows must remain native to Shopify Payments and Stripe UK hosted tokenized fields (ensuring continuous **PCI-DSS Level 1 compliance**).
- **Custom Code & Theme Integrity**: Liquid theme modifications must be managed via GitHub version control with branch protection rules requiring mandatory code review before merging into the live storefront theme.

### 4.2 DNS, Edge & Perimeter Protection
- **Cloudflare Edge Routing**: All public-facing company web properties (`arielmc.com`, `arielmc.co.uk`, `arielmc.shop`) must route traffic through Cloudflare Edge Services.
- **WAF Rules**: Web Application Firewall (WAF) rules must block malicious bots, known scrapers, and automated credential-stuffing attacks.
- **Transport Security**: Enforce HTTP Strict Transport Security (**HSTS**) with a minimum of **TLS 1.3** encryption.
- **DNSSEC**: Domain Name System Security Extensions (**DNSSEC**) must remain permanently enabled to protect against DNS spoofing and cache poisoning.

---

## 5. Social Media, Ad Portfolios & Communications Protection

### 5.1 Meta Business Suite & TikTok Business Center Governance
- **Portfolio Separation**: Agency contractors and freelance media buyers must never be added as individual personal users to the ArielMC primary business entity.
- **Business Partner ID Provisioning**: Access must be provisioned solely via **Business Partner IDs**, sharing only the specific Ad Account and Pixel assets required for their engagement.
- **Budget Ceilings & Financial Failsafes**: 
  - Every external campaign must have a hard account-level spending cap and a target CAC threshold of **≤ £18.00**.
  - Automated rules must be configured to kill/pause any creative reaching **£36.00 (2× CAC)** without an attributed conversion.
- **Direct Asset Ownership**: Facebook Pages, Instagram Accounts, TikTok handles, and WhatsApp Business numbers must be registered to ArielMC corporate email addresses (`@arielmc.com` or `@arielmc.shop`), never to an employee’s or contractor’s personal profile.

### 5.2 Phishing & Spoofing Defense (Email Governance)
- **Corporate DNS Mandate**: The corporate Google Workspace domains must enforce:
  - **SPF**: Strictly define authorized mail senders.
  - **DKIM**: 2048-bit cryptographic key signing on all outbound communication.
  - **DMARC**: Enforce a strict rejection policy:  
    `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:dmarc-reports@arielmc.com;`  
    This automatically drops unauthorized emails spoofing ArielMC domains.
- **Impersonation Alerts**: Social media platforms frequently generate phishing attempts disguised as *"Urgent: Trademark Infringement / Ad Account Suspension Imminent"*. Staff and contractors are strictly prohibited from clicking links in ad warnings received via direct message or unverified email. All notices must be verified directly by typing the platform URL into a clean browser session.

---

## 6. Financial Operations & B2B Settlement Safeguards

### 6.1 Business Email Compromise (BEC) & Invoicing Verifications
- **Out-of-Band Callback Verification**: Any request from a supplier (e.g., Savar leather tanneries, Narayanganj textile mills, Shenzhen tech factories) or B2B corporate gifting client to alter bank settlement details, routing codes, or Wise payment emails requires **mandatory dual-channel verification**.
  - The employee processing the payment must contact the verified executive contact via a pre-established telephone number or face-to-face video call prior to releasing funds.
  - **Email confirmation alone is strictly prohibited as a basis for changing banking details.**

### 6.2 Banking Rails & Export Remittance Segregation
- **Wise Business UK Virtual Cards**: Online SaaS platforms, freight handlers, and paid ad channels (Meta/TikTok/Google) must be paid using purpose-dedicated virtual commercial cards with hard monthly balance limits. Physical corporate debit cards must remain locked in the corporate safe in London or kept disabled in the app until authorized for in-person expenditure.
- **Bangladesh Bank Compliance**: All inbound foreign currency remittances into the Authorized Dealer (AD) corporate bank account in Dhaka must be reconciled against valid e-commerce shipping logs, EXP waivers (under **Bangladesh Bank FE Circular No. 48/31**), or vetted B2B export contracts.
- **Export Retention Quota (ERQ) Governance**: ERQ foreign currency expenditures (USD/GBP) are restricted strictly to authorized overseas business operating costs (e.g., UK 3PL storage, ad spend, software tools).

---

## 7. Cross-Border Data Privacy & Physical Device Security

### 7.1 UK GDPR / Data Protection Act Compliance (B2C & B2B Data)
- **Data Minimization**: Customer shipping information (names, delivery addresses, phone numbers) must only be accessed for direct order fulfilment via Royal Mail Tracked 24/48 and UK 3PL integrations.
- **Export Restrictions**: Exporting customer lists into local unencrypted `.csv` or `.xlsx` files on personal computers is strictly forbidden. Customer data analysis must take place within the secured dashboard or protected Google Sheets workspace under two-factor authentication.
- **Purge Cycles**: Customer contact details older than **180 days** must be anonymized or purged from third-party logistics apps, retaining only transactional financial data required for HMRC quarterly VAT returns and Bangladesh Bank audits.

### 7.2 Endpoint Hardware Security (Remote Work & Dhaka Office)
- **Device Encryption**: Full-disk encryption (**FileVault on macOS**; **BitLocker on Windows**) must be permanently activated on every laptop used by Dhaka operations staff and UK personnel.
- **Network Access Control**: Connecting to ArielMC administrative accounts or banking dashboards over public or open Wi-Fi networks (coffee shops, airports, hotel lobbies) is strictly prohibited unless routed through a verified, encrypted corporate VPN tunnel.
- **Physical Clean Desk Policy**: At the Dhaka operational office (**House 30, Road 07, Block C, Niketon, Gulshan, Dhaka**), physical commercial documents—including RJSC files, bank statements, VAT challans, and proforma invoices—must be locked in designated filing cabinets when unattended.

---

## 8. Incident Response Plan & Emergency Kill-Switch Runbook

In the event of suspected unauthorized account access, credential leakage, compromised ad spends, or malware infection, personnel must execute the following response protocol immediately:

```
[ INCIDENT DETECTED ] (ATO, Phishing, Ad Hijack, Stolen Device, Data Exfiltration)
         │
         ▼
STEP 1: ISOLATE & FREEZE (First 5 Minutes)
  ├── Ad Account Compromise: Freeze Meta & TikTok campaigns via Master Portfolio.
  ├── Financial Anomaly: Freeze Wise Virtual Cards immediately via mobile app.
  └── Credential Leak: Initiate Google Workspace global session logout.
         │
         ▼
STEP 2: NOTIFY INCIDENT COMMAND (First 15 Minutes)
  ├── Dhaka Lead: Call +880 2410 811 91 / +880 1819 273458
  ├── UK Operations Desk: Direct telephone escalation to Managing Director.
  └── Log event ticket with timestamp, affected system, and breach vector.
         │
         ▼
STEP 3: CONTAINMENT & REMEDIATION (First 60 Minutes)
  ├── Revoke active OAuth API tokens on Shopify & Stripe UK.
  ├── Rotate master passwords in 1Password / Bitwarden Teams.
  └── Terminate active browser sessions across all user seats.
         │
         ▼
STEP 4: REGULATORY ASSESSMENT (Within 24–72 Hours)
  ├── Evaluate exposure under UK GDPR (Notify UK ICO within 72 hours if customer PII is breached).
  └── Review statutory reporting under Bangladesh Cyber Security guidelines.
```

---

## 9. Audits, Offboarding & Disciplinary Enforcement

1. **Monthly Access Hygiene Recertification**: On the last Friday of every calendar month, the Dhaka Operations Lead and UK Director must review every user seat across Shopify, Amazon Seller Central, Stripe, Meta Business Suite, and Google Workspace. Inactive contractor accounts must be deactivated immediately.
2. **Rapid Offboarding SLA**: Upon contract termination or resignation of any staff member or external contractor, access to all shared password vaults, Google Workspace accounts, and secondary marketplace profiles must be revoked **within sixty (60) minutes** of notice.
3. **Violations & Non-Compliance**: Failure to observe this SOP compromises the cross-border integrity, intellectual property, and financial standing of Ariel Marketing & Communications Limited. Violations will result in disciplinary action up to immediate termination of employment or agency contract, alongside potential civil or criminal litigation under applicable laws of Bangladesh and the United Kingdom.

---

## 10. Managing 3 Website Cyber Security Precautions

Managing three distinct web properties across dual jurisdictions requires strict isolation of the direct-to-consumer store from corporate wholesale pipelines:

### 10.1 Domain Portfolio & DNS Infrastructure Hardening
- **Registrar Locks & Multi-Year Auto-Renew**: Place a strict Transfer Lock and Registry Lock on `arielmc.com`, `arielmc.co.uk`, and `arielmc.shop` with **5-year auto-renewals**. Losing control of any domain halts active ad conversions or compromises executive B2B correspondence.
- **Edge Routing & Cloudflare DNSSEC**: Manage DNS for all three domains behind Cloudflare with DNSSEC enabled to prevent DNS spoofing and cache poisoning.
- **Card-Testing & Bot Defense on `.shop`**: Deploy Web Application Firewall (WAF) rate-limiting on `arielmc.shop`. Fraudsters frequently use automated bot scripts to test stolen credit cards on e-commerce checkouts; elevated decline rates can cause Stripe UK or Shopify Payments to suspend merchant processing.

### 10.2 Invoicing Protection & Anti-Spoofing (DMARC / SPF / DKIM)
- **Anti-Impersonation Records on `.com` and `.co.uk`**: Enforce a strict DMARC rejection policy (`v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`) alongside 2048-bit DKIM keys on both corporate domains. This prevents bad actors from spoofing invoices to institutional B2B buyers.
- **Marketing Subdomain Isolation**: Never send bulk marketing emails directly from `@arielmc.com` or `@arielmc.co.uk`. Confine automated order receipts, abandoned cart reminders, and Klaviyo promotional flows to a dedicated subdomain (e.g., `@mail.arielmc.shop`) to protect corporate sender reputation from spam blacklisting.

### 10.3 Frontend Legal Compliance & Mandatory Disclosures
- **UK Statutory Disclosures (`arielmc.co.uk` & `arielmc.shop`)**: Under the UK Companies Act and e-Commerce Regulations, the footer must display:
  - *Company Name*: Ariel Marketing & Communications Limited
  - *Companies House Registration*: Registered in England & Wales
  - *Registered Office Address*: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
  - *GB VAT Number*: Valid UK VAT registration display.
- **Consent Management (UK GDPR / PECR)**: Implement a certified Consent Management Platform (CMP) on `arielmc.shop` supporting **Google Consent Mode v2**. Meta, TikTok, and Google tracking pixels must remain completely blocked until the user explicitly opts in.
- **Bangladesh Digital Identification (`arielmc.com`)**: To comply with the Ministry of Commerce for digital platforms, display:
  - Dhaka HQ operating address: House 30, Road 07, Block C, Niketon, Gulshan, Dhaka-1212.
  - 13-digit Business Identification Number (BIN).
  - Digital Business Identification (DBID).

### 10.4 Script Hygiene & Storefront Isolation (`arielmc.shop`)
- **Third-Party App Sandboxing**: Maintain a strict Content Security Policy (CSP) to block malicious JavaScript injections (Magecart attacks) designed to scrape customer card data at checkout. Restrict installations strictly to certified "Built for Shopify" apps.
- **Zero Card-Data Storage**: Restrict all checkout actions entirely to native, tokenized Shopify Payments and Stripe UK rails. Never capture payment card numbers, bank routing codes, or CVVs in custom contact forms or customer account notes.

### 10.5 Cross-Domain Routing & SEO Canonicalization
- **Hreflang & Canonical Configuration**: Implement cross-domain canonical and `rel="alternate"` hreflang tags to prevent Google from penalizing duplicate product descriptions or brand copy across `arielmc.co.uk` and `arielmc.shop`.
- **Clean Funnel Separation**: Place an unobtrusive retail banner on `arielmc.com` and `arielmc.co.uk` routing retail consumers directly to `arielmc.shop`. Keep the `.com` and `.co.uk` properties dedicated solely to wholesale inquiries, ESG audit disclosures, and B2B corporate gifting pipelines.

---

## 11. Brand Protection, Payment Fraud & Physical Supply Chain Integrity

### 11.1 Brand Protection & Amazon Hijacking Mitigation
- **UKIPO Trademark & Amazon Brand Registry**: File an immediate Class 18 (leather goods, bags, luggage) trademark with the UK Intellectual Property Office (UKIPO) for the "ArielMC" brand mark. Register the mark with Amazon Brand Registry immediately upon application filing to unlock Project Zero, automated counterfeit takedowns, and Buy Box hijacking defense on Amazon UK.
- **Listing Tampering Monitoring**: Deploy automated ASIN monitoring tools (e.g., SellerApp or Helium 10) to alert the Dhaka team to unauthorized listing changes, title edits, or piggybacking sellers on your private-label listings.

### 11.2 E-Commerce Payment Fraud & Chargeback Defence
- **Strict 3D Secure 2.0 (3DS2) Automation**: Enforce 3DS2 across Shopify DTC checkout via Stripe UK for all orders flagged with elevated risk. Shifting liability to card issuers protects against "friendly fraud" and false "unauthorized purchase" chargeback claims.
- **Postal Proof of Delivery Archiving**: Sync Royal Mail Tracked 24/48 GPS delivery stamps and recipient signature scans automatically into Shopify order histories. Automated dispute pipelines mitigate "Item Not Received" (INR) claims common in UK e-commerce.

### 11.3 Physical Supply Chain & Maritime Integrity
- **Pre-Shipment Third-Party AQL 2.5 Audits**: Mandate that no ocean container leaves Chittagong until a standardized **ISO 2859-1 (AQL 2.5)** inspection sign-off occurs at the Savar and Narayanganj manufacturing facilities. Verifying stitching, zipper pull strength, and EVA foam thickness before export prevents costly UK returns that cannot be re-exported.
- **Moisture Damage & Container Desiccants**: Transiting the Bay of Bengal and Suez Canal exposes full-grain leather and jute to extreme temperature cycles and humidity. Enforce high-absorption container desiccant poles (calcium chloride based) inside shipping containers alongside 50g clay packets in each laptop compartment to stop leather bloom and mold.

### 11.4 Dhaka Office Endpoint & Shadow-IT Hygiene
- **USB & External Media Blocking**: Disable unauthorized USB mass-storage read/write access on all office Mac and Windows workstations via Apple MDM (Jamf Now) or Microsoft Intune to eliminate offline data theft or air-gapped malware vectors.
- **Remote Desktop Software Ban**: Blacklist unsanctioned screen-sharing and remote administration tools (AnyDesk, TeamViewer, UltraViewer) across office routers; mandate secure Zoom/Google Meet sessions for remote UK coordination.

### 11.5 FX Volatility & Remittance Slippage
- **Wise Multi-Currency Balance Locking**: Hold GBP proceeds inside Wise Business UK until optimal exchange windows or schedule auto-conversions into USD/BDT to prevent currency erosion during foreign trade settlements with your Dhaka Authorized Dealer bank.

---

## 12. Employee & Contractor Acknowledgment

```
I hereby acknowledge that I have received, read, understood, and agree to abide by the
Ariel Marketing & Communications Limited Standard Operating Procedure on Information 
Security, Access Control & Platform Governance (SOP-SEC-2026-V1).

• Full Legal Name: __________________________________________________
• Position / Agency Name: ___________________________________________
• Operating Location: [  ] Dhaka, Bangladesh    [  ] London / Remote, UK
• Signature: ________________________________________________________
• Date: ________________________
```

---
*Enforced by the Board of Directors & IT Directorate — Ariel Marketing & Communications Limited.*
