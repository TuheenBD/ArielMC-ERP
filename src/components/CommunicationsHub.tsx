'use client';

import React, { useState } from 'react';
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
  ArrowRight
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

export const CommunicationsHub: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'MEETING' | 'SAMPLE' | 'ORDER' | 'CUSTOM'>('MEETING');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState<'ZOOM' | 'MEET' | 'TEAMS'>('ZOOM');
  const [customSubject, setCustomSubject] = useState('Trade Discussion & Sourcing Inquiry - ArielMC');

  const comms = OFFICIAL_COMMUNICATION_CHANNELS;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getTemplateContent = () => {
    const meetingLink =
      meetingPlatform === 'ZOOM'
        ? `Zoom: ${comms.meetings.zoom.launchUrl} (Host: ${comms.meetings.zoom.account})`
        : meetingPlatform === 'MEET'
        ? `Google Meet: ${comms.meetings.googleMeet.launchUrl} (Account: ${comms.meetings.googleMeet.account})`
        : `Microsoft Teams: ${comms.meetings.microsoftTeams.chatUrl} (Account: ${comms.meetings.microsoftTeams.account})`;

    switch (selectedTemplate) {
      case 'MEETING':
        return `Dear Partner,\n\nWe would like to invite you to a virtual trade & sourcing conference with Ariel Marketing & Communications Ltd.\n\nMeeting Platform: ${meetingPlatform}\nDirect Link: ${meetingLink}\nWhatsApp Coordination: ${comms.whatsappIntl}\n\nAgenda:\n1. Product sampling and tech-pack specification review\n2. FOB Chittagong Port costing & back-to-back production lead times\n3. Quality inspection (AQL 1.5 / 2.5) and ESG compliance\n\nWarm regards,\nSyed Akramul Hassan (Managing Director)\nAriel Marketing & Communications Limited\nDhaka, Bangladesh | info@arielmc.com | tuheen@arielmc.com`;

      case 'SAMPLE':
        return `Dear Sourcing Team,\n\nWe have registered your sample request for customized ethical manufacturing out of our Bangladesh export hubs.\n\n- Domestic Dispatch Hub: Dhaka / Savar\n- Tracking & Coordination: WhatsApp ${comms.whatsappIntl}\n- Commercial Reference: info@arielmc.com\n\nOur team is preparing raw material lab dips and physical specimens per your tech-pack.\n\nSincerely,\nArielMC Merchandising Team\nWebsite: https://www.arielmc.com`;

      case 'ORDER':
        return `Dear Buyer,\n\nThank you for placing your Back-to-Back Purchase Order with Ariel Marketing & Communications Ltd.\n\n- Master L/C & Commercial Terms: Irrevocable at Sight\n- Ex-Factory & Port Handover: Chittagong Port (FOB / CIF)\n- Operational Desk: tuheen@arielmc.com / ArielMC.BD@gmail.com\n- 24/7 International Trade Desk: WhatsApp ${comms.whatsappIntl}\n\nWe have scheduled the Time & Action (T&A) milestones and will stream live QA updates.\n\nBest regards,\nAriel Marketing & Communications Ltd`;

      case 'CUSTOM':
      default:
        return `Dear Partner,\n\nPlease feel free to reach our trade desk via any of our official channels:\n- Mobile (BD): ${comms.mobileBd}\n- WhatsApp: ${comms.whatsappIntl}\n- Hostinger Business Mail: info@arielmc.com / tuheen@arielmc.com\n- Google Workspace: TuheenBD@gmail.com\n- Zoom: ${comms.meetings.zoom.account}\n- Google Meet: ${comms.meetings.googleMeet.account}\n- Microsoft Teams: ${comms.meetings.microsoftTeams.account}\n\nAriel Marketing & Communications Limited`;
    }
  };

  const handleLaunchEmail = (provider: 'HOSTINGER' | 'GMAIL' | 'DEFAULT') => {
    const subject = encodeURIComponent(customSubject);
    const body = encodeURIComponent(getTemplateContent());

    if (provider === 'GMAIL') {
      const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${subject}&body=${body}`;
      window.open(url, '_blank');
    } else if (provider === 'HOSTINGER') {
      window.open('https://mail.hostinger.com', '_blank');
    } else {
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#C8A96A] font-mono text-xs font-semibold border border-white/20">
              COMMUNICATIONS &amp; VIRTUAL DESK
            </span>
            <span className="text-xs text-[#E8EFE8] font-mono">
              Hostinger • Gmail • Zoom • Google Meet • Teams • WhatsApp
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-['Montserrat'] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#C8A96A]" />
            Trade Communications &amp; Virtual Meetings Hub
          </h1>
          <p className="text-xs text-[#E8EFE8] max-w-3xl leading-relaxed font-['Open_Sans']">
            Unified command center connecting international buyers, factory management, and executive desks. Launch one-click Zoom, Google Meet, Microsoft Teams, and WhatsApp sessions, or manage Hostinger &amp; Gmail business mailboxes with verified protocols.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <a
            href="https://mail.hostinger.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 text-xs font-semibold transition-all shadow-sm font-['Montserrat']"
          >
            <HostingerIcon className="w-4 h-4" />
            <span>Hostinger Webmail</span>
          </a>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] text-xs font-bold transition-all shadow-md font-['Montserrat']"
          >
            <GmailIcon className="w-4 h-4" />
            <span>Gmail Workspace</span>
          </a>
        </div>
      </div>

      {/* SECTION 1: LIVE VIRTUAL MEETINGS & CHANNELS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
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
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">Zoom</h3>
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
                className="w-full py-2 px-3 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73db] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Start Zoom Meeting</span>
              </a>
              <div className="flex items-center gap-1.5">
                <a
                  href={comms.meetings.zoom.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] text-[11px] font-semibold text-center transition-colors"
                >
                  Join Meeting
                </a>
                <button
                  onClick={() => handleCopy(comms.meetings.zoom.account, 'zoom')}
                  className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                  title="Copy Zoom Account"
                >
                  {copiedKey === 'zoom' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Google Meet */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#00AC47]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E6F4EA] text-[#00AC47]">
                    <GoogleMeetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">Google Meet</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Instant Video Room</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                  Google Workspace Account
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                  {comms.meetings.googleMeet.account}
                </div>
                <p className="text-[11px] text-[#6B7269] mt-1">
                  1-Click browser meetings, calendar sync, and factory floor walkthroughs.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.googleMeet.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#00832D] hover:bg-[#006e26] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch Google Meet</span>
              </a>
              <div className="flex items-center gap-1.5">
                <a
                  href="https://meet.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] text-[11px] font-semibold text-center transition-colors"
                >
                  Meet Dashboard
                </a>
                <button
                  onClick={() => handleCopy(comms.meetings.googleMeet.account, 'meet')}
                  className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                  title="Copy Google Meet Account"
                >
                  {copiedKey === 'meet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Microsoft Teams */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#5B5FC7]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#F0F1FA] text-[#5B5FC7]">
                    <TeamsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">MS Teams</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Enterprise Direct</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                  Microsoft Teams Account
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                  {comms.meetings.microsoftTeams.account}
                </div>
                <p className="text-[11px] text-[#6B7269] mt-1">
                  Corporate procurement calls &amp; retail buyer group consultations.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.microsoftTeams.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#5B5FC7] hover:bg-[#4b4fa3] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Teams Chat</span>
              </a>
              <div className="flex items-center gap-1.5">
                <a
                  href={comms.meetings.microsoftTeams.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] text-[11px] font-semibold text-center transition-colors"
                >
                  Teams Web
                </a>
                <button
                  onClick={() => handleCopy(comms.meetings.microsoftTeams.account, 'teams')}
                  className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                  title="Copy Teams Account"
                >
                  {copiedKey === 'teams' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: WhatsApp Desk */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#25D366]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E8F8EE] text-[#25D366]">
                    <WhatsappIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">WhatsApp</h3>
                    <span className="text-[10px] text-gray-500 font-mono">24/7 Global Desk</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for chats" />
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                  Hotline &amp; International Desk
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                  {comms.whatsappIntl}
                </div>
                <p className="text-[11px] text-[#6B7269] mt-1">
                  Instant mobile chat, high-res sample photos, AQL video checks.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <WhatsappIcon className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <div className="flex items-center gap-1.5">
                <a
                  href={comms.meetings.whatsapp.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] text-[11px] font-semibold text-center transition-colors"
                >
                  WhatsApp Web
                </a>
                <button
                  onClick={() => handleCopy(comms.whatsappIntl, 'wa')}
                  className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                  title="Copy WhatsApp Number"
                >
                  {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DUAL EMAIL WORKSPACES (HOSTINGER & GMAIL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostinger Business Email System */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F0E6FF] text-[#673AB7]">
                <HostingerIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1A1A1A] font-['Montserrat']">
                    Hostinger Business Email System
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0E6FF] text-[#673AB7] font-semibold">
                    Primary Domain
                  </span>
                </div>
                <p className="text-xs text-[#6B7269]">
                  Corporate @arielmc.com mail infrastructure on Hostinger Cloud
                </p>
              </div>
            </div>

            <a
              href={comms.emailSystems.hostinger.webmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#673AB7] hover:bg-[#572f9b] text-white text-xs font-semibold shadow-sm transition-colors font-['Montserrat']"
            >
              <span>Hostinger Webmail</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Hostinger Mailboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269]">
                  General Commercial &amp; RFQ
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-1 break-all">
                  {comms.emailSystems.hostinger.accounts.general}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Primary intake for buyer specifications</p>
              </div>
              <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between">
                <a
                  href={`mailto:${comms.emailSystems.hostinger.accounts.general}`}
                  className="text-xs text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1"
                >
                  Compose <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={() => handleCopy(comms.emailSystems.hostinger.accounts.general, 'h_gen')}
                  className="p-1 rounded text-gray-500 hover:text-[#1F3A2E]"
                >
                  {copiedKey === 'h_gen' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#8A6D3B]">
                  Managing Director Executive Desk
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-1 break-all">
                  {comms.emailSystems.hostinger.accounts.executive}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Syed Akramul Hassan (Executive)</p>
              </div>
              <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between">
                <a
                  href={`mailto:${comms.emailSystems.hostinger.accounts.executive}`}
                  className="text-xs text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1"
                >
                  Compose <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={() => handleCopy(comms.emailSystems.hostinger.accounts.executive, 'h_exec')}
                  className="p-1 rounded text-gray-500 hover:text-[#1F3A2E]"
                >
                  {copiedKey === 'h_exec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Hostinger IMAP/SMTP Connection Reference */}
          <div className="p-3 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F3A2E] font-sans pb-1">
              <Server className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Hostinger Server Protocol (Outlook / Apple Mail):</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IMAP Server:</span>
              <span className="font-semibold text-[#1A1A1A]">{comms.emailSystems.hostinger.serverSettings.imap}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SMTP Server:</span>
              <span className="font-semibold text-[#1A1A1A]">{comms.emailSystems.hostinger.serverSettings.smtp}</span>
            </div>
          </div>
        </div>

        {/* Gmail & Google Workspace System */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FDEAEA] text-[#EA4335]">
                <GmailIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1A1A1A] font-['Montserrat']">
                    Gmail &amp; Google Workspace
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FDEAEA] text-[#EA4335] font-semibold">
                    Google Cloud
                  </span>
                </div>
                <p className="text-xs text-[#6B7269]">
                  Integrated Google ecosystem for Google Meet &amp; Cloud Drive backups
                </p>
              </div>
            </div>

            <a
              href={comms.emailSystems.gmail.webmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA4335] hover:bg-[#d0382b] text-white text-xs font-semibold shadow-sm transition-colors font-['Montserrat']"
            >
              <span>Gmail Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Gmail Mailboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#EA4335]">
                  Primary Executive Google Account
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-1 break-all">
                  {comms.emailSystems.gmail.accounts.primary}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Linked to Zoom &amp; Google Meet</p>
              </div>
              <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${comms.emailSystems.gmail.accounts.primary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1"
                >
                  Open in Gmail <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={() => handleCopy(comms.emailSystems.gmail.accounts.primary, 'g_prim')}
                  className="p-1 rounded text-gray-500 hover:text-[#1F3A2E]"
                >
                  {copiedKey === 'g_prim' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269]">
                  Operations &amp; Cloud Backup Desk
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-1 break-all">
                  {comms.emailSystems.gmail.accounts.backup}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Holding company operational mail</p>
              </div>
              <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${comms.emailSystems.gmail.accounts.backup}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1"
                >
                  Open in Gmail <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={() => handleCopy(comms.emailSystems.gmail.accounts.backup, 'g_back')}
                  className="p-1 rounded text-gray-500 hover:text-[#1F3A2E]"
                >
                  {copiedKey === 'g_back' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="p-3 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-[11px] text-gray-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Google Workspace OAuth &amp; Meet video rooms configured for instant client invitations.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE TRADE DISPATCH & MEETING INVITATION GENERATOR */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDE3DD] gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#C8A96A]" />
              <span>Interactive Buyer &amp; Supplier Dispatch Composer</span>
            </h3>
            <p className="text-xs text-[#6B7269]">
              Generate official meeting invites, sample tracking dispatches, and back-to-back contract notices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Select Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              className="p-1.5 text-xs font-semibold rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E]"
            >
              <option value="MEETING">📅 Virtual Meeting Invitation</option>
              <option value="SAMPLE">🧵 Prototyping &amp; Sample Dispatch</option>
              <option value="ORDER">📦 Back-to-Back Order Notice</option>
              <option value="CUSTOM">✉️ General Corporate Directory</option>
            </select>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              placeholder="buyer@clientbrand.co.uk or factory@supplier.bd"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {selectedTemplate === 'MEETING' && (
            <div>
              <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Virtual Video Platform
              </label>
              <select
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value as any)}
                className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-semibold text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E]"
              >
                <option value="ZOOM">Zoom (TuheenBD@gmail.com)</option>
                <option value="MEET">Google Meet (TuheenBD@gmail.com)</option>
                <option value="TEAMS">Microsoft Teams (TuheenBD@msn.com)</option>
              </select>
            </div>
          )}
        </div>

        {/* Message Preview */}
        <div>
          <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
            Generated Corporate Dispatch Body
          </label>
          <textarea
            readOnly
            rows={7}
            value={getTemplateContent()}
            className="w-full p-3.5 bg-[#F8F6F2] border border-[#DDE3DD] rounded-xl font-mono text-xs text-[#1A1A1A] focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLaunchEmail('HOSTINGER')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#673AB7] hover:bg-[#572f9b] text-white font-bold text-xs shadow-sm transition-colors font-['Montserrat']"
            >
              <HostingerIcon className="w-3.5 h-3.5" />
              <span>Send via Hostinger Webmail</span>
            </button>
            <button
              onClick={() => handleLaunchEmail('GMAIL')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA4335] hover:bg-[#d0382b] text-white font-bold text-xs shadow-sm transition-colors font-['Montserrat']"
            >
              <GmailIcon className="w-3.5 h-3.5" />
              <span>Compose in Gmail</span>
            </button>
            <button
              onClick={() => handleLaunchEmail('DEFAULT')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#15271F] text-white font-bold text-xs shadow-sm transition-colors font-['Montserrat']"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Default Email Client</span>
            </button>
          </div>

          <button
            onClick={() => handleCopy(getTemplateContent(), 'dispatch_body')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] font-semibold text-xs transition-colors"
          >
            {copiedKey === 'dispatch_body' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message Body</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
