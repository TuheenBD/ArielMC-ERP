'use client';

import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  ExternalLink,
  Copy,
  Check,
  X,
  Building2,
  Globe2,
  ShieldCheck,
  Share2,
  Smartphone,
  Video,
  Users
} from 'lucide-react';
import {
  LinkedinIcon as Linkedin,
  YoutubeIcon as Youtube,
  FacebookIcon as Facebook,
  WhatsappIcon,
  ZoomIcon,
  GoogleMeetIcon,
  TeamsIcon,
  GmailIcon,
  HostingerIcon
} from '@/components/SocialIcons';
import { OFFICIAL_COMMUNICATION_CHANNELS } from '@/data/initialData';

interface CommunicationChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunicationChannelsModal: React.FC<CommunicationChannelsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const allText = `Ariel Marketing & Communications Limited
Official Communication Channels for Suppliers & Buyers:

1. Telephony & WhatsApp Desk:
   - Mobile (Bangladesh): +8801819273458
   - WhatsApp (International Desk): +8801819273458

2. Instant Virtual Meeting Desks:
   - Zoom: TuheenBD@gmail.com
   - Google Meet: TuheenBD@gmail.com
   - Microsoft Teams: TuheenBD@msn.com

3. Dual Corporate Email Systems:
   - Hostinger Business Mail: info@arielmc.com / tuheen@arielmc.com (Webmail: https://mail.hostinger.com)
   - Google Workspace / Gmail: TuheenBD@gmail.com / ArielMC.BD@gmail.com (Webmail: https://mail.google.com)

4. Official Social Media & Portals:
   - LinkedIn (Corporate): https://www.linkedin.com/company/arielmc/?viewAsMember=true
   - LinkedIn (ArielMC.shop): https://www.linkedin.com/showcase/arielmc-shop/?viewAsMember=true
   - YouTube (ArielMC-BD): https://www.youtube.com/@ArielMC-BD
   - YouTube (ArielMC.shop): https://www.youtube.com/@ArielMCShop
   - Facebook (ArielMC): https://www.facebook.com/profile.php?id=61593617982910
   - Facebook (ArielMC.shop): https://www.facebook.com/profile.php?id=61594583437920

HQ: House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh
Tel: +880 2410 811 91`;

    navigator.clipboard.writeText(allText);
    setCopiedKey('ALL');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center font-bold shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Montserrat'] tracking-wide">
                  Communication Channels: Suppliers &amp; Buyers
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-semibold">
                  Verified Official
                </span>
              </div>
              <p className="text-xs text-[#E8EFE8] font-['Open_Sans'] mt-0.5">
                Ariel Marketing &amp; Communications Ltd • Global Sourcing &amp; Export Directory
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#F4F6F4] text-[#1A1A1A] font-['Open_Sans']">
          {/* Section 1: Direct Hotline & WhatsApp */}
          <div>
            <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8A6D3B]" />
              <span>Direct Telephony &amp; Instant Messaging</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Mobile (BD) */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269] flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#1F3A2E]" />
                      Mobile (Bangladesh)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] font-semibold">
                      🇧🇩 Domestic
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-[#1F3A2E] pt-1">
                    +8801819273458
                  </div>
                  <p className="text-[11px] text-[#6B7269]">
                    Direct voice line to Dhaka central merchandising desk &amp; management.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#DDE3DD] flex items-center gap-2">
                  <a
                    href="tel:+8801819273458"
                    className="flex-1 text-center py-1.5 px-3 rounded-lg bg-[#1F3A2E] hover:bg-[#15271F] text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Call Now
                  </a>
                  <button
                    onClick={() => handleCopy('+8801819273458', 'mobile')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy phone number"
                  >
                    {copiedKey === 'mobile' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* WhatsApp (Intl) */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp (International)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] font-semibold">
                      🌐 24/7 Global
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-[#1F3A2E] pt-1">
                    +8801819273458
                  </div>
                  <p className="text-[11px] text-[#6B7269]">
                    Instant chat for international buyers, RFQ submission, and factory QA updates.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#DDE3DD] flex items-center gap-2">
                  <a
                    href="https://wa.me/8801819273458?text=Hello%20ArielMC%20Team%2C%20inquiry%20via%20ArielMC%20ERP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </a>
                  <button
                    onClick={() => handleCopy('+8801819273458', 'whatsapp')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy WhatsApp number"
                  >
                    {copiedKey === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Instant Virtual Meeting Desks (Zoom, Google Meet, Teams, WhatsApp) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#8A6D3B]" />
                <span>Instant Virtual Meeting Desks &amp; Video Conferencing</span>
              </h3>
              <span className="text-[10px] font-mono text-[#6B7269]">
                Live Buyer &amp; Supplier Rooms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Zoom */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#2D8CFF]/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E8F3FF] text-[#2D8CFF]">
                        <ZoomIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-['Montserrat'] text-[#1A1A1A]">Zoom</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">Official Host Account</span>
                    <div className="font-mono text-xs font-bold text-[#1F3A2E] truncate mt-0.5" title="TuheenBD@gmail.com">
                      TuheenBD@gmail.com
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDE3DD] flex items-center gap-1.5">
                  <a
                    href="https://zoom.us/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#2D8CFF] hover:bg-[#1f73db] text-white text-[11px] font-semibold text-center transition-colors shadow-sm"
                  >
                    Join / Launch
                  </a>
                  <button
                    onClick={() => handleCopy('TuheenBD@gmail.com', 'zoom')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy Zoom account"
                  >
                    {copiedKey === 'zoom' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Google Meet */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#00897B]/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E0F2F1] text-[#00897B]">
                        <GoogleMeetIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-['Montserrat'] text-[#1A1A1A]">Google Meet</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">Workspace Account</span>
                    <div className="font-mono text-xs font-bold text-[#1F3A2E] truncate mt-0.5" title="TuheenBD@gmail.com">
                      TuheenBD@gmail.com
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDE3DD] flex items-center gap-1.5">
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#00897B] hover:bg-[#00796B] text-white text-[11px] font-semibold text-center transition-colors shadow-sm"
                  >
                    New Meet Room
                  </a>
                  <button
                    onClick={() => handleCopy('TuheenBD@gmail.com', 'meet')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy Meet account"
                  >
                    {copiedKey === 'meet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Microsoft Teams */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#5059C9]/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#EDE7F6] text-[#5059C9]">
                        <TeamsIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-['Montserrat'] text-[#1A1A1A]">MS Teams</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">Teams Account</span>
                    <div className="font-mono text-xs font-bold text-[#1F3A2E] truncate mt-0.5" title="TuheenBD@msn.com">
                      TuheenBD@msn.com
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDE3DD] flex items-center gap-1.5">
                  <a
                    href="https://teams.microsoft.com/l/chat/0/0?users=TuheenBD@msn.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#5059C9] hover:bg-[#434aa8] text-white text-[11px] font-semibold text-center transition-colors shadow-sm"
                  >
                    Direct Chat / Call
                  </a>
                  <button
                    onClick={() => handleCopy('TuheenBD@msn.com', 'teams')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy Teams account"
                  >
                    {copiedKey === 'teams' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* WhatsApp Desk */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E8F8F0] text-emerald-600">
                        <WhatsappIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-['Montserrat'] text-[#1A1A1A]">WhatsApp Desk</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">International Line</span>
                    <div className="font-mono text-xs font-bold text-[#1F3A2E] truncate mt-0.5">
                      +8801819273458
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDE3DD] flex items-center gap-1.5">
                  <a
                    href="https://wa.me/8801819273458?text=Hello%20ArielMC%20Team%2C%20inquiry%20via%20ArielMC%20ERP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold text-center transition-colors shadow-sm"
                  >
                    Chat / Video
                  </a>
                  <button
                    onClick={() => handleCopy('+8801819273458', 'wa-desk')}
                    className="p-1.5 rounded-lg border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#6B7269] hover:text-[#1F3A2E] transition-colors"
                    title="Copy WhatsApp Number"
                  >
                    {copiedKey === 'wa-desk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dual Corporate Email Systems (Hostinger & Google Workspace) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8A6D3B]" />
                <span>Dual Corporate Email Systems (Hostinger &amp; Gmail)</span>
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#6B7269]">
                <a
                  href="https://mail.hostinger.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#673AB7] font-semibold hover:underline flex items-center gap-1"
                >
                  <HostingerIcon className="w-3 h-3" />
                  Hostinger Webmail
                </a>
                <span>•</span>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EA4335] font-semibold hover:underline flex items-center gap-1"
                >
                  <GmailIcon className="w-3 h-3" />
                  Gmail Workspace
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Hostinger Business Mail System */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#EDE7F6] text-[#673AB7]">
                      <HostingerIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-['Montserrat'] text-[#1A1A1A]">
                        Hostinger Business Mail
                      </h4>
                      <span className="text-[10px] text-gray-500 font-mono">Domain: @arielmc.com</span>
                    </div>
                  </div>
                  <a
                    href="https://mail.hostinger.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#673AB7]/10 hover:bg-[#673AB7]/20 text-[#673AB7] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Webmail</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs">
                  {/* General */}
                  <div className="p-2 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">Commercial &amp; General Inquiries</span>
                      <span className="font-mono text-xs font-bold text-[#1F3A2E]">info@arielmc.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="mailto:info@arielmc.com?subject=Commercial%20Inquiry%20via%20ArielMC%20ERP"
                        className="p-1 text-[#1F3A2E] hover:underline text-[10px] font-semibold"
                      >
                        Compose
                      </a>
                      <button
                        onClick={() => handleCopy('info@arielmc.com', 'info')}
                        className="p-1 rounded hover:bg-white text-gray-500"
                        title="Copy"
                      >
                        {copiedKey === 'info' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Executive */}
                  <div className="p-2 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#8A6D3B] uppercase font-semibold block">Managing Director Desk</span>
                      <span className="font-mono text-xs font-bold text-[#1F3A2E]">tuheen@arielmc.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="mailto:tuheen@arielmc.com?subject=Strategic%20Inquiry%20via%20ArielMC%20ERP"
                        className="p-1 text-[#1F3A2E] hover:underline text-[10px] font-semibold"
                      >
                        Compose
                      </a>
                      <button
                        onClick={() => handleCopy('tuheen@arielmc.com', 'tuheen')}
                        className="p-1 rounded hover:bg-white text-gray-500"
                        title="Copy"
                      >
                        {copiedKey === 'tuheen' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#6B7269] pt-1 border-t border-[#DDE3DD] flex items-center justify-between">
                  <span>IMAP: imap.hostinger.com:993</span>
                  <span>SMTP: smtp.hostinger.com:465</span>
                </div>
              </div>

              {/* Box 2: Google Workspace / Gmail System */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FDEAEA] text-[#EA4335]">
                      <GmailIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-['Montserrat'] text-[#1A1A1A]">
                        Google Workspace / Gmail
                      </h4>
                      <span className="text-[10px] text-gray-500 font-mono">Google Cloud Ecosystem</span>
                    </div>
                  </div>
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#EA4335]/10 hover:bg-[#EA4335]/20 text-[#EA4335] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Gmail</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Primary Workspace */}
                  <div className="p-2 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#EA4335] uppercase font-semibold block">Primary Executive Workspace</span>
                      <span className="font-mono text-xs font-bold text-[#1F3A2E]">TuheenBD@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=TuheenBD@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#EA4335] hover:underline text-[10px] font-semibold"
                      >
                        Web Compose
                      </a>
                      <button
                        onClick={() => handleCopy('TuheenBD@gmail.com', 'tuheen-gmail')}
                        className="p-1 rounded hover:bg-white text-gray-500"
                        title="Copy"
                      >
                        {copiedKey === 'tuheen-gmail' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Operational Backup */}
                  <div className="p-2 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#6B7269] uppercase font-semibold block">Cloud Backup &amp; Operations</span>
                      <span className="font-mono text-xs font-bold text-[#1F3A2E]">ArielMC.BD@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=ArielMC.BD@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#EA4335] hover:underline text-[10px] font-semibold"
                      >
                        Web Compose
                      </a>
                      <button
                        onClick={() => handleCopy('ArielMC.BD@gmail.com', 'ariel-gmail')}
                        className="p-1 rounded hover:bg-white text-gray-500"
                        title="Copy"
                      >
                        {copiedKey === 'ariel-gmail' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#6B7269] pt-1 border-t border-[#DDE3DD] flex items-center justify-between">
                  <span>Linked with: Google Meet &amp; Zoom</span>
                  <span>Direct Browser SSO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official Social Media Presences */}
          <div>
            <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#8A6D3B]" />
              <span>Official Social Media &amp; Digital Portals</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* LinkedIn Cards */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#E8F0FA] text-[#0A66C2]">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A] font-['Montserrat']">LinkedIn</span>
                </div>

                <div className="space-y-2 text-xs">
                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.linkedin.corporate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC</span>
                      <span className="text-[10px] text-gray-500">Corporate Page</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>

                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.linkedin.shop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC.shop</span>
                      <span className="text-[10px] text-gray-500">DTC Showcase</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>
                </div>
              </div>

              {/* YouTube Cards */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FDEAEA] text-[#FF0000]">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A] font-['Montserrat']">YouTube</span>
                </div>

                <div className="space-y-2 text-xs">
                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.youtube.corporate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC-BD</span>
                      <span className="text-[10px] text-gray-500">Factory Tours &amp; Craft</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>

                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.youtube.shop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC.shop</span>
                      <span className="text-[10px] text-gray-500">Product Showcase</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>
                </div>
              </div>

              {/* Facebook Cards */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#E8F0FA] text-[#1877F2]">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A] font-['Montserrat']">Facebook</span>
                </div>

                <div className="space-y-2 text-xs">
                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.facebook.corporate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC</span>
                      <span className="text-[10px] text-gray-500">Official Page</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>

                  <a
                    href={OFFICIAL_COMMUNICATION_CHANNELS.socialLinks.facebook.shop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-[#E8F0EA] border border-[#DDE3DD] flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <span className="font-semibold text-[#1F3A2E] block">ArielMC.shop</span>
                      <span className="text-[10px] text-gray-500">Retail &amp; Customer Care</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1F3A2E]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#DDE3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-gray-500 text-[11px]">
            Dhaka HQ: House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] font-bold text-xs shadow-sm transition-all font-['Montserrat']"
            >
              {copiedKey === 'ALL' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied All Details!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Directory</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-[#1A1A1A] font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
