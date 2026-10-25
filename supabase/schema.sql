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
-- TABLE 10: VOUCHERS (Standard Cash Purchase, Money Receive & Multi-Currency Ledger)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS vouchers (
    id TEXT PRIMARY KEY,
    voucher_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('CASH_PURCHASE', 'CASH_RECEIVE')),
    date DATE NOT NULL,
    main_account_head TEXT NOT NULL,
    sub_category_head TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    exchange_rate_to_bdt NUMERIC(10,4) NOT NULL DEFAULT 1.0000,
    party_name TEXT NOT NULL,
    party_details TEXT,
    linked_order_number TEXT,
    buyer_country TEXT,
    payment_mode TEXT NOT NULL,
    bank_reference TEXT,
    tax_chalan_ref TEXT,
    station_code TEXT DEFAULT 'ARIEL_BD',
    station_bank_name TEXT,
    station_account_number TEXT,
    channel TEXT,
    channel_transaction_ref TEXT,
    is_station_b2c_inflow BOOLEAN DEFAULT false,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_amount_bdt NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    amount_in_words TEXT NOT NULL,
    prepared_by TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    approved_by TEXT NOT NULL,
    claimant_or_depositor TEXT NOT NULL,
    physical_attachment JSONB,
    audit_status TEXT DEFAULT 'VERIFIED',
    is_local_value_addition BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_date ON vouchers(date);
CREATE INDEX IF NOT EXISTS idx_vouchers_type ON vouchers(type);
CREATE INDEX IF NOT EXISTS idx_vouchers_station ON vouchers(station_code);
CREATE INDEX IF NOT EXISTS idx_vouchers_account_head ON vouchers(main_account_head);

