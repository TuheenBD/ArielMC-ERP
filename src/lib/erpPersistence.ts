import {
  ProductItem,
  SupplierFactory,
  SampleDevelopmentOrder,
  BuyerSalesOrder,
  CrmLead,
  InventoryItem,
  WarehouseLocation,
  StockTransferOrder
} from '@/types/erp';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_PRODUCTS } from '@/data/initialData';
import { INITIAL_FACTORIES } from '@/data/initialFactories';
import { INITIAL_SAMPLES } from '@/data/initialSamples';
import { INITIAL_ORDERS } from '@/data/initialOrders';
import crmLeadsData from '@/data/crmLeads.json';
import {
  INITIAL_WAREHOUSES,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STOCK_TRANSFERS
} from '@/data/initialInventory';

import { StandardVoucher } from '@/types/voucher';
import { INITIAL_STANDARD_VOUCHERS } from '@/data/initialVouchers';
import { AccountHead } from '@/types/accountHead';
import { INITIAL_ACCOUNT_HEADS } from '@/data/initialAccountHeads';
import { ComplianceChecklistItem, OfficialDocument } from '@/types/documentPortal';
import { BANGLADESH_34_COMPLIANCE_CHECKLIST } from '@/data/bangladeshComplianceChecklist';
import { INITIAL_OFFICIAL_DOCUMENTS } from '@/data/initialOfficialDocuments';
import { PosRegisterShift, PosTransaction } from '@/types/pos';
import { INITIAL_REGISTER_SHIFTS, INITIAL_POS_TRANSACTIONS } from '@/data/initialPosData';
import { BuyerPortfolio } from '@/types/buyerPortfolio';
import { INITIAL_BUYER_PORTFOLIOS } from '@/data/initialBuyerPortfolios';
import { FactorySupplierPortfolio } from '@/types/factoryPortfolio';
import { INITIAL_FACTORY_PORTFOLIOS } from '@/data/initialFactoryPortfolios';
import { D2cSalesPoint, D2cSaleOrder } from '@/types/d2cSales';
import { INITIAL_D2C_SALES_POINTS, INITIAL_D2C_SALE_ORDERS } from '@/data/initialD2cSalesData';

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'arielmc_erp_products_v1',
  FACTORIES: 'arielmc_erp_factories_v1',
  SAMPLES: 'arielmc_erp_samples_v1',
  ORDERS: 'arielmc_erp_orders_v1',
  LEADS: 'arielmc_erp_leads_v1',
  INVENTORY: 'arielmc_erp_inventory_v1',
  WAREHOUSES: 'arielmc_erp_warehouses_v1',
  TRANSFERS: 'arielmc_erp_transfers_v1',
  VOUCHERS: 'arielmc_vouchers_db',
  ACCOUNT_HEADS: 'arielmc_erp_account_heads_v1',
  OFFICIAL_DOCUMENTS: 'arielmc_erp_official_documents_v1',
  COMPLIANCE: 'arielmc_erp_compliance_checklist_v1',
  POS_SHIFTS: 'arielmc_erp_pos_shifts_v1',
  POS_TRANSACTIONS: 'arielmc_erp_pos_transactions_v1',
  BUYER_PORTFOLIOS: 'arielmc_erp_buyer_portfolios_v1',
  FACTORY_PORTFOLIOS: 'arielmc_erp_factory_portfolios_v1',
  D2C_SALES_POINTS: 'arielmc_erp_d2c_sales_points_v1',
  D2C_SALE_ORDERS: 'arielmc_erp_d2c_sale_orders_v1',
};

// ==============================================================================
// 1. PRODUCTS PERSISTENCE
// ==============================================================================

export const fetchProducts = async (): Promise<ProductItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          sku: row.sku,
          eanBarcode: row.ean_barcode,
          styleCode: row.style_code,
          packagingMode: row.packaging_mode,
          name: row.name,
          sector: row.sector,
          category: row.category,
          hsCode: row.hs_code,
          description: row.description,
          unit: row.unit || 'PCS',
          dimensions: row.dimensions,
          weightKg: Number(row.weight_kg) || 0,
          tags: row.tags || [],
          targetMarkets: row.target_markets || ['UK', 'EU', 'US', 'AU'],
          costing: row.costing || {},
          attributes: row.attributes || {},
          complianceCertificates: row.compliance_certificates || [],
          partnerFactory: row.partner_factory || {},
          sampleStatus: row.sample_status || 'PROTO_REQUESTED',
          images: row.images || [],
          createdDate: row.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, falling back to local cache:', e);
    }
  }

  // LocalStorage / Seed Fallback
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_PRODUCTS;
};

export const persistProduct = async (product: ProductItem): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('products').upsert({
        id: product.id,
        sku: product.sku,
        ean_barcode: product.eanBarcode,
        style_code: product.styleCode,
        packaging_mode: product.packagingMode,
        name: product.name,
        sector: product.sector,
        category: product.category,
        hs_code: product.hsCode,
        description: product.description,
        unit: product.unit,
        dimensions: product.dimensions,
        weight_kg: product.weightKg,
        tags: product.tags,
        target_markets: product.targetMarkets,
        costing: product.costing,
        attributes: product.attributes,
        compliance_certificates: product.complianceCertificates,
        partner_factory: product.partnerFactory,
        sample_status: product.sampleStatus,
        images: product.images,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to upsert product to Supabase:', e);
    }
  }
};

// ==============================================================================
// 2. FACTORIES PERSISTENCE
// ==============================================================================

export const fetchFactories = async (): Promise<SupplierFactory[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('factories').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          code: row.code,
          name: row.name,
          sectors: row.sectors || [],
          cluster: row.cluster,
          factoryAddress: row.factory_address,
          contactPerson: row.contact_person,
          designation: row.designation,
          phone: row.phone,
          email: row.email,
          tradeLicenseNo: row.trade_license_no,
          binNumber: row.bin_number,
          tinNumber: row.tin_number,
          epbRegistrationNo: row.epb_registration_no,
          tier: row.tier || 'TIER_1_PREFERRED',
          capacity: row.capacity || { monthlyCapacityUnits: 0, allocatedUnits: 0, activeLines: 0, machineryList: [] },
          scorecard: row.scorecard || { onTimeDeliveryPct: 100, aqlPassRatePct: 100, ratingScore: 5, priceCompetitiveness: 5 },
          complianceAudits: row.compliance_audits || [],
          leadTimeDays: row.lead_time_days ?? 30,
          minimumOrderQuantity: row.minimum_order_quantity ?? 100,
          paymentTerms: row.payment_terms || '30% Advance, 70% against BL copy',
          bankDetails: row.bank_details || { bankName: '', branch: '', routingNumber: '' },
          associatedSkus: row.associated_skus || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase factories fetch failed, falling back:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.FACTORIES);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_FACTORIES;
};

