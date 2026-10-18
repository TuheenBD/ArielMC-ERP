# ArielMC Global Sourcing & Dual-Hub E-Commerce ERP: Master Operational Handbook
> **Classification**: Proprietary Corporate Operating System Handbook  
> **Headquarters**: Ariel Marketing & Communications Ltd, Dhaka, Bangladesh  
> **Regional Operating Stations**: United Kingdom (`WH-UK`), Germany / European Union (`WH-DE`), United States (`WH-US`)  
> **Target Trade Corridor**: Dhaka (Production / Export) ➔ Chattogram Seaport (CTG) ➔ Dual 3PL Hubs (Felixstowe / Northampton & Hamburg / Rotterdam) ➔ Multi-Channel Fulfillment (Amazon FBM/FBA, Etsy, Shopify DTC, Direct B2B Wholesale)

---

## Executive Overview & System Purpose

This Operational Handbook defines the end-to-end standard operating procedures (SOP), supply chain logistics, customs compliance, multi-channel pricing, and inventory routing architecture for **ArielMC Enterprise ERP**. 

**Primary Strategic Mandate**: Replace horizontal, generic ERP software (such as Odoo, Linnworks, or Katana) with our 100% sovereign, tailor-made ERP engine. ArielMC ERP natively executes multi-warehouse geographic order routing, hybrid Amazon FBA/FBM replenishment, Bangladesh Bank foreign exchange compliance, and multi-station VAT accounting at **$0 recurring software licensing overhead**.

---

## Part 1: Dual 3PL Hub Architecture & Automated Geographic Routing

```
                          [Dhaka Central Sourcing & Production Hub]
                                            │
                                            ▼
                           [Chattogram Seaport (CTG), Bangladesh]
                                            │
                  ┌─────────────────────────┴─────────────────────────┐
                  ▼ (Direct Ocean / LCL Option A)                     ▼ (Direct Ocean / LCL Option A)
   [UK 3PL Hub: Felixstowe / Northampton]            [Germany 3PL Hub: Hamburg / Rotterdam]
   (Davies Turner / PackPro / Huboo)                  (Dachser / Alaiko / Byrd)
                  │                                                   │
        ┌─────────┴─────────┐                               ┌─────────┴─────────┐
        ▼                   ▼                               ▼                   ▼
   [UK B2C Orders]    [UK B2B Orders]                 [EU B2C Orders]     [EU B2B Orders]
   (Royal Mail 48)     (Palletline)                   (DHL Paket / DPD)  (Schenker/Dachser)
```

### 1.1 Automated Geographic Order Routing Rules
ArielMC ERP inspects every incoming sales order (from Shopify DTC, Amazon FBM, Etsy API, or manual B2B quotation) and automatically routes fulfillment based on destination country:

| Destination Territory | ISO Country Codes | Assigned Warehouse | Primary Carrier Service | Delivery SLA |
| :--- | :--- | :--- | :--- | :--- |
| **United Kingdom** | `GB`, `UK`, `IM`, `JE`, `GG` | `WH-UK` (Felixstowe / Northampton) | Royal Mail Tracked 48 / 24, Evri, Palletline | 24 – 48 Hours |
| **Germany (Domestic)** | `DE` | `WH-DE` (Hamburg / Ruhr) | DHL Paket National, DPD Classic | 24 – 48 Hours |
| **Pan-European Union** | `FR`, `IT`, `ES`, `NL`, `BE`, `AT`, `SE`, `DK`, `PL`, `IE`, `CZ` | `WH-DE` (Hamburg / Ruhr) | DHL Paket International (EU Zone 1), Dachser | 2 – 4 Days |
| **Rest of World / DDP** | All other destinations | Direct from Dhaka or Regional Hub | DHL Express Worldwide / FedEx DDP | 3 – 5 Days |

### 1.2 Storefront Configuration
1. **Shopify DTC (`www.arielmc.shop`)**: Multi-location inventory configured with `UK Warehouse` and `DE Warehouse`. Geo-IP routing presents GBP/Royal Mail to UK visitors and EUR/DHL Paket to EU visitors.
2. **Amazon FBM**: Two distinct Shipping Templates in Seller Central (UK template with domestic UK transit times; DE template with German domestic carriers). Same-day tracking upload compliance ($\le 24$ hours).
3. **Etsy**: Distinct origin postal profiles for UK and EU buyers to eliminate default extended transit estimates.

