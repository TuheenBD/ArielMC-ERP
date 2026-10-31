-- ==============================================================================
-- ArielMC ERP - Database Cleanup Script: Option 2 (Transactions & Test Products)
-- ==============================================================================
-- Action: Clears all mock transactional data, dummy sample orders, test products,
--         retail shifts/transactions, dummy leads, and email queue logs.
-- Preserves: 
--   1. 5 Sovereign Operating Stations (BD, UK, US, EU, AU)
--   2. 12 Bonded Warehouses / Global Logistics Hubs (warehouses)
--   3. 34 Statutory Compliance Checklists (compliance_records)
--   4. Chart of Accounts Master Heads (account_heads)
--   5. Enterprise Standard Operating Procedures (official_documents)
--   6. Vetted Bangladesh Manufacturing Network (factories)
-- ==============================================================================

BEGIN;

-- 1. Clear Transactional & Operational Records
TRUNCATE TABLE sample_development_orders CASCADE;
TRUNCATE TABLE sales_orders CASCADE;
TRUNCATE TABLE stock_transfers CASCADE;
TRUNCATE TABLE inventory_items CASCADE;
TRUNCATE TABLE pos_transactions CASCADE;
TRUNCATE TABLE pos_register_shifts CASCADE;

-- 2. Clear Financial Entries & CRM Leads
TRUNCATE TABLE vouchers CASCADE;
TRUNCATE TABLE pnl_records CASCADE;
TRUNCATE TABLE crm_leads CASCADE;

-- 3. Clear Test / Seed Products
TRUNCATE TABLE products CASCADE;

-- 4. Clear Email Delivery Queue & Audit Logs (if existing)
TRUNCATE TABLE public.email_audit_ledger CASCADE;
TRUNCATE TABLE public.email_queue CASCADE;

COMMIT;

-- Verify Clean Status
SELECT 'products' AS table_name, count(*) FROM products
UNION ALL
SELECT 'sample_development_orders', count(*) FROM sample_development_orders
UNION ALL
SELECT 'sales_orders', count(*) FROM sales_orders
UNION ALL
SELECT 'inventory_items', count(*) FROM inventory_items
UNION ALL
SELECT 'crm_leads', count(*) FROM crm_leads
UNION ALL
SELECT 'vouchers', count(*) FROM vouchers
UNION ALL
SELECT 'warehouses (PRESERVED)', count(*) FROM warehouses
UNION ALL
SELECT 'account_heads (PRESERVED)', count(*) FROM account_heads
UNION ALL
SELECT 'compliance_records (PRESERVED)', count(*) FROM compliance_records
UNION ALL
SELECT 'official_documents (PRESERVED)', count(*) FROM official_documents
UNION ALL
SELECT 'factories (PRESERVED)', count(*) FROM factories;