export const persistFactory = async (factory: SupplierFactory): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('factories').upsert({
        id: factory.id,
        code: factory.code,
        name: factory.name,
        sectors: factory.sectors,
        cluster: factory.cluster,
        factory_address: factory.factoryAddress,
        contact_person: factory.contactPerson,
        designation: factory.designation,
        phone: factory.phone,
        email: factory.email,
        trade_license_no: factory.tradeLicenseNo,
        bin_number: factory.binNumber,
        tin_number: factory.tinNumber,
        epb_registration_no: factory.epbRegistrationNo,
        tier: factory.tier,
        capacity: factory.capacity,
        scorecard: factory.scorecard,
        compliance_audits: factory.complianceAudits,
        lead_time_days: factory.leadTimeDays,
        minimum_order_quantity: factory.minimumOrderQuantity,
        payment_terms: factory.paymentTerms,
        bank_details: factory.bankDetails,
        associated_skus: factory.associatedSkus,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to upsert factory to Supabase:', e);
    }
  }
};

// ==============================================================================
// 3. SAMPLE DEVELOPMENT ORDERS (SDOs)
// ==============================================================================

export const fetchSamples = async (): Promise<SampleDevelopmentOrder[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('sample_development_orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          sdoNumber: row.sdo_number,
          sector: row.sector,
          styleName: row.style_name,
          styleCode: row.style_code,
          samplingTier: row.sampling_tier,
          sopReference: row.sop_reference,
          associatedProductId: row.associated_product_id,
          buyerCompany: row.buyer_company,
          buyerContact: row.buyer_contact,
          targetMarket: row.target_market,
          factoryId: row.factory_id,
          factoryName: row.factory_name,
          stage: row.stage,
          roundNumber: row.round_number ?? 1,
          status: row.status,
          requestDate: row.request_date || new Date().toISOString().split('T')[0],
          targetDeliveryDate: row.target_delivery_date || '',
          actualApprovalDate: row.actual_approval_date,
          techPack: row.tech_pack || {},
          courier: row.courier,
          costing: row.costing || {},
          reimbursementTerms: row.reimbursement_terms,
          qaDossier: row.qa_dossier,
          waybillLabelling: row.waybill_labelling,
          feedbacks: row.feedbacks || [],
          tags: row.tags || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase samples fetch failed, falling back:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.SAMPLES);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_SAMPLES;
};

export const persistSample = async (sample: SampleDevelopmentOrder): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('sample_development_orders').upsert({
        id: sample.id,
        sdo_number: sample.sdoNumber,
        sector: sample.sector,
        style_name: sample.styleName,
        style_code: sample.styleCode,
        sampling_tier: sample.samplingTier,
        sop_reference: sample.sopReference,
        associated_product_id: sample.associatedProductId,
        buyer_company: sample.buyerCompany,
        buyer_contact: sample.buyerContact,
        target_market: sample.targetMarket,
        factory_id: sample.factoryId,
        factory_name: sample.factoryName,
        stage: sample.stage,
        round_number: sample.roundNumber,
        status: sample.status,
        request_date: sample.requestDate,
        target_delivery_date: sample.targetDeliveryDate,
        actual_approval_date: sample.actualApprovalDate,
        tech_pack: sample.techPack,
        courier: sample.courier,
        costing: sample.costing,
        reimbursement_terms: sample.reimbursementTerms,
        qa_dossier: sample.qaDossier,
        waybill_labelling: sample.waybillLabelling,
        feedbacks: sample.feedbacks,
        tags: sample.tags,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to upsert sample to Supabase:', e);
    }
  }
};

// ==============================================================================
// 4. SALES ORDERS & PURCHASE ORDERS
// ==============================================================================

export const fetchOrders = async (): Promise<BuyerSalesOrder[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('sales_orders').select('*').order('order_date', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          soNumber: row.so_number,
          buyerCompany: row.buyer_company,
          buyerContact: row.buyer_contact,
          targetMarket: row.target_market,
          operatingEntity: row.operating_entity,
          currency: row.currency,
          incoterm: row.incoterm,
          status: row.status,
          orderDate: row.order_date,
          targetExFactoryDate: row.target_ex_factory_date,
          targetPortCutOffDate: row.target_port_cut_off_date,
          targetDeliveryDate: row.target_delivery_date,
          paymentTerms: row.payment_terms,
          masterLcNumber: row.master_lc_number,
          totalQuantity: row.total_quantity,
          totalAmountBuyerCurrency: Number(row.total_amount_buyer_currency),
          totalAmountUsd: Number(row.total_amount_usd),
          items: row.items || [],
          linkedPo: row.linked_po || {},
          marginProtection: row.margin_protection || {},
          timeAndAction: row.time_and_action || [],
          inspections: row.inspections || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase orders fetch failed, falling back:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_ORDERS;
};

export const persistOrder = async (order: BuyerSalesOrder): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('sales_orders').upsert({
        id: order.id,
        so_number: order.soNumber,
        buyer_company: order.buyerCompany,
        buyer_contact: order.buyerContact,
        target_market: order.targetMarket,
        operating_entity: order.operatingEntity,
        currency: order.currency,
        incoterm: order.incoterm,
        status: order.status,
        order_date: order.orderDate,
        target_ex_factory_date: order.targetExFactoryDate,
        target_port_cut_off_date: order.targetPortCutOffDate,
        target_delivery_date: order.targetDeliveryDate,
        payment_terms: order.paymentTerms,
        master_lc_number: order.masterLcNumber,
        total_quantity: order.totalQuantity,
        total_amount_buyer_currency: order.totalAmountBuyerCurrency,
        total_amount_usd: order.totalAmountUsd,
        items: order.items,
        linked_po: order.linkedPo,
        margin_protection: order.marginProtection,
        time_and_action: order.timeAndAction,
        inspections: order.inspections,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to upsert order to Supabase:', e);
    }
  }
};

// ==============================================================================
// 5. CRM LEADS
// ==============================================================================