### 1.3 Dual Tax & Regulatory Identifiers
- **United Kingdom (`ARIEL_UK`)**:
  - HMRC VAT Registration Number (Standard 20% UK VAT on domestic sales)
  - GB EORI Number (linked to customs broker & courier accounts)
  - UK EPR (Extended Producer Responsibility) packaging compliance
- **European Union / Germany (`ARIEL_EU`)**:
  - German VAT ID (*USt-IdNr.*) for German domestic sales (19% VAT)
  - EU EORI Number (prefixed with `DE`)
  - EU One-Stop Shop (OSS) registration for intra-EU cross-border B2C distance sales
  - LUCID (*VerpackG*) registration with a licensed dual system (e.g., Interseroh / Der Grüne Punkt)

---

## Part 2: Sea Freight Strategy & Maritime Cargo Protection

### 2.1 Ocean Freight Shipping Options from Chattogram (CTG)
- **Option A: Split at Origin (Recommended for FCL or steady LCL)**:
  - Separate bookings at Chattogram Seaport directly to **Felixstowe / London Gateway (UK)** and **Hamburg / Rotterdam (Germany)**.
  - *Advantage*: Clean separation of Bills of Lading, zero double-handling fees, independent customs clearance.
- **Option B: Mother Shipment to Rotterdam + Bonded T1 Transit (Best for combined single FCL)**:
  - Discharge entire container at Rotterdam / Hamburg bonded Container Freight Station (CFS).
  - Clear EU cargo directly into Germany; move UK portion under a **T1 transit document** via bonded truck across the English Channel to `WH-UK`, where UK import duty and VAT are settled.

### 2.2 Sea Transit Risk Controls (35–45 Day Equatorial Voyage)
Leather and jute are hygroscopic natural materials prone to humidity damage, container rain, mold, and leather creasing during transit:
1. **Silica & Desiccant Protocol**:
   - Every individual bag cavity must contain a **5g–10g clay or silica gel packet**.
   - Container interior walls must hang industrial **calcium chloride desiccant poles** (Absortech / Super Dry) at 1 pole per 10 linear feet.
2. **Stuffing & Non-Woven Dustbags**:
   - Full-grain leather totes (Styles 2 & 3) must be lightly stuffed with **acid-free tissue paper** and sealed in breathable non-woven dustbags. Unstuffed stacking causes permanent structural creasing and cold micro-cracking upon arrival in European winter.
3. **Phytosanitary & Fumigation Protocol**:
   - Jute-Cotton totes strictly require **Chittagong DAE (Department of Agricultural Extension) Phytosanitary Certification** and third-party container fumigation certificates prior to vessel departure.

---

## Part 3: Product Line Specifications, HS Codes & 0% Preferential Duty

### 3.1 Product Portfolio Specifications
1. **Full-Grain Leather Totes (Styles 2 & 3)**:
   - *Materials*: Savar LWG certified vegetable-tanned cowhide, drop handles, interior organizers, zip/magnetic toggle closures.
   - *Colors*: Deep burgundy/merlot, charcoal/slate, British tan.
   - *Packaging*: 10–12 units per master carton separated by corrugated dividers.
2. **Denim-Leather Embroidered Laptop Tote ("Bloom" Series)**:
   - *Materials*: Narayanganj heavyweight cotton denim shell with floral embroidery, Savar vegetable-tanned leather trim, recessed brass zipper, suspended high-density EVA laptop compartment.
   - *Packaging*: 15–20 units per master carton.
3. **Structured Jute-Cotton Shopper Tote**:
   - *Materials*: Heavyweight 320–350 GSM natural jute-cotton blend, 0.02mm food-grade PP inner moisture barrier, continuous gussets, heavy-duty webbing handles.
   - *Packaging*: Flat packed in polybags, 25–50 units per master carton.

