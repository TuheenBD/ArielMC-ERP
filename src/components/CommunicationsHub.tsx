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
  Lock
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

interface EmailDispatchLog {
  id: string;
  timestamp: string;
  provider: 'HOSTINGER' | 'GMAIL';
  from: string;
  to: string;
  subject: string;
  mode: 'LIVE_SMTP' | 'SIMULATED';
  messageId: string;
}

export const CommunicationsHub: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'MEETING' | 'SAMPLE' | 'ORDER' | 'CUSTOM'>('MEETING');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState<'ZOOM' | 'MEET' | 'TEAMS'>('ZOOM');
  const [customSubject, setCustomSubject] = useState('Trade Discussion & Sourcing Inquiry - ArielMC');
  const [messageBody, setMessageBody] = useState('');

  // In-ERP Direct Sending State
  const [emailProvider, setEmailProvider] = useState<'HOSTINGER' | 'GMAIL'>('HOSTINGER');
  const [hostingerAccount, setHostingerAccount] = useState<'info@arielmc.com' | 'tuheen@arielmc.com'>('info@arielmc.com');
  const [gmailAccount, setGmailAccount] = useState<'TuheenBD@gmail.com' | 'ArielMC.BD@gmail.com'>('TuheenBD@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: 'success' | 'error';
    message: string;
    mode?: string;
    messageId?: string;
  } | null>(null);

  // SMTP Settings Modal
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [smtpConfig, setSmtpConfig] = useState({
    hostingerHost: 'smtp.hostinger.com',
    hostingerPort: 465,
    hostingerPass: '',
    gmailHost: 'smtp.gmail.com',
    gmailPort: 465,
    gmailPass: '',
  });

  // Sent History
  const [dispatchHistory, setDispatchHistory] = useState<EmailDispatchLog[]>([
    {
      id: 'dsp-01',
      timestamp: '2026-10-16 19:45',
      provider: 'HOSTINGER',
      from: 'tuheen@arielmc.com',
      to: 'sourcing@marksandspencer.co.uk',
      subject: 'ArielMC Leather Sample Dispatch & Tech-Pack Confirmation',
      mode: 'LIVE_SMTP',
      messageId: '<msg-7821-arielmc@hostinger>',
    },
    {
      id: 'dsp-02',
      timestamp: '2026-10-16 18:20',
      provider: 'GMAIL',
      from: 'TuheenBD@gmail.com',
      to: 'import@nordicstyle.se',
      subject: 'Virtual Sourcing Conference - Bangladesh Ethical Ceramics',
      mode: 'LIVE_SMTP',
      messageId: '<google-meet-conf-8921@gmail>',
    },
  ]);

  const comms = OFFICIAL_COMMUNICATION_CHANNELS;

  // Load saved credentials & history from localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('arielmc_smtp_config');
      if (savedConfig) {
        setSmtpConfig((prev) => ({ ...prev, ...JSON.parse(savedConfig) }));
      }
      const savedHistory = localStorage.getItem('arielmc_email_history');
      if (savedHistory) {
        setDispatchHistory(JSON.parse(savedHistory));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveSmtpConfig = () => {
    try {
      localStorage.setItem('arielmc_smtp_config', JSON.stringify(smtpConfig));
      setIsSmtpModalOpen(false);
      setSendResult({
        type: 'success',
        message: 'SMTP credentials updated successfully in ERP session.',
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

  const getTemplateContent = (template: 'MEETING' | 'SAMPLE' | 'ORDER' | 'CUSTOM') => {
    const meetingLink =
      meetingPlatform === 'ZOOM'
        ? `Zoom: ${comms.meetings.zoom.launchUrl} (Host: ${comms.meetings.zoom.account})`
        : meetingPlatform === 'MEET'
        ? `Google Meet: ${comms.meetings.googleMeet.launchUrl} (Account: ${comms.meetings.googleMeet.account})`
        : `Microsoft Teams: ${comms.meetings.microsoftTeams.chatUrl} (Account: ${comms.meetings.microsoftTeams.account})`;

    switch (template) {
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

  // Sync initial body on mount or template change
  useEffect(() => {
    setMessageBody(getTemplateContent(selectedTemplate));
  }, [selectedTemplate, meetingPlatform]);

  // DIRECT IN-ERP EMAIL DISPATCH
  const handleDirectSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSendResult({
        type: 'error',
        message: 'Please provide a valid recipient email address.',
      });
      return;
    }

    if (!customSubject.trim()) {
      setSendResult({
        type: 'error',
        message: 'Please provide a subject line.',
      });
      return;
    }

    if (!messageBody.trim()) {
      setSendResult({
        type: 'error',
        message: 'Email body text cannot be empty.',
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    const fromAccount = emailProvider === 'HOSTINGER' ? hostingerAccount : gmailAccount;
    const activePass = emailProvider === 'HOSTINGER' ? smtpConfig.hostingerPass : smtpConfig.gmailPass;
    const activeHost = emailProvider === 'HOSTINGER' ? smtpConfig.hostingerHost : smtpConfig.gmailHost;
    const activePort = emailProvider === 'HOSTINGER' ? smtpConfig.hostingerPort : smtpConfig.gmailPort;

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: emailProvider,
          fromAccount,
          to: recipientEmail,
          subject: customSubject,
          body: messageBody,
          smtpConfig: {
            host: activeHost,
            port: activePort,
            user: fromAccount,
            pass: activePass || undefined,
            secure: true,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch email.');
      }

      setSendResult({
        type: 'success',
        message: data.note || 'Email dispatched successfully!',
        mode: data.mode,
        messageId: data.messageId,
      });

      // Record to dispatch history
      const newEntry: EmailDispatchLog = {
        id: `dsp-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        provider: emailProvider,
        from: fromAccount,
        to: recipientEmail,
        subject: customSubject,
        mode: data.mode || 'LIVE_SMTP',
        messageId: data.messageId || `msg-${Date.now()}`,
      };

      const updatedHistory = [newEntry, ...dispatchHistory];
      setDispatchHistory(updatedHistory);
      try {
        localStorage.setItem('arielmc_email_history', JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }
    } catch (err: any) {
      setSendResult({
        type: 'error',
        message: err.message || 'Error occurred while contacting mail server.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Launch webmail / client
  const handleLaunchEmail = (provider: 'HOSTINGER' | 'GMAIL' | 'DEFAULT') => {
    const subject = encodeURIComponent(customSubject);
    const body = encodeURIComponent(messageBody);

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
              Direct In-ERP Mailer • Hostinger • Gmail • Zoom • Meet • Teams
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-['Montserrat'] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#C8A96A]" />
            Trade Communications &amp; Direct Mail Hub
          </h1>
          <p className="text-xs text-[#E8EFE8] max-w-3xl leading-relaxed font-['Open_Sans']">
            Send emails directly from inside ArielMC ERP using verified <strong>Hostinger Business Mail</strong> and <strong>Google Workspace / Gmail</strong> SMTP gateways. Launch instant Zoom, Google Meet, Teams, and WhatsApp video conferences with buyers &amp; domestic factories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => setIsSmtpModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 text-xs font-semibold transition-all shadow-sm font-['Montserrat']"
            title="Configure SMTP Passwords & Server Gateways"
          >
            <Settings className="w-4 h-4" />
            <span>SMTP Settings</span>
          </button>
          <a
            href="https://mail.hostinger.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#673AB7] hover:bg-[#572f9b] text-white text-xs font-bold transition-all shadow-md font-['Montserrat']"
          >
            <HostingerIcon className="w-4 h-4" />
            <span>Hostinger</span>
          </a>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] text-xs font-bold transition-all shadow-md font-['Montserrat']"
          >
            <GmailIcon className="w-4 h-4" />
            <span>Gmail</span>
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#00897B]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E0F2F1] text-[#00897B]">
                    <GoogleMeetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">Google Meet</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Instant Workspace Room</span>
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
                  Instant 1-click video calls with buyers directly from Google Calendar &amp; Gmail.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.googleMeet.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <Video className="w-3.5 h-3.5" />
                <span>New Google Meet</span>
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#5059C9]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#EDE7F6] text-[#5059C9]">
                    <TeamsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">MS Teams</h3>
                    <span className="text-[10px] text-gray-500 font-mono">Enterprise Chat &amp; Call</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready for calls" />
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                  Teams Account
                </span>
                <div className="text-xs font-bold font-mono text-[#1F3A2E] mt-0.5 break-all">
                  {comms.meetings.microsoftTeams.account}
                </div>
                <p className="text-[11px] text-[#6B7269] mt-1">
                  Direct communication with enterprise retail supply chain procurement desks.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.microsoftTeams.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#5059C9] hover:bg-[#434aa8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat / Call on Teams</span>
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E8F8F0] text-emerald-600">
                    <WhatsappIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm font-['Montserrat']">WhatsApp</h3>
                    <span className="text-[10px] text-gray-500 font-mono">24/7 Trade Hotline</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-mono text-[#6B7269] uppercase block font-semibold">
                  International Desk
                </span>
                <div className="text-base font-bold font-mono text-[#1F3A2E] mt-0.5">
                  {comms.whatsappIntl}
                </div>
                <p className="text-[11px] text-[#6B7269] mt-1">
                  Live photo/video sharing of factory lab dips, bulk cutting, and carton seals.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DDE3DD]">
              <a
                href={comms.meetings.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-['Montserrat']"
              >
                <MessageSquare className="w-3.5 h-3.5" />
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

      {/* SECTION 2: DIRECT IN-ERP EMAIL COMPOSER & DISPATCHER */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDE3DD] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#C8A96A] text-[#1F3A2E] font-bold">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
                Direct In-ERP Email Dispatcher
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Direct Sending Enabled
              </span>
            </div>
            <p className="text-xs text-[#6B7269] mt-0.5">
              Send professional trade communications directly to buyers and suppliers without leaving the ERP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSmtpModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-xs font-semibold text-[#1F3A2E] transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Configure SMTP</span>
            </button>

            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              className="p-2 text-xs font-semibold rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E]"
            >
              <option value="MEETING">📅 Virtual Meeting Invitation</option>
              <option value="SAMPLE">🧵 Prototyping &amp; Sample Dispatch</option>
              <option value="ORDER">📦 Back-to-Back Order Notice</option>
              <option value="CUSTOM">✉️ General Corporate Directory</option>
            </select>
          </div>
        </div>

        {/* Live Feedback Alert Banner */}
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
                    Message ID: {sendResult.messageId} • Mode: {sendResult.mode}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSendResult(null)}
              className="p-1 rounded hover:bg-black/5 text-gray-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sender Channel Selection (Hostinger vs Gmail) */}
        <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A2E] font-['Montserrat'] block">
            Step 1: Choose Dispatch Gateway &amp; Sender Account
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Hostinger Option */}
            <div
              onClick={() => setEmailProvider('HOSTINGER')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                emailProvider === 'HOSTINGER'
                  ? 'border-[#673AB7] bg-white shadow-sm'
                  : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EDE7F6] text-[#673AB7] mt-0.5">
                  <HostingerIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1A1A1A] font-['Montserrat']">
                      Hostinger Business Mail
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EDE7F6] text-[#673AB7] font-semibold">
                      @arielmc.com
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <label className="text-[11px] text-gray-500">From:</label>
                    <select
                      value={hostingerAccount}
                      onChange={(e) => setHostingerAccount(e.target.value as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded bg-[#F4F6F4] border border-[#DDE3DD] text-[11px] font-mono font-bold text-[#1F3A2E]"
                    >
                      <option value="info@arielmc.com">info@arielmc.com (General / RFQ)</option>
                      <option value="tuheen@arielmc.com">tuheen@arielmc.com (Managing Director)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-4 h-4 rounded-full border flex items-center justify-center mt-1">
                {emailProvider === 'HOSTINGER' && <div className="w-2.5 h-2.5 rounded-full bg-[#673AB7]" />}
              </div>
            </div>

            {/* Gmail Option */}
            <div
              onClick={() => setEmailProvider('GMAIL')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                emailProvider === 'GMAIL'
                  ? 'border-[#EA4335] bg-white shadow-sm'
                  : 'border-transparent bg-white/60 hover:bg-white text-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FDEAEA] text-[#EA4335] mt-0.5">
                  <GmailIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1A1A1A] font-['Montserrat']">
                      Google Workspace / Gmail
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FDEAEA] text-[#EA4335] font-semibold">
                      Google Cloud
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <label className="text-[11px] text-gray-500">From:</label>
                    <select
                      value={gmailAccount}
                      onChange={(e) => setGmailAccount(e.target.value as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded bg-[#F4F6F4] border border-[#DDE3DD] text-[11px] font-mono font-bold text-[#1F3A2E]"
                    >
                      <option value="TuheenBD@gmail.com">TuheenBD@gmail.com (Executive Workspace)</option>
                      <option value="ArielMC.BD@gmail.com">ArielMC.BD@gmail.com (Operations Backup)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-4 h-4 rounded-full border flex items-center justify-center mt-1">
                {emailProvider === 'GMAIL' && <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider">
                Recipient Email *
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRecipientEmail('buyer@marksandspencer.co.uk')}
                  className="text-[9px] font-mono text-[#673AB7] hover:underline"
                >
                  +UK Buyer
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setRecipientEmail('sourcing@arielmc.com')}
                  className="text-[9px] font-mono text-[#EA4335] hover:underline"
                >
                  +Test Desk
                </button>
              </div>
            </div>
            <input
              type="email"
              placeholder="e.g. buyer@clientbrand.co.uk or factory@supplier.bd"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-medium"
            />
          </div>

          {selectedTemplate === 'MEETING' ? (
            <div>
              <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Meeting Link to Attach
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
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                WhatsApp Dispatch Desk
              </label>
              <input
                type="text"
                readOnly
                value={`${comms.whatsappIntl} (24/7 International)`}
                className="w-full p-2.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-mono text-gray-600"
              />
            </div>
          )}
        </div>

        {/* Message Editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-[#1F3A2E] uppercase tracking-wider">
              Email Body Text (Directly Editable)
            </label>
            <span className="text-[10px] text-gray-500">
              Corporate ArielMC HTML letterhead &amp; footer will be attached automatically
            </span>
          </div>
          <textarea
            rows={7}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="w-full p-3.5 bg-[#F8F6F2] border border-[#DDE3DD] rounded-xl font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DDE3DD]">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* DIRECT IN-ERP SEND BUTTON */}
            <button
              onClick={handleDirectSendEmail}
              disabled={isSending}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all font-['Montserrat'] ${
                isSending
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : emailProvider === 'HOSTINGER'
                  ? 'bg-[#1F3A2E] hover:bg-[#15271F] text-white hover:shadow-lg'
                  : 'bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] hover:shadow-lg'
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending via {emailProvider}...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Directly from ERP (via {emailProvider === 'HOSTINGER' ? 'Hostinger' : 'Gmail'})</span>
                </>
              )}
            </button>

            {/* Fallback 1-Click Webmail Buttons */}
            <button
              onClick={() => handleLaunchEmail('HOSTINGER')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#673AB7] font-semibold text-xs transition-colors"
              title="Open pre-filled draft in Hostinger Webmail"
            >
              <HostingerIcon className="w-3.5 h-3.5" />
              <span>Hostinger Webmail</span>
            </button>
            <button
              onClick={() => handleLaunchEmail('GMAIL')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#EA4335] font-semibold text-xs transition-colors"
              title="Open pre-filled draft in Gmail Web"
            >
              <GmailIcon className="w-3.5 h-3.5" />
              <span>Gmail Web</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessageBody(getTemplateContent(selectedTemplate))}
              className="p-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-gray-500 hover:text-[#1F3A2E] text-xs transition-colors"
              title="Reset body to selected template default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCopy(messageBody, 'dispatch_body')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] font-semibold text-xs transition-colors"
            >
              {copiedKey === 'dispatch_body' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT IN-ERP EMAIL DISPATCH AUDIT LOG */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C8A96A]" />
            <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
              In-ERP Email Dispatch &amp; Delivery Audit Trail
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
              {dispatchHistory.length} Recorded
            </span>
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            Direct Server Dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] text-[#6B7269] font-mono uppercase text-[10px] border-y border-[#DDE3DD]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Gateway</th>
                <th className="py-2.5 px-3 font-semibold">Sender Desk</th>
                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                <th className="py-2.5 px-3 font-semibold">Subject</th>
                <th className="py-2.5 px-3 font-semibold">Status / Mode</th>
                <th className="py-2.5 px-3 font-semibold">Message ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
              {dispatchHistory.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8F6F2]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        log.provider === 'HOSTINGER'
                          ? 'bg-[#EDE7F6] text-[#673AB7]'
                          : 'bg-[#FDEAEA] text-[#EA4335]'
                      }`}
                    >
                      {log.provider === 'HOSTINGER' ? <HostingerIcon className="w-3 h-3" /> : <GmailIcon className="w-3 h-3" />}
                      <span>{log.provider}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#1F3A2E] font-semibold">
                    {log.from}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#1A1A1A]">
                    {log.to}
                  </td>
                  <td className="py-2.5 px-3 max-w-[220px] truncate font-medium">
                    {log.subject}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        log.mode === 'LIVE_SMTP'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.mode === 'LIVE_SMTP' ? 'Live Delivered' : 'Simulated Test'}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500 max-w-[140px] truncate" title={log.messageId}>
                    {log.messageId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMTP CONFIGURATION MODAL */}
      {isSmtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-['Montserrat']">
                    ERP In-App SMTP Gateway Configuration
                  </h3>
                  <p className="text-[11px] text-[#E8EFE8]">
                    Configure Hostinger &amp; Gmail credentials for direct in-ERP emailing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSmtpModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Hostinger Section */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-3">
                <div className="flex items-center gap-2 text-[#673AB7]">
                  <HostingerIcon className="w-4 h-4" />
                  <h4 className="font-bold text-xs uppercase font-['Montserrat']">
                    1. Hostinger Business Mail SMTP
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block text-gray-500 font-mono">Host:</label>
                    <input
                      type="text"
                      value={smtpConfig.hostingerHost}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, hostingerHost: e.target.value })}
                      className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-mono">Port (SSL):</label>
                    <input
                      type="number"
                      value={smtpConfig.hostingerPort}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, hostingerPort: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Hostinger Password (for info@arielmc.com / tuheen@arielmc.com):
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Hostinger mailbox password"
                    value={smtpConfig.hostingerPass}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, hostingerPass: e.target.value })}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Managed in Hostinger hPanel. Can also be set in <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code> as <code className="bg-gray-200 px-1 py-0.5 rounded">HOSTINGER_SMTP_PASS</code>.
                  </p>
                </div>
              </div>

              {/* Gmail Section */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-3">
                <div className="flex items-center gap-2 text-[#EA4335]">
                  <GmailIcon className="w-4 h-4" />
                  <h4 className="font-bold text-xs uppercase font-['Montserrat']">
                    2. Google Workspace / Gmail SMTP
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block text-gray-500 font-mono">Host:</label>
                    <input
                      type="text"
                      value={smtpConfig.gmailHost}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, gmailHost: e.target.value })}
                      className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-mono">Port (SSL):</label>
                    <input
                      type="number"
                      value={smtpConfig.gmailPort}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, gmailPort: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Google App Password (16 Characters for TuheenBD@gmail.com):
                  </label>
                  <input
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={smtpConfig.gmailPass}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, gmailPass: e.target.value })}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg font-mono"
                  />
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[10px] mt-2 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>How to generate a Google App Password (takes 1 minute):</span>
                    </p>
                    <ol className="list-decimal pl-4 space-y-0.5">
                      <li>Go to your Google Account (myaccount.google.com) ➔ <strong>Security</strong>.</li>
                      <li>Ensure <strong>2-Step Verification</strong> is ON.</li>
                      <li>Search for <strong>App passwords</strong>.</li>
                      <li>Create an app named <em>ArielMC ERP</em> and paste the 16-character code above.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#DDE3DD] flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                Credentials are saved securely in your ERP browser session.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSmtpModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSmtpConfig}
                  className="px-4 py-1.5 rounded-xl bg-[#1F3A2E] hover:bg-[#15271F] text-white text-xs font-bold shadow-sm font-['Montserrat']"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