export const fetchCrmLeads = async (): Promise<CrmLead[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('crm_leads').select('*').limit(300);
      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          company: r.company,
          tier: r.tier,
          market: r.market,
          country: r.country,
          channel: r.channel,
          contact: r.contact,
          role: r.role,
          email: r.email,
          phone: r.phone,
          website: r.website,
          address: r.address,
          focus: r.focus,
          interest: r.interest,
          priority: r.priority,
          stage: r.stage,
          value: r.value ? Number(r.value) : null,
          nextAction: r.next_action,
          nextDate: r.next_date,
          lastContact: r.last_contact,
          touches: r.touches || 1,
          owner: r.owner,
          notes: r.notes,
          source: r.source,
          createdAt: r.created_at || new Date().toISOString(),
          cur: r.cur,
        }));
      }
    } catch (e) {
      console.warn('Supabase leads fetch failed, falling back:', e);
    }
  }

  return (crmLeadsData as any[]) as CrmLead[];
};

// ==============================================================================
// 6. GLOBAL INVENTORY & WAREHOUSES
// ==============================================================================

export const fetchInventory = async (): Promise<{
  warehouses: WarehouseLocation[];
  items: InventoryItem[];
  transfers: StockTransferOrder[];
}> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const [whRes, invRes, stoRes] = await Promise.all([
        supabase.from('warehouses').select('*'),
        supabase.from('inventory_items').select('*'),
        supabase.from('stock_transfers').select('*'),
      ]);

      if (!whRes.error && whRes.data) {
        const warehouses = whRes.data.map((r: any) => ({
          id: r.id,
          code: r.code,
          name: r.name,
          type: r.type,
          country: r.country,
          countryCode: r.country_code,
          city: r.city,
          flag: r.flag,
          capacityCbm: Number(r.capacity_cbm),
          currentUtilizationPct: Number(r.current_utilization_pct),
          operator: r.operator,
          address: r.address,
          contactEmail: r.contact_email,
          contactPhone: r.contact_phone,
          climateControlled: Boolean(r.climate_controlled),
          activeShipmentsInbound: Number(r.active_shipments_inbound) || 0,
        }));

        const items = (invRes.data || []).map((r: any) => ({
          id: r.id,
          sku: r.sku,
          productName: r.product_name,
          sector: r.sector,
          category: r.category,
          warehouseId: r.warehouse_id,
          warehouseCode: r.warehouse_code,
          warehouseName: r.warehouse_name,
          onHandQty: Number(r.on_hand_qty),
          reservedQty: Number(r.reserved_qty),
          availableQty: Number(r.available_qty),
          inTransitQty: Number(r.in_transit_qty),
          safetyStockMin: Number(r.safety_stock_min),
          reorderPoint: Number(r.reorder_point),
          unitCostUsd: Number(r.unit_cost_usd),
          totalValuationUsd: Number(r.total_valuation_usd),
          dailyRunRate: Number(r.daily_run_rate),
          daysOfInventoryRemaining: Number(r.days_of_inventory_remaining),
          healthStatus: r.health_status,
          allocations: r.allocations || {},
          provenance: r.provenance || {},
          lastPhysicalAuditDate: r.last_physical_audit_date,
        }));

        const transfers = (stoRes.data || []).map((r: any) => ({
          id: r.id,
          transferOrderNumber: r.transfer_order_number,
          sku: r.sku,
          productName: r.product_name,
          sourceWarehouseCode: r.source_warehouse_code,
          destinationWarehouseCode: r.destination_warehouse_code,
          unitsToTransfer: Number(r.units_to_transfer),
          channelDestination: r.channel_destination,
          modeOfTransport: r.mode_of_transport,
          carrier: r.carrier,
          trackingOrContainerNumber: r.tracking_or_container_number,
          departureDate: r.departure_date,
          estimatedArrivalDate: r.estimated_arrival_date,
          status: r.status,
          notes: r.notes,
        }));

        return { warehouses, items, transfers };
      }
    } catch (e) {
      console.warn('Supabase inventory fetch failed, using initial dataset:', e);
    }
  }

  return {
    warehouses: INITIAL_WAREHOUSES,
    items: INITIAL_INVENTORY_ITEMS,
    transfers: INITIAL_STOCK_TRANSFERS,
  };
};

// ==============================================================================
// 7. BULK SEED TO SUPABASE POSTGRESQL
// ==============================================================================

