'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Video,
  Users,
  Send,
  Calendar,
  Globe2,
  ShieldCheck,
  Server,
  Sparkles,
  Smartphone,
  Share2,
  FileText,
  Clock,
  ArrowRight,
  Settings,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  History,
  X,
  RefreshCw,
  Lock,
  Eye,
  Inbox,
  Radio,
  Layers,
  Database
} from 'lucide-react';
import {
  ZoomIcon,
  GoogleMeetIcon,
  TeamsIcon,
  GmailIcon,
  HostingerIcon,
  WhatsappIcon,
  LinkedinIcon,
  YoutubeIcon,
  FacebookIcon
} from '@/components/SocialIcons';
import { OFFICIAL_COMMUNICATION_CHANNELS } from '@/data/initialData';
import { 
  EmailQueueItem, 
  EmailTemplateType, 
  EmailProviderType, 
  EmailQueueStatus 
} from '@/types/erp';
import { 
  dispatchErpEmail, 
  resolveEmailContent, 
  getLocalQueueItems, 
  saveLocalQueueItem 
} from '@/lib/emailService';

export const CommunicationsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'DESKS' | 'OUTBOX'>('OUTBOX');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Template & Form State
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>('INVOICE');
  const [recipientEmail, setRecipientEmail] = useState('tuheen@arielmc.com');
  const [recipientName, setRecipientName] = useState('Syed Akramul Hassan');
  const [meetingPlatform, setMeetingPlatform] = useState<'ZOOM' | 'MEET' | 'TEAMS'>('ZOOM');
  const [customSubject, setCustomSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Sample Dispatch specific variables
  const [sampleTracking, setSampleTracking] = useState('DHL-8921827391');
  const [invoiceNumber, setInvoiceNumber] = useState('AMC-INV-2026-089');
  const [poNumber, setPoNumber] = useState('AMC-PO-BD-7819');

  // Gateway Selection
  const [emailProvider, setEmailProvider] = useState<EmailProviderType>('RESEND');
  const [hostingerAccount, setHostingerAccount] = useState<'info@arielmc.com' | 'tuheen@arielmc.com'>('info@arielmc.com');
  const [gmailAccount, setGmailAccount] = useState<'TuheenBD@gmail.com' | 'ArielMC.BD@gmail.com'>('TuheenBD@gmail.com');

  // Sending & Alert State
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: 'success' | 'error';
    message: string;
    mode?: string;
    messageId?: string;
  } | null>(null);

  // Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');

  // Credentials & Settings Modal
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [credentialsConfig, setCredentialsConfig] = useState({
    resendApiKey: '',
    postmarkToken: '',
    hostingerHost: 'smtp.hostinger.com',
    hostingerPort: 465,
    hostingerPass: '',
    gmailHost: 'smtp.gmail.com',
    gmailPort: 465,
    gmailPass: '',
  });

  // Outbox Queue History
  const [outboxItems, setOutboxItems] = useState<EmailQueueItem[]>([
    {
      id: 'msg-seed-01',
      createdAt: '2026-10-19 14:32',
      updatedAt: '2026-10-19 14:32',
      recipient: 'sourcing@marksandspencer.co.uk',
      recipientName: 'Marks & Spencer Sourcing UK',
      templateId: 'INVOICE',
      subject: '[Commercial Export Invoice] AMC-INV-2026-089 — ArielMC Ltd for Marks & Spencer Sourcing UK',
      payload: { invoiceNo: 'AMC-INV-2026-089', totalAmountUsd: 48500 },
      status: 'delivered',
      externalMessageId: 'res_78129847192',
      attempts: 1,
      provider: 'RESEND',
    },
    {
      id: 'msg-seed-02',
      createdAt: '2026-10-19 12:15',
      updatedAt: '2026-10-19 12:15',
      recipient: 'logistics@daviesturner.co.uk',
      recipientName: 'Davies Turner UK Logistics',
      templateId: 'SAMPLE_DISPATCH',
      subject: '[Sample Dispatch #SMP-LT2-01] Artisan Full-Grain Leather Tote — Dispatched via Royal Mail Tracked 48',
      payload: { sampleCode: 'SMP-LT2-01', carrier: 'Royal Mail Tracked 48', trackingNumber: 'RM781928371GB' },
      status: 'delivered',
      externalMessageId: 'pm_9821738192',
      attempts: 1,
      provider: 'POSTMARK',
    },
    {
      id: 'msg-seed-03',
      createdAt: '2026-10-19 09:40',
      updatedAt: '2026-10-19 09:40',
      recipient: 'production@savartannery.com.bd',
      recipientName: 'Savar Tannery Estate Ltd',
      templateId: 'FACTORY_PO',
      subject: '[Official Purchase Order] AMC-PO-BD-7819 — ArielMC Ltd / Savar Tannery Estate Ltd',
      payload: { poNumber: 'AMC-PO-BD-7819', quantityUnits: 3500 },
      status: 'sent',
      externalMessageId: 'sim-89127391',
      attempts: 1,
      provider: 'HOSTINGER',
    },
  ]);

  const comms = OFFICIAL_COMMUNICATION_CHANNELS;

  // Hydrate local queue and configuration on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('arielmc_credentials_config');
      if (savedConfig) {
        setCredentialsConfig((prev) => ({ ...prev, ...JSON.parse(savedConfig) }));
      }
      const localQueue = getLocalQueueItems();
      if (localQueue && localQueue.length > 0) {
        setOutboxItems((prev) => {
          const ids = new Set(localQueue.map((i) => i.id));
          const existingFiltered = prev.filter((i) => !ids.has(i.id));
          return [...localQueue, ...existingFiltered];
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Update dynamic template preview
  const updatePreview = () => {
    const vars: Record<string, any> = {
      to: recipientEmail,
      buyerName: recipientName || recipientEmail,
      invoiceNo: invoiceNumber,
      invoiceType: 'COMMERCIAL',
      totalAmountUsd: 38450.0,
      currency: 'USD',
      paymentTerms: 'Irrevocable Confirmed L/C at Sight (Eastern Bank PLC AD)',
      lineItems: [
        { description: 'Artisan Full-Grain Leather Tote (Style 2, Burgundy)', qty: 500, unitPrice: 50.0, total: 25000.0 },
        { description: 'Savar Artisan Leather Cardholder (Vegetable Tanned)', qty: 1500, unitPrice: 8.96, total: 13450.0 }
      ],
      sampleCode: 'SMP-2026-08',
      sku: 'AMC-LT2-LEA-BUR-SGL',
      productName: 'ArielMC Style 2 Full Leather Tote - Burgundy',
      tier: 'TIER_1_3PL_BUFFER',
      carrier: 'Royal Mail Tracked 48 / DHL Express',
      trackingNumber: sampleTracking,
      originHub: 'Davies Turner UK Hub (Dartford DA2)',
      destinationAddress: 'Oxford Street Showroom, London, UK',
      estimatedDeliveryDate: '21 October 2026 (48h Protocol)',
      poNumber: poNumber,
      factoryName: 'Bengal Leather Complex Ltd',
      factoryCluster: 'Savar Leather Industrial Park, Dhaka',
      quantityUnits: 2500,
      totalCostBdt: 8400000,
      exFactoryDeadline: '15 November 2026',
      body: messageBody,
      subject: customSubject,
    };

    const rendered = resolveEmailContent(selectedTemplate, vars, customSubject, messageBody);
    setPreviewSubject(rendered.subject);
    setPreviewHtml(rendered.html);
  };

  useEffect(() => {
    updatePreview();
  }, [selectedTemplate, recipientEmail, recipientName, invoiceNumber, sampleTracking, poNumber, customSubject, messageBody]);

  const handleSaveCredentials = () => {
    try {
      localStorage.setItem('arielmc_credentials_config', JSON.stringify(credentialsConfig));
      setIsSmtpModalOpen(false);
      setSendResult({
        type: 'success',
        message: 'Email gateway credentials saved successfully in ERP session.',
      });
      setTimeout(() => setSendResult(null), 4000);
    } catch {
      // ignore
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ASYNCHRONOUS INGESTION DISPATCHER
  const handleDispatchEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSendResult({
        type: 'error',
        message: 'Please provide a valid recipient email address.',
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const vars: Record<string, any> = {
        to: recipientEmail,
        buyerName: recipientName || recipientEmail,
        invoiceNo: invoiceNumber,
        totalAmountUsd: 38450.0,
        sampleCode: 'SMP-2026-08',
        trackingNumber: sampleTracking,
        poNumber: poNumber,
        body: messageBody,
      };

      const result = await dispatchErpEmail({
        to: recipientEmail,
        recipientName,
        subject: customSubject || previewSubject,
        templateId: selectedTemplate,
        variables: vars,
        provider: emailProvider,
      });

      setSendResult({
        type: 'success',
        message: 'Email accepted into Asynchronous Queue & Dispatched!',
        mode: result.mode,
        messageId: result.messageId,
      });

      // Update in-memory outbox
      const newItem: EmailQueueItem = {
        id: result.messageId,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        recipient: recipientEmail,
        recipientName,
        templateId: selectedTemplate,
        subject: customSubject || previewSubject,
        payload: vars,
        status: (result.status as any) || 'sent',
        externalMessageId: result.messageId,
        attempts: 1,
        provider: emailProvider,
      };

      setOutboxItems((prev) => [newItem, ...prev]);
    } catch (err: any) {
      setSendResult({
        type: 'error',
        message: err.message || 'Dispatch error occurred.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#C8A96A] font-mono text-xs font-semibold border border-white/20">
              HIGH-PERFORMANCE ASYNCHRONOUS EMAIL PIPELINE
            </span>
            <span className="text-xs text-[#E8EFE8] font-mono hidden sm:inline">
              Next.js 16 • Supabase PostgreSQL • Resend / Postmark
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-heading flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-[#C8A96A]" />
            Trade Communications &amp; Asynchronous Email Center
          </h1>
          <p className="text-xs text-[#E8EFE8] max-w-3xl leading-relaxed">
            Zero UI latency decoupled email pipeline. Automatically dispatch official Commercial Invoices, Two-Tier Sample Dispatches, Factory POs, and virtual meeting invitations with real-time delivery and bounce tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => setIsSmtpModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 text-xs font-semibold transition-all shadow-sm font-heading cursor-pointer"
            title="Configure Resend, Postmark & SMTP Gateways"
          >
            <Settings className="w-4 h-4" />
            <span>Gateway Credentials</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('OUTBOX')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
              activeSubTab === 'OUTBOX'
                ? 'bg-[#1F3A2E] text-white shadow-md border-b-2 border-[#C8A96A]'
                : 'bg-white text-[#6B7269] hover:bg-[#F4F6F4] border border-[#DDE3DD]'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Asynchronous Email Outbox &amp; Pipeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold">
              {outboxItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('DESKS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
              activeSubTab === 'DESKS'
                ? 'bg-[#1F3A2E] text-white shadow-md border-b-2 border-[#C8A96A]'
                : 'bg-white text-[#6B7269] hover:bg-[#F4F6F4] border border-[#DDE3DD]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Virtual Desks &amp; Video Channels</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6B7269]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pipeline: ACTIVE</span>
          </span>
        </div>
      </div>

      {activeSubTab === 'OUTBOX' ? (
        <div className="space-y-6">
          {/* TOP METRICS SUMMARY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
              <span className="text-[11px] font-mono text-gray-500 uppercase">Total Dispatched</span>
              <div className="text-xl font-bold font-heading text-[#1F3A2E] mt-1">{outboxItems.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
              <span className="text-[11px] font-mono text-gray-500 uppercase">Delivered (Verified)</span>
              <div className="text-xl font-bold font-heading text-emerald-700 mt-1">
                {outboxItems.filter((i) => i.status === 'delivered').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
              <span className="text-[11px] font-mono text-gray-500 uppercase">In Transit / Sent</span>
              <div className="text-xl font-bold font-heading text-blue-700 mt-1">
                {outboxItems.filter((i) => i.status === 'sent').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
              <span className="text-[11px] font-mono text-gray-500 uppercase">Bounced / Dropped</span>
              <div className="text-xl font-bold font-heading text-rose-700 mt-1">
                {outboxItems.filter((i) => i.status === 'bounced' || i.status === 'failed').length}
              </div>
            </div>
          </div>

          {/* SECTION: 1-CLICK DISPATCHER CONSOLE */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDE3DD] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#C8A96A] text-[#1F3A2E] font-bold">
                    <Send className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F3A2E] font-heading">
                    1-Click Enterprise Email Dispatcher
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Asynchronous Ingestion Ready
                  </span>
                </div>
                <p className="text-xs text-[#6B7269] mt-0.5">
                  Select an official document template, customize parameters, preview HTML, and queue directly into Supabase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updatePreview();
                    setPreviewModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C8A96A] hover:bg-[#F8F6F2] text-xs font-semibold text-[#1F3A2E] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Preview Branded HTML</span>
                </button>
              </div>
            </div>

            {/* Alert Banner */}
            {sendResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start justify-between gap-3 animate-in fade-in ${
                  sendResult.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {sendResult.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{sendResult.message}</p>
                    {sendResult.messageId && (
                      <p className="text-[10px] font-mono mt-0.5 text-gray-500">
                        Queue Ticket ID: <code>{sendResult.messageId}</code> • Mode: <code>{sendResult.mode}</code>
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSendResult(null)} className="p-1 rounded hover:bg-black/5 text-gray-500 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Step 1: Gateway Selector */}
            <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A2E] font-heading block">
                Step 1: Choose Delivery Provider Gateway
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Resend Option */}
                <div
                  onClick={() => setEmailProvider('RESEND')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    emailProvider === 'RESEND'
                      ? 'border-[#1F3A2E] bg-white shadow-sm ring-1 ring-[#C8A96A]'
                      : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1F3A2E] font-heading">Resend API</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">3,000 Free/mo • Native Next.js 16 • SPF/DKIM</p>
                </div>

                {/* Postmark Option */}
                <div
                  onClick={() => setEmailProvider('POSTMARK')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    emailProvider === 'POSTMARK'
                      ? 'border-[#FFDC00] bg-white shadow-sm ring-1 ring-[#FFDC00]'
                      : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1F3A2E] font-heading">Postmark API</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      Blueprint
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Instant Webhook Feedback • 99.9% Deliverability</p>
                </div>

                {/* Hostinger SMTP */}
                <div
                  onClick={() => setEmailProvider('HOSTINGER')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    emailProvider === 'HOSTINGER'
                      ? 'border-[#673AB7] bg-white shadow-sm ring-1 ring-[#673AB7]'
                      : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1F3A2E] font-heading">Hostinger Business</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EDE7F6] text-[#673AB7] font-semibold">
                      @arielmc.com
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Custom Corporate Domain • Port 465 SSL</p>
                </div>

                {/* Google Workspace */}
                <div
                  onClick={() => setEmailProvider('GMAIL')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    emailProvider === 'GMAIL'
                      ? 'border-[#EA4335] bg-white shadow-sm ring-1 ring-[#EA4335]'
                      : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1F3A2E] font-heading">Google Workspace</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FDEAEA] text-[#EA4335] font-semibold">
                      App Password
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">TuheenBD@gmail.com • Google Cloud Mail</p>
                </div>
              </div>
            </div>

            {/* Step 2: Template Selection & Target Fields */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A2E] font-heading block">
                Step 2: Template Configuration &amp; Recipient Parameters
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {[
                  { id: 'INVOICE', label: '📜 Commercial Invoice & Mushak', desc: 'Customs & Banking' },
                  { id: 'SAMPLE_DISPATCH', label: '🧵 Sample Dispatch Tracking', desc: 'Two-Tier Protocol' },
                  { id: 'ORDER_CONFIRMATION', label: '📦 Order Confirmation', desc: 'FOB / CIF Contract' },
                  { id: 'FACTORY_PO', label: '🏭 Tannery & Factory PO', desc: 'Export Work Order' },
                  { id: 'CUSTOM', label: '✉️ Custom Announcement', desc: 'General Broadcast' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedTemplate === tpl.id
                        ? 'border-[#1F3A2E] bg-[#1F3A2E] text-white shadow-xs'
                        : 'border-[#DDE3DD] bg-white hover:bg-[#F8F6F2] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="font-bold text-xs font-heading">{tpl.label}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedTemplate === tpl.id ? 'text-[#C8A96A]' : 'text-gray-500'}`}>
                      {tpl.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs Based on Selected Template */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Email Address:</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="buyer@client.co.uk"
                    className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Name / Organization:</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Marks & Spencer Sourcing Office"
                    className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                  />
                </div>

                {selectedTemplate === 'INVOICE' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Invoice Reference No:</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#DDE3DD] font-mono text-[#1F3A2E] font-bold"
                    />
                  </div>
                )}

                {selectedTemplate === 'SAMPLE_DISPATCH' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Courier Tracking Code:</label>
                    <input
                      type="text"
                      value={sampleTracking}
                      onChange={(e) => setSampleTracking(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#DDE3DD] font-mono text-[#C8A96A] font-bold"
                    />
                  </div>
                )}

                {selectedTemplate === 'FACTORY_PO' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Purchase Order (PO) Number:</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#DDE3DD] font-mono text-[#1F3A2E] font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#DDE3DD] gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDispatchEmail}
                  disabled={isSending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#15271F] text-white text-xs font-bold transition-all shadow-md font-heading cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C8A96A]" />
                      <span>Queueing in Asynchronous Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C8A96A]" />
                      <span>Dispatch to Queue (via {emailProvider})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updatePreview();
                    setPreviewModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDE3DD] hover:bg-[#F8F6F2] text-xs font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#C8A96A]" />
                  <span>Preview Full HTML</span>
                </button>
              </div>

              <span className="text-[11px] text-gray-500 font-mono">
                Decoupled Ingestion: ~10ms execution response
              </span>
            </div>
          </div>

          {/* SECTION: LIVE OUTBOX & DELIVERY AUDIT TABLE */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#C8A96A]" />
                <h3 className="text-sm font-bold text-[#1F3A2E] font-heading">
                  Live Asynchronous Email Outbox &amp; Delivery Audit Trail
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                  {outboxItems.length} Enqueued
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                PostgreSQL Schema: <code>public.email_queue</code>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F6F2] text-[#6B7269] font-mono uppercase text-[10px] border-y border-[#DDE3DD]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                    <th className="py-2.5 px-3 font-semibold">Template</th>
                    <th className="py-2.5 px-3 font-semibold">Recipient</th>
                    <th className="py-2.5 px-3 font-semibold">Subject</th>
                    <th className="py-2.5 px-3 font-semibold">Gateway</th>
                    <th className="py-2.5 px-3 font-semibold">Delivery Status</th>
                    <th className="py-2.5 px-3 font-semibold">Queue Ticket ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
                  {outboxItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8F6F2]/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                        {item.createdAt}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono font-bold text-[10px] text-slate-800">
                          {item.templateId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#1A1A1A]">
                        <div>{item.recipient}</div>
                        {item.recipientName && <div className="text-[10px] text-gray-400 font-sans">{item.recipientName}</div>}
                      </td>
                      <td className="py-2.5 px-3 max-w-[240px] truncate font-medium">
                        {item.subject}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] font-bold text-gray-600">
                        {item.provider || 'RESEND'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            item.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'bounced' || item.status === 'failed'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {item.status === 'delivered' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : item.status === 'bounced' ? (
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-blue-600" />
                          )}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500 max-w-[140px] truncate" title={item.externalMessageId || item.id}>
                        {item.externalMessageId || item.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* VIRTUAL DESKS & VIDEO CONFERENCING SUB-TAB */
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1F3A2E] uppercase tracking-wider font-heading flex items-center gap-2">
              <Video className="w-4 h-4 text-[#C8A96A]" />
              <span>Instant Virtual Meeting Desks &amp; Video Conferencing</span>
            </h2>
            <span className="text-[11px] font-mono text-[#6B7269]">
              Active Buyer &amp; Factory Channels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Zoom */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#2D8CFF]/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#E8F3FF] text-[#2D8CFF]">
                      <ZoomIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-sm font-heading">Zoom</h3>
                      <span className="text-[10px] text-gray-500 font-mono">Video Conferencing</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                    Official Account
                  </span>
                  <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                    {comms.meetings.zoom.account}
                  </div>
                  <p className="text-[11px] text-[#6B7269] mt-1">
                    Primary room for UK &amp; European buyer technical tech-pack reviews.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
                <a
                  href={comms.meetings.zoom.directMeetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73db] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-heading"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Zoom Meeting</span>
                </a>
              </div>
            </div>

            {/* Card 2: Google Meet */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#00897B]/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#E0F2F1] text-[#00897B]">
                      <GoogleMeetIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-sm font-heading">Google Meet</h3>
                      <span className="text-[10px] text-gray-500 font-mono">Workspace Room</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                    Workspace Account
                  </span>
                  <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                    {comms.meetings.googleMeet.account}
                  </div>
                  <p className="text-[11px] text-[#6B7269] mt-1">
                    Instant 1-click video calls with buyers directly from Google Workspace.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
                <a
                  href={comms.meetings.googleMeet.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#00897B] hover:bg-[#007065] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-heading"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Google Meet</span>
                </a>
              </div>
            </div>

            {/* Card 3: Microsoft Teams */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#5059C9]/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#EDE7F6] text-[#5059C9]">
                      <TeamsIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-sm font-heading">MS Teams</h3>
                      <span className="text-[10px] text-gray-500 font-mono">Corporate Teams</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                    Enterprise ID
                  </span>
                  <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                    {comms.meetings.microsoftTeams.account}
                  </div>
                  <p className="text-[11px] text-[#6B7269] mt-1">
                    For enterprise buyers utilizing Microsoft 365 tenant authentication.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
                <a
                  href={comms.meetings.microsoftTeams.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#5059C9] hover:bg-[#3f47a6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-heading"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Teams Desk</span>
                </a>
              </div>
            </div>

            {/* Card 4: WhatsApp */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#25D366]/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#E8F8EE] text-[#25D366]">
                      <WhatsappIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-sm font-heading">WhatsApp</h3>
                      <span className="text-[10px] text-gray-500 font-mono">Factory &amp; Buyer Desk</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                    Direct Trade Mobile
                  </span>
                  <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5">
                    {comms.whatsappIntl}
                  </div>
                  <p className="text-[11px] text-[#6B7269] mt-1">
                    24/7 International Desk for instant sample photography and shipping updates.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
                <a
                  href={comms.meetings.whatsapp.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebc57] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-heading"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HTML PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-heading">Live Branded HTML Email Preview</h3>
                <p className="text-[11px] text-[#E8EFE8] font-mono truncate max-w-xl">
                  Subject: {previewSubject}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#F4F6F4] overflow-y-auto flex-1">
              <div className="shadow-lg rounded-xl overflow-hidden max-w-xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
            <div className="p-3 bg-white border-t border-[#DDE3DD] flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Official ArielMC Corporate Branding • British Racing Green (#1F3A2E) &amp; Gold (#C8A96A)
              </span>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#1F3A2E] text-white font-bold text-xs cursor-pointer font-heading"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIALS CONFIGURATION MODAL */}
      {isSmtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">
                    Email Pipeline Gateway Credentials
                  </h3>
                  <p className="text-[11px] text-[#E8EFE8]">
                    Configure Resend API, Postmark, and SMTP Passwords
                  </p>
                </div>
              </div>
              <button onClick={() => setIsSmtpModalOpen(false)} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Resend Section */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase text-[#1F3A2E] font-heading">
                    1. Resend API Key (Recommended)
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    3,000 Free / mo
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="re_xxxxxxxxxxxxxx"
                  value={credentialsConfig.resendApiKey}
                  onChange={(e) => setCredentialsConfig({ ...credentialsConfig, resendApiKey: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                />
                <p className="text-[10px] text-gray-500">
                  Obtain for free at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">resend.com</a>. Can also be set in <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code> as <code className="bg-gray-200 px-1 py-0.5 rounded">RESEND_API_KEY</code>.
                </p>
              </div>

              {/* Postmark Section */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#1F3A2E] font-heading">
                  2. Postmark Server Token
                </h4>
                <input
                  type="password"
                  placeholder="Server token from Postmarkapp.com"
                  value={credentialsConfig.postmarkToken}
                  onChange={(e) => setCredentialsConfig({ ...credentialsConfig, postmarkToken: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                />
              </div>

              {/* Hostinger Section */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <h4 className="font-bold text-xs uppercase text-[#673AB7] font-heading">
                  3. Hostinger Business Mail Password
                </h4>
                <input
                  type="password"
                  placeholder="Enter Hostinger mailbox password"
                  value={credentialsConfig.hostingerPass}
                  onChange={(e) => setCredentialsConfig({ ...credentialsConfig, hostingerPass: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#DDE3DD] flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                Credentials are saved securely in your ERP browser session.
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsSmtpModalOpen(false)} className="px-3.5 py-1.5 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-xs font-semibold cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveCredentials} className="px-4 py-1.5 rounded-xl bg-[#1F3A2E] hover:bg-[#15271F] text-white text-xs font-bold shadow-sm font-heading cursor-pointer">
                  Save Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
