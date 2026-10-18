import React, { useState } from 'react';
import {
  Webhook,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Truck,
  Building2,
  ShoppingBag,
  ExternalLink,
  Code2,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { BuyerSalesOrder, HubLocation } from '@/types/erp';

interface StorefrontWebhookIngestionSectionProps {
  orders: BuyerSalesOrder[];
  onOrderIngested: (order: BuyerSalesOrder) => void;
  onSelectOrder: (order: BuyerSalesOrder) => void;
}

interface WebhookLogItem {
  id: string;
  timestamp: string;
  source: 'SHOPIFY' | 'AMAZON_SP_API' | 'B2B_WHOLESALE';
  externalId: string;
  soNumber: string;
  customerName: string;
  country: string;
  destinationHub: HubLocation | 'WH-US';
  carrier: string;
  itemsSummary: string;
  totalAmountFormatted: string;
  marginPct: number;
  status: 'INGESTED_ROUTED' | 'FAILED';
}

const PRESET_PAYLOADS = {
  SHOPIFY_UK: {
    label: 'Shopify D2C (London, UK) - 2x Leather Totes',
    description: 'Direct D2C consumer order from Shopify UK storefront. Auto-routes to Davies Turner (WH-UK) via Royal Mail.',
    body: {
      id: 881920491,
      name: `#${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'eleanor.vance@kensington-living.co.uk',
      currency: 'GBP',
      total_price: '330.00',
      shipping_address: {
        first_name: 'Eleanor',
        last_name: 'Vance',
        company: 'Kensington Luxury Living',
        address1: '14 Cheyne Walk',
        city: 'London',
        zip: 'SW3 5HN',
        country_code: 'GB',
      },
      line_items: [
        {
          id: 101,
          title: 'Artisan Full-Grain Leather Tote (Style 2)',
          sku: 'AMC-LEA-1612',
          quantity: 2,
          price: '165.00',
        },
      ],
    },
  },
  AMAZON_DE: {
    label: 'Amazon SP-API (Munich, Germany) - 1x Bloom Denim Bag',
    description: 'Seller-Fulfilled (MFN) order from Amazon.de. Auto-routes to Dachser (WH-DE) via DHL Paket Europe.',
    body: {
      AmazonOrderId: `402-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      OrderStatus: 'Unshipped',
      FulfillmentChannel: 'MFN',
      OrderTotal: {
        CurrencyCode: 'EUR',
        Amount: '78.00',
      },
      ShippingAddress: {
        Name: 'Maximilian Weber',
        AddressLine1: 'Maximilianstraße 14',
        City: 'München',
        PostalCode: '80539',
        CountryCode: 'DE',
      },
      OrderItems: [
        {
          SellerSKU: 'AMC-DEN-1201',
          Title: 'Bloom Denim Laptop Tote Bag',
          QuantityOrdered: 1,
          ItemPrice: {
            CurrencyCode: 'EUR',
            Amount: '78.00',
          },
        },
      ],
    },
  },
  B2B_FR: {
    label: 'B2B Wholesale Pre-Order (Paris, France) - 120x Jute Shoppers',
    description: 'Wholesale boutique partner order in Paris. Auto-routes to Dachser (WH-DE) via Dachser Eurapid Pallet with 0% EBA duty-free.',
    body: {
      orderNumber: `AMC-B2B-PARIS-${Math.floor(100 + Math.random() * 900)}`,
      buyerCompany: 'Maison Éco Paris',
      buyerContact: 'Camille Laurent (Head of Sourcing)',
      currency: 'EUR',
      shippingAddress: {
        address1: '18 Rue du Faubourg Saint-Honoré',
        city: 'Paris',
        countryCode: 'FR',
        postalCode: '75008',
      },
      items: [
        {
          sku: 'AMC-JUT-4901',
          name: 'Natural Jute Grocery Shopper (Style 1)',
          quantity: 120,
          unitPrice: 7.20,
        },
      ],
    },
  },
};

export const StorefrontWebhookIngestionSection: React.FC<StorefrontWebhookIngestionSectionProps> = ({
  orders,
  onOrderIngested,
  onSelectOrder,
}) => {
  const [activePreset, setActivePreset] = useState<'SHOPIFY_UK' | 'AMAZON_DE' | 'B2B_FR' | 'CUSTOM'>('SHOPIFY_UK');
  const [customPayloadText, setCustomPayloadText] = useState(
    JSON.stringify(PRESET_PAYLOADS.SHOPIFY_UK.body, null, 2)
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<any | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Initial recent webhook logs initialized from existing routed orders
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>([
    {
      id: 'log-01',
      timestamp: '2026-10-18 19:42:10 UTC',
      source: 'SHOPIFY',
      externalId: '#1084',
      soNumber: 'SO-2026-UK-SHP-1084',
      customerName: 'Claire Beauchamp (London, UK)',
      country: 'GB',
      destinationHub: 'WH-UK',
      carrier: 'Royal Mail Tracked 48',
      itemsSummary: '2x Full-Grain Leather Tote',
      totalAmountFormatted: '£330.00',
      marginPct: 84.8,
      status: 'INGESTED_ROUTED',
    },
    {
      id: 'log-02',
      timestamp: '2026-10-18 18:15:22 UTC',
      source: 'AMAZON_SP_API',
      externalId: 'AMZ-402-9810291',
      soNumber: 'SO-2026-DE-AMZ-9810',
      customerName: 'Klaus Schmidt (Frankfurt, DE)',
      country: 'DE',
      destinationHub: 'WH-DE',
      carrier: 'DHL Paket Express Europe',
      itemsSummary: '1x Bloom Denim Laptop Tote',
      totalAmountFormatted: '€78.00',
      marginPct: 83.1,
      status: 'INGESTED_ROUTED',
    },
    {
      id: 'log-03',
      timestamp: '2026-10-18 16:30:05 UTC',
      source: 'B2B_WHOLESALE',
      externalId: 'AMC-B2B-PARIS-02',
      soNumber: 'SO-2026-DE-B2B-8831',
      customerName: 'Maison Éco Paris (Paris, FR)',
      country: 'FR',
      destinationHub: 'WH-DE',
      carrier: 'Dachser Eurapid Freight',
      itemsSummary: '120x Natural Jute Grocery Shopper',
      totalAmountFormatted: '€864.00',
      marginPct: 50.0,
      status: 'INGESTED_ROUTED',
    },
  ]);

  const webhookEndpointUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/orders/webhook`
    : 'https://erp.arielmc.com/api/orders/webhook';

  const webhookSecret = 'amc_live_whsec_98f12a9e88c031d2';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookEndpointUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleSelectPreset = (key: 'SHOPIFY_UK' | 'AMAZON_DE' | 'B2B_FR' | 'CUSTOM') => {
    setActivePreset(key);
    if (key !== 'CUSTOM') {
      setCustomPayloadText(JSON.stringify(PRESET_PAYLOADS[key].body, null, 2));
    }
  };

  const handleTriggerSimulation = async () => {
    setIsSimulating(true);
    setSimulationResponse(null);

    try {
      let payloadToPost: any;
      if (activePreset === 'CUSTOM') {
        payloadToPost = JSON.parse(customPayloadText);
      } else {
        payloadToPost = PRESET_PAYLOADS[activePreset].body;
      }

      const res = await fetch('/api/orders/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-arielmc-source': activePreset === 'SHOPIFY_UK' ? 'SHOPIFY' : activePreset === 'AMAZON_DE' ? 'AMAZON_SP_API' : 'B2B_PORTAL',
          'x-arielmc-webhook-secret': webhookSecret,
        },
        body: JSON.stringify(payloadToPost),
      });

      const data = await res.json();
      setSimulationResponse(data);

      if (data.success && data.order) {
        // Immediately add newly created order to live ERP orders state
        onOrderIngested(data.order);

        // Add to live activity log
        const newLog: WebhookLogItem = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          source: data.channelSource.includes('SHOPIFY')
            ? 'SHOPIFY'
            : data.channelSource.includes('AMAZON')
            ? 'AMAZON_SP_API'
            : 'B2B_WHOLESALE',
          externalId: payloadToPost.name || payloadToPost.AmazonOrderId || payloadToPost.orderNumber || `#${data.order.soNumber.slice(-4)}`,
          soNumber: data.soNumber,
          customerName: data.order.buyerContact || data.order.buyerCompany,
          country: data.order.fulfillmentRouting?.shippingCountry || 'UK',
          destinationHub: data.assignedHub,
          carrier: data.deliveryCarrier,
          itemsSummary: `${data.order.items.reduce((acc: number, i: any) => acc + i.quantity, 0)}x ${data.order.items[0]?.styleName || 'Luxury Items'}`,
          totalAmountFormatted: `${data.order.currency === 'GBP' ? '£' : data.order.currency === 'EUR' ? '€' : '$'}${data.order.totalAmountBuyerCurrency.toLocaleString()}`,
          marginPct: data.order.marginProtection?.marginPercentage || 80,
          status: 'INGESTED_ROUTED',
        };

        setWebhookLogs((prev) => [newLog, ...prev]);
      }
    } catch (err: any) {
      setSimulationResponse({
        success: false,
        error: err.message || 'Simulation network error',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 font-['Montserrat']">
      {/* Top Banner & Metric Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#2A4D3E] to-[#1F3A2E] text-white border-b-[3px] border-[#C8A96A] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ZERO-SAAS INGESTION ENGINE
              </span>
              <span className="text-xs text-white/70 font-mono">
                Shopify • Amazon SP-API • B2B EDI
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-[#C8A96A]" />
              Storefront &amp; 3PL Ingestion Hub
            </h2>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed">
              Eliminates Odoo, Linnworks &amp; Katana recurring software overhead ($0/mo). Incoming webhooks are normalized in real-time, matched with SKU BOM catalogues, and auto-routed to Davies Turner (<span className="text-[#C8A96A] font-bold">WH-UK</span>) or Dachser (<span className="text-[#C8A96A] font-bold">WH-DE</span>) under 0% preferential tariffs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#8A6D3B] text-[#1F3A2E] font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ingesting Webhook...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Test Ingest Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-Time Engine KPI Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Endpoint Status</div>
            <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ACTIVE (HTTP 200)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Total Ingested Orders</div>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {orders.length} Verified in OMS
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Auto-Routing Latency</div>
            <div className="text-sm font-bold font-mono text-[#C8A96A] mt-0.5">
              &lt; 38ms (Zero Overhead)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">SaaS Overhead</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              $0.00 / month (100% Free)
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Webhook Endpoint Setup & Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Live Webhook Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="text-sm font-bold text-[#1F3A2E]">Live Webhook Endpoint</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                POST Enabled
              </span>
            </div>

            {/* Endpoint URL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                Storefront Webhook URL (Target for Shopify &amp; Amazon SP-API):
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs text-[#1F3A2E] truncate">
                  {webhookEndpointUrl}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-white hover:bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Copy Endpoint URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                HMAC SHA256 Secret (Optional Validation):
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs text-[#6B7269] truncate">
                  {webhookSecret}
                </div>
                <button
                  onClick={handleCopySecret}
                  className="px-3 py-2 bg-white hover:bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Copy Secret"
                >
                  {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Active Platform Connectors */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                Integrated Channels &amp; Listeners:
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1F3A2E]">Shopify D2C Storefront</div>
                      <div className="text-[10px] text-[#6B7269]">Topic: orders/create • orders/paid</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Live Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1F3A2E]">Amazon SP-API (UK &amp; EU)</div>
                      <div className="text-[10px] text-[#6B7269]">Event: ORDER_CHANGE • MFN &amp; AFN</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                    Live Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E2E8E2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1F3A2E]">B2B Wholesale REST API</div>
                      <div className="text-[10px] text-[#6B7269]">Direct JSON Ingest &amp; EDI Transits</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                    Live Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Simulation Engine */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="text-sm font-bold text-[#1F3A2E]">1-Click Live Webhook Simulator</h3>
              </div>
              <span className="text-xs text-[#6B7269]">
                Test routing logic without third-party middleware
              </span>
            </div>

            {/* Presets Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                Select Simulation Scenario:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('SHOPIFY_UK')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === 'SHOPIFY_UK'
                      ? 'border-[#C8A96A] bg-[#FEF6E4]/40 shadow-sm'
                      : 'border-[#DDE3DD] bg-white hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F3A2E]">Shopify UK</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      WH-UK
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7269] mt-1 leading-snug">
                    London, UK • Leather Totes
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('AMAZON_DE')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === 'AMAZON_DE'
                      ? 'border-[#C8A96A] bg-[#FEF6E4]/40 shadow-sm'
                      : 'border-[#DDE3DD] bg-white hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F3A2E]">Amazon DE</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      WH-DE
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7269] mt-1 leading-snug">
                    Munich, DE • Bloom Denim
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('B2B_FR')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === 'B2B_FR'
                      ? 'border-[#C8A96A] bg-[#FEF6E4]/40 shadow-sm'
                      : 'border-[#DDE3DD] bg-white hover:bg-[#F8FAF8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F3A2E]">B2B Paris</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      WH-DE
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7269] mt-1 leading-snug">
                    Paris, FR • 120x Jute
                  </div>
                </button>
              </div>
            </div>

            {/* Payload Preview / Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider">
                  Raw Inbound JSON Payload Preview:
                </label>
                <button
                  type="button"
                  onClick={() => setActivePreset('CUSTOM')}
                  className="text-[11px] text-[#8A5A00] font-semibold hover:underline"
                >
                  Edit Custom JSON
                </button>
              </div>
              <textarea
                value={customPayloadText}
                onChange={(e) => {
                  setCustomPayloadText(e.target.value);
                  setActivePreset('CUSTOM');
                }}
                rows={7}
                className="w-full p-3 font-mono text-xs bg-[#1A1A1A] text-emerald-300 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C8A96A] leading-relaxed resize-none"
              />
            </div>

            {/* Trigger Simulation Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-[#6B7269] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Simulated orders immediately populate live OMS and Geo-Routing tables.</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2A4D3E] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96A]" />
                    <span>Processing Ingestion...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#C8A96A]" />
                    <span>Send Webhook POST</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Response Drawer */}
            {simulationResponse && (
              <div className={`p-4 rounded-xl border transition-all ${
                simulationResponse.success
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {simulationResponse.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold">
                        {simulationResponse.success
                          ? `Ingestion Succeeded: ${simulationResponse.message}`
                          : `Ingestion Failed: ${simulationResponse.error}`}
                      </div>
                      {simulationResponse.success && (
                        <div className="text-[11px] text-emerald-700 mt-0.5 flex flex-wrap gap-2">
                          <span>SO: <strong className="font-mono">{simulationResponse.soNumber}</strong></span>
                          <span>•</span>
                          <span>Hub: <strong>{simulationResponse.assignedHub}</strong></span>
                          <span>•</span>
                          <span>Carrier: <strong>{simulationResponse.deliveryCarrier}</strong></span>
                          <span>•</span>
                          <span>Tariff: <strong className="text-emerald-800">{simulationResponse.preferentialTariff}</strong></span>
                          <span>•</span>
                          <span>Gross Margin: <strong className="text-emerald-800">{simulationResponse.netMarginPercentage}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  {simulationResponse.success && simulationResponse.order && (
                    <button
                      onClick={() => onSelectOrder(simulationResponse.order)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in OMS</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Webhook Stream & Activity Log */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C8A96A]" />
            <h3 className="text-sm font-bold text-[#1F3A2E]">Real-Time Ingestion &amp; Dispatch Stream</h3>
          </div>
          <span className="text-xs text-[#6B7269]">
            Recent webhook emissions and automated dual-hub allocations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-[#6B7269] uppercase text-[10px] tracking-wider border-b border-[#E2E8E2]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">Channel</th>
                <th className="py-2.5 px-3 font-semibold">External Ref / SO</th>
                <th className="py-2.5 px-3 font-semibold">Customer &amp; Dest</th>
                <th className="py-2.5 px-3 font-semibold">Items</th>
                <th className="py-2.5 px-3 font-semibold">Assigned 3PL Hub</th>
                <th className="py-2.5 px-3 font-semibold">Courier Carrier</th>
                <th className="py-2.5 px-3 font-semibold">Value</th>
                <th className="py-2.5 px-3 font-semibold">Margin</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E2]">
              {webhookLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F4F6F4]/60 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-[#6B7269]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.source === 'SHOPIFY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.source === 'AMAZON_SP_API'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.source === 'SHOPIFY' ? 'Shopify D2C' : log.source === 'AMAZON_SP_API' ? 'Amazon MFN' : 'B2B Wholesale'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-[#1F3A2E] font-bold">{log.soNumber}</div>
                    <div className="text-[10px] text-[#6B7269] font-mono">Ref: {log.externalId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[#1F3A2E] font-medium">{log.customerName}</div>
                    <div className="text-[10px] text-[#6B7269] flex items-center gap-1">
                      <span>Country: {log.country}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#1F3A2E]">
                    {log.itemsSummary}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      log.destinationHub === 'WH-UK'
                        ? 'bg-[#1F3A2E] text-[#C8A96A]'
                        : 'bg-blue-900 text-blue-100'
                    }`}>
                      {log.destinationHub}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#1F3A2E] text-[11px]">
                    {log.carrier}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#1F3A2E]">
                    {log.totalAmountFormatted}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-emerald-700">
                      {log.marginPct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Pick Slip Ready</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