export const syncAllSeedDataToSupabase = async (): Promise<{
  success: boolean;
  message: string;
  error?: string;
  counts?: Record<string, number>;
  details?: Record<string, number>;
}> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials are not configured in .env.local (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing).',
      error: 'Supabase credentials missing in .env.local',
    };
  }

  try {
    // 1. Seed Products
    const productsPayload = INITIAL_PRODUCTS.map((p) => ({
      id: p.id,
      sku: p.sku,
      ean_barcode: p.eanBarcode,
      style_code: p.styleCode,
      packaging_mode: p.packagingMode,
      name: p.name,
      sector: p.sector,
      category: p.category,
      hs_code: p.hsCode,
      description: p.description,
      unit: p.unit,
      dimensions: p.dimensions,
      weight_kg: p.weightKg,
      tags: p.tags,
      target_markets: p.targetMarkets,
      costing: p.costing,
      attributes: p.attributes,
      compliance_certificates: p.complianceCertificates,
      partner_factory: p.partnerFactory,
      sample_status: p.sampleStatus,
      images: p.images,
    }));
    await supabase.from('products').upsert(productsPayload);

    // 2. Seed Factories
    const factoriesPayload = INITIAL_FACTORIES.map((f) => ({
      id: f.id,
      code: f.code,
      name: f.name,
      sectors: f.sectors,
      cluster: f.cluster,
      factory_address: f.factoryAddress,
      contact_person: f.contactPerson,
      designation: f.designation,
      phone: f.phone,
      email: f.email,
      trade_license_no: f.tradeLicenseNo,
      bin_number: f.binNumber,
      tin_number: f.tinNumber,
      epb_registration_no: f.epbRegistrationNo,
      tier: f.tier,
      capacity: f.capacity,
      scorecard: f.scorecard,
      compliance_audits: f.complianceAudits,
      lead_time_days: f.leadTimeDays,
      minimum_order_quantity: f.minimumOrderQuantity,
      payment_terms: f.paymentTerms,
      bank_details: f.bankDetails,
      associated_skus: f.associatedSkus,
    }));
    await supabase.from('factories').upsert(factoriesPayload);

    // 3. Seed SDOs
    const samplesPayload = INITIAL_SAMPLES.map((s) => ({
      id: s.id,
      sdo_number: s.sdoNumber,
      sector: s.sector,
      style_name: s.styleName,
      style_code: s.styleCode,
      sampling_tier: s.samplingTier,
      sop_reference: s.sopReference,
      associated_product_id: s.associatedProductId,
      buyer_company: s.buyerCompany,
      buyer_contact: s.buyerContact,
      target_market: s.targetMarket,
      factory_id: s.factoryId,
      factory_name: s.factoryName,
      stage: s.stage,
      round_number: s.roundNumber,
      status: s.status,
      request_date: s.requestDate,
      target_delivery_date: s.targetDeliveryDate,
      actual_approval_date: s.actualApprovalDate,
      tech_pack: s.techPack,
      courier: s.courier,
      costing: s.costing,
      reimbursement_terms: s.reimbursementTerms,
      qa_dossier: s.qaDossier,
      waybill_labelling: s.waybillLabelling,
      feedbacks: s.feedbacks,
      tags: s.tags,
    }));
    await supabase.from('sample_development_orders').upsert(samplesPayload);

    // 4. Seed Sales Orders
    const ordersPayload = INITIAL_ORDERS.map((o) => ({
      id: o.id,
      so_number: o.soNumber,
      buyer_company: o.buyerCompany,
      buyer_contact: o.buyerContact,
      target_market: o.targetMarket,
      operating_entity: o.operatingEntity,
      currency: o.currency,
      incoterm: o.incoterm,
      status: o.status,
      order_date: o.orderDate,
      target_ex_factory_date: o.targetExFactoryDate,
      target_port_cut_off_date: o.targetPortCutOffDate,
      target_delivery_date: o.targetDeliveryDate,
      payment_terms: o.paymentTerms,
      master_lc_number: o.masterLcNumber,
      total_quantity: o.totalQuantity,
      total_amount_buyer_currency: o.totalAmountBuyerCurrency,
      total_amount_usd: o.totalAmountUsd,
      items: o.items,
      linked_po: o.linkedPo,
      margin_protection: o.marginProtection,
      time_and_action: o.timeAndAction,
      inspections: o.inspections,
    }));
    await supabase.from('sales_orders').upsert(ordersPayload);

    // 5. Seed Warehouses
    const warehousesPayload = INITIAL_WAREHOUSES.map((w) => ({
      id: w.id,
      code: w.code,
      name: w.name,
      type: w.type,
      country: w.country,
      country_code: w.countryCode,
      city: w.city,
      flag: w.flag,
      capacity_cbm: w.capacityCbm,
      current_utilization_pct: w.currentUtilizationPct,
      operator: w.operator,
      address: w.address,
      contact_email: w.contactEmail,
      contact_phone: w.contactPhone,
      climate_controlled: w.climateControlled,
      active_shipments_inbound: w.activeShipmentsInbound,
    }));
    await supabase.from('warehouses').upsert(warehousesPayload);

    // 6. Seed Inventory Items
    const itemsPayload = INITIAL_INVENTORY_ITEMS.map((item) => ({
      id: item.id,
      sku: item.sku,
      product_name: item.productName,
      sector: item.sector,
      category: item.category,
      warehouse_id: item.warehouseId,
      warehouse_code: item.warehouseCode,
      warehouse_name: item.warehouseName,
      on_hand_qty: item.onHandQty,
      reserved_qty: item.reservedQty,
      available_qty: item.availableQty,
      in_transit_qty: item.inTransitQty,
      safety_stock_min: item.safetyStockMin,
      reorder_point: item.reorderPoint,
      unit_cost_usd: item.unitCostUsd,
      total_valuation_usd: item.totalValuationUsd,
      daily_run_rate: item.dailyRunRate,
      days_of_inventory_remaining: item.daysOfInventoryRemaining,
      health_status: item.healthStatus,
      allocations: item.allocations,
      provenance: item.provenance,
      last_physical_audit_date: item.lastPhysicalAuditDate,
    }));
    await supabase.from('inventory_items').upsert(itemsPayload);

    // 7. Seed Transfers
    const transfersPayload = INITIAL_STOCK_TRANSFERS.map((t) => ({
      id: t.id,
      transfer_order_number: t.transferOrderNumber,
      sku: t.sku,
      product_name: t.productName,
      source_warehouse_code: t.sourceWarehouseCode,
      destination_warehouse_code: t.destinationWarehouseCode,
      units_to_transfer: t.unitsToTransfer,
      channel_destination: t.channelDestination,
      mode_of_transport: t.modeOfTransport,
      carrier: t.carrier,
      tracking_or_container_number: t.trackingOrContainerNumber,
      departure_date: t.departureDate,
      estimated_arrival_date: t.estimatedArrivalDate,
      status: t.status,
      notes: t.notes,
    }));
    await supabase.from('stock_transfers').upsert(transfersPayload);

    // 8. Seed Standard Vouchers
    const vouchersPayload = INITIAL_STANDARD_VOUCHERS.map((v) => ({
      id: v.id,
      voucher_number: v.voucherNumber,
      type: v.type,
      date: v.date,
      main_account_head: v.mainAccountHead,
      sub_category_head: v.subCategoryHead,
      currency: v.currency,
      exchange_rate_to_bdt: v.exchangeRateToBdt,
      party_name: v.partyName,
      party_details: v.partyDetails,
      linked_order_number: v.linkedOrderNumber,
      buyer_country: v.buyerCountry,
      payment_mode: v.paymentMode,
      bank_reference: v.bankReference,
      tax_chalan_ref: v.taxChalanRef,
      station_code: v.stationCode || 'ARIEL_BD',
      station_bank_name: v.stationBankName,
      station_account_number: v.stationAccountNumber,
      channel: v.channel,
      channel_transaction_ref: v.channelTransactionRef,
      is_station_b2c_inflow: v.isStationB2CInflow ?? false,
      items: v.items,
      total_amount: v.totalAmount,
      total_amount_bdt: v.totalAmountBdt,
      amount_in_words: v.amountInWords,
      prepared_by: v.preparedBy,
      verified_by: v.verifiedBy,
      approved_by: v.approvedBy,
      claimant_or_depositor: v.claimantOrDepositor,
      physical_attachment: v.physicalAttachment,
      audit_status: v.auditStatus,
      is_local_value_addition: v.isLocalValueAddition,
      notes: v.notes,
    }));
    await supabase.from('vouchers').upsert(vouchersPayload);

    // 9. Seed Account Heads
    const accountHeadsPayload = INITIAL_ACCOUNT_HEADS.map((h) => ({
      id: h.id,
      name: h.name,
      code: h.code,
      type: h.type,
      description: h.description,
      sub_categories: h.subCategories,
      is_default: h.isDefault,
    }));
    await supabase.from('account_heads').upsert(accountHeadsPayload);

    // 10. Seed Bangladesh 34 Compliance Checklist
    const compliancePayload = BANGLADESH_34_COMPLIANCE_CHECKLIST.map((c) => ({
      id: `chk-${c.id}`,
      checklist_id: c.id,
      title: c.title,
      category: c.category,
      category_label: c.categoryLabel,
      issuing_authority: c.issuingAuthority,
      description: c.description,
      step_sequence: c.stepSequence,
      step_title: c.stepTitle,
      govt_fee_estimate: c.govtFeeEstimate,
      agency_fee_estimate: c.agencyFeeEstimate,
      total_budget_estimate: c.totalBudgetEstimate,
      destination_market_audit: c.destinationMarketAudit,
      document_id: c.documentId,
      is_mandatory: c.isMandatory,
      status: c.status,
    }));
    await supabase.from('compliance_records').upsert(compliancePayload);

    // 11. Seed POS Register Shifts
    const posShiftsPayload = Object.values(INITIAL_REGISTER_SHIFTS).map((s) => ({
      id: s.id,
      store_id: s.storeId,
      cashier: s.cashier,
      opened_at: s.openedAt,
      closed_at: s.closedAt,
      opening_float: s.openingFloat,
      cash_sales: s.cashSales,
      card_sales: s.cardSales,
      wire_sales: s.wireSales,
      mobile_sales: s.mobileSales,
      total_sales: s.totalSales,
      total_orders: s.totalOrders,
      b2b_orders_count: s.b2bOrdersCount,
      d2c_orders_count: s.d2cOrdersCount,
      cash_expected: s.cashExpected,
      cash_actual: s.cashActual,
      status: s.status,
    }));
    await supabase.from('pos_register_shifts').upsert(posShiftsPayload);

    // 12. Seed POS Transactions
    const posTxnsPayload = INITIAL_POS_TRANSACTIONS.map((txn) => ({
      id: txn.id,
      receipt_number: txn.receiptNumber,
      date: txn.date,
      time: txn.time,
      store_id: txn.storeId,
      mode: txn.mode,
      customer: txn.customer,
      items: txn.items,
      subtotal: txn.subtotal,
      discount_amount: txn.discountAmount,
      discount_code: txn.discountCode,
      tax_amount: txn.taxAmount,
      total_amount: txn.totalAmount,
      currency: txn.currency,
      currency_symbol: txn.currencySymbol,
      payment_method: txn.paymentMethod,
      payment_ref: txn.paymentRef,
      amount_tendered: txn.amountTendered,
      change_due: txn.changeDue,
      cashier_name: txn.cashierName,
      linked_sales_order_id: txn.linkedSalesOrderId,
      notes: txn.notes,
    }));
    await supabase.from('pos_transactions').upsert(posTxnsPayload);

    // 13. Seed Official Documents
    const documentsPayload = INITIAL_OFFICIAL_DOCUMENTS.map((doc) => ({
      id: doc.id,
      title: doc.title,
      doc_code: doc.docCode,
      section: doc.section,
      station: doc.station,
      issuing_authority: doc.issuingAuthority,
      document_number: doc.documentNumber,
      category: doc.category,
      issue_date: doc.issueDate,
      expiry_date: doc.expiryDate,
      renewal_lead_days: doc.renewalLeadDays,
      status: doc.status,
      file_format: doc.fileFormat,
      file_size: doc.fileSize,
      file_url: doc.fileUrl,
      verified: doc.verified ?? true,
      uploaded_by: doc.uploadedBy,
      uploaded_at: doc.uploadedAt,
      notes: doc.notes,
      renewal_task: doc.renewalTask,
      checklist_item_id: doc.checklistItemId,
    }));
    await supabase.from('official_documents').upsert(documentsPayload);

    const countsMap = {
      products: productsPayload.length,
      factories: factoriesPayload.length,
      samples: samplesPayload.length,
      orders: ordersPayload.length,
      warehouses: warehousesPayload.length,
      inventory: itemsPayload.length,
      transfers: transfersPayload.length,
      vouchers: vouchersPayload.length,
      account_heads: accountHeadsPayload.length,
      compliance_records: compliancePayload.length,
      pos_shifts: posShiftsPayload.length,
      pos_transactions: posTxnsPayload.length,
      official_documents: documentsPayload.length,
    };

    return {
      success: true,
      message: 'All master enterprise records seeded successfully to Supabase PostgreSQL!',
      counts: countsMap,
      details: countsMap,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Database sync failed: ${error?.message || error}`,
      error: error?.message || String(error),
    };
  }
};

// ==============================================================================
// 7.5. VOUCHERS PERSISTENCE (Cash Purchase & Money Receive Dual-Flow Engine)
// ==============================================================================

export const fetchVouchers = async (): Promise<StandardVoucher[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('vouchers').select('*').order('date', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          voucherNumber: row.voucher_number || row.voucherNumber,
          type: row.type,
          date: row.date,
          mainAccountHead: row.main_account_head || row.mainAccountHead,
          subCategoryHead: row.sub_category_head || row.subCategoryHead,
          currency: row.currency || 'BDT',
          exchangeRateToBdt: Number(row.exchange_rate_to_bdt || row.exchangeRateToBdt) || 1.0,
          partyName: row.party_name || row.partyName,
          partyDetails: row.party_details || row.partyDetails,
          linkedOrderNumber: row.linked_order_number || row.linkedOrderNumber,
          paymentMode: row.payment_mode || row.paymentMode,
          bankReference: row.bank_reference || row.bankReference,
          taxChalanRef: row.tax_chalan_ref || row.taxChalanRef,
          items: row.items || [],
          totalAmount: Number(row.total_amount || row.totalAmount) || 0,
          totalAmountBdt: Number(row.total_amount_bdt || row.totalAmountBdt) || 0,
          amountInWords: row.amount_in_words || row.amountInWords,
          preparedBy: row.prepared_by || row.preparedBy,
          verifiedBy: row.verified_by || row.verifiedBy,
          approvedBy: row.approved_by || row.approvedBy,
          claimantOrDepositor: row.claimant_or_depositor || row.claimantOrDepositor,
          physicalAttachment: row.physical_attachment || row.physicalAttachment,
          auditStatus: row.audit_status || row.auditStatus || 'VERIFIED',
          isLocalValueAddition: row.is_local_value_addition ?? row.isLocalValueAddition ?? true,
          notes: row.notes,
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('Supabase vouchers fetch failed, falling back to local cache:', e);
    }
  }

  // LocalStorage / Seed Fallback
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.VOUCHERS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_STANDARD_VOUCHERS;
};

export const persistVoucher = async (voucher: StandardVoucher): Promise<void> => {
  // 1. Dual persistence to LocalStorage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.VOUCHERS);
      let list: StandardVoucher[] = cached ? JSON.parse(cached) : INITIAL_STANDARD_VOUCHERS;
      const idx = list.findIndex((v) => v.id === voucher.id);
      if (idx >= 0) {
        list[idx] = voucher;
      } else {
        list = [voucher, ...list];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.VOUCHERS, JSON.stringify(list));
    } catch (err) {
      console.error('LocalStorage voucher persistence error:', err);
    }
  }

  // 2. Dual persistence to Supabase PostgreSQL (if connected)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('vouchers').upsert({
        id: voucher.id,
        voucher_number: voucher.voucherNumber,
        type: voucher.type,
        date: voucher.date,
        main_account_head: voucher.mainAccountHead,
        sub_category_head: voucher.subCategoryHead,
        currency: voucher.currency,
        exchange_rate_to_bdt: voucher.exchangeRateToBdt,
        party_name: voucher.partyName,
        party_details: voucher.partyDetails,
        linked_order_number: voucher.linkedOrderNumber,
        payment_mode: voucher.paymentMode,
        bank_reference: voucher.bankReference,
        tax_chalan_ref: voucher.taxChalanRef,
        items: voucher.items,
        total_amount: voucher.totalAmount,
        total_amount_bdt: voucher.totalAmountBdt,
        amount_in_words: voucher.amountInWords,
        prepared_by: voucher.preparedBy,
        verified_by: voucher.verifiedBy,
        approved_by: voucher.approvedBy,
        claimant_or_depositor: voucher.claimantOrDepositor,
        physical_attachment: voucher.physicalAttachment,
        audit_status: voucher.auditStatus,
        is_local_value_addition: voucher.isLocalValueAddition,
        notes: voucher.notes,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase optional voucher cloud sync skipped (offline mode active):', e);
    }
  }
};

// ==============================================================================
// 7.6. ACCOUNT HEADS PERSISTENCE (Custom & Statutory Ledger Chart of Accounts)
// ==============================================================================

export const getCachedAccountHeads = (): AccountHead[] => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCOUNT_HEADS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return INITIAL_ACCOUNT_HEADS;
};

export const fetchAccountHeads = async (): Promise<AccountHead[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('account_heads').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        const mapped = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          code: row.code,
          type: row.type,
          description: row.description,
          subCategories: row.sub_categories || row.subCategories || [],
          isDefault: row.is_default ?? row.isDefault ?? false,
          createdAt: row.created_at || row.createdAt,
          updatedAt: row.updated_at || row.updatedAt,
        }));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.ACCOUNT_HEADS, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase account_heads fetch failed, falling back to local cache:', e);
    }
  }

  // LocalStorage / Seed Fallback
  return getCachedAccountHeads();
};

export const persistAccountHeads = async (heads: AccountHead[]): Promise<void> => {
  // 1. Dual persistence to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCOUNT_HEADS, JSON.stringify(heads));
    } catch (err) {
      console.error('LocalStorage account_heads persistence error:', err);
    }
  }

  // 2. Dual persistence to Supabase PostgreSQL (if connected)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload = heads.map((h) => ({
        id: h.id,
        name: h.name,
        code: h.code,
        type: h.type,
        description: h.description,
        sub_categories: h.subCategories,
        is_default: h.isDefault,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('account_heads').upsert(payload);
    } catch (e) {
      console.warn('Supabase optional account_heads cloud sync skipped (offline mode active):', e);
    }
  }
};

// ==============================================================================
// 7.7. OFFICIAL DOCUMENTS PERSISTENCE (Statutory, Export & Commercial Archive)
// ==============================================================================

export const fetchOfficialDocuments = async (): Promise<OfficialDocument[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('official_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: OfficialDocument[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          docCode: row.doc_code || row.docCode,
          section: row.section,
          station: row.station,
          issuingAuthority: row.issuing_authority || row.issuingAuthority,
          documentNumber: row.document_number || row.documentNumber,
          category: row.category,
          issueDate: row.issue_date || row.issueDate,
          expiryDate: row.expiry_date || row.expiryDate,
          renewalLeadDays: row.renewal_lead_days ?? row.renewalLeadDays ?? 30,
          status: row.status,
          fileFormat: row.file_format || row.fileFormat || 'PDF',
          fileSize: row.file_size || row.fileSize,
          fileUrl: row.file_url || row.fileUrl,
          verified: row.verified ?? true,
          uploadedBy: row.uploaded_by || row.uploadedBy,
          uploadedAt: row.uploaded_at || row.uploadedAt,
          notes: row.notes,
          renewalTask: row.renewal_task || row.renewalTask,
          checklistItemId: row.checklist_item_id ?? row.checklistItemId,
        }));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase official_documents fetch failed, falling back to local cache:', e);
    }
  }

  // LocalStorage / Seed Fallback
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_OFFICIAL_DOCUMENTS;
};

export const persistOfficialDocument = async (doc: OfficialDocument): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS);
      let list: OfficialDocument[] = cached ? JSON.parse(cached) : INITIAL_OFFICIAL_DOCUMENTS;
      const idx = list.findIndex((d) => d.id === doc.id);
      if (idx >= 0) {
        list[idx] = doc;
      } else {
        list = [doc, ...list];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('arielmc_documents_changed'));
    } catch (err) {
      console.error('LocalStorage official document persistence error:', err);
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('official_documents').upsert({
        id: doc.id,
        title: doc.title,
        doc_code: doc.docCode,
        section: doc.section,
        station: doc.station,
        issuing_authority: doc.issuingAuthority,
        document_number: doc.documentNumber,
        category: doc.category,
        issue_date: doc.issueDate,
        expiry_date: doc.expiryDate,
        renewal_lead_days: doc.renewalLeadDays,
        status: doc.status,
        file_format: doc.fileFormat,
        file_size: doc.fileSize,
        file_url: doc.fileUrl,
        verified: doc.verified ?? true,
        uploaded_by: doc.uploadedBy,
        uploaded_at: doc.uploadedAt || new Date().toISOString(),
        notes: doc.notes,
        renewal_task: doc.renewalTask,
        checklist_item_id: doc.checklistItemId,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase official document sync skipped:', e);
    }
  }
};

export const deleteOfficialDocument = async (docId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS);
      if (cached) {
        const list: OfficialDocument[] = JSON.parse(cached);
        const filtered = list.filter((d) => d.id !== docId);
        localStorage.setItem(LOCAL_STORAGE_KEYS.OFFICIAL_DOCUMENTS, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('arielmc_documents_changed'));
      }
    } catch (err) {
      console.error('LocalStorage official document delete error:', err);
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('official_documents').delete().eq('id', docId);
    } catch (e) {
      console.warn('Supabase official document delete skipped:', e);
    }
  }
};

// ==============================================================================
// 7.8. BANGLADESH 34-STEP STATUTORY COMPLIANCE PERSISTENCE
// ==============================================================================

export const fetchComplianceChecklist = async (): Promise<ComplianceChecklistItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('compliance_records')
        .select('*')
        .order('step_sequence', { ascending: true });

      if (!error && data) {
        const mapped: ComplianceChecklistItem[] = data.map((row: any) => ({
          id: row.checklist_id ?? Number(row.id?.replace('chk-', '')) ?? 1,
          title: row.title,
          category: row.category,
          categoryLabel: row.category_label || row.categoryLabel,
          issuingAuthority: row.issuing_authority || row.issuingAuthority,
          description: row.description,
          stepSequence: row.step_sequence ?? row.stepSequence,
          stepTitle: row.step_title || row.stepTitle,
          govtFeeEstimate: row.govt_fee_estimate || row.govtFeeEstimate,
          agencyFeeEstimate: row.agency_fee_estimate || row.agencyFeeEstimate,
          totalBudgetEstimate: row.total_budget_estimate || row.totalBudgetEstimate,
          destinationMarketAudit: row.destination_market_audit || row.destinationMarketAudit,
          documentId: row.document_id || row.documentId,
          isMandatory: row.is_mandatory ?? row.isMandatory ?? true,
          status: row.status,
        }));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLIANCE, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase compliance_records fetch failed, falling back to local cache:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLIANCE);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return BANGLADESH_34_COMPLIANCE_CHECKLIST;
};

export const persistComplianceChecklistItem = async (item: ComplianceChecklistItem): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLIANCE);
      let list: ComplianceChecklistItem[] = cached ? JSON.parse(cached) : BANGLADESH_34_COMPLIANCE_CHECKLIST;
      const idx = list.findIndex((c) => c.id === item.id);
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.push(item);
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLIANCE, JSON.stringify(list));
    } catch (err) {
      console.error('LocalStorage compliance persistence error:', err);
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('compliance_records').upsert({
        id: `chk-${item.id}`,
        checklist_id: item.id,
        title: item.title,
        category: item.category,
        category_label: item.categoryLabel,
        issuing_authority: item.issuingAuthority,
        description: item.description,
        step_sequence: item.stepSequence,
        step_title: item.stepTitle,
        govt_fee_estimate: item.govtFeeEstimate,
        agency_fee_estimate: item.agencyFeeEstimate,
        total_budget_estimate: item.totalBudgetEstimate,
        destination_market_audit: item.destinationMarketAudit,
        document_id: item.documentId,
        is_mandatory: item.isMandatory,
        status: item.status,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase compliance sync skipped:', e);
    }
  }
};

// ==============================================================================
// 7.9. POS REGISTER SHIFTS PERSISTENCE (Multi-Store Shift Drawer Tracking)
// ==============================================================================

export const fetchPosRegisterShifts = async (): Promise<Record<string, PosRegisterShift>> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('pos_register_shifts').select('*');
      if (!error && data) {
        const mapped: Record<string, PosRegisterShift> = {};
        data.forEach((row: any) => {
          mapped[row.store_id] = {
            id: row.id,
            storeId: row.store_id,
            cashier: row.cashier,
            openedAt: row.opened_at,
            closedAt: row.closed_at,
            openingFloat: Number(row.opening_float) || 0,
            cashSales: Number(row.cash_sales) || 0,
            cardSales: Number(row.card_sales) || 0,
            wireSales: Number(row.wire_sales) || 0,
            mobileSales: Number(row.mobile_sales) || 0,
            totalSales: Number(row.total_sales) || 0,
            totalOrders: row.total_orders || 0,
            b2bOrdersCount: row.b2b_orders_count || 0,
            d2cOrdersCount: row.d2c_orders_count || 0,
            cashExpected: Number(row.cash_expected) || 0,
            cashActual: row.cash_actual != null ? Number(row.cash_actual) : undefined,
            status: row.status || 'OPEN',
          };
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SHIFTS, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase pos_register_shifts fetch failed, falling back to local cache:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_SHIFTS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_REGISTER_SHIFTS;
};

export const persistPosRegisterShift = async (shift: PosRegisterShift): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_SHIFTS);
      const shiftsMap: Record<string, PosRegisterShift> = cached
        ? JSON.parse(cached)
        : { ...INITIAL_REGISTER_SHIFTS };
      shiftsMap[shift.storeId] = shift;
      localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SHIFTS, JSON.stringify(shiftsMap));
    } catch (err) {
      console.error('LocalStorage POS shift persistence error:', err);
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('pos_register_shifts').upsert({
        id: shift.id,
        store_id: shift.storeId,
        cashier: shift.cashier,
        opened_at: shift.openedAt,
        closed_at: shift.closedAt,
        opening_float: shift.openingFloat,
        cash_sales: shift.cashSales,
        card_sales: shift.cardSales,
        wire_sales: shift.wireSales,
        mobile_sales: shift.mobileSales,
        total_sales: shift.totalSales,
        total_orders: shift.totalOrders,
        b2b_orders_count: shift.b2bOrdersCount,
        d2c_orders_count: shift.d2cOrdersCount,
        cash_expected: shift.cashExpected,
        cash_actual: shift.cashActual,
        status: shift.status,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase POS shift sync skipped:', e);
    }
  }
};

// ==============================================================================
// 7.10. POS TRANSACTIONS PERSISTENCE (Omnichannel Retail & Wholesale Receipts)
// ==============================================================================

export const fetchPosTransactions = async (): Promise<PosTransaction[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        const mapped: PosTransaction[] = data.map((row: any) => ({
          id: row.id,
          receiptNumber: row.receipt_number || row.receiptNumber,
          date: row.date,
          time: row.time,
          storeId: row.store_id || row.storeId,
          mode: row.mode,
          customer: row.customer || {},
          items: row.items || [],
          subtotal: Number(row.subtotal) || 0,
          discountAmount: Number(row.discount_amount) || 0,
          discountCode: row.discount_code || row.discountCode,
          taxAmount: Number(row.tax_amount) || 0,
          totalAmount: Number(row.total_amount) || 0,
          currency: row.currency || 'GBP',
          currencySymbol: row.currency_symbol || row.currencySymbol || '£',
          paymentMethod: row.payment_method || row.paymentMethod,
          paymentRef: row.payment_ref || row.paymentRef,
          amountTendered: Number(row.amount_tendered) || 0,
          changeDue: Number(row.change_due) || 0,
          cashierName: row.cashier_name || row.cashierName,
          linkedSalesOrderId: row.linked_sales_order_id || row.linkedSalesOrderId,
          notes: row.notes,
        }));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEYS.POS_TRANSACTIONS, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase pos_transactions fetch failed, falling back to local cache:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_TRANSACTIONS);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return INITIAL_POS_TRANSACTIONS;
};

export const persistPosTransaction = async (tx: PosTransaction): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_TRANSACTIONS);
      let list: PosTransaction[] = cached ? JSON.parse(cached) : INITIAL_POS_TRANSACTIONS;
      const idx = list.findIndex((t) => t.id === tx.id);
      if (idx >= 0) {
        list[idx] = tx;
      } else {
        list = [tx, ...list];
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.POS_TRANSACTIONS, JSON.stringify(list));
    } catch (err) {
      console.error('LocalStorage POS transaction persistence error:', err);
    }
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('pos_transactions').upsert({
        id: tx.id,
        receipt_number: tx.receiptNumber,
        date: tx.date,
        time: tx.time,
        store_id: tx.storeId,
        mode: tx.mode,
        customer: tx.customer,
        items: tx.items,
        subtotal: tx.subtotal,
        discount_amount: tx.discountAmount,
        discount_code: tx.discountCode,
        tax_amount: tx.taxAmount,
        total_amount: tx.totalAmount,
        currency: tx.currency,
        currency_symbol: tx.currencySymbol,
        payment_method: tx.paymentMethod,
        payment_ref: tx.paymentRef,
        amount_tendered: tx.amountTendered,
        change_due: tx.changeDue,
        cashier_name: tx.cashierName,
        linked_sales_order_id: tx.linkedSalesOrderId,
        notes: tx.notes,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase POS transaction sync skipped:', e);
    }
  }
};

// ==============================================================================
// 8. DATABASE HEALTH CHECK & MULTI-TABLE PING
// ==============================================================================

export const testSupabaseHealth = async (): Promise<{
  configured: boolean;
  connected: boolean;
  latencyMs: number;
  message: string;
  error?: string;
  tableCounts?: Record<string, number>;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      latencyMs: 0,
      message: 'Supabase environment variables not configured in .env.local (Using offline local cache mode).',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      configured: true,
      connected: false,
      latencyMs: 0,
      message: 'Unable to initialize Supabase client instance.',
      error: 'Client instance initialization failed',
    };
  }

  const start = performance.now();
  try {
    const [
      prodsRes,
      facsRes,
      sdosRes,
      ordersRes,
      vouchersRes,
      headsRes,
      docsRes,
      posTxRes,
      complianceRes,
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('factories').select('*', { count: 'exact', head: true }),
      supabase.from('sample_development_orders').select('*', { count: 'exact', head: true }),
      supabase.from('sales_orders').select('*', { count: 'exact', head: true }),
      supabase.from('vouchers').select('*', { count: 'exact', head: true }),
      supabase.from('account_heads').select('*', { count: 'exact', head: true }),
      supabase.from('official_documents').select('*', { count: 'exact', head: true }),
      supabase.from('pos_transactions').select('*', { count: 'exact', head: true }),
      supabase.from('compliance_records').select('*', { count: 'exact', head: true }),
    ]);

    const latencyMs = Math.round(performance.now() - start);

    if (prodsRes.error) {
      return {
        configured: true,
        connected: false,
        latencyMs,
        message: `Connected to Supabase endpoint, but table query returned error: ${prodsRes.error.message}. (Have you run supabase/schema.sql in the Supabase SQL Editor?)`,
        error: prodsRes.error.message,
      };
    }

    return {
      configured: true,
      connected: true,
      latencyMs,
      message: `Active PostgreSQL connection verified (${latencyMs}ms response time across 9 enterprise tables).`,
      tableCounts: {
        products: prodsRes.count || 0,
        factories: facsRes.count || 0,
        samples: sdosRes.count || 0,
        orders: ordersRes.count || 0,
        vouchers: vouchersRes.count || 0,
        account_heads: headsRes.count || 0,
        official_documents: docsRes.count || 0,
        pos_transactions: posTxRes.count || 0,
        compliance_records: complianceRes.count || 0,
      },
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      latencyMs: Math.round(performance.now() - start),
      message: `Network connection failed: ${err.message || err}`,
      error: err.message || String(err),
    };
  }
};

// ==============================================================================
// 15. BUYER PORTFOLIOS PERSISTENCE
// ==============================================================================

export const fetchBuyerPortfolios = async (): Promise<BuyerPortfolio[]> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.BUYER_PORTFOLIOS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached buyer portfolios:', e);
    }
  }
  return INITIAL_BUYER_PORTFOLIOS;
};

export const persistBuyerPortfolios = async (portfolios: BuyerPortfolio[]): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BUYER_PORTFOLIOS, JSON.stringify(portfolios));
    } catch (e) {
      console.warn('Failed to cache buyer portfolios:', e);
    }
  }
};

// ==============================================================================
// 16. FACTORY & SUPPLIER PORTFOLIOS PERSISTENCE
// ==============================================================================

export const fetchFactoryPortfolios = async (): Promise<FactorySupplierPortfolio[]> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.FACTORY_PORTFOLIOS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached factory portfolios:', e);
    }
  }
  return INITIAL_FACTORY_PORTFOLIOS;
};

export const persistFactoryPortfolios = async (portfolios: FactorySupplierPortfolio[]): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FACTORY_PORTFOLIOS, JSON.stringify(portfolios));
    } catch (e) {
      console.warn('Failed to cache factory portfolios:', e);
    }
  }
};

// ==============================================================================
// 17. B2C / D2C MULTICHANNEL SALES POINTS & ORDERS PERSISTENCE
// ==============================================================================

export const fetchD2cSalesPoints = async (): Promise<D2cSalesPoint[]> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.D2C_SALES_POINTS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached D2C sales points:', e);
    }
  }
  return INITIAL_D2C_SALES_POINTS;
};

export const persistD2cSalesPoints = async (points: D2cSalesPoint[]): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.D2C_SALES_POINTS, JSON.stringify(points));
    } catch (e) {
      console.warn('Failed to cache D2C sales points:', e);
    }
  }
};

export const fetchD2cSaleOrders = async (): Promise<D2cSaleOrder[]> => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.D2C_SALE_ORDERS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached D2C sale orders:', e);
    }
  }
  return INITIAL_D2C_SALE_ORDERS;
};

export const persistD2cSaleOrders = async (orders: D2cSaleOrder[]): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.D2C_SALE_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to cache D2C sale orders:', e);
    }
  }
};


