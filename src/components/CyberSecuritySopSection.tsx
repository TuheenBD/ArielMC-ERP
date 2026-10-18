'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Server,
  Globe,
  Mail,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  Clock,
  ExternalLink,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Building2,
  Eye,
  FileText,
  DollarSign,
  AlertOctagon,
  ArrowRight,
  Sliders,
  Sparkles,
  ChevronRight,
  Flame,
  FileCheck2,
  Cpu,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { CompanyEntity, CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';

interface CyberSecuritySopSectionProps {
  activeEntity?: CompanyEntity;
  activeCurrency?: CurrencyRate;
  theme?: ThemeProfile;
}

type SecurityTab = 
  | 'KILL_SWITCH' 
  | 'POLP_MATRIX' 
  | 'WEBSITE_TRIO' 
  | 'BUDGET_MATRIX' 
  | 'SUPPLY_CHAIN_HYGIENE' 
  | 'ACKNOWLEDGMENT';

interface KillSwitchAction {
  id: string;
  name: string;
  target: string;
  status: 'READY' | 'TRIGGERED';
  timestamp?: string;
  category: 'AD_CAMPAIGN' | 'FINANCIAL' | 'CREDENTIAL';
}

export const CyberSecuritySopSection: React.FC<CyberSecuritySopSectionProps> = ({
  activeEntity,
  activeCurrency,
  theme = 'crm-green',
}) => {
  const [activeTab, setActiveTab] = useState<SecurityTab>('KILL_SWITCH');
  const [currencyMode, setCurrencyMode] = useState<'GBP' | 'BDT'>('GBP');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Kill Switch state
  const [killSwitchActions, setKillSwitchActions] = useState<KillSwitchAction[]>([
    {
      id: 'KS-1',
      name: 'Freeze Meta & TikTok Ad Portfolios',
      target: 'Master Ad Portfolios (arielmc.com / arielmc.co.uk)',
      status: 'READY',
      category: 'AD_CAMPAIGN',
    },
    {
      id: 'KS-2',
      name: 'Suspend Wise UK Corporate Virtual Cards',
      target: 'Commercial SaaS & Ad Spend Virtual Cards',
      status: 'READY',
      category: 'FINANCIAL',
    },
    {
      id: 'KS-3',
      name: 'Trigger Google Workspace Global Session Logout',
      target: 'All Dhaka HQ & London User Seats',
      status: 'READY',
      category: 'CREDENTIAL',
    },
    {
      id: 'KS-4',
      name: 'Revoke Shopify DTC & Stripe UK OAuth Tokens',
      target: 'API Key Integrations & Private App Tokens',
      status: 'READY',
      category: 'CREDENTIAL',
    },
  ]);

  // Budget status toggles
  const [budgetStatus, setBudgetStatus] = useState<Record<string, boolean>>({
    'yubikey': true,
    'cloudflare': true,
    'vault': true,
    'google': true,
    'audit': false,
  });

  // Incident log simulation
  const [incidentLogs, setIncidentLogs] = useState<Array<{ id: string; time: string; event: string; system: string; status: string }>>([
    {
      id: 'INC-2026-081',
      time: '2026-10-18 14:22 GMT',
      event: 'Magecart script injection attempt blocked by CSP on arielmc.shop',
      system: 'Shopify DTC Edge / Cloudflare WAF',
      status: 'BLOCKED & MITIGATED',
    },
    {
      id: 'INC-2026-074',
      time: '2026-10-12 09:15 BST',
      event: 'Fake Trademark Infringement phishing email dropped via DMARC p=reject',
      system: 'Google Workspace Inbound Mail',
      status: 'REJECTED (SPF/DKIM Fail)',
    },
  ]);

  // Acknowledgment Form State
  const [ackForm, setAckForm] = useState({
    legalName: '',
    roleOrAgency: '',
    location: 'Dhaka, Bangladesh',
    date: new Date().toISOString().split('T')[0],
    agreed: false,
    signed: false,
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleTriggerKillSwitch = (id: string) => {
    setKillSwitchActions(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'READY' ? 'TRIGGERED' : 'READY',
              timestamp: item.status === 'READY' ? new Date().toLocaleTimeString() : undefined,
            }
          : item
      )
    );
  };

  const bdtRate = 155; // ৳155 per £1 GBP as certified in the official document

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* ==================== EXECUTIVE HEADER & POSTURE BANNER ==================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1a14] via-[#12261d] to-[#0a1510] border border-[#234534] shadow-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C8A96A]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Active Sovereign Security Perimeter
              </span>
              <span className="px-3 py-1 rounded-full bg-[#203a2c] border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-mono font-semibold">
                SOP-SEC-2026-V1
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                Dhaka HQ ⇄ London Subsidiary
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <ArielMC /> Cyber Security &amp; Cross-Border Platform Governance
              </h1>
              <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed mt-1">
                Standard Operating Procedure for Online Platform Protection, E-Commerce Storefront Hardening,
                Anti-Phishing / Anti-BEC Protocols, and Multi-Jurisdiction Statutory Defense.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Edge Defense: Cloudflare Pro WAF
              </span>
              <span>•</span>
              <span className="text-amber-300">Tier 1 IAM: YubiKey 5C NFC</span>
              <span>•</span>
              <span className="text-cyan-300">Email: DMARC p=reject</span>
              <span>•</span>
              <span className="text-emerald-300">Checkout: Level 1 PCI-DSS</span>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="shrink-0 p-5 rounded-xl bg-[#14291f]/90 border border-[#2b5540] backdrop-blur-md shadow-xl flex flex-col gap-3 min-w-[260px]">
            <div className="flex items-center justify-between border-b border-[#234534] pb-2">
              <span className="text-xs text-slate-400 font-mono uppercase">Year 1 Sec Budget</span>
              <button
                onClick={() => setCurrencyMode(prev => prev === 'GBP' ? 'BDT' : 'GBP')}
                className="text-[11px] px-2 py-0.5 rounded bg-[#1e3c2c] text-[#C8A96A] hover:bg-[#254d37] font-mono transition-colors"
              >
                Switch: {currencyMode === 'GBP' ? '৳ BDT' : '£ GBP'}
              </button>
            </div>
            <div>
              <div className="text-2xl font-black text-[#C8A96A] font-mono">
                {currencyMode === 'GBP' ? '£1,280' : '৳198,400'}
              </div>
              <p className="text-[11px] text-slate-400">
                {currencyMode === 'GBP' ? '৳198,400 BDT equivalent' : '£1,280 GBP @ ৳155/£'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#234534] flex items-center justify-between text-xs">
              <span className="text-slate-400">Rapid Offboarding SLA:</span>
              <span className="font-bold text-amber-400 font-mono">60 Minutes</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-[#234534] pt-4">
          {[
            { id: 'KILL_SWITCH', label: '🚨 Emergency Kill-Switch Runbook', icon: AlertOctagon },
            { id: 'POLP_MATRIX', label: '🛡️ Principle of Least Privilege (PoLP)', icon: Lock },
            { id: 'WEBSITE_TRIO', label: '🌐 Managing 3 Websites (.com / .co.uk / .shop)', icon: Globe },
            { id: 'BUDGET_MATRIX', label: '💰 Year 1 Security Budget (£1,280 / ৳198.4k)', icon: DollarSign },
            { id: 'SUPPLY_CHAIN_HYGIENE', label: '📦 Supply Chain, AQL & Endpoint Hygiene', icon: Server },
            { id: 'ACKNOWLEDGMENT', label: '✍️ Employee & Contractor Sign-Off', icon: FileCheck2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SecurityTab)}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C8A96A] text-slate-950 font-bold shadow-lg shadow-[#C8A96A]/20 scale-102'
                    : 'bg-[#152a20] text-slate-300 hover:bg-[#1a3528] hover:text-white border border-[#234534]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== TAB 1: EMERGENCY KILL-SWITCH RUNBOOK ==================== */}
      {activeTab === 'KILL_SWITCH' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#234534] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    7. Incident Response Plan &amp; Emergency Kill-Switch Runbook
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Immediate 4-step containment protocol in the event of suspected Account Takeover (ATO),
                  credential leakage, fraudulent ad spends, or Business Email Compromise (BEC).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-mono">Incident Hotline:</span>
                <a
                  href="tel:+880241081191"
                  className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  +880 2410 811 91
                </a>
              </div>
            </div>

            {/* Runbook Flow Diagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="rounded-xl bg-[#14281f] border-2 border-red-500/40 p-5 space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-red-500/40">
                    Step 1 • T + 0 to 5 Min
                  </span>
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-base font-bold text-white">ISOLATE &amp; FREEZE</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Execute immediate technical kill-switches to arrest active ad burn, bank fund diversion, and unauthorized session persistence.
                </p>
                <div className="pt-2 border-t border-[#234534] space-y-2 text-xs">
                  <div className="p-2 rounded bg-red-950/40 border border-red-500/20 text-red-200">
                    • <strong>Ad Account Compromise</strong>: Freeze Meta &amp; TikTok campaigns via Master Portfolio.
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/20 text-amber-200">
                    • <strong>Financial Anomaly</strong>: Freeze Wise Virtual Cards via mobile app.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Credential Leak</strong>: Global Google Workspace session logout.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl bg-[#14281f] border-2 border-amber-500/40 p-5 space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/40">
                    Step 2 • T + 5 to 15 Min
                  </span>
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">NOTIFY COMMAND</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct verbal telephone escalation to Executive Leadership. Never rely on email or Slack during an ongoing ATO.
                </p>
                <div className="pt-2 border-t border-[#234534] space-y-2 text-xs">
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/20 text-amber-100">
                    • <strong>Dhaka Operations Lead</strong>:<br />
                    <span className="font-mono font-bold text-amber-300">+880 2410 811 91 / +8801819 273458</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>UK Desk</strong>: Direct phone call to Managing Director.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Log Event Ticket</strong>: Record timestamp, affected system, and breach vector.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl bg-[#14281f] border-2 border-cyan-500/40 p-5 space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/40">
                    Step 3 • T + 15 to 60 Min
                  </span>
                  <Key className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white">CONTAIN &amp; REMEDIATE</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sever compromised tokens, rotate team password master keys, and audit unauthorized session activity across both hubs.
                </p>
                <div className="pt-2 border-t border-[#234534] space-y-2 text-xs">
                  <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-100">
                    • <strong>OAuth API Revocation</strong>: Revoke active app tokens on Shopify &amp; Stripe UK.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Master Password Rotation</strong>: Rotate vault keys in 1Password / Bitwarden Teams.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Browser Purge</strong>: Terminate active sessions across all user seats globally.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl bg-[#14281f] border-2 border-emerald-500/40 p-5 space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                    Step 4 • T + 24 to 72 Hrs
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">REGULATORY AUDIT</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Statutory assessment under UK Data Protection Act 2018 / UK GDPR &amp; Bangladesh Cyber Security Act.
                </p>
                <div className="pt-2 border-t border-[#234534] space-y-2 text-xs">
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-200">
                    • <strong>UK ICO Notification</strong>: Mandatory notification to UK ICO within <strong>72 hours</strong> if customer PII breached.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Bangladesh Cyber Authority</strong>: Statutory filing under national guidelines.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-200">
                    • <strong>Post-Mortem Review</strong>: Formal board briefing &amp; root cause documentation.
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Kill Switch Trigger Simulation Dashboard */}
            <div className="mt-6 p-6 rounded-xl bg-[#12241b] border border-[#2b5540] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Interactive Emergency Kill-Switch Simulator (Live Safeguard Panel)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Test operational preparedness. Triggering isolates specific API bridges and sends emergency simulation telemetry.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setKillSwitchActions(prev => prev.map(a => ({ ...a, status: 'READY', timestamp: undefined })));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#183225] hover:bg-[#204231] text-xs font-mono text-slate-300 hover:text-white border border-[#2e5d45] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Simulator
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {killSwitchActions.map(action => {
                  const isTriggered = action.status === 'TRIGGERED';
                  return (
                    <div
                      key={action.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        isTriggered
                          ? 'bg-red-950/70 border-red-500 text-red-100 shadow-md shadow-red-950/50'
                          : 'bg-[#162e22] border-[#29523e] text-slate-200 hover:border-[#3b7558]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isTriggered ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="font-bold text-sm text-white">{action.name}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono">{action.target}</p>
                        {action.timestamp && (
                          <span className="text-[10px] text-red-300 font-mono block">
                            Executed at: {action.timestamp} (Simulated)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleTriggerKillSwitch(action.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all shrink-0 ${
                          isTriggered
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                            : 'bg-red-900/40 hover:bg-red-800/80 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {isTriggered ? '🚨 ISOLATED (Click to Restore)' : '⚡ TRIGGER KILL-SWITCH'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Incident Audit Logs */}
            <div className="p-5 rounded-xl bg-[#0c1913] border border-[#214232] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recent Edge Security Audits &amp; Threat Mitigations
                </span>
                <span className="text-[11px] font-mono text-emerald-400">0 Active Breaches Detected</span>
              </div>

              <div className="space-y-2">
                {incidentLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-[#14261d] border border-[#234232] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{log.id}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{log.time}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-slate-300">{log.event}</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 shrink-0">{log.system}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: PRINCIPLE OF LEAST PRIVILEGE (PoLP) MATRIX ==================== */}
      {activeTab === 'POLP_MATRIX' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#234534] pb-4">
              <span className="px-2.5 py-0.5 rounded bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider">
                Section 2.3 • Access Control &amp; RBAC Architecture
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                Principle of Least Privilege (PoLP) Governance Matrix
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                Strict partition of duties between Dhaka Operational Staff, UK Contractors / External Media Buyers,
                and Executive Board Ownership across all 6 operational platforms.
              </p>
            </div>

            {/* PoLP Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-[#2b5540] bg-[#12241b]">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#183225] border-b border-[#2b5540] text-slate-200 font-mono text-xs uppercase">
                    <th className="p-4">Platform / Portal</th>
                    <th className="p-4">Permitted Role for Dhaka HQ Staff</th>
                    <th className="p-4">Permitted Role for UK Contractors / Media Buyers</th>
                    <th className="p-4">Root / Owner Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#234534] text-slate-300">
                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        W
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Wise Business UK</div>
                        <span className="text-[11px] text-slate-400 font-mono">Cross-Border Banking Rails</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] font-semibold">
                        &quot;Read Only&quot;
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Accountant / View balances strictly for bank reconciliation
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-500/30 font-semibold">
                        No Access
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Unless designated as a statutory UK Director
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      Managing Director / Board
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                        S
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Stripe UK</div>
                        <span className="text-[11px] text-slate-400 font-mono">Merchant Payment Processing</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-cyan-300 border border-[#2d5942] font-semibold">
                        &quot;Support Specialist&quot; or &quot;Analyst&quot;
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        View transactions, trace dispute alerts, and initiate verified refunds
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold">
                        &quot;Developer&quot;
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        API integration restricted strictly to test keys
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      Managing Director / Board
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        🛒
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Shopify DTC</div>
                        <span className="text-[11px] text-slate-400 font-mono">arielmc.shop Storefront</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] font-semibold">
                        &quot;Staff Member&quot;
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Orders, Customer Service, Inventory editing
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] font-semibold">
                        &quot;Staff Member&quot;
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Marketing, Blog, Theme Design
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      Managing Director
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                        a
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Amazon Seller Central</div>
                        <span className="text-[11px] text-slate-400 font-mono">Amazon UK &amp; EU Marketplace</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
                        Secondary User:
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Inventory &amp; Fulfilment Management
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
                        Secondary User:
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Advertising &amp; Campaign Optimization
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      Primary Admin
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                        M
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Meta Business Portfolio</div>
                        <span className="text-[11px] text-slate-400 font-mono">Facebook &amp; Instagram Ads</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-blue-300 border border-[#2d5942] font-semibold">
                        Employee Access:
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Page content editor, Community manager
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-semibold">
                        Partner / Agency Access:
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Ad Account Advertiser (Pre-set daily budget ceilings &le; £18 CAC)
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      ArielMC Corporate Super-Admin
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        🇧🇩
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Bangladesh AD Bank (ERQ)</div>
                        <span className="text-[11px] text-slate-400 font-mono">Forex &amp; BB FE Circular 48/31</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] font-semibold">
                        Dhaka Trade/Finance Desk:
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        View/Prepare EXP filings &amp; reconciliation vouchers
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-500/30 font-semibold">
                        No Access
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                        Strictly sovereign domestic regulatory interface
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C8A96A]">
                      Authorised Director Signatories
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Core IAM Mandates Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#14281f] border border-[#29523e] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Key className="w-4 h-4" />
                  Tier 1 FIDO2 Mandate
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Wise, Stripe, AD Bank portals, Cloudflare DNS, and Google Workspace Super-Admin require
                  <strong> YubiKey 5C NFC hardware keys</strong> or Apple Touch ID biometrics.
                  SMS 2FA and email OTP are strictly banned.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#29523e] space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  Password Vault Policy
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All staff and contractors must use <strong>1Password / Bitwarden Teams</strong>.
                  Master passwords minimum 16 characters. Browser autofill (Chrome, Safari) and sharing passwords
                  via Slack/WhatsApp is strictly prohibited.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#29523e] space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  3-Minute Device Lockout
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All workstations (MacBook Pro M1, iPhone, Windows PCs) must enforce automatic screen locks after
                  <strong> 3 minutes of inactivity</strong>, secured by biometric Touch ID / Face ID or an alphanumeric passcode.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MANAGING 3 WEBSITES (.COM / .CO.UK / .SHOP) ==================== */}
      {activeTab === 'WEBSITE_TRIO' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#234534] pb-4">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                Multi-Domain Architecture &amp; Anti-Tampering
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                Managing 3 Website Cyber Security Precautions
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                Strict separation of direct-to-consumer store from corporate wholesale pipelines to prevent
                malicious script leakage, search penalties, and cross-border regulatory fines.
              </p>
            </div>

            {/* 3 Domains Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Domain 1: arielmc.shop */}
              <div className="rounded-xl bg-[#14281f] border-2 border-emerald-500/50 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                    DTC Storefront
                  </span>
                  <span className="text-xs font-mono text-[#C8A96A]">Flagship E-Commerce</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-mono">
                    arielmc.shop
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Direct-to-consumer checkout &amp; retail conversions
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[#234534]">
                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-emerald-300 block">🛡️ Card-Testing &amp; Bot Defense:</span>
                    <p>
                      WAF rate limiting deployed to block automated card-testing bots. Prevents Stripe UK &amp; Shopify Payments merchant account suspension.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-cyan-300 block">🔒 Script Hygiene &amp; CSP:</span>
                    <p>
                      Strict Content Security Policy (CSP) blocking Magecart script injection. Only certified <em>&quot;Built for Shopify&quot;</em> apps allowed.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-amber-300 block">💳 Zero Card-Data Storage:</span>
                    <p>
                      No card numbers, bank routing codes, or CVVs ever stored on local servers. 100% tokenized on Stripe UK &amp; Shopify Payments (PCI-DSS Level 1).
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-purple-300 block">🍪 Consent Management CMP:</span>
                    <p>
                      Certified CMP supporting Google Consent Mode v2. Meta, TikTok, and Google tracking pixels blocked until explicit opt-in.
                    </p>
                  </div>
                </div>
              </div>

              {/* Domain 2: arielmc.co.uk */}
              <div className="rounded-xl bg-[#14281f] border-2 border-blue-500/50 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
                    UK Corporate / B2B
                  </span>
                  <span className="text-xs font-mono text-[#C8A96A]">London Subsidiary</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-mono">
                    arielmc.co.uk
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    UK wholesale, institutional buyers &amp; B2B corporate gifting
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[#234534]">
                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-blue-300 block">🇬🇧 UK Statutory Footer Disclosures:</span>
                    <p>
                      Mandatory footer displaying Ariel Marketing &amp; Communications Limited, Companies House #, Shelton Street London address, and GB VAT number.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-emerald-300 block">🛡️ Invoicing Protection:</span>
                    <p>
                      2048-bit DKIM keys and strict DMARC rejection policy (<code>p=reject</code>) to eliminate invoice spoofing to UK enterprise buyers.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-amber-300 block">🔀 Canonical &amp; Hreflang:</span>
                    <p>
                      Cross-domain <code>rel=&quot;alternate&quot; hreflang</code> tags to prevent Google duplicate content penalties against <code>.shop</code>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-cyan-300 block">🎯 Clean Funnel Separation:</span>
                    <p>
                      Unobtrusive retail header banner routing retail shoppers to <code>.shop</code>, reserving <code>.co.uk</code> for B2B RFQs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Domain 3: arielmc.com */}
              <div className="rounded-xl bg-[#14281f] border-2 border-amber-500/50 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                    Global HQ / Bangladesh
                  </span>
                  <span className="text-xs font-mono text-[#C8A96A]">Export Manufacturing</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-mono">
                    arielmc.com
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Global sourcing hub, ESG audit disclosures &amp; factory profiles
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[#234534]">
                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-amber-300 block">🇧🇩 Ministry of Commerce Compliance:</span>
                    <p>
                      Displays Dhaka HQ address (House 30, Road 07, Block C, Niketon, Gulshan), 13-digit BIN, and Digital Business ID (DBID).
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-emerald-300 block">📬 Marketing Subdomain Isolation:</span>
                    <p>
                      Never send bulk marketing from <code>@arielmc.com</code>. Confine promotional email flows to <code>@mail.arielmc.shop</code>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-cyan-300 block">🔐 5-Year Registrar Lock:</span>
                    <p>
                      Transfer Lock and Registry Lock with 5-year auto-renewals to protect corporate identity from expiration hijacking.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-[#183326] border border-[#2d5942] space-y-1">
                    <span className="font-bold text-purple-300 block">☁️ Cloudflare DNSSEC:</span>
                    <p>
                      Permanently enabled DNSSEC across all 3 domains to prevent DNS cache poisoning and malicious redirect hijacking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DNS Technical Configuration Snippet */}
            <div className="p-5 rounded-xl bg-[#0c1812] border border-[#244835] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C8A96A]" />
                  Statutory DNS Anti-Spoofing Records (Google Workspace + Cloudflare)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      'v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:dmarc-reports@arielmc.com;',
                      'dmarc'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-[#173022] hover:bg-[#1e3e2c] text-xs font-mono text-[#C8A96A] border border-[#2a553c] flex items-center gap-1.5 transition-colors"
                >
                  {copiedText === 'dmarc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'dmarc' ? 'Copied DMARC' : 'Copy DMARC Record'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#14261c] border border-[#234533] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">SPF Record (Strict Senders)</span>
                  <code className="text-emerald-300 text-[11px] block break-all">
                    v=spf1 include:_spf.google.com ~all
                  </code>
                </div>

                <div className="p-3 rounded-lg bg-[#14261c] border border-[#234533] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">DKIM Signature (2048-Bit)</span>
                  <code className="text-cyan-300 text-[11px] block break-all">
                    google._domainkey.arielmc.com (2048-bit RSA)
                  </code>
                </div>

                <div className="p-3 rounded-lg bg-[#14261c] border border-[#234533] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">DMARC Policy (Rejection)</span>
                  <code className="text-amber-300 text-[11px] block break-all">
                    v=DMARC1; p=reject; sp=reject; adkim=s;
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: YEAR 1 SECURITY IMPLEMENTATION BUDGET ==================== */}
      {activeTab === 'BUDGET_MATRIX' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider">
                  Financial Allocations • Board Approved
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                  Security Implementation Budget (Year 1)
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Comprehensive perimeter and access defense matrix across Dhaka and London hubs.
                </p>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#14281f] border border-[#274f3b] shrink-0">
                <button
                  onClick={() => setCurrencyMode('GBP')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    currencyMode === 'GBP'
                      ? 'bg-[#C8A96A] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  £ GBP (Base)
                </button>
                <button
                  onClick={() => setCurrencyMode('BDT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    currencyMode === 'BDT'
                      ? 'bg-[#C8A96A] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ৳ BDT (@ ৳155/£)
                </button>
              </div>
            </div>

            {/* Budget Table */}
            <div className="overflow-x-auto rounded-xl border border-[#2b5540] bg-[#12241b]">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#183225] border-b border-[#2b5540] text-slate-200 font-mono text-xs uppercase">
                    <th className="p-4">Security Component</th>
                    <th className="p-4">Tool / Implementation Provider</th>
                    <th className="p-4 text-right">Annual Cost (£ GBP)</th>
                    <th className="p-4 text-right">Annual Cost (BDT @ ৳155/£)</th>
                    <th className="p-4">Strategic Purpose</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#234534] text-slate-300">
                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      Hardware 2FA Keys
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      YubiKey 5C NFC (3 units for Key Admins)
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      £150
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      ৳23,250
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      Phishing-resistant logins for Wise, Stripe &amp; Meta
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setBudgetStatus(prev => ({ ...prev, yubikey: !prev.yubikey }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors ${
                          budgetStatus.yubikey
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {budgetStatus.yubikey ? '✓ Enforced' : 'Pending'}
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      Edge WAF &amp; DDoS
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      Cloudflare Pro Plan (Storefront domains)
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      £240
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      ৳37,200
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      Bot mitigation, card-testing rate limiting, SSL/WAF
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setBudgetStatus(prev => ({ ...prev, cloudflare: !prev.cloudflare }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors ${
                          budgetStatus.cloudflare
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {budgetStatus.cloudflare ? '✓ Active' : 'Pending'}
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      Team Password Vault
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      Bitwarden Teams / 1Password (5 seats)
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      £180
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      ৳27,900
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      Zero-knowledge credential isolation across teams
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setBudgetStatus(prev => ({ ...prev, vault: !prev.vault }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors ${
                          budgetStatus.vault
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {budgetStatus.vault ? '✓ Active' : 'Pending'}
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      Secure Business Email
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      Google Workspace Business Starter + 2SV
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      £360
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      ৳55,800
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      Phishing defense, SPF/DKIM/DMARC routing
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setBudgetStatus(prev => ({ ...prev, google: !prev.google }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors ${
                          budgetStatus.google
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {budgetStatus.google ? '✓ Active' : 'Pending'}
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#152c20]/60 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      Vulnerability Audit
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      Third-party PCI-DSS / Web Security Scan
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      £350
                    </td>
                    <td className="p-4 font-mono font-bold text-right text-emerald-400">
                      ৳54,250
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      Pre-launch store and endpoint penetration audit
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setBudgetStatus(prev => ({ ...prev, audit: !prev.audit }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-colors ${
                          budgetStatus.audit
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {budgetStatus.audit ? '✓ Completed' : 'Scheduled Q4'}
                      </button>
                    </td>
                  </tr>

                  {/* Total Row */}
                  <tr className="bg-[#162e22] font-black text-white border-t-2 border-[#C8A96A]/60">
                    <td colSpan={2} className="p-4 font-mono uppercase text-sm">
                      Annual Total Investment
                    </td>
                    <td className="p-4 font-mono text-right text-base text-[#C8A96A]">
                      £1,280
                    </td>
                    <td className="p-4 font-mono text-right text-base text-[#C8A96A]">
                      ৳198,400
                    </td>
                    <td colSpan={2} className="p-4 font-mono text-xs text-emerald-300">
                      Comprehensive perimeter &amp; access defense (৳155/£ anchor)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Budget Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-2">
                <span className="text-xs font-mono uppercase text-[#C8A96A] font-bold block">
                  ROI of Proactive Security Investment
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  An annual investment of <strong>£1,280 (৳198,400)</strong> protects against typical breach losses exceeding
                  <strong> £35,000–£75,000</strong> (unauthorized Meta ad spend burn, invoice wire redirection, and UK ICO GDPR penalties).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
                  Procurement &amp; Invoicing Allocation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Software tools and Cloudflare edge services are paid via dedicated <strong>Wise UK Virtual Commercial Cards</strong>,
                  reconciled under UK corporate deductible operating expenses and Bangladesh Bank ERQ regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: PHYSICAL SUPPLY CHAIN, AQL & ENDPOINT HYGIENE ==================== */}
      {activeTab === 'SUPPLY_CHAIN_HYGIENE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#234534] pb-4">
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                Sections 5.1, 6.2 &amp; Supply Chain Integrity
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                Physical Supply Chain, Anti-BEC &amp; Dhaka Endpoint Hygiene
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                Extending cybersecurity discipline into physical export containers, factory inspections,
                and office device hardening.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Anti-BEC Out-of-Band Callback */}
              <div className="p-5 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <PhoneCall className="w-4 h-4" />
                  Anti-BEC Out-of-Band Callback Mandate
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Any request from a supplier (e.g., Savar leather tanneries, Narayanganj textile mills, Shenzhen tech factories)
                  or B2B corporate gifting client to alter bank settlement details, routing codes, or Wise payment emails
                  requires <strong>mandatory dual-channel verification</strong>.
                </p>
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                  ⚠️ <strong>Ironclad Rule</strong>: The employee processing the payment must contact the verified executive contact
                  via a pre-established telephone number or face-to-face video call prior to releasing funds.
                  <strong> Email confirmation alone is strictly prohibited.</strong>
                </div>
              </div>

              {/* Card 2: Physical Supply Chain & Maritime Integrity */}
              <div className="p-5 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  Pre-Shipment ISO 2859-1 (AQL 2.5) &amp; Maritime Desiccants
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No ocean container leaves Chittagong until a standardized <strong>ISO 2859-1 (AQL 2.5)</strong> inspection sign-off
                  occurs at Savar and Narayanganj facilities. Verifying stitching, zipper pull strength, and EVA foam thickness
                  before export prevents costly UK returns that cannot be re-exported.
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                  🌿 <strong>Moisture Safeguards</strong>: Transiting the Bay of Bengal &amp; Suez Canal exposes full-grain leather
                  and jute to extreme humidity. Enforce high-absorption container desiccant poles (calcium chloride based) inside
                  containers alongside <strong>50g clay packets</strong> in each laptop compartment to stop leather bloom.
                </div>
              </div>

              {/* Card 3: Dhaka Office Endpoint & Shadow-IT Hygiene */}
              <div className="p-5 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  USB Mass-Storage Blocking &amp; Remote Software Ban
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Disable unauthorized USB mass-storage read/write access on all office Mac and Windows workstations via Apple MDM
                  (Jamf Now) or Microsoft Intune to eliminate offline data theft or air-gapped malware vectors.
                </p>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                  🚫 <strong>Remote Desktop Ban</strong>: Blacklist unsanctioned screen-sharing and remote administration tools
                  (<em>AnyDesk, TeamViewer, UltraViewer</em>) across office routers; mandate secure Zoom/Google Meet sessions for remote UK coordination.
                </div>
              </div>

              {/* Card 4: UKIPO Trademark & Amazon Project Zero */}
              <div className="p-5 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-3">
                <div className="flex items-center gap-2 text-[#C8A96A] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Brand Protection &amp; Amazon Hijacking Mitigation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  File immediate Class 18 (leather goods, bags, luggage) trademark with the UK Intellectual Property Office (UKIPO)
                  for the &quot;ArielMC&quot; brand mark. Register immediately with Amazon Brand Registry upon application filing.
                </p>
                <div className="p-3 rounded-lg bg-[#213f30] border border-[#C8A96A]/30 text-xs text-slate-200">
                  ⚡ <strong>Automated ASIN Defense</strong>: Unlocks Amazon Project Zero, automated counterfeit takedowns,
                  and Buy Box hijacking defense. Deploy SellerApp / Helium 10 to alert the Dhaka team to unauthorized listing tampering.
                </div>
              </div>
            </div>

            {/* Clean Desk Policy at Niketon Office */}
            <div className="p-4 rounded-xl bg-[#0c1812] border border-[#244835] flex items-center gap-3 text-xs text-slate-300">
              <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Physical Clean Desk Policy (Dhaka Operational Office)</strong>: At House 30, Road 07, Block C, Niketon, Gulshan,
                physical commercial documents—including RJSC files, bank statements, VAT challans, and proforma invoices—must be locked
                in designated steel filing cabinets when unattended.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: EMPLOYEE & CONTRACTOR ACKNOWLEDGMENT ==================== */}
      {activeTab === 'ACKNOWLEDGMENT' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-[#0f1f18] border border-[#234534] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                  Section 9 • Legal Compliance
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                  Employee &amp; Contractor Acknowledgment Form
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Standardized compliance sign-off for SOP-SEC-2026-V1. Mandatory for all Dhaka staff, London personnel, and external agencies.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-colors self-start sm:self-auto shadow-md"
              >
                <Printer className="w-4 h-4" />
                Print A4 Compliance Form
              </button>
            </div>

            {/* A4 Form Paper Simulator */}
            <div className="max-w-2xl mx-auto rounded-xl bg-white text-slate-900 p-8 shadow-2xl border-4 border-[#C8A96A] space-y-6 font-sans">
              <div className="text-center border-b-2 border-slate-300 pb-4 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                  Ariel Marketing &amp; Communications Limited
                </span>
                <h3 className="text-lg font-black font-serif text-[#12261d]">
                  Standard Operating Procedure Acknowledgment (SOP-SEC-2026-V1)
                </h3>
                <p className="text-[11px] text-slate-600 font-serif italic">
                  Information Security, Access Control &amp; Cross-Border Platform Governance
                </p>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  I hereby acknowledge that I have received, read, understood, and agree to abide by the
                  <strong> Ariel Marketing &amp; Communications Limited Standard Operating Procedure on Information Security,
                  Access Control &amp; Platform Governance (SOP-SEC-2026-V1)</strong>.
                </p>
                <p>
                  I understand that violations—including saving credentials in browsers, sharing plaintext passwords,
                  modifying wire instructions without phone/video callback verification, or failing to report compromised accounts—compromise
                  the cross-border standing of the company and will result in disciplinary action up to termination of employment
                  or contract alongside potential statutory litigation.
                </p>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 pt-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Full Legal Name:
                  </label>
                  <input
                    type="text"
                    value={ackForm.legalName}
                    onChange={e => setAckForm({ ...ackForm, legalName: e.target.value })}
                    placeholder="e.g. Syed Akramul Hassan"
                    className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Position / Agency Name:
                    </label>
                    <input
                      type="text"
                      value={ackForm.roleOrAgency}
                      onChange={e => setAckForm({ ...ackForm, roleOrAgency: e.target.value })}
                      placeholder="e.g. Managing Director / Media Buyer"
                      className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Operating Location:
                    </label>
                    <select
                      value={ackForm.location}
                      onChange={e => setAckForm({ ...ackForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#C8A96A]"
                    >
                      <option value="Dhaka, Bangladesh">Dhaka HQ, Bangladesh</option>
                      <option value="London, United Kingdom">London Subsidiary, UK</option>
                      <option value="Remote / International">Remote / International Contractor</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ack-agree"
                    checked={ackForm.agreed}
                    onChange={e => setAckForm({ ...ackForm, agreed: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="ack-agree" className="text-[11px] text-slate-700 font-medium">
                    I solemnly affirm that I have enrolled in 2FA/YubiKey and will follow all anti-phishing procedures.
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Execution Date:</span>
                    <span className="font-mono text-xs text-slate-800">{ackForm.date}</span>
                  </div>

                  <div>
                    {ackForm.signed ? (
                      <div className="px-4 py-2 rounded bg-emerald-100 border border-emerald-400 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Digitally Signed &amp; Timestamped
                      </div>
                    ) : (
                      <button
                        disabled={!ackForm.agreed || !ackForm.legalName}
                        onClick={() => setAckForm({ ...ackForm, signed: true })}
                        className={`px-4 py-2 rounded text-xs font-bold font-mono transition-all ${
                          ackForm.agreed && ackForm.legalName
                            ? 'bg-[#12261d] text-[#C8A96A] hover:bg-[#1a382b] shadow-md cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Sign &amp; Acknowledge Document
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
