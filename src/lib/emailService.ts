import { EmailQueueItem, EmailTemplateType, EmailProviderType } from '@/types/erp';
import { getSupabaseClient } from './supabaseClient';

export interface EmailTemplatePayload {
  to: string;
  recipientName?: string;
  subject: string;
  templateId: EmailTemplateType;
  variables: Record<string, any>;
  provider?: EmailProviderType;
}

/**
 * Corporate ArielMC HTML Email Base Wrapper
 * Styled in bespoke British Racing Green (#1F3A2E) & Sand Gold (#C8A96A)
 */
export function wrapInArielCorporateTemplate(contentHtml: string, title: string, subtitle?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F4; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #DDE3DD; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: #1F3A2E; padding: 28px 32px; border-bottom: 3px solid #C8A96A; text-align: left; }
    .header-logo { font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0; }
    .header-logo span { color: #C8A96A; }
    .header-sub { font-size: 11px; color: #A0B9A8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; font-weight: 600; }
    .body { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .badge { display: inline-block; background: #E8F0EA; color: #1F3A2E; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; border: 1px solid #C8A96A; }
    .badge-gold { background: #C8A96A; color: #1F3A2E; font-weight: bold; }
    .card { background: #FAF9F5; border: 1px solid #E8EDE8; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    .table th { background: #F1F5F2; padding: 10px 12px; text-align: left; font-weight: 700; color: #1F3A2E; border-bottom: 2px solid #DDE3DD; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; }
    .btn { display: inline-block; background: #1F3A2E; color: #FFFFFF !important; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none; border-bottom: 3px solid #C8A96A; }
    .footer { background: #162B22; padding: 24px 32px; text-align: left; font-size: 11px; color: #8FA899; line-height: 1.6; border-top: 1px solid #2C5240; }
    .footer strong { color: #FFFFFF; }
    .footer-stations { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: #738F7E; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">Ariel<span>MC</span> Enterprise ERP</div>
      <div class="header-sub">${subtitle || 'Global Sourcing • Supply Chain & Trade Logistics'}</div>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <strong>Ariel Marketing & Communications Limited</strong><br>
      Official Trade & Global Sourcing Division • Bangladesh AD Banking Registered<br>
      e-TIN: 481928371901 • VAT BIN: 004819283-0101 • RJSC Reg: C-189283<br>
      <div class="footer-stations">
        <strong>Operating Stations:</strong><br>
        🇧🇩 Dhaka HQ: Gulshan-2, Dhaka-1212 | AD Bank: Eastern Bank PLC (ERQ Div)<br>
        🇬🇧 UK Hub: Davies Turner Logistics, Felixstowe & Dartford DA2<br>
        🇩🇪 EU Hub: Dachser European Logistics SE, Hamburg DE-21107<br>
        🇺🇸 US Hub: Long Beach, CA | 🇦🇺 AU Hub: Port Botany, Sydney
      </div>
      <p style="margin-top: 12px; font-size: 9px; color: #587363;">
        Confidential Notice: This electronic transmission and any attachments are intended solely for the designated recipient. It contains proprietary commercial data protected under international trade and banking laws.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Render Commercial Invoice / Proforma / Mushak 6.3 Email Template
 */
export function renderInvoiceTemplate(vars: {
  invoiceNo: string;
  invoiceType?: 'COMMERCIAL' | 'PROFORMA' | 'MUSHAK_6_3';
  buyerName: string;
  buyerCountry?: string;
  totalAmountUsd: number;
  currency?: string;
  paymentTerms?: string;
  duePeriod?: string;
  lineItems?: Array<{ description: string; qty: number; unitPrice: number; total: number }>;
  downloadUrl?: string;
}): { subject: string; html: string } {
  const typeLabel = vars.invoiceType === 'MUSHAK_6_3' 
    ? 'Official VAT Mushak 6.3 Tax Invoice' 
    : vars.invoiceType === 'PROFORMA'
    ? 'Proforma Invoice (P/I)' 
    : 'Commercial Export Invoice';

  const subject = `[${typeLabel}] ${vars.invoiceNo} — ArielMC Ltd for ${vars.buyerName}`;

  const itemsHtml = vars.lineItems && vars.lineItems.length > 0 
    ? `<table class="table">
        <thead>
          <tr>
            <th>Item & Specification</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${vars.lineItems.map(item => `
            <tr>
              <td><strong>${item.description}</strong></td>
              <td style="text-align: right;">${item.qty}</td>
              <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
              <td style="text-align: right; font-weight: bold;">$${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`
    : '';

  const body = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <span class="badge badge-gold">${typeLabel}</span>
        <h2 style="margin: 8px 0 4px 0; font-size: 20px; color: #1F3A2E;">Ref: ${vars.invoiceNo}</h2>
        <div style="font-size: 12px; color: #64748B;">Date: ${new Date().toLocaleDateString('en-GB')} • Issued by ArielMC Finance Desk</div>
      </div>
    </div>

    <p>Dear <strong>${vars.buyerName}</strong>,</p>
    <p>Please find attached your official commercial document issued by <strong>Ariel Marketing & Communications Limited</strong> for international customs clearing and banking acceptance.</p>

    <div class="card">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #1F3A2E; letter-spacing: 1px; margin-bottom: 8px;">Document Summary</div>
      <table style="width: 100%; font-size: 13px;">
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Invoice Amount:</td>
          <td style="font-weight: 800; font-size: 16px; color: #1F3A2E; text-align: right;">$${vars.totalAmountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${vars.currency || 'USD'}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Payment Terms:</td>
          <td style="font-weight: 600; text-align: right;">${vars.paymentTerms || 'Irrevocable Confirmed L/C at Sight'}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Export Clearance Port:</td>
          <td style="font-weight: 600; text-align: right;">Chittagong Port (BDCGP) / Dhaka Air Cargo (DAC)</td>
        </tr>
      </table>
    </div>

    ${itemsHtml}

    <p style="margin-top: 24px;">
      ${vars.downloadUrl 
        ? `<a href="${vars.downloadUrl}" class="btn">View & Download Official PDF</a>` 
        : `<em>The encrypted official PDF document is attached to this transmission.</em>`}
    </p>

    <div style="margin-top: 24px; padding: 12px 16px; background: #FFFBEB; border-left: 4px solid #C8A96A; font-size: 12px; color: #78350F;">
      <strong>Authorized Banking Note:</strong> In accordance with Bangladesh Bank FE Circular regulations, foreign currency settlements must be routed directly via Eastern Bank PLC (AD Foreign Exchange Branch), SWIFT: <code>EBLDBDDH</code>.
    </div>
  `;

  return {
    subject,
    html: wrapInArielCorporateTemplate(body, subject, 'Export Billing & Statutory Mushak System')
  };
}

/**
 * Render Two-Tier B2B Sample Dispatch Protocol Email Template
 */
export function renderSampleDispatchTemplate(vars: {
  sampleCode: string;
  buyerName: string;
  sku: string;
  productName: string;
  tier: 'TIER_1_3PL_BUFFER' | 'TIER_2_DHAKA_OEM';
  carrier: string;
  trackingNumber: string;
  originHub: string;
  destinationAddress: string;
  estimatedDeliveryDate?: string;
}): { subject: string; html: string } {
  const subject = `[Sample Dispatch #${vars.sampleCode}] ${vars.productName} — Dispatched via ${vars.carrier}`;

  const tierBadge = vars.tier === 'TIER_1_3PL_BUFFER' 
    ? 'Tier 1: 3PL Hub Buffer (24-48h Expedited Delivery)' 
    : 'Tier 2: Dhaka OEM Artisan Prototype (Bespoke Sampling)';

  const body = `
    <span class="badge">${tierBadge}</span>
    <h2 style="margin: 8px 0 4px 0; font-size: 20px; color: #1F3A2E;">Sample Dispatch Notification</h2>
    <div style="font-size: 12px; color: #64748B; margin-bottom: 16px;">Reference Code: <strong>${vars.sampleCode}</strong></div>

    <p>Dear <strong>${vars.buyerName}</strong>,</p>
    <p>We are pleased to inform you that your physical sample evaluation specimen for <strong>${vars.productName}</strong> (SKU: <code>${vars.sku}</code>) has been dispatched from our <strong>${vars.originHub}</strong> facility.</p>

    <div class="card">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #1F3A2E; letter-spacing: 1px; margin-bottom: 8px;">Courier & Tracking Parameters</div>
      <table style="width: 100%; font-size: 13px;">
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Carrier Partner:</td>
          <td style="font-weight: 700; color: #1F3A2E; text-align: right;">${vars.carrier}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Tracking Number:</td>
          <td style="font-family: monospace; font-weight: 800; font-size: 14px; color: #C8A96A; text-align: right;">${vars.trackingNumber}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Destination:</td>
          <td style="font-weight: 600; text-align: right;">${vars.destinationAddress}</td>
        </tr>
        ${vars.estimatedDeliveryDate ? `
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Estimated Delivery:</td>
          <td style="font-weight: 600; text-align: right; color: #047857;">${vars.estimatedDeliveryDate}</td>
        </tr>` : ''}
      </table>
    </div>

    <p>This specimen includes official LWG Gold audited leather swatches, verified tensile lab test reports, and factory inspection approval tags.</p>

    <p style="margin-top: 24px;">
      <a href="https://www.google.com/search?q=${encodeURIComponent(vars.trackingNumber)}" class="btn">Track Package Online</a>
    </p>
  `;

  return {
    subject,
    html: wrapInArielCorporateTemplate(body, subject, 'Two-Tier Sample Dispatch & QA Protocol')
  };
}

/**
 * Render Purchase Order (PO) to Factories & Suppliers
 */
export function renderFactoryPoTemplate(vars: {
  poNumber: string;
  factoryName: string;
  factoryCluster: string;
  productName: string;
  sku: string;
  quantityUnits: number;
  totalCostBdt: number;
  exFactoryDeadline: string;
  complianceNotes?: string;
}): { subject: string; html: string } {
  const subject = `[Official Purchase Order] ${vars.poNumber} — ArielMC Ltd / ${vars.factoryName}`;

  const body = `
    <span class="badge badge-gold">Official Manufacturing Work Order</span>
    <h2 style="margin: 8px 0 4px 0; font-size: 20px; color: #1F3A2E;">Work Order PO: ${vars.poNumber}</h2>
    <div style="font-size: 12px; color: #64748B; margin-bottom: 16px;">Target Factory: <strong>${vars.factoryName}</strong> (${vars.factoryCluster})</div>

    <p>Dear Management of <strong>${vars.factoryName}</strong>,</p>
    <p>Ariel Marketing & Communications Limited hereby places the following formal export production work order under our master contract agreement:</p>

    <div class="card">
      <table style="width: 100%; font-size: 13px;">
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Product Description:</td>
          <td style="font-weight: 700; color: #1F3A2E; text-align: right;">${vars.productName}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">SKU Code:</td>
          <td style="font-family: monospace; font-weight: 600; text-align: right;">${vars.sku}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Order Volume:</td>
          <td style="font-weight: 800; font-size: 15px; text-align: right;">${vars.quantityUnits.toLocaleString()} PCS</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Total Contract Value:</td>
          <td style="font-weight: 800; font-size: 15px; color: #1F3A2E; text-align: right;">৳${vars.totalCostBdt.toLocaleString('en-IN')} BDT</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Mandatory Ex-Factory Date:</td>
          <td style="font-weight: 800; color: #B45309; text-align: right;">${vars.exFactoryDeadline}</td>
        </tr>
      </table>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; font-size: 12px;">
      <strong>Mandatory QA & ESG Requirements:</strong>
      <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #475569;">
        <li>AQL 1.5 Major / 2.5 Minor final random inspection before factory release.</li>
        <li>Zero Chromium VI (Cr-VI) detection under EN ISO 17075 certification.</li>
        <li>100% carton labeling per ArielMC export packing manual.</li>
      </ul>
    </div>
  `;

  return {
    subject,
    html: wrapInArielCorporateTemplate(body, subject, 'Bangladesh Export Procurement & Tannery Network')
  };
}

/**
 * Render B2B Wholesale & Retailer Outreach Campaign Template
 */
export function renderB2bPitchTemplate(vars: {
  buyerCompany: string;
  buyerContact?: string;
  buyerCountry?: string;
  categoryInterest?: string;
  campaignTitle?: string;
  customMessage?: string;
  catalogUrl?: string;
  uk3plBufferAvailability?: boolean;
}): { subject: string; html: string } {
  const subject = vars.campaignTitle || `ArielMC Sourcing Partnership — Ethical Export Manufacturing for ${vars.buyerCompany}`;

  const body = `
    <span class="badge badge-gold">Official B2B Wholesale Partnership</span>
    <h2 style="margin: 8px 0 4px 0; font-size: 20px; color: #1F3A2E;">Export Manufacturing &amp; Wholesale Supply</h2>
    <div style="font-size: 12px; color: #64748B; margin-bottom: 16px;">Prepared for: <strong>${vars.buyerCompany}</strong> (${vars.buyerCountry || 'International'})</div>

    <p>Dear <strong>${vars.buyerContact || 'Category Sourcing Director'}</strong>,</p>
    
    <p>I am reaching out from <strong>Ariel Marketing & Communications Limited</strong>, an export-licensed international trade and manufacturer network based in Dhaka, Bangladesh, with direct 3PL fulfillment hubs in <strong>Dartford (UK)</strong> and <strong>Hamburg (Germany)</strong>.</p>

    <div class="card">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #1F3A2E; letter-spacing: 1px; margin-bottom: 8px;">Key Sourcing Advantages for ${vars.buyerCompany}</div>
      <table style="width: 100%; font-size: 13px;">
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Primary Manufacturing Focus:</td>
          <td style="font-weight: 700; color: #1F3A2E; text-align: right;">${vars.categoryInterest || 'Full-Grain Leatherware & Diversified Jute'}</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Compliance &amp; ESG Standards:</td>
          <td style="font-weight: 600; text-align: right;">LWG Gold Audited, BSCI Grade-A, SEDEX SMETA 4-Pillar</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Rapid Prototyping (2-Tier):</td>
          <td style="font-weight: 600; color: #047857; text-align: right;">24-48h Delivery from UK 3PL Buffer (Felixstowe/Dartford)</td>
        </tr>
        <tr>
          <td style="color: #64748B; padding: 4px 0;">Customs &amp; Duty Advantage:</td>
          <td style="font-weight: 600; text-align: right;">UK DCTS / EU GSP+ Preferential 0% Duty Import Clearance</td>
        </tr>
      </table>
    </div>

    ${vars.customMessage ? `<div style="margin: 16px 0; padding: 12px 16px; background: #FFFFFF; border-left: 3px solid #1F3A2E; font-size: 13px; color: #334155;">${vars.customMessage}</div>` : ''}

    <p>Would you be open to receiving a complimentary physical swatch kit and prototype specimen to inspect our leather grain and craftsmanship firsthand?</p>

    <p style="margin-top: 24px;">
      <a href="${vars.catalogUrl || 'https://www.arielmc.com'}" class="btn">Explore Lookbook &amp; Request Sample</a>
    </p>

    <div style="margin-top: 24px; font-size: 11px; color: #64748B;">
      Commercial Inquiries: <strong>Syed Akramul Hassan</strong> (Managing Director)<br>
      WhatsApp Trade Desk: <code>+8801819273458</code> | Email: <code>tuheen@arielmc.com</code>
    </div>
  `;

  return {
    subject,
    html: wrapInArielCorporateTemplate(body, subject, 'Sovereign Sourcing & International Retail Supply')
  };
}

/**
 * Universal Template Resolver
 */
export function resolveEmailContent(
  templateId: EmailTemplateType, 
  vars: Record<string, any>, 
  fallbackSubject?: string, 
  fallbackBody?: string
): { subject: string; html: string } {
  switch (templateId) {
    case 'INVOICE':
      return renderInvoiceTemplate({
        invoiceNo: vars.invoiceNo || 'INV-DRAFT',
        invoiceType: vars.invoiceType,
        buyerName: vars.buyerName || vars.to || 'Valued Buyer',
        totalAmountUsd: vars.totalAmountUsd || 0,
        currency: vars.currency || 'USD',
        paymentTerms: vars.paymentTerms,
        lineItems: vars.lineItems,
        downloadUrl: vars.downloadUrl,
      });

    case 'SAMPLE_DISPATCH':
      return renderSampleDispatchTemplate({
        sampleCode: vars.sampleCode || 'SMP-DRAFT',
        buyerName: vars.buyerName || 'Valued Buyer',
        sku: vars.sku || 'SKU-001',
        productName: vars.productName || 'Export Prototype',
        tier: vars.tier || 'TIER_1_3PL_BUFFER',
        carrier: vars.carrier || 'Royal Mail Tracked 48',
        trackingNumber: vars.trackingNumber || 'TRK-PENDING',
        originHub: vars.originHub || 'Dhaka / UK Hub',
        destinationAddress: vars.destinationAddress || 'Registered Office',
        estimatedDeliveryDate: vars.estimatedDeliveryDate,
      });

    case 'FACTORY_PO':
      return renderFactoryPoTemplate({
        poNumber: vars.poNumber || 'PO-DRAFT',
        factoryName: vars.factoryName || 'Partner Factory',
        factoryCluster: vars.factoryCluster || 'Savar, Dhaka',
        productName: vars.productName || 'Export Merchandise',
        sku: vars.sku || 'SKU-001',
        quantityUnits: vars.quantityUnits || 1000,
        totalCostBdt: vars.totalCostBdt || 100000,
        exFactoryDeadline: vars.exFactoryDeadline || 'TBD',
      });

    case 'B2B_PITCH':
      return renderB2bPitchTemplate({
        buyerCompany: vars.buyerCompany || vars.buyerName || 'Valued Buyer',
        buyerContact: vars.buyerContact,
        buyerCountry: vars.buyerCountry,
        categoryInterest: vars.categoryInterest,
        campaignTitle: vars.campaignTitle || fallbackSubject,
        customMessage: vars.customMessage || fallbackBody,
        catalogUrl: vars.catalogUrl,
        uk3plBufferAvailability: vars.uk3plBufferAvailability ?? true,
      });

    case 'CUSTOM':
    case 'SYSTEM_ALERT':
    default: {
      const subject = fallbackSubject || vars.subject || 'ArielMC Enterprise ERP Notification';
      const body = fallbackBody || vars.body || `<p>${JSON.stringify(vars)}</p>`;
      return {
        subject,
        html: wrapInArielCorporateTemplate(body, subject, 'Operations & Client Services')
      };
    }
  }
}

/**
 * Client-Side Queue Dispatcher
 * Calls /api/send-email, writes to Supabase if online, and records in localStorage for offline resiliency
 */
export async function dispatchErpEmail(payload: EmailTemplatePayload): Promise<{
  success: boolean;
  messageId: string;
  status: string;
  mode?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to dispatch email via API gateway.');
    }

    // Save to local queue cache so user immediately sees it in the Outbox
    const localQueueItem: EmailQueueItem = {
      id: data.messageId || `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recipient: payload.to,
      recipientName: payload.recipientName,
      templateId: payload.templateId,
      subject: payload.subject,
      payload: payload.variables,
      status: (data.status as any) || 'sent',
      externalMessageId: data.externalMessageId || data.messageId,
      attempts: 1,
      provider: payload.provider || 'RESEND',
    };

    saveLocalQueueItem(localQueueItem);

    return {
      success: true,
      messageId: localQueueItem.id,
      status: localQueueItem.status,
      mode: data.mode,
    };
  } catch (err: any) {
    // If offline or network error, still queue locally!
    const offlineId = `offline-${Date.now()}`;
    const offlineItem: EmailQueueItem = {
      id: offlineId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recipient: payload.to,
      recipientName: payload.recipientName,
      templateId: payload.templateId,
      subject: payload.subject,
      payload: payload.variables,
      status: 'queued',
      deliveryErrorDetails: err.message,
      attempts: 0,
      provider: payload.provider || 'SIMULATED',
    };

    saveLocalQueueItem(offlineItem);

    return {
      success: true,
      messageId: offlineId,
      status: 'queued',
      mode: 'OFFLINE_QUEUED',
      error: err.message,
    };
  }
}

const LOCAL_STORAGE_KEY = 'arielmc_email_queue_v1';

export function getLocalQueueItems(): EmailQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalQueueItem(item: EmailQueueItem) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalQueueItems();
    const filtered = current.filter(i => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 100); // keep last 100 in memory
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