### 3.2 Customs Classification & Preferential Tariffs
| Product Line | Harmonized System (HS) Code | EU Import Duty Rate | UK Import Duty Rate | Required Customs Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **Leather Handbags / Totes** | `HS 4202.21` | **0.0%** (EBA preferential) | **0.0%** (DCTS Comprehensive) | REX statement of origin on invoice; Savar tannery REACH certificate |
| **Denim-Leather Laptop Tote** | `HS 4202.22` / `4202.92` | **0.0%** (EBA preferential) | **0.0%** (DCTS Comprehensive) | REX statement of origin; ISO 105-X12 crocking test certificate |
| **Jute-Cotton Shopper Tote** | `HS 4202.92` / `6305.10` | **0.0%** (EBA preferential) | **0.0%** (DCTS Comprehensive) | DAE Phytosanitary cert; container fumigation cert; REX origin |

- **EU Everything But Arms (EBA)**: 0% import duty into Germany/EU under GSP EBA. Requires standard Registered Exporter (REX) origin declaration on commercial invoice.
- **UK Developing Countries Trading Scheme (DCTS)**: 0% duty into the UK under Comprehensive Preferences with standard origin declaration.

### 3.3 Pallet Specifications
- **UK 3PL (`WH-UK`)**: Standard UK Pallet ($1200\text{ mm} \times 1000\text{ mm}$).
- **German 3PL (`WH-DE`)**: Standard Euro Pallet ($1200\text{ mm} \times 800\text{ mm}$).

---

## Part 4: Logistics & 3PL Cost Anatomy (Benchmark Figures)

| Operational Cost Segment | UK 3PL Hub (`WH-UK`) | German / EU Hub (`WH-DE`) | Billing Metric |
| :--- | :--- | :--- | :--- |
| **Ocean Freight (LCL)** | $80 – $145 / CBM (Felixstowe/Soton) | $75 – $140 / CBM (Hamburg/Rotterdam) | W/M (Weight or Measurement) |
| **Customs Clearance** | £65 – £110 per entry | €70 – €120 per entry | Per Bill of Lading |
| **Port Handling & CFS** | £180 – £350 per shipment | €200 – €380 per shipment | Per container / consignment |
| **Pallet Storage** | £14.00 – £22.00 / pallet / month | €14.00 – €24.00 / pallet / month | Per standard pallet footprint |
| **B2C Pick & Pack (Base unit)** | £1.20 – £1.90 per order | €1.40 – €2.20 per order | 1st unit dispatched |
| **Additional Item Pick** | £0.25 – £0.45 per unit | €0.30 – €0.50 per unit | Same order addition |
| **Packaging Box & Tissue** | £0.40 – £0.90 per box | €0.45 – €1.10 per box | Single/double-wall tote box |
| **B2C Last-Mile Courier** | £2.85 – £3.40 (Royal Mail Tracked 48) | €3.85 – €4.60 (DHL Paket National) | Standard parcel 0–2 kg tracked |
| **B2B Outbound Pallet** | £45 – £85 (Palletways / Palletline) | €55 – €110 (Schenker / Dachser) | Distance tiered per pallet |

---

## Part 5: Channel Strategy & Per-Unit Profitability Simulation

### 5.1 Style 2/3 Leather Tote Unit Economics (Retailing at €120.00 incl. 19% German VAT)

$$\text{Gross Selling Price: } €120.00$$
$$\text{Less 19\% German VAT: } -€19.16 \implies \text{Net Sales Revenue: } €100.84$$
$$\text{Less Landed Product Cost (Dhaka FOB + Ocean Share): } -€28.00$$
$$\text{Less 3PL Outbound Fulfillment (Pick \& Pack + Box + DHL Paket): } -€7.50$$
$$\mathbf{\text{Remaining Operating Margin Pool: } €65.34}$$

| Financial Metric | Amazon FBM | Etsy | Shopify DTC | B2B Wholesale (€50 ex-VAT) |
| :--- | :--- | :--- | :--- | :--- |
| **Gross Order Value** | €120.00 | €120.00 | €120.00 | €50.00 |
| **Platform Commission** | -€18.00 (15%) | -€7.80 (6.5%) | €0.00 | €0.00 |
| **Payment Gateway** | €0.00 (included) | -€5.10 (4% + €0.30) | -€2.30 (~1.7% + €0.25) | -€0.20 (SEPA transfer) |
| **Listing / Renewal Fee** | €0.00 | -€0.19 ($0.20) | €0.00 | €0.00 |
| **Customer Acquisition / Ads** | €0.00 (organic traffic) | €0.00 – €18.00 (optional) | -€25.00 (Meta / Google ads) | €0.00 (direct sales) |
| **Total Channel Sales Cost** | -€18.00 | -€13.09 | -€27.30 | -€0.20 |
| **Net Contribution Profit** | **€47.34 (~39%)** | **€52.25 (~44%)** | **€38.04 (~32%)** | **€18.00 (~36%)** |

