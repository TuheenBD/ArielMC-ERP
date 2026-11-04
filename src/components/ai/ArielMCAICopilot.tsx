'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  FileText,
  Package,
  Factory,
  FlaskConical,
  BookOpen,
  LayoutDashboard,
  Megaphone,
  Key,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal
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
  provider?: 'gemini' | 'smart-fallback';
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [apiKeySavedNotice, setApiKeySavedNotice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('arielmc_gemini_api_key') || '';
      setApiKey(stored);
      setApiKeyInput(stored);
    }
  }, []);

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    setApiKey(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('arielmc_gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('arielmc_gemini_api_key');
      }
    }
    setApiKeySavedNotice(true);
    setTimeout(() => {
      setApiKeySavedNotice(false);
      setShowSettings(false);
    }, 1500);
  };

  const initialWelcomeText = `Hello Partner! I am your **ArielMC AI Partner**.\n\nI have complete real-time visibility across our **62 Master SKUs**, partner factories, costing sheets, and cash incentive net yields across all 5 operating stations (**ArielMC BD**, **ArielMC UK**, **ArielMC US**, **ArielMC EU**, and **ArielMC AU**).\n\nWhat can we solve or analyze together today, Syed?`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_ai_copilot_history_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
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
        provider: 'smart-fallback'
      }
    ];
  });

  useEffect(() => {
    try {
      const safeToStore = messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
        provider: m.provider
      }));
      localStorage.setItem('arielmc_ai_copilot_history_v2', JSON.stringify(safeToStore));
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
      provider: 'smart-fallback'
    };
    setMessages([fresh]);
    try {
      localStorage.removeItem('arielmc_ai_copilot_history_v2');
    } catch {
      // ignore
    }
  };

  const handleCopyText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // High-intelligence conversational fallback when Gemini API key is missing or offline
  const generateConversationalFallback = (userQuery: string): { text: string; actions?: { label: string; action: () => void; icon?: any }[] } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Margin & Costing Analysis
    if (q.includes('margin') || q.includes('cost') || q.includes('fob') || q.includes('pricing') || q.includes('profit')) {
      const sorted = [...products].sort((a, b) => (b.costing?.arielSourcingMarginPct || 0) - (a.costing?.arielSourcingMarginPct || 0));
      const top3 = sorted.slice(0, 3);
      
      let res = `Partner, here is a clear breakdown of our commercial margins across the **${products.length} synchronized SKUs**:\n\n`;
      top3.forEach((p, idx) => {
        const cost = p.costing?.factoryCostUsd || 0;
        const fob = p.costing?.b2bFobPriceUsd || 0;
        const margin = p.costing?.arielSourcingMarginPct || 0;
        const netYield = p.costing?.netIncentivePct || (p.sector === 'JUTE' ? 9.5 : 6.65);
        res += `• **${p.name}** (\`${p.sku}\`):\n  Factory Cost: **$${cost.toFixed(2)}** &rarr; Published FOB: **$${fob.toFixed(2)}** | Commercial Margin: **${margin}%** | Govt Cash Incentive: **+${netYield}%**\n\n`;
      });
      res += `In ArielMC, our standard margin policy targets **18% to 38%** commercial margin, reinforced by Bangladesh Bank cash incentives (up to **9.5% net yield** on diversified Jute and **6.65%** on Leather & Pottery). Would you like to review specific slabs or adjust a buyer quote?`;

      return {
        text: res,
        actions: [
          {
            label: 'Open Product Master',
            action: () => { if (onNavigateTab) onNavigateTab('PRODUCTS'); },
            icon: Package
          }
        ]
      };
    }

    // 2. Factory Audits & Compliance
    if (q.includes('factory') || q.includes('audit') || q.includes('compliance') || q.includes('lwg') || q.includes('bsci') || q.includes('sedex')) {
      const lwgFactories = factories.filter(f => f.complianceAudits?.some(a => a.standardName?.toLowerCase().includes('lwg') || a.auditBody?.toLowerCase().includes('lwg')));
      const bsciFactories = factories.filter(f => f.complianceAudits?.some(a => a.standardName?.toLowerCase().includes('bsci') || a.standardName?.toLowerCase().includes('sedex')));
      
      let res = `Partner, we partner exclusively with verified, audited facilities across Savar, Gazipur, Dhamrai, and Narsingdi:\n\n`;
      if (lwgFactories.length > 0) {
        res += `**LWG-Audited Tanneries (Leather Compendium):**\n`;
        lwgFactories.forEach(f => {
          res += `• **${f.name}** (${f.cluster}) — Tier 1, LWG Gold/Silver certified, Capacity: ${(f.capacity?.monthlyCapacityUnits || 15000).toLocaleString()} units/mo.\n`;
        });
        res += `\n`;
      }
      res += `**Social & Environmental Compliance (BSCI / Sedex SMETA 4-Pillar):**\n`;
      const displayFactories = bsciFactories.length > 0 ? bsciFactories.slice(0, 3) : factories.slice(0, 3);
      displayFactories.forEach(f => {
        const certs = f.complianceAudits?.map(a => a.standardName).filter(Boolean).slice(0, 3).join(', ') || 'Sedex, BSCI';
        res += `• **${f.name}** (${f.cluster}) — Audits: ${certs}, AQL Pass Rate: **${f.scorecard?.aqlPassRatePct || 98}%**.\n`;
      });
      res += `\nEvery consignment is covered by our 5-stage quality audit protocol before vessel loading.`;

      return {
        text: res,
        actions: [
          {
            label: 'View Factory Directory',
            action: () => { if (onNavigateTab) onNavigateTab('FACTORIES'); },
            icon: Factory
          }
        ]
      };
    }

    // 3. LDC 2029 Policy Question
    if (q.includes('ldc') || q.includes('tariff') || q.includes('2029') || q.includes('policy') || q.includes('trade')) {
      return {
        text: `The UN General Assembly's extension of Bangladesh's LDC graduation to **November 24, 2029** is a major win for us, Syed.\n\nHere is how we leverage it:\n1. **Zero Tariff Shock**: We can guarantee 0% duty-free quota-free access to our UK (DCTS) and EU (EBA) buyers until late 2029.\n2. **Margin Protection**: Defers an average 12.5% MFN duty across 38 destination countries.\n3. **Diversification Mandate**: International buyers are actively looking to diversify beyond 84%+ RMG dependence. Our **Golden Jute, Master Leather, Fine Ceramics, and Terracotta** lines are perfectly positioned right now.\n\nOur full whitepaper is published on our corporate website and blog if you'd like to share it with buyers!`,
        actions: [
          {
            label: 'Open Brand & Marketing',
            action: () => { if (onNavigateTab) onNavigateTab('MARKETING'); },
            icon: Megaphone
          }
        ]
      };
    }

    // 4. Sample Policy (SOP-B2B-SMP-2026-V1)
    if (q.includes('sample') || q.includes('sdo') || q.includes('courier') || q.includes('proto')) {
      return {
        text: `Under our official **SOP-B2B-SMP-2026-V1 Sample Policy**:\n\n• **Standard Dispatch**: Counter-samples dispatch within **5 to 9 business days** via DHL Express.\n• **Commercial Credit**: Sample development and courier charges are **100% credited back** on the buyer's first commercial bulk production purchase order.\n• **Active SDOs**: We currently have **${samples.length} active samples** in development across protos, lab dips, and golden seal approvals.\n\nWould you like me to track a specific SDO or generate a sample invoice?`,
        actions: [
          {
            label: 'Track Active Samples',
            action: () => { if (onNavigateTab) onNavigateTab('RND'); },
            icon: FlaskConical
          }
        ]
      };
    }

    // 5. User Guide or Document Export
    if (q.includes('guide') || q.includes('manual') || q.includes('document') || q.includes('invoice') || q.includes('pdf')) {
      return {
        text: `Syed, all official export documentation and the ERP Master Manual are accessible in 1 click:\n\n• **ArielMC ERP Master Manual (PDF)**: Complete guide to all 10 ERP phases.\n• **Commercial Documentation**: Proforma Invoices, Commercial Invoices, Packing Lists, Mushak 6.3 VAT tax invoices, and Factory MoUs.\n\nWhich document would you like to open?`,
        actions: [
          {
            label: 'Open User Guide',
            action: () => { if (onOpenUserGuide) onOpenUserGuide(); },
            icon: BookOpen
          },
          {
            label: 'Export Document Center',
            action: () => { if (onOpenDocumentCenter) onOpenDocumentCenter(); },
            icon: FileText
          }
        ]
      };
    }

    // 6. Natural General Conversation / Strategy / Drafting
    return {
      text: `Understood, Partner. I'm right here with you. We currently have **${products.length} synchronized SKUs** active in our Product Master across our 5 national sectors, with all costing sheets and factory MoUs aligned.\n\nTell me what you're working on — whether you want to calculate a custom landed cost, review factory lead times, draft an email to a retail buyer, or analyze our cash incentives. I'm ready to solve it with you!`
    };
  };

  const handleSendPrompt = async (promptText?: string) => {
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

    try {
      // 1. Attempt live Gemini API call
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userApiKey: apiKey || undefined,
          clientContext: {
            station: activeEntity?.legalName || activeEntity?.code || 'ArielMC BD',
            currency: activeCurrency?.code || 'USD',
            productsCount: products.length
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reply) {
          const agentReply: ChatMessage = {
            id: `arielmc-${Date.now()}`,
            sender: 'arielmc',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            provider: 'gemini'
          };
          setMessages((prev) => [...prev, agentReply]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fall through to smart conversational fallback
    }

    // 2. Fallback to our natural conversational partner engine
    setTimeout(() => {
      const { text, actions } = generateConversationalFallback(userMessage.text);
      const agentReply: ChatMessage = {
        id: `arielmc-${Date.now()}`,
        sender: 'arielmc',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'smart-fallback',
        quickActions: actions
      };
      setMessages((prev) => [...prev, agentReply]);
      setIsTyping(false);
    }, 400);
  };

  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';

  return (
    <>
      {/* AI Chat Drawer & Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 bg-white ${
            isExpanded
              ? 'w-[calc(100vw-3rem)] max-w-4xl h-[calc(100vh-5rem)]'
              : 'w-[94vw] sm:w-[480px] h-[660px] max-h-[88vh]'
          } ${
            isRoyal ? 'border-[#4169E1]' : isHydrangea ? 'border-[#AD56C4]' : 'border-[#C8A96A]'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`px-5 py-4 flex items-center justify-between text-white border-b ${
              isRoyal
                ? 'bg-[#0F172A] border-[#1E293B]'
                : isHydrangea
                ? 'bg-[#230C2E] border-[#3D1A4D]'
                : 'bg-[#1F3A2E] border-[#2C5240]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-[#C8A96A]">
                  <Image
                    src="/images/ArielMC_Emblem_Square.png"
                    alt="ArielMC AI Partner"
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
                    ArielMC <span className="text-[#C8A96A]">AI Partner</span>
                  </span>
                  {apiKey ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>GEMINI LIVE</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30 flex items-center gap-1">
                      <span>SMART PARTNER</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-300 font-sans">
                  Autonomous Sourcing, Costing &amp; Strategy Co-Pilot
                </p>
              </div>
            </div>

            {/* Action Buttons in Header */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-colors ${
                  showSettings ? 'bg-[#C8A96A] text-[#1F3A2E]' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="AI Settings & Gemini API Key"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-xl text-gray-300 hover:text-rose-300 hover:bg-white/10 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Restore Size' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Drawer / Popover for Gemini Key */}
          {showSettings && (
            <div className="px-4 py-3 bg-[#F8FAF9] border-b border-gray-200 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Google Gemini API Key</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#C8A96A] hover:underline flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">
                Connect your Gemini API key to enable live, unconstrained natural intelligence across your ERP.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste AIzaSy... key here"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-xl bg-[#1F3A2E] text-white hover:bg-[#C8A96A] hover:text-[#1F3A2E] font-bold text-xs transition-colors"
                >
                  {apiKeySavedNotice ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Conversational Prompt Pills */}
          <div className="px-4 py-2.5 bg-[#FAF9F6] border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <button
              onClick={() => handleSendPrompt('Analyze our highest margin products across Jute, Leather, and Ceramics')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              📊 Highest Margins
            </button>
            <button
              onClick={() => handleSendPrompt('Which partner factories have LWG Gold & Sedex SMETA 4-Pillar audits?')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              🏭 Factory Audits
            </button>
            <button
              onClick={() => handleSendPrompt('How does the UN LDC extension to 2029 benefit our export strategy?')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              🌍 LDC 2029 Strategy
            </button>
            <button
              onClick={() => handleSendPrompt('Explain our B2B sample credit policy under SOP-B2B-SMP-2026-V1')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#C8A96A] hover:text-[#1F3A2E] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              📦 Sample SOP
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-white p-1 border border-[#C8A96A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Image
                        src="/images/ArielMC_Emblem_Square.png"
                        alt="ArielMC AI"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-xs relative group ${
                      isUser
                        ? isRoyal
                          ? 'bg-[#4169E1] text-white rounded-br-xs'
                          : 'bg-[#1F3A2E] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                    }`}
                  >
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className={`absolute top-2.5 right-2.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                        isUser ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Message Body with clean natural formatting */}
                    <div className="whitespace-pre-wrap leading-relaxed text-[13px] space-y-2">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        // Check for headers
                        if (paragraph.startsWith('### ')) {
                          return (
                            <div key={pIdx} className="font-heading font-bold text-[14px] text-[#1F3A2E] border-b border-gray-100 pb-1 pt-1">
                              {paragraph.replace('### ', '')}
                            </div>
                          );
                        }
                        if (paragraph.startsWith('**') && paragraph.endsWith('**') && !paragraph.slice(2, -2).includes('**')) {
                          return (
                            <div key={pIdx} className="font-heading font-bold text-[13px] text-[#1F3A2E]">
                              {paragraph.slice(2, -2)}
                            </div>
                          );
                        }

                        // Format bold and code text
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
                          <div key={pIdx} className="leading-relaxed">
                            {formatted}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Action Navigation Buttons */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap gap-2">
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
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
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

                    {/* Timestamp & Provider Badge */}
                    <div
                      className={`text-[10px] mt-2 flex items-center justify-between ${
                        isUser ? 'text-white/60' : 'text-gray-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.provider === 'gemini' && (
                        <span className="text-[9px] font-mono text-emerald-600 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Gemini Live</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-white p-1 border border-[#C8A96A] flex items-center justify-center shrink-0 shadow-xs">
                  <Image
                    src="/images/ArielMC_Emblem_Square.png"
                    alt="ArielMC AI"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Sending Bar */}
          <div className="p-3.5 bg-white border-t border-gray-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your partner about pricing, factories, buyer replies, LDC 2029..."
                className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A] focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-3 rounded-2xl transition-all shadow-sm ${
                  inputText.trim()
                    ? 'bg-[#1F3A2E] text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#1F3A2E] cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                title="Send message to AI Partner"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 px-1 font-mono">
              <span>Station: {activeEntity?.legalName || activeEntity?.code || 'ArielMC BD (BDT)'}</span>
              <span className="flex items-center gap-1">
                <span>Encrypted Executive Partner</span>
                <span>•</span>
                <span>62 Master SKUs</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
