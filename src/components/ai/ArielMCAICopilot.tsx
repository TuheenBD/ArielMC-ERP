'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  HelpCircle,
  FileText,
  Building2,
  Package,
  Factory,
  FlaskConical,
  Repeat,
  Landmark,
  ShieldCheck,
  Database,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  Boxes,
  LayoutDashboard,
  Megaphone
} from 'lucide-react';
import {
  CompanyEntity,
  CurrencyRate,
  ProductItem,
  SupplierFactory,
  SampleDevelopmentOrder,
  BuyerSalesOrder,
  LogisticsConsignment,
  CrmLead
} from '@/types/erp';
import { ActiveTab, ThemeProfile } from '@/components/Sidebar';

export interface ArielMCAICopilotProps {
  activeEntity: CompanyEntity;
  activeCurrency: CurrencyRate;
  products: ProductItem[];
  factories: SupplierFactory[];
  samples: SampleDevelopmentOrder[];
  orders: BuyerSalesOrder[];
  consignments: LogisticsConsignment[];
  crmLeads: CrmLead[];
  theme?: ThemeProfile;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenDocumentCenter?: () => void;
  onOpenDatabaseSettings?: () => void;
  onOpenUserGuide?: () => void;
  onOpenProfileControl?: () => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'arielmc';
  text: string;
  timestamp: string;
  quickActions?: {
    label: string;
    action: () => void;
    icon?: any;
  }[];
}