---

## Part 6: The Recommended Hybrid Amazon Strategy (FBA + FBM)

Rather than choosing pure FBA or pure FBM, ArielMC ERP implements a **Dynamic Hybrid Replenishment Model**:

1. **Drip-Feed 30–45 Days to Amazon FBA**:
   - Fast-moving SKUs (Jute-Cotton Shoppers, Bloom Laptop Totes) are pallet-transferred from `WH-UK` or `WH-DE` in small batches into Amazon Fulfillment Centers.
   - *Benefit*: Unlocks the Prime badge, captures Buy Box algorithm priority ($3\times–5\times$ conversion multiplier), while eliminating aged-inventory surcharges.
2. **Keep High-Ticket Leather Totes on FBM**:
   - Styles 2 & 3 remain 100% stored at `WH-UK` and `WH-DE`, listed as Seller-Fulfilled (FBM).
   - *Benefit*: Protects delicate leather from automated Amazon warehouse mishandling. In case of customer return, 3PL provides white-glove inspection, leather wipe, dustbag replacement, and restock (preventing unwarranted liquidation).
3. **Preserve B2B Wholesale Flexibility**:
   - Stock remains unencumbered in our private 3PL for wholesale boutique and corporate gift dispatch without Amazon Multi-Channel Fulfillment (MCF) surcharges.

---

## Part 7: Two-Tier B2B Sample Dispatch Protocol

1. **Tier 1: Off-the-Shelf Catalog Production Samples**:
   - Small buffer of finished production units stored at `WH-UK` and `WH-DE`.
   - Domestic dispatch within 24–48 hours via Royal Mail or DHL Paket to prospective UK/EU buyers upon request.
2. **Tier 2: Custom OEM / Prototype Development Samples**:
   - Dispatched directly from Dhaka R&D sample room via DHL Express or FedEx Priority on DDP terms.
   - Commercial invoices clearly marked: *"Mutilated Samples — Not for Resale"*.
   - Courier account linked directly to GB EORI / DE EORI to ensure zero customs delays.

---

## Part 8: How ArielMC ERP Replaces Odoo

ArielMC ERP replaces Odoo's multi-company, multi-warehouse, and multi-channel modules with native, high-performance features:

| Odoo Requirement (from PDF) | How Odoo Does It | How ArielMC ERP Executes It Better |
| :--- | :--- | :--- |
| **Multi-Company Accounting** | Odoo Custom Plan ($37/user/mo) with separate fiscal localizations | **Native Sovereign Entity Isolation** (`ARIEL_UK`, `ARIEL_EU`, `ARIEL_US`, `ARIEL_BD`) with live multi-currency consolidated P&L. |
| **Geographic Routing** | Low-code Python script inside Odoo Server Actions | **Native Rule-Based Routing Engine** built into the order ingestion flow. |
| **Storefront Connectors** | $400–$800 one-time app store modules (Emipro) that break on upgrades | **Native Webhook Listeners** for Shopify, Amazon SP-API, and Etsy. |
| **3PL Dispatch Feed** | Scheduled cron job exporting CSV/EDI to 3PL SFTP | **1-Click 3PL Daily Dispatch Manifest** generation + REST API dispatch triggers. |
| **Tracking Feedback Loop** | 3PL webhook updates stock picking; updates marketplace | **Automated Tracking Ingestion**; updates order status and customer notification. |
| **Annual Running Cost** | **$4,500 – $6,200 (Year 1) / $2,000–$2,600 (Year 2+)** | **$0 License Fees, $0 Connector Fees, 100% Enterprise Ownership**. |

---

*Document registered as Master Operational Handbook in the ArielMC ERP Enterprise Repository.*
