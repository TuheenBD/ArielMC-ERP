-- ==============================================================================
-- ArielMC ERP - Master PostgreSQL Schema (Supabase Database Migration)
-- ==============================================================================
-- Architecture: High-Performance Multi-Entity Global Sourcing & Supply Chain ERP
-- Covering: Products, Factories, SDOs, Sales Orders, Purchase Orders, CRM Leads,
--           Warehouses, Global Inventory, Stock Transfers & Dual-Track Finance.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE 1: PRODUCTS (Sector Master SKUs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    ean_barcode TEXT,
    style_code TEXT,
    packaging_mode TEXT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL CHECK (sector IN ('LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS')),
    category TEXT NOT NULL,
    hs_code TEXT NOT NULL,
    description TEXT,
    unit TEXT DEFAULT 'PCS',
    dimensions TEXT,
    weight_kg NUMERIC(8,3) DEFAULT 0.000,
    tags TEXT[] DEFAULT '{}',
    target_markets TEXT[] DEFAULT '{}',
    costing JSONB NOT NULL DEFAULT '{}'::jsonb,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    compliance_certificates TEXT[] DEFAULT '{}',
    partner_factory JSONB NOT NULL DEFAULT '{}'::jsonb,
    sample_status TEXT DEFAULT 'PROTO_REQUESTED',
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sector ON products(sector);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- ==============================================================================
-- TABLE 2: FACTORIES (Bangladesh Manufacturing & Compliance Network)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS factories (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sectors TEXT[] NOT NULL DEFAULT '{}',
    cluster TEXT NOT NULL,
    factory_address TEXT NOT NULL,
    contact_person TEXT,
    designation TEXT,
    phone TEXT,
    email TEXT,
    trade_license_no TEXT,
    bin_number TEXT,
    tin_number TEXT,
    epb_registration_no TEXT,
    tier TEXT DEFAULT 'TIER_1_PREFERRED',
    capacity JSONB DEFAULT '{}'::jsonb,
    scorecard JSONB DEFAULT '{}'::jsonb,
    compliance_audits JSONB DEFAULT '[]'::jsonb,
    lead_time_days INT DEFAULT 30,
    minimum_order_quantity INT DEFAULT 100,
    payment_terms TEXT DEFAULT '30% Advance, 70% against BL copy',
    bank_details JSONB DEFAULT '{}'::jsonb,
    associated_skus TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_factories_cluster ON factories(cluster);
CREATE INDEX IF NOT EXISTS idx_factories_tier ON factories(tier);

-- ==============================================================================
-- TABLE 3: SAMPLE DEVELOPMENT ORDERS (R&D, Tech Packs & Sampling)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sample_development_orders (
    id TEXT PRIMARY KEY,
    sdo_number TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    style_name TEXT NOT NULL,
    style_code TEXT NOT NULL,
    sampling_tier TEXT,
    sop_reference TEXT,
    associated_product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    buyer_company TEXT NOT NULL,
    buyer_contact TEXT,
    target_market TEXT NOT NULL,
    factory_id TEXT,
    factory_name TEXT,
    stage TEXT NOT NULL DEFAULT 'PROTO',
    round_number INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'IN_FABRICATION',
    request_date DATE,
    target_delivery_date DATE,
    actual_approval_date DATE,
    tech_pack JSONB DEFAULT '{}'::jsonb,
    courier JSONB DEFAULT '{}'::jsonb,
    costing JSONB DEFAULT '{}'::jsonb,
    reimbursement_terms JSONB DEFAULT '{}'::jsonb,
    qa_dossier JSONB DEFAULT '{}'::jsonb,
    waybill_labelling TEXT,
    feedbacks JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sdos_buyer ON sample_development_orders(buyer_company);
CREATE INDEX IF NOT EXISTS idx_sdos_status ON sample_development_orders(status);
CREATE INDEX IF NOT EXISTS idx_sdos_style_code ON sample_development_orders(style_code);

-- ==============================================================================
-- TABLE 4: SALES ORDERS (Two-Way Order Management System - Buyer SO & Factory PO)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sales_orders (
    id TEXT PRIMARY KEY,
    so_number TEXT UNIQUE NOT NULL,
    buyer_company TEXT NOT NULL,
    buyer_contact TEXT,
    target_market TEXT NOT NULL,
    operating_entity TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    incoterm TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    order_date DATE NOT NULL,
    target_ex_factory_date DATE,
    target_port_cut_off_date DATE,
    target_delivery_date DATE,
    payment_terms TEXT,
    master_lc_number TEXT,
    total_quantity INT NOT NULL DEFAULT 0,
    total_amount_buyer_currency NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_amount_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    linked_po JSONB NOT NULL DEFAULT '{}'::jsonb,
    margin_protection JSONB NOT NULL DEFAULT '{}'::jsonb,
    time_and_action JSONB NOT NULL DEFAULT '[]'::jsonb,
    inspections JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_orders_buyer ON sales_orders(buyer_company);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);

-- ==============================================================================
-- TABLE 5: CRM LEADS (Global Wholesale Accounts & Pipeline)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS crm_leads (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    tier TEXT DEFAULT 'TIER_1',
    market TEXT NOT NULL,
    country TEXT NOT NULL,
    channel TEXT,
    contact TEXT,
    role TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    focus TEXT,
    interest TEXT,
    priority TEXT DEFAULT 'MEDIUM',
    stage TEXT DEFAULT 'NEW_LEAD',
    value NUMERIC(12,2),
    next_action TEXT,
    next_date TEXT,
    last_contact TEXT,
    touches INT DEFAULT 1,
    owner TEXT DEFAULT 'Tuheen Hassan',
    notes TEXT,
    source TEXT DEFAULT 'WEBSITE',
    cur TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_market ON crm_leads(market);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);

-- ==============================================================================
-- TABLE 6: WAREHOUSES (Multi-Location Global Logistics Facilities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,
    city TEXT NOT NULL,
    flag TEXT NOT NULL,
    capacity_cbm NUMERIC(8,2) DEFAULT 0.00,
    current_utilization_pct NUMERIC(5,2) DEFAULT 0.00,
    operator TEXT,
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    climate_controlled BOOLEAN DEFAULT true,
    active_shipments_inbound INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 7: INVENTORY ITEMS (Master Stock Ledger & Allocations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    category TEXT NOT NULL,
    warehouse_id TEXT,
    warehouse_code TEXT NOT NULL,
    warehouse_name TEXT NOT NULL,
    on_hand_qty INT NOT NULL DEFAULT 0,
    reserved_qty INT NOT NULL DEFAULT 0,
    available_qty INT NOT NULL DEFAULT 0,
    in_transit_qty INT NOT NULL DEFAULT 0,
    safety_stock_min INT DEFAULT 100,
    reorder_point INT DEFAULT 200,
    unit_cost_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_valuation_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    daily_run_rate NUMERIC(6,2) DEFAULT 0.00,
    days_of_inventory_remaining INT DEFAULT 30,
    health_status TEXT DEFAULT 'OPTIMAL',
    allocations JSONB NOT NULL DEFAULT '{}'::jsonb,
    provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_physical_audit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory_items(warehouse_code);
CREATE INDEX IF NOT EXISTS idx_inventory_health ON inventory_items(health_status);

-- ==============================================================================
-- TABLE 8: STOCK TRANSFERS (Inter-Warehouse & Maritime Corridors)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS stock_transfers (
    id TEXT PRIMARY KEY,
    transfer_order_number TEXT UNIQUE NOT NULL,
    sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    source_warehouse_code TEXT NOT NULL,
    destination_warehouse_code TEXT NOT NULL,
    units_to_transfer INT NOT NULL DEFAULT 0,
    channel_destination TEXT NOT NULL,
    mode_of_transport TEXT NOT NULL,
    carrier TEXT NOT NULL,
    tracking_or_container_number TEXT NOT NULL,
    departure_date DATE NOT NULL,
    estimated_arrival_date DATE NOT NULL,
    status TEXT DEFAULT 'IN_TRANSIT',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 9: DUAL-TRACK FINANCE & P&L STATEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pnl_records (
    id TEXT PRIMARY KEY,
    fiscal_year TEXT NOT NULL,
    total_volume_units INT DEFAULT 0,
    b2c_units INT DEFAULT 0,
    b2b_units INT DEFAULT 0,
    gross_commercial_turnover_usd NUMERIC(14,2) DEFAULT 0.00,
    net_commercial_revenue_usd NUMERIC(14,2) DEFAULT 0.00,
    gross_profit_usd NUMERIC(14,2) DEFAULT 0.00,
    ebitda_usd NUMERIC(14,2) DEFAULT 0.00,
    ebitda_margin_pct NUMERIC(5,2) DEFAULT 0.00,
    tax_provision_usd NUMERIC(14,2) DEFAULT 0.00,
    retained_net_profit_usd NUMERIC(14,2) DEFAULT 0.00,
    blended_net_margin_pct NUMERIC(5,2) DEFAULT 0.00,
    b2c_lines JSONB DEFAULT '[]'::jsonb,
    b2b_lines JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_development_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pnl_records ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated users & anon demo access
CREATE POLICY "Public Read Access Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Write Access Products" ON products FOR ALL USING (true);

CREATE POLICY "Public Read Access Factories" ON factories FOR SELECT USING (true);
CREATE POLICY "Public Write Access Factories" ON factories FOR ALL USING (true);

CREATE POLICY "Public Read Access SDOs" ON sample_development_orders FOR SELECT USING (true);
CREATE POLICY "Public Write Access SDOs" ON sample_development_orders FOR ALL USING (true);

CREATE POLICY "Public Read Access Orders" ON sales_orders FOR SELECT USING (true);
CREATE POLICY "Public Write Access Orders" ON sales_orders FOR ALL USING (true);

CREATE POLICY "Public Read Access Leads" ON crm_leads FOR SELECT USING (true);
CREATE POLICY "Public Write Access Leads" ON crm_leads FOR ALL USING (true);

CREATE POLICY "Public Read Access Warehouses" ON warehouses FOR SELECT USING (true);
CREATE POLICY "Public Write Access Warehouses" ON warehouses FOR ALL USING (true);

CREATE POLICY "Public Read Access Inventory" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Public Write Access Inventory" ON inventory_items FOR ALL USING (true);

CREATE POLICY "Public Read Access Transfers" ON stock_transfers FOR SELECT USING (true);
CREATE POLICY "Public Write Access Transfers" ON stock_transfers FOR ALL USING (true);

CREATE POLICY "Public Read Access PnL" ON pnl_records FOR SELECT USING (true);
CREATE POLICY "Public Write Access PnL" ON pnl_records FOR ALL USING (true);

-- ==============================================================================
-- AUTOMATIC updated_at TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_factories_updated_at ON factories;
CREATE TRIGGER trg_factories_updated_at BEFORE UPDATE ON factories FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_sdos_updated_at ON sample_development_orders;
CREATE TRIGGER trg_sdos_updated_at BEFORE UPDATE ON sample_development_orders FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_sales_orders_updated_at ON sales_orders;
CREATE TRIGGER trg_sales_orders_updated_at BEFORE UPDATE ON sales_orders FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_crm_leads_updated_at ON crm_leads;
CREATE TRIGGER trg_crm_leads_updated_at BEFORE UPDATE ON crm_leads FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON inventory_items;
CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
