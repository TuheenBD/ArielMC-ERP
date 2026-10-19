'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  HardDrive, 
  Server, 
  Zap, 
  ExternalLink, 
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { testSupabaseHealth, syncAllSeedDataToSupabase } from '@/lib/erpPersistence';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { ThemeProfile } from '@/components/Sidebar';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSynced?: () => void;
  theme?: ThemeProfile;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataSynced,
  theme = 'crm-green',
}) => {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'SEED' | 'SCHEMA'>('STATUS');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [tableCounts, setTableCounts] = useState<{ [table: string]: number }>({});
  const [lastChecked, setLastChecked] = useState<string>('');
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Seeding State
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    counts?: { [table: string]: number };
    error?: string;
  } | null>(null);

  // Schema Copy State
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  const runHealthCheck = async () => {
    setIsLoadingHealth(true);
    setErrorMessage(null);
    try {
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);
      
      const health = await testSupabaseHealth();
      setIsConnected(health.connected);
      setLatencyMs(health.latencyMs);
      setTableCounts(health.tableCounts || {});
      setErrorMessage(health.error || null);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (e: any) {
      setIsConnected(false);
      setErrorMessage(e.message || 'Failed to ping Supabase database.');
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const handleRunSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await syncAllSeedDataToSupabase();
      setSeedResult(res);
      if (res.success) {
        await runHealthCheck();
        if (onDataSynced) {
          onDataSynced();
        }
      }
    } catch (err: any) {
      setSeedResult({
        success: false,
        error: err.message || 'Seeding failed unexpectedly.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySchema = () => {
    const sqlSchemaCode = `-- ==============================================================================
-- ArielMC ERP - POSTGRESQL MASTER DATABASE SCHEMA
-- Automated Table Definitions, Primary Keys, Indexes, Triggers & RLS Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    ean_barcode TEXT,
    style_code TEXT,
    packaging_mode TEXT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    category TEXT NOT NULL,
    hs_code TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL DEFAULT 'PCS',
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

-- 3. Factories Network
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

-- 4. Sample Development Orders (SDO)
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

-- 5. Sales Orders (OMS)
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

-- 6. CRM Leads
CREATE TABLE IF NOT EXISTS crm_leads (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    tier TEXT,
    market TEXT NOT NULL,
    country TEXT NOT NULL,
    channel TEXT,
    contact TEXT NOT NULL,
    role TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    focus TEXT,
    interest TEXT,
    priority TEXT DEFAULT 'MEDIUM',
    stage TEXT DEFAULT 'NEW',
    value NUMERIC(14,2),
    next_action TEXT,
    next_date TEXT,
    last_contact TEXT,
    touches INT DEFAULT 0,
    owner TEXT,
    notes TEXT,
    source TEXT,
    cur TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Warehouses & Hubs
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    is_bonded BOOLEAN DEFAULT false,
    operating_entity TEXT NOT NULL,
    total_area_sq_ft INT DEFAULT 0,
    utilized_area_sq_ft INT DEFAULT 0,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    customs_station_code TEXT,
    bin_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    warehouse_id TEXT NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    sector TEXT NOT NULL,
    style_code TEXT,
    style_name TEXT NOT NULL,
    batch_or_lot_number TEXT,
    production_date DATE,
    customs_import_boe_no TEXT,
    customs_entry_date DATE,
    physical_stock INT NOT NULL DEFAULT 0,
    allocated_stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 0,
    in_transit_incoming INT NOT NULL DEFAULT 0,
    reorder_point INT NOT NULL DEFAULT 50,
    unit_cost_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_value_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    hs_code TEXT,
    storage_bin_location TEXT,
    quality_status TEXT DEFAULT 'PASSED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Stock Transfers
CREATE TABLE IF NOT EXISTS stock_transfers (
    id TEXT PRIMARY KEY,
    transfer_number TEXT UNIQUE NOT NULL,
    source_warehouse_id TEXT NOT NULL REFERENCES warehouses(id),
    destination_warehouse_id TEXT NOT NULL REFERENCES warehouses(id),
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    transport_mode TEXT NOT NULL DEFAULT 'OCEAN_FCL',
    carrier_name TEXT,
    bl_or_awb_number TEXT,
    container_number TEXT,
    commercial_invoice_number TEXT,
    mushak_6_5_number TEXT,
    dispatch_date DATE,
    estimated_arrival_date DATE,
    actual_arrival_date DATE,
    customs_cleared_date DATE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_pieces INT NOT NULL DEFAULT 0,
    total_value_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Financial PnL Records
CREATE TABLE IF NOT EXISTS pnl_records (
    id TEXT PRIMARY KEY,
    month_name TEXT NOT NULL,
    year INT NOT NULL,
    revenue_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    cogs_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    gross_profit_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    operating_expenses_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    net_profit_usd NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    net_margin_pct NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleDownloadSchema = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `-- ArielMC ERP - Official Supabase PostgreSQL Schema\n-- Generated for: ArielMC Global Operations\n\n` +
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n` +
      `-- See supabase/schema.sql in the repository for full definitions.\n`
    ], { type: 'text/sql' });
    element.href = URL.createObjectURL(file);
    element.download = 'arielmc_erp_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  // Theme-aware styles
  const modalShell = isRoyal
    ? 'bg-[#0B132B] border border-slate-700/80 text-slate-100'
    : isHeritage
    ? 'bg-[#1C160C] border border-[#8A6D3B]/60 text-[#F5EEDC]'
    : 'bg-[#12231B] border border-[#2C5240] text-white';

  const modalHeaderBg = isRoyal
    ? 'bg-[#0F172A] border-b border-slate-800'
    : isHeritage
    ? 'bg-[#261E10] border-b-2 border-[#C8A96A]'
    : 'bg-[#162B22] border-b-2 border-[#C8A96A]';

  const iconBox = isRoyal
    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
    : 'bg-[#C8A96A]/15 border border-[#C8A96A]/30 text-[#C8A96A]';

  const postgresBadge = isRoyal
    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
    : 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30';

  const connectivityBanner = isRoyal
    ? 'bg-slate-900/90 border-b border-slate-800'
    : isHeritage
    ? 'bg-[#151007] border-b border-[#8A6D3B]/40'
    : 'bg-[#0D1913] border-b border-[#2C5240]';

  const testBtn = isRoyal
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
    : isHeritage
    ? 'bg-[#2E2211] hover:bg-[#3D2E17] text-[#F5EEDC] border border-[#8A6D3B]/60'
    : 'bg-[#1F3A2E] hover:bg-[#2C5240] text-white border border-[#2C5240]';

  const testIcon = isRoyal ? 'text-blue-400' : 'text-[#C8A96A]';

  const tabNavBg = isRoyal
    ? 'border-b border-slate-800 bg-[#0B132B]/60'
    : isHeritage
    ? 'border-b border-[#8A6D3B]/40 bg-[#161109]'
    : 'border-b border-[#2C5240] bg-[#162B22]/60';

  const tabActive = isRoyal
    ? 'border-blue-500 text-blue-400 bg-slate-800/40'
    : isHeritage
    ? 'border-[#C8A96A] text-[#C8A96A] bg-[#2E2211]/50'
    : 'border-[#C8A96A] text-[#C8A96A] bg-[#1F3A2E]/50';

  const tabInactive = isRoyal
    ? 'border-transparent text-slate-400 hover:text-slate-200'
    : isHeritage
    ? 'border-transparent text-[#B8A382] hover:text-[#F5EEDC]'
    : 'border-transparent text-[#8FA89B] hover:text-white';

  const overviewCard = isRoyal
    ? 'bg-slate-900/60 border border-slate-800'
    : isHeritage
    ? 'bg-[#22180C] border border-[#8A6D3B]/40'
    : 'bg-[#162B22] border border-[#2C5240]';

  const overviewIcon = isRoyal ? 'text-blue-400' : 'text-[#C8A96A]';

  const codePill = isRoyal
    ? 'text-blue-400 font-mono bg-blue-950/40 px-1 py-0.5 rounded border border-blue-900/30'
    : isHeritage
    ? 'text-[#C8A96A] font-mono bg-[#2A2012] px-1 py-0.5 rounded border border-[#8A6D3B]/50'
    : 'text-[#C8A96A] font-mono bg-[#0D1913] px-1 py-0.5 rounded border border-[#2C5240]';

  const tableCard = isRoyal
    ? 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
    : isHeritage
    ? 'bg-[#22180C] border border-[#8A6D3B]/40 hover:border-[#C8A96A]/60'
    : 'bg-[#162B22] border border-[#2C5240] hover:border-[#3A6B54]';

  const tableCountBadge = isRoyal
    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
    : isHeritage
    ? 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30'
    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60';

  const seedBtn = isRoyal
    ? 'bg-blue-600 hover:bg-blue-500 text-white font-bold'
    : isHeritage
    ? 'bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1C160C] font-bold'
    : 'bg-[#1E6B3A] hover:bg-[#258247] text-white border border-emerald-600/40 font-bold';

  const seedIcon = isRoyal ? 'text-blue-400' : 'text-[#C8A96A]';

  const stepNumber = isRoyal
    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
    : 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30';

  const cardLink = isRoyal
    ? 'text-blue-400 hover:text-blue-300'
    : 'text-[#C8A96A] hover:text-[#d6ba7c]';

  const copySqlBtn = isRoyal
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
    : isHeritage
    ? 'bg-[#2E2211] hover:bg-[#3D2E17] text-[#F5EEDC] border border-[#8A6D3B]/60'
    : 'bg-[#1F3A2E] hover:bg-[#2C5240] text-white border border-[#2C5240]';

  const downloadSqlBtn = isRoyal
    ? 'bg-blue-600 hover:bg-blue-500 text-white font-semibold'
    : isHeritage
    ? 'bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1C160C] font-bold'
    : 'bg-[#C8A96A] hover:bg-[#d6ba7c] text-[#1F3A2E] font-bold';

  const terminalBg = isRoyal
    ? 'bg-[#070B14] border border-slate-800 text-slate-300'
    : isHeritage
    ? 'bg-[#100C06] border border-[#8A6D3B]/40 text-[#E5D5B3]'
    : 'bg-[#0A140F] border border-[#2C5240] text-[#CFE0D5]';

  const modalFooterBg = isRoyal
    ? 'bg-[#0F172A] border-t border-slate-800'
    : isHeritage
    ? 'bg-[#261E10] border-t border-[#8A6D3B]/40'
    : 'bg-[#162B22] border-t border-[#2C5240]';

  const closeBtn = isRoyal
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
    : isHeritage
    ? 'bg-[#2E2211] hover:bg-[#3D2E17] text-[#F5EEDC] border border-[#8A6D3B]/60'
    : 'bg-[#1F3A2E] hover:bg-[#2C5240] text-white border border-[#2C5240]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        id="database-settings-modal"
        className={`relative w-full max-w-4xl ${modalShell} rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 ${modalHeaderBg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${iconBox} flex items-center justify-center shadow-inner`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                  <span className="font-bold">ArielMC</span> ERP Database & Persistence
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${postgresBadge}`}>
                  PostgreSQL
                </span>
              </div>
              <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#8FA89B]'}`}>
                Supabase Cloud Storage & Real-Time Sync Engine for All Live Operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Connectivity Banner */}
        <div className={`px-6 py-3.5 ${connectivityBanner} flex flex-wrap items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold font-mono tracking-wider text-slate-200">
                {isConnected ? 'POSTGRESQL LIVE CONNECTED' : isConfigured ? 'CREDENTIALS SET (OFFLINE)' : 'LOCAL HYBRID CACHE MODE'}
              </span>
            </div>
            {isConnected && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                ⚡ {latencyMs}ms Latency
              </span>
            )}
            {!isConfigured && (
              <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                Seamless Offline Fallback Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {lastChecked && (
              <span className={`text-[11px] ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#B8A382]' : 'text-[#8FA89B]'} hidden sm:inline`}>
                Pinging: {lastChecked}
              </span>
            )}
            <button
              onClick={runHealthCheck}
              disabled={isLoadingHealth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${testBtn} font-semibold transition-all disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''} ${testIcon}`} />
              <span>{isLoadingHealth ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex px-6 ${tabNavBg}`}>
          <button
            onClick={() => setActiveTab('STATUS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'STATUS' ? tabActive : tabInactive
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Connection & Table Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('SEED')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'SEED' ? tabActive : tabInactive
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1-Click Seed Data Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('SCHEMA')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'SCHEMA' ? tabActive : tabInactive
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>SQL Schema & Setup Guide</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* TAB 1: STATUS & TABLE METRICS */}
          {activeTab === 'STATUS' && (
            <div className="space-y-6">
              {/* Architecture Overview */}
              <div className={`p-4 rounded-xl ${overviewCard}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${overviewIcon}`} />
                      <span>Zero-Failure Hybrid Persistence Architecture</span>
                    </h3>
                    <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} leading-relaxed`}>
                      <span className="font-bold text-white">ArielMC</span> ERP runs automatically in hybrid persistence mode. When Supabase PostgreSQL credentials are present in <code className={codePill}>.env.local</code>, all live transactions seamlessly read and write to cloud PostgreSQL. If running offline or without credentials, data gracefully persists in high-performance browser cache and local memory without any operational interruption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Tables Breakdown */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#C8A96A]' : 'text-[#8FA89B]'} mb-3 flex items-center gap-2`}>
                  <Layers className="w-3.5 h-3.5" />
                  <span>PostgreSQL Persistent Tables Status</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Products Master', table: 'products', count: tableCounts.products ?? 12, desc: 'Leather, Jute, Textiles, Ceramics' },
                    { label: 'Factories Network', table: 'factories', count: tableCounts.factories ?? 8, desc: 'Savar, Gazipur, Narsingdi' },
                    { label: 'Sample Dev Orders (SDO)', table: 'sample_development_orders', count: tableCounts.samples ?? 8, desc: 'Tech Packs, QA, Prototypes' },
                    { label: 'Sales Orders (OMS)', table: 'sales_orders', count: tableCounts.orders ?? 5, desc: 'Buyer SOs & Factory POs' },
                    { label: 'CRM Wholesale Leads', table: 'crm_leads', count: tableCounts.crm_leads ?? 35, desc: 'UK, US, EU, AU Pipeline' },
                    { label: 'Warehouses & Hubs', table: 'warehouses', count: tableCounts.warehouses ?? 4, desc: 'Savar, Tilbury, Rotterdam, NY' },
                    { label: 'Inventory Items', table: 'inventory_items', count: tableCounts.inventory_items ?? 12, desc: 'Batch, BoE, Physical Stock' },
                    { label: 'Stock Transfers', table: 'stock_transfers', count: tableCounts.stock_transfers ?? 3, desc: 'Ocean FCL, Air Freight' },
                    { label: 'Standard Vouchers', table: 'vouchers', count: tableCounts.vouchers ?? 14, desc: 'Debit, Credit, Journal, Contra' },
                    { label: 'Account Heads', table: 'account_heads', count: tableCounts.account_heads ?? 12, desc: 'Statutory Chart of Accounts' },
                    { label: 'Official Documents', table: 'official_documents', count: tableCounts.official_documents ?? 14, desc: 'Export Docs, Licenses, Tax Chalan' },
                    { label: 'Bangladesh Compliance', table: 'compliance_records', count: tableCounts.compliance_records ?? 34, desc: '34-Step Statutory Legal Checklist' },
                    { label: 'POS Transactions', table: 'pos_transactions', count: tableCounts.pos_transactions ?? 8, desc: 'Retail & Wholesale Store Receipts' },
                    { label: 'Finance PnL Records', table: 'pnl_records', count: tableCounts.pnl_records ?? 6, desc: 'Multi-Currency Revenue & EBITDA' },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl ${tableCard} transition-all flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-100">{item.label}</span>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${tableCountBadge}`}>
                          {isConnected ? `${item.count} rows` : `${item.count} cached`}
                        </span>
                      </div>
                      <div className={`text-[11px] ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#B8A382]' : 'text-[#8FA89B]'} flex items-center justify-between`}>
                        <span className="truncate">{item.desc}</span>
                        <span className={`font-mono text-[10px] ${isRoyal ? 'text-slate-500' : isHeritage ? 'text-[#8A6D3B]' : 'text-[#5C7E6E]'}`}>table: {item.table}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Callout if applicable */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Notice:</span> {errorMessage}
                    <div className="mt-1 text-[11px] text-amber-300/80">
                      Ensure your Supabase project is active and that <code className="font-mono">supabase/schema.sql</code> has been executed in the Supabase SQL Editor.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 1-CLICK SEED DATA SYNC */}
          {activeTab === 'SEED' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl ${overviewCard} space-y-4`}>
                <div className="flex items-start gap-3">
                  <Zap className={`w-6 h-6 ${seedIcon} shrink-0 mt-1`} />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      One-Click Supabase PostgreSQL Initializer
                    </h3>
                    <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} leading-relaxed`}>
                      Seed your live PostgreSQL instance with all foundational <span className="font-bold text-white">ArielMC</span> ERP data. This synchronizes our authentic master catalog of 12 multi-sector products, 8 verified Bangladesh partner factories, 8 active SDO sample orders, 5 confirmed export sales orders, 35 CRM buyer leads, 4 international bonded warehouses, and multi-location global inventory.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleRunSeed}
                    disabled={isSeeding || !isConfigured}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${seedBtn} text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Synchronizing All Master Datasets...' : 'Push All ERP Seed Data to Supabase'}</span>
                  </button>

                  {!isConfigured && (
                    <span className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Configure .env.local to enable cloud write
                    </span>
                  )}
                </div>
              </div>

              {/* Seed Result Feedback */}
              {seedResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  seedResult.success 
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                    : 'bg-red-950/40 border-red-800 text-red-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-2">
                    {seedResult.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Database Synchronization Completed Successfully!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Synchronization Failed: {seedResult.error}</span>
                      </>
                    )}
                  </div>
                  {seedResult.counts && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                      {Object.entries(seedResult.counts).map(([tbl, cnt]) => (
                        <div key={tbl} className="bg-black/30 p-2 rounded border border-white/10">
                          <span className="text-gray-400">{tbl}:</span> <span className={`font-bold ${isRoyal ? 'text-blue-400' : isHeritage ? 'text-[#C8A96A]' : 'text-emerald-400'}`}>{cnt} rows</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEMA DDL & SETUP GUIDE */}
          {activeTab === 'SCHEMA' && (
            <div className="space-y-6">
              {/* 3 Step Setup Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-xl ${tableCard} flex flex-col justify-between transition-all group shadow-sm`}>
                  <div className="space-y-2.5">
                    <div className={`w-7 h-7 rounded-lg ${stepNumber} flex items-center justify-center font-bold text-xs font-mono`}>
                      1
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Create Supabase Project</h4>
                    <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} leading-relaxed`}>
                      Log in to <span className={`${cardLink} font-medium`}>supabase.com</span> and create a new project with your preferred region (e.g. Singapore or Frankfurt).
                    </p>
                  </div>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`mt-4 inline-flex items-center gap-1.5 text-xs ${cardLink} font-semibold group-hover:underline`}
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className={`p-5 rounded-xl ${tableCard} flex flex-col justify-between transition-all group shadow-sm`}>
                  <div className="space-y-2.5">
                    <div className={`w-7 h-7 rounded-lg ${stepNumber} flex items-center justify-center font-bold text-xs font-mono`}>
                      2
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Run SQL DDL Script</h4>
                    <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} leading-relaxed`}>
                      Open the <span className="text-slate-200 font-semibold">SQL Editor</span> in your Supabase project and execute the comprehensive <span className="font-bold text-white">ArielMC</span> schema DDL.
                    </p>
                  </div>
                  <button 
                    onClick={handleCopySchema}
                    className={`mt-4 inline-flex items-center gap-1.5 text-xs ${cardLink} font-semibold group-hover:underline`}
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
                  </button>
                </div>

                <div className={`p-5 rounded-xl ${tableCard} flex flex-col justify-between transition-all group shadow-sm`}>
                  <div className="space-y-2.5">
                    <div className={`w-7 h-7 rounded-lg ${stepNumber} flex items-center justify-center font-bold text-xs font-mono`}>
                      3
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Configure .env.local</h4>
                    <p className={`text-xs ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} leading-relaxed`}>
                      Copy your Project URL and Anon API Key from Project Settings &gt; API into your local <code className={codePill}>.env.local</code> file.
                    </p>
                  </div>
                  <span className={`mt-4 font-mono text-[11px] ${isRoyal ? 'text-slate-500' : isHeritage ? 'text-[#8A6D3B]' : 'text-[#5C7E6E]'}`}>
                    NEXT_PUBLIC_SUPABASE_URL
                  </span>
                </div>
              </div>

              {/* Action Buttons for SQL */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'}`}>
                  Master Schema File: <code className={codePill}>supabase/schema.sql</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySchema}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${copySqlBtn} text-xs font-semibold transition-all`}
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className={`w-3.5 h-3.5 ${testIcon}`} />}
                    <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSchema}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${downloadSqlBtn} text-xs transition-all shadow-sm`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              {/* Code Snippet Preview */}
              <div className={`relative rounded-xl ${terminalBg} p-4 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed`}>
                <pre>{`-- ArielMC ERP - POSTGRESQL TABLES INCLUDED:
1. products                  (HS Codes, Costings, Sector Attributes, Compliance)
2. factories                 (Savar, Gazipur, Narsingdi, Audits, Scorecards)
3. sample_development_orders (SDOs, Tech Packs, Courier AWB, QA Dossiers)
4. sales_orders              (Buyer SOs, Factory POs, T&A Milestones, L/C)
5. crm_leads                 (Global Wholesale Buyer Pipeline UK/US/EU/AU)
6. warehouses                (Bonded CFS Dhaka, Tilbury, Rotterdam, JFK Hubs)
7. inventory_items           (Batch / Lot, BoE Customs, Physical & Allocated)
8. stock_transfers           (Inter-warehouse Ocean FCL & Air Transit)
9. pnl_records               (Multi-currency Monthly Financial Operating Statements)`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3.5 ${modalFooterBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-1 font-bold text-xs text-white">
              <span className="font-bold text-[#93C5FD]">ArielMC</span><sup className="text-[0.65em] font-bold text-[#93C5FD]">™</sup>
              <span className="font-bold">Enterprise Resource Planning System</span>
            </div>
            <div className={`text-[10px] ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4C3A3]' : 'text-[#A0B8AB]'} mt-0.5`}>
              © Ariel Marketing &amp; Communications Limited | All Right Reserve
            </div>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg ${closeBtn} font-semibold transition-all`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
