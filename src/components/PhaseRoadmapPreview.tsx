'use client';

import React from 'react';
import { ActiveTab } from './Sidebar';
import {
  Factory,
  FlaskConical,
  Users2,
  Repeat,
  Ship,
  Boxes,
  Landmark,
  Store,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

interface PhaseRoadmapPreviewProps {
  activeTab: ActiveTab;
  onNavigateToProducts: () => void;
}

export const PhaseRoadmapPreview: React.FC<PhaseRoadmapPreviewProps> = ({
  activeTab,
  onNavigateToProducts,
}) => {
  const getPhaseDetails = () => {
    switch (activeTab) {
      case 'FACTORIES':
        return {
          title: 'Phase 2: Bangladesh Factory & Compliance Management',
          subtitle: 'Domestic vendor directories, machinery profiles, compliance audits, and capacity tracking',
          icon: Factory,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          deliverables: [
            'Vendor Registry for Savar, Gazipur, Narsingdi, Narayanganj & Nilphamari clusters',
            'Social & Environmental Audit Expiry Tracker (BSCI, SEDEX, OEKO-TEX, LWG, GOTS)',
            'Factory Machinery & Line Capacity Planning (Monthly pieces/sets)',
            'Vendor Tier Rating & Scorecards (OTD %, AQL 1.5/2.5 Failure Rates, Price Stability)',
            'Digital Contract Archive: Master Sourcing Agreements (MSA), NDAs, & EPB Registrations',
          ],
          schemaPreview: `CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sectors VARCHAR(50)[] NOT NULL,
  compliance_ratings JSONB, -- { bsci: "Grade A", lwg: "Silver" }
  audit_expiry_dates JSONB,
  monthly_capacity_pcs INT,
  tier_rating VARCHAR(10) DEFAULT 'TIER_2'
);`,
        };
      case 'RND':
        return {
          title: 'Phase 3: R&D, Tech Packs & Sample Development',
          subtitle: 'From buyer concept design and CAD sketches to approved pre-production samples',
          icon: FlaskConical,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          deliverables: [
            'Interactive Digital Tech Packs with CAD sketches, measurement tolerance tables & BOM',
            'Sample Development Order (SDO) Lifecycle: Proto -> Fit -> Size Set -> PP -> TOP',
            'Pre-Costing Calculator: Fabric + CM (Cut & Make) + Wash + Lab Tests + Ariel Margin + Port Cartage',
            'Lab Test Verification: REACH heavy metals, shrinkage tests, color fastness, FDA food safety',
            'International Courier Tracking (DHL / FedEx express integration to London, NY, Frankfurt)',
          ],
          schemaPreview: `CREATE TABLE sample_development_orders (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  stage VARCHAR(30), -- 'PROTO', 'FIT', 'PP_SAMPLE', 'TOP'
  tech_pack_version VARCHAR(10),
  courier_airway_bill VARCHAR(50),
  buyer_feedback VARCHAR(30) -- 'APPROVED', 'REVISE_LAB_DIP', 'REJECTED'
);`,
        };
      case 'CRM':
        return {
          title: 'Phase 4: Global B2B CRM & Target Market Lead Management',
          subtitle: 'Acquire, nurture, and close wholesale buyers across the UK, EU, US, and Australia',
          icon: Users2,
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
          deliverables: [
            'Multi-Channel Lead Ingestion: Website (arielmc.com), Trade Fairs (Ambiente, NY Now), Cold Outreach',
            'Target Account Pipeline: New Inquiry -> Tech Pack Review -> Quotation -> Sampling -> Contract',
            'Dynamic B2B Quotation Builder with Incoterms (FOB Chattogram, CIF Felixstowe, DDP Los Angeles)',
            'Trade Profile & Buyer Preferences: Minimum Order Values, Target Margins, Payment Terms (L/C, TT)',
            'Automated Merchandiser Follow-Up Alerts & Interaction Logging',
          ],
          schemaPreview: `CREATE TABLE crm_leads (
  id UUID PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  target_market VARCHAR(10), -- 'UK', 'EU', 'US', 'AU'
  buyer_tier VARCHAR(20), -- 'TIER_1_DEPT_STORE', 'BOUTIQUE', 'WHOLESALER'
  pipeline_stage VARCHAR(30),
  deal_value_estimate_usd NUMERIC(12,2)
);`,
        };
      case 'ORDERS':
        return {
          title: 'Phase 5: Two-Way Order Management System (OMS)',
          subtitle: 'Synchronize Buyer Sales Orders (SO) with Factory Purchase Orders (PO) with locked margins',
          icon: Repeat,
          color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
          deliverables: [
            'Back-to-Back Contracting: 1 Buyer SO generates 1..N Factory POs with locked ArielMC gross margin',
            'Time & Action (T&A) Critical Path Engine: Yarn/Leather in-house -> Cutting -> Bulk -> FRI Inspection',
            'Digital QC / QA Inspection Sheets: Mobile photo uploads, defect counts, AQL 1.5/2.5 pass/fail certificates',
            'Payment Milestone Triggers: 30% Advance -> 70% against Bill of Lading (BL) copy / Confirmed L/C',
            'Production Delay Early Warning System & Factory Penalty Calculation',
          ],
          schemaPreview: `CREATE TABLE sales_orders (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES buyers(id),
  incoterm VARCHAR(10),
  total_amount NUMERIC(14,2),
  status VARCHAR(30)
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY,
  sales_order_id UUID REFERENCES sales_orders(id),
  supplier_id UUID REFERENCES suppliers(id),
  status VARCHAR(30)
);`,
        };
      case 'LOGISTICS':
        return {
          title: 'Phase 6: Logistics, Supply Chain & Export Documentation',
          subtitle: 'Automate Bangladesh export documents, container loads, and regional freight',
          icon: Ship,
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          deliverables: [
            'One-Click Export Documentation: Proforma Invoice (PI), Commercial Invoice (CI), Packing List, Form EXP',
            'Certificate of Origin (Export Promotion Bureau / Dhaka Chamber of Commerce)',
            'Container Stuffing Optimization: 20ft / 40ft / 40ft High Cube CBM calculations',
            'Ocean & Air Freight Tracking: Real-time AIS vessel tracking from Chattogram to Southampton/Long Beach',
            'Amazon FBA Inbound Labeling: Carton Barcode & Pallet label generation',
          ],
          schemaPreview: `CREATE TABLE export_shipments (
  id UUID PRIMARY KEY,
  sales_order_id UUID REFERENCES sales_orders(id),
  bl_number VARCHAR(50),
  container_number VARCHAR(50),
  vessel_name VARCHAR(100),
  port_of_loading VARCHAR(100) DEFAULT 'Chattogram (CTG)',
  port_of_discharge VARCHAR(100),
  form_exp_number VARCHAR(50)
);`,
        };
      case 'INVENTORY':
        return {
          title: 'Phase 7: Multi-Location Global Inventory & Fulfillment',
          subtitle: 'Real-time visibility across transit hubs, regional 3PLs, and Amazon FBA fulfillment centers',
          icon: Boxes,
          color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
          deliverables: [
            'Global Warehouse Hierarchy: Dhaka Transit -> On-Water Transit -> UK 3PL -> Amazon FBA -> Retail',
            'Omnichannel Stock Allocation: Split stock between Amazon, Shopify (arielmc.shop), and B2B wholesale',
            'Real-Time Webhook Stock Sync with Shopify Admin API and Amazon Selling Partner (SP) API',
            'Batch & Lot Traceability: Link manufactured batch to specific Bangladesh factory and raw hide lot',
            'Safety Stock Re-Order Alerts based on sales velocity and ocean transit lead times',
          ],
          schemaPreview: `CREATE TABLE inventory_items (
  id UUID PRIMARY KEY,
  warehouse_id UUID REFERENCES warehouses(id),
  product_id UUID REFERENCES products(id),
  on_hand_qty INT DEFAULT 0,
  reserved_qty INT DEFAULT 0,
  in_transit_qty INT DEFAULT 0
);`,
        };
      case 'FINANCE':
        return {
          title: 'Phase 8: Multi-Station Global Finance, Tax & Accounting',
          subtitle: 'Multi-currency general ledger, cross-border tax compliance, and Bangladesh statutory compliance',
          icon: Landmark,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          deliverables: [
            'Multi-Entity General Ledger: BDT, GBP, USD, EUR, AUD consolidation with auto-FX gains/losses',
            'UK HMRC Making Tax Digital (MTD) VAT returns & UK Corporate Tax provisions',
            'US Sales Tax Nexus Monitoring across 50 states & Delaware corporate filing',
            'EU One-Stop-Shop (OSS/IOSS) VAT returns & Australia GST / BAS returns',
            'Bangladesh NBR Compliance: Mushak 6.3 invoices, TDS/VDS withholding tax, Bangladesh Bank EXP repatriation',
          ],
          schemaPreview: `CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  entry_date DATE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  exchange_rate_to_usd NUMERIC(10,4),
  debit_account_id UUID,
  credit_account_id UUID,
  amount NUMERIC(14,2)
);`,
        };
      case 'POS':
        return {
          title: 'Phase 9: Omnichannel Physical Store POS (Year 2+ Expansion)',
          subtitle: 'Unified point-of-sale for ArielMC flagship showrooms in London, New York, or Sydney',
          icon: Store,
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
          deliverables: [
            'Offline-First Progressive Web App (PWA) POS with local IndexedDB sync',
            'Barcode scanning & thermal receipt printing',
            'Card terminal integration via Stripe Terminal / Adyen',
            'Real-time omnichannel stock deduction synchronized with Shopify and ERP inventory',
          ],
          schemaPreview: `CREATE TABLE pos_sessions (
  id UUID PRIMARY KEY,
  store_id UUID,
  terminal_id VARCHAR(50),
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  cash_collected NUMERIC(12,2)
);`,
        };
      default:
        return null;
    }
  };

  const details = getPhaseDetails();
  if (!details) return null;

  const Icon = details.icon;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] p-6 shadow-sm text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-[#C8A96A]">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A] text-[#0A1A2F] font-bold">
                  NEXT SPRINT ROADMAP
                </span>
                <span className="text-xs text-emerald-100 font-medium">Architectural Spec Ready</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1 font-['Montserrat']">{details.title}</h1>
              <p className="text-sm text-white/80 mt-1 max-w-2xl font-['Open_Sans']">{details.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onNavigateToProducts}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#0A1A2F] text-xs font-bold font-['Montserrat'] shadow transition-all"
          >
            <span>Back to Live Product Master</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Deliverables List & Schema Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Capabilities */}
        <div className="rounded-2xl bg-white border border-[#DDE3DD] p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-[#1F3A2E] text-sm flex items-center gap-2 font-['Montserrat']">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Core Capabilities & Workflow Deliverables</span>
          </h3>

          <div className="space-y-2.5">
            {details.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-xs text-[#1A1A1A] flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Schema Architecture */}
        <div className="rounded-2xl bg-white border border-[#DDE3DD] p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#1F3A2E] text-sm flex items-center gap-2 font-['Montserrat']">
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                <span>PostgreSQL Relational Schema Blueprint</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF2F6] text-[#475569] border border-[#D5DEE7] font-semibold">
                PostgreSQL 16
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3 font-['Open_Sans']">
              This module integrates directly into the unified PostgreSQL database using relational foreign keys linked to the Phase 1 Company and Product entities.
            </p>

            <pre className="p-4 rounded-xl bg-[#0A1A2F] text-[#C8A96A] font-mono text-xs overflow-x-auto border border-[#0A1A2F] leading-relaxed shadow-inner">
              {details.schemaPreview}
            </pre>
          </div>

          <div className="pt-4 border-t border-[#DDE3DD] flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Ready to activate when Phase 1 is validated</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Blueprint Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