export const ArielMCAICopilot: React.FC<ArielMCAICopilotProps> = ({
  activeEntity,
  activeCurrency,
  products,
  factories,
  samples,
  orders,
  consignments,
  crmLeads,
  theme = 'crm-green',
  onNavigateTab,
  onOpenDocumentCenter,
  onOpenDatabaseSettings,
  onOpenUserGuide,
  onOpenProfileControl,
  isOpen: externalIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isOpen) : val;
    setInternalIsOpen(nextVal);
    onToggleOpen?.(nextVal);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeText = `Welcome to **ArielMC** ERP. I am your autonomous AI operations assistant, named **ArielMC**.\n\nI have complete real-time visibility across our **5 Operating Stations** (**ArielMC BD**, **ArielMC UK**, **ArielMC US**, **ArielMC EU**, and **ArielMC AU**).\n\nHow may I assist you today? You can ask me about:\n- **Master Product SKUs & Costing Margins** (Leather, Jute, Textiles, Ceramics, Pottery)\n- **Bangladesh Factory Audits & Compliance** (LWG Gold, BSCI, SEDEX, OEKO-TEX)\n- **R&D & SDO Sample Tracking** (Lab Dips, Protos, Golden Seal Approval)\n- **Order Management & Back-to-Back POs** (M&S, Harrods, Ralph Lauren)\n- **Bonded Warehousing, Mushak 6.3 & Bangladesh Customs**\n- **Multi-Station Finance & FX Hedging**\n- **Profile Control, 2SA & User Security**\n- **ArielMC ERP User Guide (PDF)**`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_ai_copilot_history_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((m: any) => {
              const isWelcome = m.id === 'welcome-msg' || (typeof m.id === 'string' && m.id.startsWith('welcome-'));
              return {
                id: m.id || `msg-${Date.now()}`,
                sender: m.sender || 'arielmc',
                text: m.text || '',
                timestamp: m.timestamp || 'Just now',
                quickActions: isWelcome
                  ? [
                      {
                        label: 'Highest Margin SKUs',
                        action: () => handleSendPrompt('Show the highest margin products in our catalog')
                      },
                      {
                        label: 'LWG Gold Factories',
                        action: () => handleSendPrompt('Which factories have LWG Gold & BSCI Grade A compliance?')
                      },
                      {
                        label: 'Mushak 6.3 Guide',
                        action: () => handleSendPrompt('How do I generate an official Mushak 6.3 VAT invoice in ArielMC ERP?')
                      },
                      {
                        label: 'Open User Guide',
                        action: () => {
                          if (onOpenUserGuide) onOpenUserGuide();
                        },
                        icon: BookOpen
                      }
                    ]
                  : undefined
              };
            });
          }
        }
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'welcome-msg',
        sender: 'arielmc',
        text: initialWelcomeText,
        timestamp: 'Just now',
        quickActions: [
          {
            label: 'Highest Margin SKUs',
            action: () => handleSendPrompt('Show the highest margin products in our catalog')
          },
          {
            label: 'LWG Gold Factories',
            action: () => handleSendPrompt('Which factories have LWG Gold & BSCI Grade A compliance?')
          },
          {
            label: 'Mushak 6.3 Guide',
            action: () => handleSendPrompt('How do I generate an official Mushak 6.3 VAT invoice in ArielMC ERP?')
          },
          {
            label: 'Open User Guide',
            action: () => {
              if (onOpenUserGuide) onOpenUserGuide();
            },
            icon: BookOpen
          }
        ]
      }
    ];
  });

  useEffect(() => {
    try {
      const safeToStore = messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));
      localStorage.setItem('arielmc_ai_copilot_history_v1', JSON.stringify(safeToStore));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleClearHistory = () => {
    const fresh: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'arielmc',
      text: initialWelcomeText,
      timestamp: 'Just now',
      quickActions: [
        {
          label: 'Highest Margin SKUs',
          action: () => handleSendPrompt('Show the highest margin products in our catalog')
        },
        {
          label: 'LWG Gold Factories',
          action: () => handleSendPrompt('Which factories have LWG Gold & BSCI Grade A compliance?')
        },
        {
          label: 'Mushak 6.3 Guide',
          action: () => handleSendPrompt('How do I generate an official Mushak 6.3 VAT invoice in ArielMC ERP?')
        },
        {
          label: 'Open User Guide',
          action: () => {
            if (onOpenUserGuide) onOpenUserGuide();
          },
          icon: BookOpen
        }
      ]
    };
    setMessages([fresh]);
    try {
      localStorage.removeItem('arielmc_ai_copilot_history_v1');
    } catch {
      // ignore
    }
  };

  const generateAnswer = (userQuery: string): { text: string; actions?: { label: string; action: () => void; icon?: any }[] } => {
    const q = userQuery.toLowerCase();

    // 1. User Guide / Documentation
    if (q.includes('user guide') || q.includes('manual') || q.includes('handbook') || q.includes('documentation') || q.includes('pdf guide')) {
      return {
        text: `### **ArielMC** ERP User Guide & Operational Manual\n\nThe official **ArielMC ERP User Guide** is available for direct interactive reading and 1-click PDF download.\n\n**Manual Chapters Included:**\n1. **Executive Multi-Station Architecture** (BD, UK, US, EU, AU)\n2. **Phase 1: Sector Product Master & Costing Engine**\n3. **Phase 2: Bangladesh Factory Compliance Auditing**\n4. **Phase 3: R&D, Tech Packs & SDO Sampling Protocol**\n5. **Phase 4: Two-Way Order Management System (OMS)**\n6. **Phase 5: Global CRM Pipeline & Buyer Intelligence**\n7. **Phase 6: Logistics, Bonded Warehousing & BD Customs**\n8. **Phase 7: Bonded Inventory & Raw Material Allocation**\n9. **Phase 8: Multi-Currency Global Finance & Mushak 6.3 Tax Engine**\n10. **Phase 9: Security, User Profiles, 2SA & RBAC**\n11. **Phase 10: PostgreSQL Persistence & Cloud Sync**\n\nClick the button below to open the comprehensive user guide.`,
        actions: [
          {
            label: 'Open ArielMC ERP User Guide',
            action: () => { if (onOpenUserGuide) onOpenUserGuide(); },
            icon: BookOpen
          },
          {
            label: 'Export Official Documents',
            action: () => { if (onOpenDocumentCenter) onOpenDocumentCenter(); },
            icon: FileText
          }
        ]
      };
    }

    // 1b. Executive Dashboard
    if (q.includes('dashboard') || q.includes('overview') || q.includes('home') || q.includes('kpi')) {
      return {
        text: `### **ArielMC** Executive Command Center & Dashboard\n\nThe **Executive Dashboard** aggregates real-time metrics across all 5 operating sovereign stations:\n- **Operating Stations**: 5 Entities (BD, UK, US, EU, AU)\n- **Master Product SKUs**: Leather, Jute, Textiles, Ceramics, Pottery\n- **Partner Factories**: 8 Audited Facilities (Savar, Gazipur, Narsingdi, Dhamrai)\n- **Global B2B Leads**: 254 Buyer Accounts (UK, EU, USA, AU)\n\nClick the button below to launch the Executive Dashboard.`,
        actions: [
          {
            label: 'Open Executive Dashboard',
            action: () => { if (onNavigateTab) onNavigateTab('DASHBOARD'); },
            icon: LayoutDashboard
          }
        ]
      };
    }

    // 1c. Brand & Marketing Hub
    if (q.includes('brand') || q.includes('marketing') || q.includes('campaign') || q.includes('lookbook') || q.includes('collateral') || q.includes('trade show') || q.includes('letterhead') || q.includes('stationery') || q.includes('expo') || q.includes('roi')) {
      return {
        text: `### **ArielMC** Brand & Marketing Hub\n\nOur **Brand & Marketing Section** powers strategic B2B buyer outreach across all 5 operating sovereign stations:\n- **B2B ROI & TCO Engine**: Dynamic 60/40 deal desk model ($255k net savings, 700% ROI, 25% CFO haircut)\n- **12-Mo Strategy & Playbooks**: Appendix A (90-day sprints), Appendix B (21-day ABM), Appendix C (7 Klaviyo flows)\n- **B2B Campaigns**: 5 Multi-market initiatives across UK, EU, US, AU & BD ($2.85M pipeline attributed)\n- **Sector Lookbooks**: 6 Master digital lookbooks & line-sheets across Fine Ceramics, Leather Goods, Golden Jute, Home Textiles & Terracotta\n- **Stationery Studio**: A4 calibrated letterhead generator with standard 38mm logo & official 4-pillar corporate footer\n- **Global Expos**: Ambiente Frankfurt, Spring Fair Birmingham, NY NOW & Reed Gift Fairs Melbourne\n\nClick the button below to open the Brand & Marketing Hub.`,
        actions: [
          {
            label: 'Open Brand & Marketing Hub',
            action: () => { if (onNavigateTab) onNavigateTab('MARKETING'); },
            icon: Megaphone
          }
        ]
      };
    }

    // 2. Products / Margins / Costing
    if (q.includes('margin') || q.includes('product') || q.includes('sku') || q.includes('costing') || q.includes('leather') || q.includes('jute') || q.includes('ceramic') || q.includes('textile')) {
      const sorted = [...products].sort((a, b) => (b.costing?.arielSourcingMarginPct || 0) - (a.costing?.arielSourcingMarginPct || 0));
      const top3 = sorted.slice(0, 3);
      
      let summaryText = `### **ArielMC** Master Product & Costing Analysis\n\nWe currently manage **${products.length} registered SKUs** across 4 sectors (Leather Goods, Jute Crafts, Apparel Textiles, Tableware Ceramics).\n\n**Top High-Margin Master SKUs:**\n`;
      top3.forEach((p, idx) => {
        summaryText += `${idx + 1}. **${p.name}** (\`${p.sku}\`)\n   - Sector: **${p.sector}** | HS Code: \`${p.hsCode}\`\n   - Factory Cost: **$${(p.costing?.factoryCostUsd || 0).toFixed(2)}** | **ArielMC** Sourcing Margin: **${p.costing?.arielSourcingMarginPct || 0}%**\n   - FOB Target: **$${(p.costing?.b2bFobPriceUsd || 0).toFixed(2)}** | MOQ: **${p.partnerFactory?.moq || 200} pcs**\n`;
      });
      summaryText += `\n**Margin Strategy**: In **ArielMC**, all export margins are locked between 18% and 35%, ensuring competitive pricing for buyers while maintaining target profitability across our global stations.`;

      return {
        text: summaryText,
        actions: [
          {
            label: 'View Sector Product Master',
            action: () => { if (onNavigateTab) onNavigateTab('PRODUCTS'); },
            icon: Package
          },
          {
            label: 'Export Commercial Invoice',
            action: () => { if (onOpenDocumentCenter) onOpenDocumentCenter(); },
            icon: FileText
          }
        ]
      };
    }

    // 3. Factory / Compliance / Auditing
    if (q.includes('factory') || q.includes('compliance') || q.includes('audit') || q.includes('lwg') || q.includes('bsci') || q.includes('sedex') || q.includes('oeko')) {
      const topFactories = [...factories].slice(0, 4);
      let fText = `### **ArielMC** Bangladesh Factory Network & Compliance Auditing\n\n**ArielMC** partners exclusively with vetted, fully audited manufacturing facilities across Savar, Gazipur, Dhamrai, and Narsingdi.\n\n**Top Compliant Partner Facilities:**\n`;
      topFactories.forEach((f) => {
        fText += `- **${f.name}** (${f.cluster})\n  - Sectors: **${f.sectors?.join(', ')}** | Tier: **${f.tier?.replace(/_/g, ' ') || 'Tier 1'}**\n  - Scorecard Rating: **${f.scorecard?.ratingScore || 4.8}/5.0** | Pass Rate: **${f.scorecard?.aqlPassRatePct || 98}%**\n  - Monthly Capacity: **${(f.capacity?.monthlyCapacityUnits || 15000).toLocaleString()} units/mo** | Contact: **${f.contactPerson}**\n`;
      });
      fText += `\nAll **ArielMC** partner factories undergo strict biannual fire safety, environmental wastewater (ETP), and social labor compliance audits before allocation.`;

      return {
        text: fText,
        actions: [
          {
            label: 'Open BD Factory Compliance',
            action: () => { if (onNavigateTab) onNavigateTab('FACTORIES'); },
            icon: Factory
          },
          {
            label: 'Track Active SDOs',
            action: () => { if (onNavigateTab) onNavigateTab('RND'); },
            icon: FlaskConical
          }
        ]
      };
    }

    // 4. Samples / SDO / R&D
    if (q.includes('sample') || q.includes('sdo') || q.includes('r&d') || q.includes('rnd') || q.includes('proto') || q.includes('golden seal') || q.includes('tech pack')) {
      let sText = `### **ArielMC** R&D, Tech Packs & SDO Sampling Protocol\n\nThere are **${samples.length} active Sample Development Orders (SDOs)** currently tracked across 5 developmental stages.\n\n**Current Live SDOs:**\n`;
      samples.slice(0, 4).forEach((s) => {
        const awb = s.courier?.awbNumber ? `\`${s.courier.awbNumber}\` (${s.courier.courier})` : 'In Factory Fabrication';
        sText += `- **${s.sdoNumber}** — ${s.styleName}\n  - Buyer: **${s.buyerCompany}** (${s.targetMarket})\n  - Current Stage: **${s.stage}** | Status: **${s.status.toUpperCase()}**\n  - Courier Tracking: ${awb}\n`;
      });
      sText += `\n**Golden Seal Protocol**: Bulk commercial production cannot commence until the buyer physically signs off on the Stage 5 Golden Seal counter-sample.`;

      return {
        text: sText,
        actions: [
          {
            label: 'Open SDO Sampling Board',
            action: () => { if (onNavigateTab) onNavigateTab('RND'); },
            icon: FlaskConical
          },
          {
            label: 'Two-Way Order Management',
            action: () => { if (onNavigateTab) onNavigateTab('ORDERS'); },
            icon: Repeat
          }
        ]
      };
    }

    // 5. Orders / Sales / Buyers
    if (q.includes('order') || q.includes('buyer') || q.includes('sales') || q.includes('po') || q.includes('purchase order') || q.includes('harrods') || q.includes('marks & spencer')) {
      const totalOrderVal = orders.reduce((sum, o) => sum + (o.totalAmountUsd || 0), 0);
      let oText = `### **ArielMC** Two-Way Order Management System (OMS)\n\nWe currently manage **${orders.length} confirmed buyer sales orders** totaling **$${totalOrderVal.toLocaleString()} USD**.\n\n**Active Purchase & Sales Orders:**\n`;
      orders.slice(0, 4).forEach((o) => {
        const itemName = o.items?.[0]?.styleName || 'Master SKU';
        const factoryName = o.linkedPo?.factoryName || 'Direct BD Facility';
        oText += `- **${o.soNumber}** — ${o.buyerCompany}\n  - SKU: **${itemName}** | Quantity: **${(o.totalQuantity || 0).toLocaleString()} pcs**\n  - Order Value: **$${(o.totalAmountUsd || 0).toLocaleString()} USD** | Factory: **${factoryName}**\n  - Shipment Deadline: **${o.targetDeliveryDate}** | Status: **${o.status.toUpperCase()}**\n`;
      });
      oText += `\n**Two-Way PO Architecture**: When an order is confirmed, **ArielMC** automatically locks the buyer export price and generates a back-to-back Bangladesh Factory Purchase Order (PO) with locked raw material commitments.`;

      return {
        text: oText,
        actions: [
          {
            label: 'Open Order Management',
            action: () => { if (onNavigateTab) onNavigateTab('ORDERS'); },
            icon: Repeat
          },
          {
            label: 'Generate Official PO / Invoice',
            action: () => { if (onOpenDocumentCenter) onOpenDocumentCenter(); },
            icon: FileText
          }
        ]
      };
    }

    // 6. Logistics / Bonded / Customs / Mushak
    if (q.includes('mushak') || q.includes('customs') || q.includes('bonded') || q.includes('vat') || q.includes('tax') || q.includes('logistics') || q.includes('chattogram') || q.includes('port')) {
      return {
        text: `### **ArielMC** Bangladesh Customs & Mushak 6.3 VAT Architecture\n\n**Mushak 6.3 Statutory Standard**:\nUnder the Bangladesh National Board of Revenue (NBR) Value Added Tax and Supplementary Duty Act 2012, **ArielMC BD** (BIN: \`001928374-0101\`) generates zero-rated (0% VAT) Mushak 6.3 tax invoices for deemed exports, and standard 15% VAT invoices for domestic supply.\n\n**Bonded Warehouse Protocol**:\n- **Bond License**: \`NBR-BOND-2024-C882\` (Chattogram Customs Bond Commissionerate)\n- **Bonded Depot A-4 (Chattogram Port)**: Raw materials (Italian veg-tan hides, eco-dyes) enter duty-free under raw material utilization declarations.\n- **Bill of Lading & Shipping Guarantee**: Handled directly through **ArielMC** logistics station with real-time consignment clearance tracking.\n\nYou can generate official Mushak 6.3 and Commercial Invoices with 1-click in the Document Engine.`,
        actions: [
          {
            label: 'Open Official Document Center',
            action: () => { if (onOpenDocumentCenter) onOpenDocumentCenter(); },
            icon: FileText
          },
          {
            label: 'View Logistics & Consignments',
            action: () => { if (onNavigateTab) onNavigateTab('LOGISTICS'); },
            icon: Boxes
          }
        ]
      };
    }

    // 7. Security / Profile / 2SA / Password
    if (q.includes('security') || q.includes('profile') || q.includes('2sa') || q.includes('password') || q.includes('totp') || q.includes('auth') || q.includes('user') || q.includes('login')) {
      return {
        text: `### **ArielMC** Enterprise Security, 2SA & User Administration\n\n**ArielMC** enforces rigorous enterprise security standards:\n- **Two-Step Authentication (2SA)**: Configurable via TOTP Authenticator apps (Google Authenticator, Microsoft Authenticator) or encrypted WhatsApp OTP to \`+8801819273458\`.\n- **Role-Based Access Control (RBAC)**: Distinct permissions for **Managing Director**, **VP of Global Sourcing**, **Chief Compliance Auditor**, and **Merchandiser**.\n- **Session Integrity**: Real-time IP address tracking, session token encryption, and comprehensive audit trails.\n\nYou can manage users, update your credentials, or toggle 2SA security in the **Profile Control Center**.`,
        actions: [
          {
            label: 'Open Profile & 2SA Control',
            action: () => { if (onOpenProfileControl) onOpenProfileControl(); },
            icon: ShieldCheck
          },
          {
            label: 'Read Security Guide in Manual',
            action: () => { if (onOpenUserGuide) onOpenUserGuide(); },
            icon: BookOpen
          }
        ]
      };
    }

    // 8. Database / Supabase / Persistence
    if (q.includes('database') || q.includes('supabase') || q.includes('persistence') || q.includes('sync') || q.includes('postgres') || q.includes('storage')) {
      return {
        text: `### **ArielMC** Database Persistence & Cloud Storage (PostgreSQL / Supabase)\n\n**ArielMC** ERP operates on a resilient **Offline-First & Cloud-Synced** architecture:\n- **Local Fallback**: Instant client-side state caching via \`localStorage\` for uninterrupted offline operations.\n- **Cloud PostgreSQL (Supabase)**: Connects to live relational tables (\`ariel_products\`, \`ariel_factories\`, \`ariel_samples\`, \`ariel_orders\`, \`ariel_leads\`, \`ariel_consignments\`).\n- **Sync Heartbeat**: Automated health check confirms active database read/write connectivity.\n\nYou can review database credentials and trigger manual syncs in the Database Settings dialog.`,
        actions: [
          {
            label: 'Open Database Settings',
            action: () => { if (onOpenDatabaseSettings) onOpenDatabaseSettings(); },
            icon: Database
          },
          {
            label: 'Check Multi-Station Finance',
            action: () => { if (onNavigateTab) onNavigateTab('FINANCE'); },
            icon: Landmark
          }
        ]
      };
    }

    // 9. Finance / FX / Multi-Currency / Multi-Station
    if (q.includes('finance') || q.includes('currency') || q.includes('fx') || q.includes('exchange') || q.includes('station') || q.includes('entity') || q.includes('bdt') || q.includes('usd') || q.includes('gbp')) {
      return {
        text: `### **ArielMC** Multi-Station Finance & FX Engine\n\n**ArielMC** currently operates across 5 international stations:\n1. **ArielMC BD** (Dhaka, Bangladesh) — Base Currency: **BDT (৳)** | Tax: NBR BIN \`001928374-0101\`\n2. **ArielMC UK** (London, UK) — Base Currency: **GBP (£)** | Tax: HMRC VAT \`GB-982-1049-22\`\n3. **ArielMC US** (New York, USA) — Base Currency: **USD ($)** | Tax: EIN \`13-8472910\`\n4. **ArielMC EU** (Frankfurt, Germany) — Base Currency: **EUR (€)** | Tax: DE \`DE-304918274\`\n5. **ArielMC AU** (Sydney, Australia) — Base Currency: **AUD (A$)** | Tax: ABN \`51-829-104-921\`\n\n**Real-Time FX Hedging**: Export contracts are settled at fixed forward hedge rates, insulating station margins against currency volatility. Station transfer pricing complies with OECD arms-length principles.`,
        actions: [
          {
            label: 'Open Multi-Station Finance',
            action: () => { if (onNavigateTab) onNavigateTab('FINANCE'); },
            icon: Landmark
          },
          {
            label: 'View Entity Stations Overview',
            action: () => { if (onNavigateTab) onNavigateTab('STATIONS'); },
            icon: Building2
          }
        ]
      };
    }

    // 10. Default / Fallback Response
    return {
      text: `### **ArielMC** AI Operational Assistant\n\nI understand your inquiry regarding **"${userQuery}"**.\n\nIn **ArielMC** ERP, all operations are interconnected across our product master, factory compliance network, R&D sampling, two-way order pipeline, bonded warehousing, and multi-currency finance stations.\n\n**Recommended Quick Navigations:**\n- Search and review **Sector Product SKUs & Costings**\n- Check **Bangladesh Factory Audits & Compliance**\n- Track **R&D Tech Packs & SDO Samples**\n- Export **Official Invoices & Mushak 6.3 PDFs**\n- Consult the comprehensive **ArielMC ERP User Guide (PDF)**`,
      actions: [
        {
          label: 'View Products',
          action: () => { if (onNavigateTab) onNavigateTab('PRODUCTS'); },
          icon: Package
        },
        {
          label: 'Factory Compliance',
          action: () => { if (onNavigateTab) onNavigateTab('FACTORIES'); },
          icon: Factory
        },
        {
          label: 'ArielMC ERP User Guide (PDF)',
          action: () => { if (onOpenUserGuide) onOpenUserGuide(); },
          icon: BookOpen
        }
      ]
    };
  };

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!promptText) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const { text, actions } = generateAnswer(userMessage.text);
      const agentReply: ChatMessage = {
        id: `arielmc-${Date.now()}`,
        sender: 'arielmc',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: actions
      };
      setMessages((prev) => [...prev, agentReply]);
      setIsTyping(false);
    }, 450);
  };

  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  const themeAccentBg = isRoyal ? 'bg-[#4169E1]' : 'bg-[#1F3A2E]';
  const themeAccentBorder = isRoyal ? 'border-[#4169E1]' : 'border-[#C8A96A]';
  const themeAccentRing = isRoyal ? 'ring-[#4169E1]' : 'ring-[#C8A96A]';

  return (
    <>
      {/* AI Chat Drawer & Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 bg-white ${
            isExpanded
              ? 'w-[calc(100vw-3rem)] max-w-4xl h-[calc(100vh-5rem)]'
              : 'w-[92vw] sm:w-[460px] h-[640px] max-h-[85vh]'
          } ${
            isRoyal ? 'border-[#4169E1]' : 'border-[#C8A96A]'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`px-4 py-3.5 flex items-center justify-between text-white border-b ${
              isRoyal
                ? 'bg-[#0F172A] border-[#1E293B]'
                : isHeritage
                ? 'bg-[#183124] border-[#2A4837]'
                : 'bg-[#1F3A2E] border-[#2C5240]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-[#C8A96A]">
                  <Image
                    src="/images/ArielMC_Emblem_Square.png"
                    alt="ArielMC AI Copilot"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1F3A2E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-base tracking-wide text-white">
                    ArielMC <span className="text-[#C8A96A]">AI Copilot</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                    24/7 ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-[#C8A96A] font-sans">
                  Autonomous Sourcing, SDO &amp; Compliance Assistant
                </p>
              </div>
            </div>

            {/* Action Buttons in Header */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-gray-300 hover:text-rose-300 hover:bg-white/10 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Restore Size' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-2 bg-[#F8FAF9] border-b border-gray-200 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <button
              onClick={() => handleSendPrompt('Show the highest margin products in our catalog')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              📊 High Margin SKUs
            </button>
            <button
              onClick={() => handleSendPrompt('Which factories have LWG Gold & BSCI Grade A compliance?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              🏭 Factory Audits
            </button>
            <button
              onClick={() => handleSendPrompt('How do I generate an official Mushak 6.3 VAT invoice in ArielMC ERP?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              📜 Mushak 6.3 VAT
            </button>
            <button
              onClick={() => {
                if (onOpenUserGuide) onOpenUserGuide();
              }}
              className="px-2.5 py-1 rounded-full bg-[#C8A96A]/15 border border-[#C8A96A]/40 text-[#1F3A2E] hover:bg-[#C8A96A] hover:text-white font-bold whitespace-nowrap transition-colors shadow-2xs flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-[#C8A96A]" />
              <span>User Guide (PDF)</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-[#C8A96A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Image
                        src="/images/ArielMC_Emblem_Square.png"
                        alt="ArielMC AI"
                        width={22}
                        height={22}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-xs ${
                      isUser
                        ? isRoyal
                          ? 'bg-[#4169E1] text-white rounded-br-xs'
                          : 'bg-[#1F3A2E] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                    }`}
                  >
                    {/* Message Body with Markdown-like Rendering */}
                    <div className="whitespace-pre-wrap leading-relaxed text-[12px] space-y-1">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        // Check for headers
                        if (paragraph.startsWith('### ')) {
                          return (
                            <div key={pIdx} className="font-heading font-bold text-[13px] text-[#1F3A2E] border-b border-gray-100 pb-1 pt-1">
                              {paragraph.replace('### ', '')}
                            </div>
                          );
                        }
                        // Format bold text
                        const formatted = paragraph.split(/(\*\*.*?\*\*|\`.*?\`)/g).map((chunk, cIdx) => {
                          if (chunk.startsWith('**') && chunk.endsWith('**')) {
                            return (
                              <strong key={cIdx} className={isUser ? 'font-bold' : 'font-bold text-[#1F3A2E]'}>
                                {chunk.slice(2, -2)}
                              </strong>
                            );
                          }
                          if (chunk.startsWith('`') && chunk.endsWith('`')) {
                            return (
                              <code
                                key={cIdx}
                                className={`px-1 py-0.5 rounded text-[11px] font-mono ${
                                  isUser ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}
                              >
                                {chunk.slice(1, -1)}
                              </code>
                            );
                          }
                          return chunk;
                        });

                        return (
                          <div key={pIdx} className="leading-snug">
                            {formatted}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Action Buttons Attached to Response */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((qa, qIdx) => {
                          const isComponent = Boolean(
                            qa.icon &&
                              (typeof qa.icon === 'function' ||
                                (typeof qa.icon === 'object' && Boolean((qa.icon as any).$$typeof)))
                          );
                          const Icon = isComponent ? qa.icon : ChevronRight;
                          return (
                            <button
                              key={qIdx}
                              onClick={() => {
                                if (typeof qa.action === 'function') {
                                  qa.action();
                                } else if (qa.label) {
                                  handleSendPrompt(qa.label);
                                }
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                                isRoyal
                                  ? 'bg-[#4169E1]/10 text-[#4169E1] hover:bg-[#4169E1] hover:text-white border border-[#4169E1]/30'
                                  : 'bg-[#1F3A2E]/10 text-[#1F3A2E] hover:bg-[#1F3A2E] hover:text-white border border-[#1F3A2E]/30'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{qa.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div
                      className={`text-[9px] text-right font-mono ${
                        isUser ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#1F3A2E] text-[#C8A96A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold text-[10px]">
                  AMC
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs p-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#1F3A2E] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-gray-500 font-mono ml-1.5">
                    **ArielMC** AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="arielmc-ai-input"
                type="text"
                placeholder="Ask ArielMC AI about products, factories, SDOs, orders, VAT..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A96A] focus:bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`p-2.5 rounded-xl text-white font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isRoyal
                    ? 'bg-[#4169E1] hover:bg-blue-700 shadow-[#4169E1]/20'
                    : 'bg-[#1F3A2E] hover:bg-[#172D24] shadow-[#1F3A2E]/20'
                }`}
                title="Send Inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <span>Station: <strong>{activeEntity.code.replace('ARIEL_', 'ArielMC ')}</strong> ({activeEntity.baseCurrency})</span>
              <span>Encrypted AI • Autonomous Operations</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
