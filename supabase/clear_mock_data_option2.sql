-- ==============================================================================
-- ArielMC ERP - Safe Database Cleanup Script (Dynamic Table Detection)
-- ==============================================================================
-- Automatically detects existing tables in public schema and only truncates
-- mock transactional data without throwing "relation does not exist" errors.
-- Preserves all institutional tables: warehouses, compliance, factories, etc.
-- ==============================================================================

DO $$ 
DECLARE 
    tbl RECORD;
    target_tables TEXT[] := ARRAY[
        'products', 
        'sample_development_orders', 
        'sales_orders', 
        'purchase_orders',
        'station_delivery_orders',
        'stock_transfers', 
        'inventory_items', 
        'inventory',
        'pos_transactions', 
        'pos_register_shifts', 
        'vouchers', 
        'pnl_records', 
        'crm_leads', 
        'leads',
        'email_audit_ledger', 
        'email_queue'
    ];
BEGIN
    FOR tbl IN (
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name = ANY(target_tables)
    ) LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(tbl.table_name) || ' CASCADE;';
        RAISE NOTICE 'Successfully truncated mock table: %', tbl.table_name;
    END LOOP;
END $$;

-- ==============================================================================
-- Verification: Display all existing tables and their live row count
-- ==============================================================================
SELECT 
    table_name,
    (xpath('/row/cnt/text()', xml_count))[1]::text::int AS row_count
FROM (
    SELECT 
        table_name,
        query_to_xml(format('SELECT count(*) AS cnt FROM public.%I', table_name), false, true, '') AS xml_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) t
ORDER BY table_name;
