# ArielMC Project Rules & Brand Guidelines

## Brand Name Spelling & Typography
- **Exact Official Brand Name**: `ArielMC`
- **Strict Rule**: Always write the brand name exactly as **`ArielMC`**.
  - Capital **A**
  - Lowercase **riel**
  - Capital **M**
  - Capital **C**
  - **No space** between "Ariel" and "MC".

### Prohibited Variations in Text & Copy:
- ❌ Do NOT write `Ariel MC`
- ❌ Do NOT write `Arielmc`
- ❌ Do NOT write `arielmc` (except in email addresses e.g. `info@arielmc.com`, URLs, or social handles)
- ❌ Do NOT write `ARIELMC` (except in UPPER_CASE code constants like `ARIELMC_CRM_WEBHOOK_URL`)

## Core Pillars & National Pride
ArielMC strictly focuses on Bangladesh's generational pride manufacturing sectors:
1. **Golden Jute (Sonali Aash)** — 100% natural fiber, river heritage.
2. **Master Leather & Goods** — Full-grain artisan craftsmanship, LWG-audited.
3. **Ethical RMG, Wovens & Linens** — Sedex/BSCI audited, living wage dignity.
4. **Pottery & Architectural Terracotta** — Centuries-old Bengal clay traditions.
5. **Fine Ceramics & Tableware** — Export-grade bone china and porcelain.

## Mandatory Enterprise Eco-System Implementation Sequence
Whenever ANY information, feature, product specification, pricing, or data update is implemented in the ArielMC Enterprise Eco-System, it **MUST ALWAYS** be implemented strictly in this serial order:

1. **ERP** (`ArielMC-ERP` / `erp.arielmc.com` / Port 3001)
   - Master source of truth for: Costing, Sourcing Vault, Factory MoUs, BOM, Factory Purchase Cost, Published FOB, Commercial Margins, Cash Incentive Net Yields, and Sector Technical Attributes.
2. **CRM** (`Master-CRM` / `crm.arielmc.com`)
   - Buyer pipeline, strategic accounts, quote requests, lead status, sample tracking (SOP-B2B-SMP-2026-V1), and client communication records.
3. **Catalog** (`arielmc-catalog` / `catalog.arielmc.com` / Port 3000)
   - B2B digital export compendium, interactive filtering, HS code compliance, logistics/CBM packaging, spec sheets, and deep-link discovery.
4. **Website** (`arielmc-website` / `www.arielmc.com` / Port 8080)
   - Public corporate showcase, department indices, hero flagship curation, marketing stories, and buyer gateway touchpoints.

### Cross-Platform Verification & Sync Check
After completing the sequence, you **MUST** run cross-platform verification to ensure data consistency, layout integrity, and operational synchronization across all 4 platforms before declaring any task complete.

## Canonical 5-Division Department Serial Hierarchy
Everywhere products, filters, navigation, or indices are rendered, they must strictly follow this canonical serial order:

### 01 THE LEATHER COMPENDIUM
1. Structured Carry & Bags
2. Handcrafted Leather Bags
3. Wallets & Small Leather Goods
*(Planned roadmap: Everyday Carry & SLGs, Tech & Workspace, Travel & Voyage, Wardrobe Accents)*

### 02 THE GOLDEN FIBER EDIT
1. Everyday Carry & Bags
2. Modern Living & Décor
3. Tech & Eco-Stationery
4. Eco-Packaging & Gifting

### 03 THE CERAMIC INDEX
1. Dinnerware & Tabletop
2. Drinkware & Café
3. Modern Living & Decor
4. Culinary Serving & Hospitality

### 04 THREAD & WEAVE
1. Canvas Tote Bags
*(Planned roadmap: RMG: Knitwear & Basics, RMG: Woven Apparel, Bedding & Sleep Linens, Bath & Towels, Dining & Kitchen Textiles)*

### 05 EARTH & FORM
1. Botanical & Garden
2. Tabletop & Hospitality
3. Home Living & Décor
4. Architectural Elements


## Ariel Group / Holdings Corporate Architecture & Sovereign Platform Mapping
Under **Ariel Group / Holdings**, the enterprise operates through two dedicated sovereign platforms that interconnect via the Quad-Bus Architecture:

1. **`ArielMC-ERP`** (`ArielMC-ERP` / `erp.arielmc.com` / Port 3001)
   - **Dedicated Legal Entity**: `Ariel Marketing & Communications Limited`
   - **Primary Brand**: `ArielMC`
   - **Enterprise Mandate**: Core B2B / B2C / D2C Global Sourcing & Supply Chain Business worldwide (Leather, Jute, Ceramics, RMG, Pottery/Terracotta across BD, UK, USA, EU, AU operating stations).

2. **`Ariel - SaaS`** (`Ariel-SaaS` / `energy.arielmc.com` / Port 3002)
   - **Dedicated Legal Entity**: `Ariel Renewable Energy Limited` (`AREL`)
   - **Primary Brand**: `Ariel - SaaS™` / `Ariel Renewable Energy`
   - **Enterprise Mandate**: Core Sovereign Renewable Energy Business in Bangladesh (Turnkey Commercial & Industrial [C&I] Rooftop Solar EPC, SREDA Net-Metering, Bangladesh Bank SFD 4.5% Green Debt Refinance Desk, Subcontractor & IEB Body Management, SCM & ASYCUDA Box 44 Customs Control, and IoT Telemetry).

3. **Enterprise Connectivity & Inter-Platform Protocol**:
   - Both platforms operate as sovereign corporate entities but remain seamlessly interconnected under **Ariel Group / Holdings**.
   - Footers, legal copyrights, branding, and entity notices must strictly reflect this separation (`ArielMC-ERP` $\rightarrow$ `Ariel Marketing & Communications Limited`; `Ariel - SaaS` $\rightarrow$ `Ariel Renewable Energy Limited`).
   - Data exchange between `ArielMC-ERP` and `Ariel - SaaS` is mediated through the high-speed Quad-Platform Synchronization Bus and shared digital asset infrastructure.

## Central Digital Asset Management (DAM) Architecture
All product and supplier media assets are stored in the unified central asset vault:
- **Central Storage Path**: `ArielMC-Enterprise-Hub/shared-assets/`
  - `products/{compendium-slug}/{department-slug}/{sku}/` (e.g. `products/01-the-leather-compendium/structured-carry-bags/LD-SCB-6/ld-scb-6.jpg`)
  - `suppliers/{supplier-code}_{supplier-name}/`
  - `buyers/`
- **Zero-Duplication Unified Access**:
  - `arielmc-website/shared-assets` -> symlinked to `shared-assets/` (served at `/shared-assets/...`)
  - `arielmc-catalog/public/shared-assets` -> symlinked to `shared-assets/` (served at `/shared-assets/...`)
  - `ArielMC-ERP/public/shared-assets` -> symlinked to `shared-assets/` (served at `/shared-assets/...`)
- **Strict Rule**: When uploading or enlisting new product photos, place them directly inside the SKU folder in `shared-assets/products/{compendium-slug}/{department-slug}/{sku}/`. They are instantly and simultaneously available across Website, Catalog, and ERP with zero file copying.
