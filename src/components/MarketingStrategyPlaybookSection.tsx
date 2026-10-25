'use client';

import React, { useState } from 'react';
import { ArielMC } from '@/lib/brand';
import { ThemeProfile } from '@/components/Sidebar';
import {
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Target,
  DollarSign,
  Send,
  Mail,
  MessageSquare,
  Package,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  Zap
} from 'lucide-react';

interface MarketingStrategyPlaybookSectionProps {
  theme?: ThemeProfile;
}

type PlaybookTab = 'POLICY' | 'BUDGET' | 'SPRINTS' | 'ABM_SEQUENCE' | 'KLAVIYO_FLOWS' | 'HYBRID_FLYWHEEL';

export const MarketingStrategyPlaybookSection: React.FC<MarketingStrategyPlaybookSectionProps> = ({
  theme = 'crm-green',
}) => {
  const [activeTab, setActiveTab] = useState<PlaybookTab>('ABM_SEQUENCE');
  const [budgetTier, setBudgetTier] = useState<'CONSERVATIVE' | 'TARGET' | 'AGGRESSIVE'>('TARGET');
  const [sprintTrackFilter, setSprintTrackFilter] = useState<'ALL' | 'B2B' | 'B2C' | 'SHARED'>('ALL');
  const [copiedTouchIndex, setCopiedTouchIndex] = useState<number | null>(null);
  const [activeTouchIndex, setActiveTouchIndex] = useState<number>(0);
  const [activeFlowIndex, setActiveFlowIndex] = useState<number>(0);

  const isRoyal = theme === 'royal-blue';
  const cardBg = 'bg-white border-[#DDE3DD] shadow-sm text-[#1A1A1A]';

  // ABM Touches Data
  const abmTouches = [
    {
      step: 'Touch 1 (Day 1)',
      channel: 'Plain-Text Email #1',
      badge: 'The Bottom-Up Trojan Horse Signal',
      subject: '[Company Name] employees using ArielMC',
      body: `Hi {{First_Name}},

Noticed two signals at {{Company_Name}} this month: (1) You're scaling out {{Specific_Initiative}}, and (2) {{Number}} members of the {{Company_Name}} team have already purchased ArielMC individually through our consumer storefront over the last 90 days.

Usually, when organic adoption happens from the ground up inside an organization like yours, {{Department_Leader_Title}}s look at consolidating usage—both to lock in enterprise volume economics (28–35% below retail) and standardize {{Core_B2B_Value_Prop}}.

I put together a 1-page breakdown showing how {{Similar_Peer_Client}} structured their rollout across {{Headcount}} without adding operational overhead.

Mind if I send that over, or should I loop in {{Colleague_Name_in_Ops}}?`,
      timing: 'Day 1 (Morning)',
      icon: Mail
    },
    {
      step: 'Touch 2 (Day 2)',
      channel: 'LinkedIn Connection Request',
      badge: 'Peer Verification',
      subject: 'Connection Request',
      body: `"Hi {{First_Name}} — saw {{Company_Name}}'s push into {{Initiative}} and noticed several folks on your team are already using ArielMC on the D2C side. Would love to connect and follow your work here."`,
      timing: 'Day 2 (+24 Hours)',
      icon: Users
    },
    {
      step: 'Touch 3 (Day 4)',
      channel: 'Direct Mail Trigger',
      badge: 'Dimensional "Trojan Box"',
      subject: 'Physical Package Dispatched via FedEx 2-Day Express',
      body: `Dimensional "Trojan Box" dispatched via FedEx 2-Day Express to HQ or verified residential executive address.
Includes:
• 1 Flagship Production Sample Unit (Artisan Leather / Fine Ceramic / Organic Linen)
• Printed 3-Point Workflow Benchmark Teardown
• Custom QR code linking to a bespoke 90-second Loom video recorded specifically for {{Company_Name}}.`,
      timing: 'Day 4 (FedEx Tracking Active)',
      icon: Package
    },
    {
      step: 'Touch 4 (Day 6)',
      channel: 'Email #2 + LinkedIn Voice Note',
      badge: 'Triggered Instantly on FedEx "Delivered" Webhook',
      subject: 'Re: [Company Name] employees using ArielMC',
      body: `{{First_Name}} —

FedEx just let me know a matte black box landed at your reception desk.

Inside is one of our flagship units for you to test firsthand, along with a printed 3-point audit we ran on {{Company_Name}}'s current {{Workflow_Area}}.

If you aren't at your desk today, I recorded a 90-second digital walk-through of the audit right here:
👉 arielmc.com/for-{{company_name}}

Curious if point #2 on {{Specific_Bottleneck}} matches what you're seeing internally heading into next quarter?`,
      timing: 'Day 6 (Upon FedEx Delivery Confirmation)',
      icon: Zap
    },
    {
      step: 'Touch 5 (Day 8)',
      channel: 'Phone Call & Voicemail',
      badge: '22-Sec Frictionless Voicemail',
      subject: 'Outbound Dial',
      body: `"Hey {{First_Name}}, it's {{Sender_Name}} at ArielMC. No need to call me back right now—just making sure the black briefing box we sent didn't get hijacked by your mailroom. I sent a 90-second link to your inbox titled '{{Company_Name}} employees using ArielMC.' Take a look when you have two minutes."`,
      timing: 'Day 8 (Afternoon)',
      icon: Phone
    },
    {
      step: 'Touch 6 (Day 11)',
      channel: 'LinkedIn DM Value Drop',
      badge: 'Ungated Benchmark Data',
      subject: 'LinkedIn Direct Message',
      body: `Shares direct ungated PDF link to Section 3 of ArielMC's Industry Benchmark Report showing how industry peers cut operational workflow costs/time by 31% in under 60 days without capital risk.`,
      timing: 'Day 11',
      icon: MessageSquare
    },
    {
      step: 'Touch 7 (Day 15)',
      channel: 'Email #3 (Multi-Threading)',
      badge: 'The "Triangle" Play to Operational Director',
      subject: '{{VP_First_Name}} / {{Company_Name}} rollout benchmarks',
      body: `Notes that a physical evaluation kit was sent to {{VP_First_Name}}, highlights the 11-day zero-downtime implementation spec, and proposes a 15-minute math review before quarterly roadmap lock.`,
      timing: 'Day 15',
      icon: Mail
    },
    {
      step: 'Touch 8 (Day 21)',
      channel: 'Email #4 (Executive Breakup)',
      badge: 'From ArielMC CMO / Managing Director',
      subject: 'Quick check-in from ArielMC\'s CMO',
      body: `Asks whether standardizing the sourcing and procurement workflow is off the radar for two quarters (#1) or simply buried under calendar load (#2), offering to close the file cleanly or join a 15-minute executive briefing personally.`,
      timing: 'Day 21 (Final Touch)',
      icon: Send
    }
  ];

  // Klaviyo Lifecycle Flows
  const klaviyoFlows = [
    {
      id: 'flow-1',
      name: '1. Welcome Series',
      trigger: 'Pop-Up Opt-In | Exit: Placed Order ≥ 1',
      steps: [
        { timing: 'Immediate', type: 'Email 1', hook: 'Welcome to ArielMC (Your 10% code is inside)', angle: 'Dynamic code WELCOME-XXXX + 3-icon visual comparison vs legacy options.' },
        { timing: '+15 Mins', type: 'SMS 1', hook: 'Instant tap-to-apply checkout shortlink with 10% code.' },
        { timing: '+24 Hours', type: 'Email 2', hook: 'Why 500+ companies & 10,000+ customers switched', angle: 'Hybrid Authority: Built for demanding enterprise environments, refined for personal use.' },
        { timing: '+72 Hours', type: 'Email 3', hook: '"I was skeptical until Day 3..."', angle: '3 verified customer video stories + 30-Day Guarantee.' },
        { timing: '+5 Days', type: 'Email 4', hook: 'Quick question from our founder (+ 10% expires)', angle: '60-sec "Find Your Fit" quiz + midnight expiration warning.' },
        { timing: '+5d 6h', type: 'SMS 2', hook: 'Final 6-Hour Expiry SMS reminder that welcome code resets.' }
      ]
    },
    {
      id: 'flow-2',
      name: '2. Abandoned Checkout',
      trigger: 'Started Checkout | Split: Cart ≥ $125 vs < $125',
      steps: [
        { timing: '+45 Mins', type: 'SMS 1', hook: 'Did something go wrong at checkout?', angle: 'Zero-discount customer service check + 1-click session rebuild link.' },
        { timing: '+4 Hours', type: 'Email 1', hook: 'Your ArielMC selection is reserved (for now)', angle: 'Dynamic cart items + Free Shipping bar + 30-Day Risk-Free Trial badge.' },
        { timing: '+24 Hours', type: 'Email 2', hook: 'Still thinking it over, {{First_Name}}?', angle: 'Side-by-side comparison chart + category-matched customer reviews.' },
        { timing: '+48 Hours', type: 'Email 3A/B', hook: 'Split Logic: ≥$125 receives $15 off credit; <$125 receives Shop Pay 4-pay breakdown.', angle: 'Preserves margins while closing high-value carts.' }
      ]
    },
    {
      id: 'flow-3',
      name: '3. Browse Abandon',
      trigger: 'Viewed Item ≥ 2x',
      steps: [
        { timing: '+2 Hours', type: 'Email 1', hook: 'You have great taste, {{First_Name}}', angle: 'Hero render of viewed SKU + 3 signature benefits + algorithmic cross-sell.' },
        { timing: '+26 Hours', type: 'Email 2', hook: 'Got questions about the {{Item_Name}}?', angle: 'Top 4 pre-purchase FAQs + live specialist chat link (zero discount to protect margins).' }
      ]
    },
    {
      id: 'flow-4',
      name: '4. Post-Purchase & B2B2C Bridge',
      trigger: 'Order Fulfilled',
      steps: [
        { timing: '+1 Hr Post-Order', type: 'Email 1', hook: 'You\'re in! Here\'s what happens next', angle: 'Founder thank-you + 60-sec Quick-Start Preview video.' },
        { timing: '+2d Post-Delivery', type: 'Email 2', hook: 'Unboxed yet? 3 pro tips for your ArielMC', angle: 'Onboarding tips driving 48-hour value realization (cuts return tickets by 35%).' },
        { timing: '+10d Post-Delivery', type: 'Email 3 (B2B Bridge)', hook: 'Want ArielMC for your whole team at work?', angle: 'Offers $50 store credit if their Ops Lead books a B2B demo ($250 gift card on close).' },
        { timing: '+14d Post-Delivery', type: 'Email 4', hook: 'How are we doing? (Get $10 credit)', angle: 'Yotpo review block: $5 credit for text, $10 credit for photo/video UGC.' }
      ]
    },
    {
      id: 'flow-5',
      name: '5. Replenishment & Cross-Sell',
      trigger: 'Time Elapsed',
      steps: [
        { timing: '+35 Days', type: 'Email 1', hook: 'Running low? Restock in 2 clicks', angle: '1-click reorder or upgrade to Subscribe & Save (15% off + Free Shipping).' },
        { timing: '+45 Days', type: 'Email 2', hook: 'Complete your setup: #1 pairing for {{Item}}', angle: 'Highest co-purchased companion SKU with 10% existing-owner bundle price.' }
      ]
    },
    {
      id: 'flow-6',
      name: '6. Win-Back',
      trigger: '60 Days Lapsed',
      steps: [
        { timing: 'Day 60', type: 'Email 1', hook: 'Look what we built while you were gone...', angle: 'No-discount innovation update showcasing new releases and upgrades.' },
        { timing: 'Day 75', type: 'Email 2', hook: 'A $20 credit on your account (expires in 72h)', angle: 'High-perceived-value "$20 off $80+" credit (outperforms % discounts 2x).' },
        { timing: 'Day 90', type: 'Email 3', hook: 'Should we pause your ArielMC updates?', angle: 'Deliverability sunset check + 90-day snooze option.' }
      ]
    },
    {
      id: 'flow-7',
      name: '7. VIP Black Tier',
      trigger: 'LTV ≥ $300 or Orders ≥ 3',
      steps: [
        { timing: 'Immediate', type: 'Email 1', hook: 'Welcome to ArielMC Black Tier (Top 5%)', angle: 'Unlocks permanent Free Express Shipping, priority CX routing & beta drop access.' },
        { timing: '+3 Days', type: 'SMS 1', hook: 'Direct Concierge V-Card SMS', angle: 'Provides dedicated VIP text concierge line + 24-hr early access to limited releases.' },
        { timing: '+14 Days', type: 'Email 2', hook: 'Private invite: Give $20, Get $20 + Council', angle: 'Upgrades referral loop to $20/$20 and invites to quarterly Product Advisory Council.' }
      ]
    }
  ];

  // 90-Day Sprint Tracker Weeks
  const sprintWeeks = [
    { week: 'Wk 1 (Sprint 1)', b2b: 'Finalize ICP firmographics; audit sales collateral gaps.', b2c: 'Full UX/CRO teardown of Shopify Plus; finalize brief for first 30 UGC/studio ads.', shared: 'Configure GDPR/CCPA CMP; partition B2B/B2C schemas in HubSpot & Klaviyo.', dri: 'CMO, DEV/OPS', phase: 'Sprint 1' },
    { week: 'Wk 2 (Sprint 1)', b2b: 'Scrape & enrich Tier-1 (50) and Tier-2 (250) ABM accounts in Clay/Apollo (3–4 contacts/account).', b2c: 'Ship product to 15 UGC creators; wireframe 3 modular advertorial/listicle landing pages.', shared: 'Install Meta CAPI, TikTok Events API & LinkedIn Tag via server-side GTM.', dri: 'B2B, B2C, DEV/OPS', phase: 'Sprint 1' },
    { week: 'Wk 3 (Sprint 1)', b2b: 'Draft Sales Enablement Kit (Pitch Deck, 1-Pager, Interactive B2B ROI Calculator).', b2c: 'Write & build Klaviyo Flows 1–4 (Welcome, Abandoned Checkout, Browse, Post-Purchase).', shared: 'Build corporate-domain detection webhook on Shopify checkout to route to HubSpot.', dri: 'B2B, B2C', phase: 'Sprint 1' },
    { week: 'Wk 4 (Sprint 1)', b2b: 'Order 50 custom Tier-1 direct mail boxes (Sendoso) + bespoke inserts; write ABM copy.', b2c: 'Build & QA 3 dedicated paid-social landing pages; configure in-cart upsell & shipping bar.', shared: 'Build Executive Board Scorecard in Triple Whale (B2C) and HubSpot (B2B).', dri: 'ALL', phase: 'Sprint 1' },
    { week: 'Wk 5 (Sprint 2)', b2b: 'Configure HubSpot Lead Scoring (Fit + Intent); ghostwrite first 12 CEO/CMO LinkedIn posts.', b2c: 'Build Klaviyo Flows 5–7 (Replenishment, Win-Back, VIP); approve 30 ad variations (3:2:2).', shared: 'End-to-end QA of lead forms, UTM persistence, and HDYHAU free-text fields.', dri: 'B2B, B2C, DEV/OPS', phase: 'Sprint 2' },
    { week: 'Wk 6 (Sprint 2)', b2b: 'Launch LinkedIn ABM Air-Cover Ads to Tier 1–2 lists; outline Benchmark Report #1.', b2c: 'Soft-launch Meta CBO testing & TikTok SPC at 50% baseline budget to season pixels.', shared: 'Verify first-party data sync between Shopify orders, Klaviyo, and ad exclusions.', dri: 'MEDIA, B2B, B2C', phase: 'Sprint 2' },
    { week: 'Wk 7 (Sprint 2)', b2b: 'Enroll Cohort 1 (First 25 Tier-1 Accounts) in 21-day ABM Direct Mail sequence; launch Search.', b2c: 'Ship first 50 Creator Seeding PR boxes; launch Google Shopping (PMax) & Brand Search.', shared: 'Run first bi-weekly creative & keyword waste audit (pause zero-engagement ads).', dri: 'B2B, B2C, MEDIA', phase: 'Sprint 2' },
    { week: 'Wk 8 (Sprint 2)', b2b: 'Host Live Teardown Workshop (Webinar #1); survey 100 leaders for Benchmark Report #1.', b2c: 'Analyze 14-day 3:2:2 creative tests; cut bottom 40% of hooks; brief 15 new hook variations.', shared: 'Review first batch of D2C corporate-email buyers and assign warm leads to B2B SDRs.', dri: 'ALL', phase: 'Sprint 2' },
    { week: 'Wk 9 (Sprint 3)', b2b: 'Enroll Cohort 2 (Next 25 Tier-1 Accounts) in ABM sequence; publish 3 customer case studies.', b2c: 'Secure whitelisting/Spark Ad codes from top 5 seeding creators and launch Partnership Ads.', shared: 'Audit page speed & Core Web Vitals across all B2B/B2C landing pages (<2.0s load).', dri: 'B2B, B2C, DEV/OPS', phase: 'Sprint 3' },
    { week: 'Wk 10 (Sprint 3)', b2b: 'Launch G2/Capterra review generation campaign with existing B2B clients.', b2c: 'Launch A/B test #1 on primary D2C landing page (Headline hook & bundle default).', shared: 'Embed B2B "Trusted by 500+ Enterprises" authority strip onto D2C product pages.', dri: 'B2B, B2C', phase: 'Sprint 3' },
    { week: 'Wk 11 (Sprint 3)', b2b: 'Finalize layout & executive summary of Flagship Industry Benchmark Report #1.', b2c: 'Audit Klaviyo flow metrics; split-test subject lines and SMS delays on Abandoned Checkout.', shared: 'Conduct 60-day attribution check comparing platform ROAS vs. blended MER.', dri: 'B2B, B2C, CMO', phase: 'Sprint 3' },
    { week: 'Wk 12 (Sprint 3)', b2b: 'Conduct Q1 Pipeline Retro: MQL-to-SQL rate, ABM engagement %, and SDR SLA adherence.', b2c: 'Graduate winning Q1 ad IDs into Meta Advantage+ Scaling; lock in Q2 creator roster.', shared: 'Present Q1 Board Readout & execute 15% Agile Budget Reallocation for Q2.', dri: 'CMO', phase: 'Sprint 3' }
  ];

  const handleCopyTouch = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTouchIndex(idx);
    setTimeout(() => setCopiedTouchIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-[#1A1A1A] animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#162B22] to-[#0F1E18] border border-[#2E5A47] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-[#C8A96A] border border-[#C8A96A]/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight font-heading flex items-center gap-2 text-white">
              <ArielMC /> <span>Hybrid Marketing Policy &amp; 12-Month Strategic Playbook</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 uppercase">
              Boardroom Master Dossier
            </span>
          </div>
          <p className="text-xs text-white/80 max-w-3xl leading-relaxed font-['Open_Sans']">
            Dual-Engine Commercial Architecture bridging Enterprise/Mid-Market B2B and Direct-to-Consumer (B2C/D2C). Incorporates the 21-Day ABM outreach sequence, 7 Klaviyo lifecycle flows, 90-day Q1 sprint tracker, and scalable budget matrix.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            CMO Authorized • Appendices A–D
          </span>
        </div>
      </div>

      {/* Playbook Navigation Sub-Tabs */}
      <div className="bg-white border border-[#DDE3DD] rounded-xl p-1.5 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {[
          { id: 'ABM_SEQUENCE' as PlaybookTab, label: 'Appendix B: 21-Day ABM Outreach', icon: Target },
          { id: 'KLAVIYO_FLOWS' as PlaybookTab, label: 'Appendix C: 7 Klaviyo B2C Flows', icon: Mail },
          { id: 'SPRINTS' as PlaybookTab, label: 'Appendix A: 90-Day Q1 Sprint Tracker', icon: Calendar },
          { id: 'BUDGET' as PlaybookTab, label: 'Section 4: Scalable Budget Matrix ($150k–$250k)', icon: DollarSign },
          { id: 'POLICY' as PlaybookTab, label: 'Section 1: Brand Policy & Channel Matrix', icon: ShieldCheck },
          { id: 'HYBRID_FLYWHEEL' as PlaybookTab, label: 'Section 2.3: Hybrid Trojan Horse Flywheel', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1F3A2E] text-white font-bold shadow-sm border border-[#1F3A2E]'
                  : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50 border border-slate-200/60 bg-slate-50/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A96A]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: APPENDIX B — 21-DAY TIER-1 ABM OUTREACH SEQUENCE
          ========================================================================= */}
      {activeTab === 'ABM_SEQUENCE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-[#DDE3DD] text-xs text-[#4A5568] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="font-bold text-[#1F3A2E] text-sm block font-heading">
                21-Day Multi-Channel Account Penetration Sequence (Top 50 Accounts)
              </span>
              Pre-Sequence (Days -14 to 0): Target account buying committee receives 14 days of LinkedIn Thought Leader Ads. SDR prepares 3-bullet hypothesis and dispatches dimensional &quot;Trojan Box&quot;.
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
              8 Multi-Touch Plays
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Touch Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              {abmTouches.map((touch, idx) => {
                const Icon = touch.icon;
                const isSelected = activeTouchIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTouchIndex(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white shadow-md'
                        : 'bg-white border-[#DDE3DD] text-[#4A5568] hover:bg-slate-50 hover:text-[#1F3A2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isSelected ? 'text-[#C8A96A]' : 'text-[#8A6D3B]'}`}>
                        {touch.step}
                      </span>
                      <span className={`text-[9.5px] font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {touch.timing}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#C8A96A]' : 'text-[#1F3A2E]'}`} />
                      <span className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-[#1F3A2E]'}`}>{touch.channel}</span>
                    </div>
                    <span className={`text-[10.5px] block truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                      {touch.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Touch Script & Copy Inspector (8 cols) */}
            <div className={`lg:col-span-8 p-6 rounded-2xl ${cardBg} border shadow-sm space-y-4`}>
              {(() => {
                const t = abmTouches[activeTouchIndex];
                const Icon = t.icon;
                return (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-[#DDE3DD] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C8A96A]/20 text-[#8A6D3B] border border-[#C8A96A]/30 uppercase">
                            {t.step}
                          </span>
                          <span className="text-xs text-[#6B7269] font-medium">
                            {t.timing}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#1F3A2E] mt-1 flex items-center gap-2 font-heading">
                          <Icon className="w-4 h-4 text-[#C8A96A]" />
                          <span>{t.channel} — {t.badge}</span>
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCopyTouch(activeTouchIndex, t.body)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-[#1F3A2E] border border-[#DDE3DD] shadow-2xs transition cursor-pointer"
                      >
                        {copiedTouchIndex === activeTouchIndex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#C8A96A]" />
                        )}
                        <span>{copiedTouchIndex === activeTouchIndex ? 'Copied' : 'Copy Script'}</span>
                      </button>
                    </div>

                    {/* Subject Line */}
                    <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-xs">
                      <span className="text-[10px] font-bold text-[#6B7269] uppercase block mb-0.5 font-heading">
                        Subject Line / Touch Header
                      </span>
                      <p className="font-mono text-[#1F3A2E] font-semibold">{t.subject}</p>
                    </div>

                    {/* Body Script */}
                    <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-xs space-y-2">
                      <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block font-heading">
                        Verified Execution Copy
                      </span>
                      <div className="font-sans text-[#1A1A1A] leading-relaxed whitespace-pre-line select-text">
                        {t.body}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7269] pt-2 border-t border-[#DDE3DD]">
                      <span>Multi-threaded buying committee alignment</span>
                      <span className="text-emerald-700 font-semibold">15-Minute SDR SLA Response Target</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: APPENDIX C — 7 CORE B2C KLAVIYO LIFECYCLE FLOWS
          ========================================================================= */}
      {activeTab === 'KLAVIYO_FLOWS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] text-xs text-[#6B7269] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#1F3A2E] text-sm block font-heading">
                Automated Lifecycle Engine (Driving 30%+ of Direct E-Commerce Revenue)
              </span>
              Global Rule: 16-hour Smart Sending enabled on low-intent touches. Non-freemail corporate domains auto-tagged <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">B2B_Corporate_Lead = True</code> and synced to HubSpot.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Flow Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              {klaviyoFlows.map((flow, idx) => {
                const isSelected = activeFlowIndex === idx;
                return (
                  <div
                    key={flow.id}
                    onClick={() => setActiveFlowIndex(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white shadow-md'
                        : 'bg-white border-[#DDE3DD] text-[#1A1A1A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{flow.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-[#C8A96A]' : 'bg-[#F8FAF8] border border-[#DDE3DD] text-[#8A6D3B]'
                      }`}>
                        {flow.steps.length} Steps
                      </span>
                    </div>
                    <span className={`text-[10.5px] block truncate mt-1 ${
                      isSelected ? 'text-white/80' : 'text-[#6B7269]'
                    }`}>
                      {flow.trigger}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Flow Steps Detail (8 cols) */}
            <div className={`lg:col-span-8 p-6 rounded-2xl ${cardBg} border shadow-sm space-y-4`}>
              {(() => {
                const currentFlow = klaviyoFlows[activeFlowIndex];
                return (
                  <div className="space-y-4">
                    <div className="border-b border-[#DDE3DD] pb-3">
                      <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block font-mono">
                        {currentFlow.id.toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-[#1F3A2E] font-heading mt-0.5">
                        {currentFlow.name}
                      </h3>
                      <p className="text-xs text-[#6B7269] mt-0.5">
                        Trigger: {currentFlow.trigger}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentFlow.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold font-mono text-[10px]">
                              {step.type} ({step.timing})
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#1A1A1A]">
                            {step.hook}
                          </p>
                          {step.angle && (
                            <p className="text-[11px] text-[#6B7269] leading-relaxed">
                              {step.angle}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: APPENDIX A — 90-DAY Q1 EXECUTION SPRINT TRACKER
          ========================================================================= */}
      {activeTab === 'SPRINTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B7269] px-2 font-medium">Filter Track:</span>
              {(['ALL', 'B2B', 'B2C', 'SHARED'] as const).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSprintTrackFilter(tr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    sprintTrackFilter === tr
                      ? 'bg-[#1F3A2E] text-white font-bold shadow-xs'
                      : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
                  }`}
                >
                  {tr === 'ALL' ? 'All 12 Weeks' : tr === 'B2B' ? 'B2B Track' : tr === 'B2C' ? 'B2C Track' : 'Shared MarTech'}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#6B7269] font-mono">
              Sprints 1–3 (Weeks 1 through 12)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#1A1A1A] bg-white divide-y divide-[#DDE3DD]">
              <thead className="bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#6B7269] font-mono border-b border-[#DDE3DD]">
                <tr>
                  <th className="p-3 w-28">Week / Phase</th>
                  {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'B2B') && (
                    <th className="p-3">B2B Track (ABM &amp; Demand Gen)</th>
                  )}
                  {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'B2C') && (
                    <th className="p-3">B2C Track (E-Commerce &amp; Lifecycle)</th>
                  )}
                  {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'SHARED') && (
                    <th className="p-3">Shared MarTech &amp; Synergy Ops</th>
                  )}
                  <th className="p-3 w-24">DRI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] font-sans">
                {sprintWeeks.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1F3A2E] whitespace-nowrap">
                      <div>{w.week}</div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] text-[#8A6D3B] font-sans">
                        {w.phase}
                      </span>
                    </td>
                    {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'B2B') && (
                      <td className="p-3 leading-relaxed text-[#1A1A1A]">
                        {w.b2b}
                      </td>
                    )}
                    {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'B2C') && (
                      <td className="p-3 leading-relaxed text-[#4A5568]">
                        {w.b2c}
                      </td>
                    )}
                    {(sprintTrackFilter === 'ALL' || sprintTrackFilter === 'SHARED') && (
                      <td className="p-3 leading-relaxed text-[#4A5568]">
                        {w.shared}
                      </td>
                    )}
                    <td className="p-3 font-mono text-[10.5px] font-bold text-[#1F3A2E] whitespace-nowrap">
                      {w.dri}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SECTION 4 — SCALABLE BUDGET MATRIX ($150K – $250K BAND)
          ========================================================================= */}
      {activeTab === 'BUDGET' && (
        <div className="space-y-5">
          {/* Tier Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B7269] px-2 font-medium">Budget Scenario:</span>
              {[
                { id: 'CONSERVATIVE' as const, label: 'Conservative ($150,000)' },
                { id: 'TARGET' as const, label: 'Target Baseline ($200,000) ✓' },
                { id: 'AGGRESSIVE' as const, label: 'Aggressive ($250,000)' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBudgetTier(tier.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    budgetTier === tier.id
                      ? 'bg-[#1F3A2E] text-white font-bold shadow-xs'
                      : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-emerald-700 font-mono font-semibold">
              Pacing: Q1 20% • Q2 25% • Q3 25% • Q4 30%
            </span>
          </div>

          {/* Budget Table */}
          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#1A1A1A] bg-white divide-y divide-[#DDE3DD]">
              <thead className="bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#6B7269] font-mono border-b border-[#DDE3DD]">
                <tr>
                  <th className="p-3">Expense Category</th>
                  <th className="p-3 w-20">% Share</th>
                  <th className="p-3 w-32">Allocation ($)</th>
                  <th className="p-3">Line-Item Tactical Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] font-sans">
                {[
                  {
                    cat: '1. B2C Performance Media',
                    pct: '32%',
                    cons: '$48,000',
                    target: '$64,000',
                    aggr: '$80,000',
                    desc: 'Meta Ads (50%), TikTok & Spark Ads (25%), Google Shopping PMax & Search (25%).'
                  },
                  {
                    cat: '2. B2B Demand Gen & ABM',
                    pct: '26%',
                    cons: '$39,000',
                    target: '$52,000',
                    aggr: '$65,000',
                    desc: 'LinkedIn ABM Ads (50%), High-Intent Search & G2 (25%), Tier-1 Direct Mail & VIP Dinners (25%).'
                  },
                  {
                    cat: '3. Creative & Seeding',
                    pct: '16%',
                    cons: '$24,000',
                    target: '$32,000',
                    aggr: '$40,000',
                    desc: 'Monthly UGC Packages & Seeding COGS (45%), Video Editing (35%), B2B Reports/Case Studies (20%).'
                  },
                  {
                    cat: '4. Agency & Specialists',
                    pct: '14%',
                    cons: '$21,000',
                    target: '$28,000',
                    aggr: '$35,000',
                    desc: 'Fractional Paid Media Buyer + Technical SEO, CRO Testing & Landing Page Sprints.'
                  },
                  {
                    cat: '5. MarTech & Data Stack',
                    pct: '12%',
                    cons: '$18,000',
                    target: '$24,000',
                    aggr: '$30,000',
                    desc: 'HubSpot Pro, Klaviyo, Shopify Plus Apps, Apollo/Clay Enrichment, Triple Whale/Attribution.'
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">{row.cat}</td>
                    <td className="p-3 font-mono text-[#8A6D3B] font-bold">{row.pct}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold text-sm">
                      {budgetTier === 'CONSERVATIVE' ? row.cons : budgetTier === 'TARGET' ? row.target : row.aggr}
                    </td>
                    <td className="p-3 text-[#6B7269]">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CMO 15% Marginal Reallocation Mandate Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#1A1A1A] space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Zap className="w-4 h-4 text-[#C8A96A]" />
              <span>CMO Governance Rule — The 15% Marginal Reallocation Mandate</span>
            </div>
            <p className="leading-relaxed text-[#6B7269]">
              At the conclusion of each 30-day operating sprint, the CMO reviews blended CAC payback between the B2B pipeline and B2C media. Up to <strong className="text-[#1A1A1A]">15% of working media capital</strong> may be reallocated between tracks without board intervention, shifting funds to whichever engine demonstrates the lowest marginal payback horizon.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SECTION 1 — BRAND POLICY & CHANNEL AUTHORIZATION MATRIX
          ========================================================================= */}
      {activeTab === 'POLICY' && (
        <div className="space-y-5">
          {/* Brand Voice Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#1F3A2E] font-heading uppercase tracking-wider">
              1.1 Brand Voice &amp; Messaging Architecture (B2B vs B2C)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#1A1A1A] bg-white divide-y divide-[#DDE3DD]">
                <thead className="bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#6B7269] font-mono border-b border-[#DDE3DD]">
                  <tr>
                    <th className="p-3 w-32">Dimension</th>
                    <th className="p-3">B2B (Enterprise &amp; Commercial Clients)</th>
                    <th className="p-3">B2C / D2C (Individual Consumers)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD]">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Persona Mindset</td>
                    <td className="p-3 text-[#1A1A1A]">Risk-averse, ROI-driven, consensus-bound, efficiency-focused.</td>
                    <td className="p-3 text-[#6B7269]">Aspirational, immediate-gratification, identity-driven, value-conscious.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Brand Tone</td>
                    <td className="p-3 text-emerald-800 font-semibold">Authoritative, Consultative, Precision-Oriented (Zero fluff).</td>
                    <td className="p-3 text-[#8A6D3B] font-semibold">Empathetic, Energetic, Accessible, Community-Centric.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Primary Value Pillar</td>
                    <td className="p-3 text-[#1A1A1A]">Scalability, operational reliability, Total Cost of Ownership (TCO), and competitive moat.</td>
                    <td className="p-3 text-[#6B7269]">Lifestyle transformation, ease of use, immediate utility, and emotional resonance.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Copy Guardrails</td>
                    <td className="p-3 text-[#1A1A1A]">Avoid hyperbole ("revolutionary"). Anchor claims in case studies, percentages, and time-saved metrics.</td>
                    <td className="p-3 text-[#6B7269]">Avoid corporate jargon ("synergy," "turnkey"). Write at a 7th-to-8th-grade reading level for rapid mobile scanning.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel Authorization Matrix */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#1F3A2E] font-heading uppercase tracking-wider">
              1.3 Channel Authorization Matrix
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#1A1A1A] bg-white divide-y divide-[#DDE3DD]">
                <thead className="bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#6B7269] font-mono border-b border-[#DDE3DD]">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Approved B2B Channels</th>
                    <th className="p-3">Approved B2C Channels</th>
                    <th className="p-3 text-rose-700">Restricted / Prohibited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD]">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Paid Social &amp; Video</td>
                    <td className="p-3 text-[#1A1A1A]">LinkedIn Ads, YouTube B2B Intent</td>
                    <td className="p-3 text-[#6B7269]">Meta (IG/FB), TikTok (Spark), Shorts, Pinterest</td>
                    <td className="p-3 text-rose-700 font-medium">Unmoderated programmatic display; politically adjacent placements.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Paid Search &amp; Intent</td>
                    <td className="p-3 text-[#1A1A1A]">Google Search (High-intent), Bing Corporate, G2/Capterra</td>
                    <td className="p-3 text-[#6B7269]">Google Shopping (PMax), Google Search (Brand &amp; Non-brand)</td>
                    <td className="p-3 text-rose-700 font-medium">Competitor trademark insertion in ad headlines.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-[#1F3A2E]">Outreach &amp; Field</td>
                    <td className="p-3 text-[#1A1A1A]">Account-Based Direct Mail (Sendoso), VIP Regional Dinners</td>
                    <td className="p-3 text-[#6B7269]">Creator Seeding (50 boxes/mo), Retail Pop-ups</td>
                    <td className="p-3 text-rose-700 font-medium">Cold SMS blasting (B2B or B2C); automated LinkedIn connection bots.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: SECTION 2.3 — HYBRID SYNERGY FLYWHEEL
          ========================================================================= */}
      {activeTab === 'HYBRID_FLYWHEEL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Flywheel 1: B2C -> B2B */}
            <div className={`p-6 rounded-2xl ${cardBg} border shadow-sm space-y-3`}>
              <div className="flex items-center gap-2 text-amber-600 font-bold font-heading">
                <Sparkles className="w-5 h-5 text-[#C8A96A]" />
                <h4 className="text-base text-[#1F3A2E]">Bottom-Up Trojan Horse (B2C &rarr; B2B)</h4>
              </div>
              <p className="text-xs text-[#6B7269] leading-relaxed">
                Automated Shopify webhook monitors customer email domains and executive shipping addresses. When <strong className="text-[#1A1A1A]">5+ employees</strong> from a single corporate entity buy ArielMC products on consumer cards, an instant Slack trigger alerts B2B SDRs to pitch an enterprise volume consolidation contract (saving the client 28–35% while securing high-ARR contracts).
              </p>
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[11px] font-mono text-amber-900 flex items-center gap-2">
                <span className="text-amber-600">⚡</span>
                <span>Alert: 12 Users at Target Enterprise identified &rarr; Automated Trojan Horse Play Initialized</span>
              </div>
            </div>

            {/* Flywheel 2: B2B -> B2C */}
            <div className={`p-6 rounded-2xl ${cardBg} border shadow-sm space-y-3`}>
              <div className="flex items-center gap-2 text-emerald-700 font-bold font-heading">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base text-[#1F3A2E]">Institutional Halo Effect (B2B &rarr; B2C)</h4>
              </div>
              <p className="text-xs text-[#6B7269] leading-relaxed">
                B2B enterprise client authority badges ("Trusted by 500+ Industry Leaders") are embedded directly across D2C e-commerce product pages to elevate buyer confidence. Concurrently, B2B enterprise contracts include exclusive employee perk portals, generating zero-CAC D2C repeat customers.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-[11px] font-mono text-emerald-900 flex items-center gap-2">
                <span>🛡️</span>
                <span>Social Proof: Verified LWG Gold &amp; Sedex Authority Strip Active on Storefront</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