-- ==============================================================================
-- TABLE 11: ACCOUNT HEADS (Master Chart of Accounts & Subcategories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS account_heads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    sub_categories JSONB DEFAULT '[]'::jsonb,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_heads_type ON account_heads(type);

-- ==============================================================================
-- TABLE 12: COMPLIANCE RECORDS (Bangladesh 34-Step Statutory Legal Matrix)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS compliance_records (
    id TEXT PRIMARY KEY,
    checklist_id INT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    description TEXT,
    step_sequence INT NOT NULL,
    step_title TEXT,
    govt_fee_estimate TEXT,
    agency_fee_estimate TEXT,
    total_budget_estimate TEXT,
    destination_market_audit TEXT,
    document_id TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'PENDING_UPLOAD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_records(status);
CREATE INDEX IF NOT EXISTS idx_compliance_step ON compliance_records(step_sequence);

-- ==============================================================================
-- TABLE 13: POS REGISTER SHIFTS (Showroom Cash Register Sessions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pos_register_shifts (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL,
    cashier TEXT NOT NULL,
    opened_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    opening_float NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    cash_sales NUMERIC(12,2) DEFAULT 0.00,
    card_sales NUMERIC(12,2) DEFAULT 0.00,
    wire_sales NUMERIC(12,2) DEFAULT 0.00,
    mobile_sales NUMERIC(12,2) DEFAULT 0.00,
    total_sales NUMERIC(12,2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    b2b_orders_count INT DEFAULT 0,
    d2c_orders_count INT DEFAULT 0,
    cash_expected NUMERIC(12,2) DEFAULT 0.00,
    cash_actual NUMERIC(12,2),
    notes TEXT,
    status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pos_shifts_store ON pos_register_shifts(store_id);
CREATE INDEX IF NOT EXISTS idx_pos_shifts_status ON pos_register_shifts(status);

-- ==============================================================================
-- TABLE 14: POS TRANSACTIONS (Omnichannel Retail & Wholesale Receipts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pos_transactions (
    id TEXT PRIMARY KEY,
    receipt_number TEXT UNIQUE NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    store_id TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('B2B_WHOLESALE', 'D2C_RETAIL')),
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_code TEXT,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'GBP',
    currency_symbol TEXT DEFAULT '£',
    payment_method TEXT NOT NULL,
    payment_ref TEXT,
    amount_tendered NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    change_due NUMERIC(12,2) DEFAULT 0.00,
    cashier_name TEXT NOT NULL,
    linked_sales_order_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pos_txns_date ON pos_transactions(date);
CREATE INDEX IF NOT EXISTS idx_pos_txns_store ON pos_transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_pos_txns_receipt ON pos_transactions(receipt_number);

-- ==============================================================================
-- TABLE 15: OFFICIAL DOCUMENTS (Legal, Commercial, Statutory & Export Archive)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS official_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    doc_code TEXT NOT NULL,
    section TEXT NOT NULL,
    station TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    document_number TEXT NOT NULL,
    category TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    renewal_lead_days INT DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    file_format TEXT DEFAULT 'PDF',
    file_size TEXT,
    file_url TEXT,
    verified BOOLEAN DEFAULT true,
    uploaded_by TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    renewal_task JSONB,
    checklist_item_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_station ON official_documents(station);
CREATE INDEX IF NOT EXISTS idx_documents_section ON official_documents(section);
CREATE INDEX IF NOT EXISTS idx_documents_status ON official_documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_checklist ON official_documents(checklist_item_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- ==============================================================================
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_register_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access Vouchers" ON vouchers FOR SELECT USING (true);
CREATE POLICY "Public Write Access Vouchers" ON vouchers FOR ALL USING (true);

CREATE POLICY "Public Read Access AccountHeads" ON account_heads FOR SELECT USING (true);
CREATE POLICY "Public Write Access AccountHeads" ON account_heads FOR ALL USING (true);

CREATE POLICY "Public Read Access Compliance" ON compliance_records FOR SELECT USING (true);
CREATE POLICY "Public Write Access Compliance" ON compliance_records FOR ALL USING (true);

CREATE POLICY "Public Read Access PosShifts" ON pos_register_shifts FOR SELECT USING (true);
CREATE POLICY "Public Write Access PosShifts" ON pos_register_shifts FOR ALL USING (true);

CREATE POLICY "Public Read Access PosTxns" ON pos_transactions FOR SELECT USING (true);
CREATE POLICY "Public Write Access PosTxns" ON pos_transactions FOR ALL USING (true);

CREATE POLICY "Public Read Access Documents" ON official_documents FOR SELECT USING (true);
CREATE POLICY "Public Write Access Documents" ON official_documents FOR ALL USING (true);

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

DROP TRIGGER IF EXISTS trg_vouchers_updated_at ON vouchers;
CREATE TRIGGER trg_vouchers_updated_at BEFORE UPDATE ON vouchers FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_account_heads_updated_at ON account_heads;
CREATE TRIGGER trg_account_heads_updated_at BEFORE UPDATE ON account_heads FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_compliance_updated_at ON compliance_records;
CREATE TRIGGER trg_compliance_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_pos_shifts_updated_at ON pos_register_shifts;
CREATE TRIGGER trg_pos_shifts_updated_at BEFORE UPDATE ON pos_register_shifts FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_pos_txns_updated_at ON pos_transactions;
CREATE TRIGGER trg_pos_txns_updated_at BEFORE UPDATE ON pos_transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_documents_updated_at ON official_documents;
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON official_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- TABLE 12: EMAIL QUEUE (High-Performance Asynchronous Outbox)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.email_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    recipient TEXT NOT NULL,
    recipient_name TEXT,
    template_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'queued' NOT NULL CHECK (status IN ('queued', 'processing', 'sent', 'delivered', 'bounced', 'failed')),
    external_message_id TEXT,
    delivery_error_details TEXT,
    attempts INTEGER DEFAULT 0,
    provider TEXT DEFAULT 'RESEND'
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON public.email_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_queue_recipient ON public.email_queue(recipient);

DROP TRIGGER IF EXISTS trg_email_queue_updated_at ON email_queue;
CREATE TRIGGER trg_email_queue_updated_at BEFORE UPDATE ON email_queue FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- TABLE 13: EMAIL AUDIT LEDGER (Webhook Feedback & Delivery Telemetry)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.email_audit_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    queue_id UUID REFERENCES public.email_queue(id) ON DELETE SET NULL,
    external_message_id TEXT,
    event_type TEXT NOT NULL, -- 'queued', 'sent', 'delivery', 'bounce', 'open', 'click', 'spam'
    recipient TEXT NOT NULL,
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_audit_queue_id ON public.email_audit_ledger(queue_id);
CREATE INDEX IF NOT EXISTS idx_email_audit_event_type ON public.email_audit_ledger(event_type);
CREATE INDEX IF NOT EXISTS idx_email_audit_created_at ON public.email_audit_ledger(created_at DESC);

-- Enable RLS
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_audit_ledger ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and service role full access
CREATE POLICY "Allow public read/write to email_queue" ON public.email_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write to email_audit_ledger" ON public.email_audit_ledger FOR ALL USING (true) WITH CHECK (true);

