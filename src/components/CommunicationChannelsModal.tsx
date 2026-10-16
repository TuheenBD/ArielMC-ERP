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
  Smartphone
} from 'lucide-react';
import { LinkedinIcon as Linkedin, YoutubeIcon as Youtube, FacebookIcon as Facebook, WhatsappIcon } from '@/components/SocialIcons';
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

1. Mobile (Bangladesh): +8801819273458
2. WhatsApp (International Desk): +8801819273458
3. E-Mails:
   - General & Commercial: info@arielmc.com
   - Managing Director: tuheen@arielmc.com
   - Operations Backup: ArielMC.BD@gmail.com

Official Social Media & Channels:
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

          {/* Section 2: Official Corporate E-Mails */}
          <div>
            <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8A6D3B]" />
              <span>Official Corporate E-Mail Addresses</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Email 1: info@arielmc.com */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#6B7269] block font-semibold uppercase">
                    General Inquiries &amp; Intake
                  </span>
                  <div className="font-mono text-xs font-bold text-[#1F3A2E] mt-1 break-all">
                    info@arielmc.com
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Primary RFQ &amp; supplier submission</p>
                </div>
                <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs">
                  <a
                    href="mailto:info@arielmc.com?subject=Inquiry%20from%20ArielMC%20ERP"
                    className="text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Compose <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    onClick={() => handleCopy('info@arielmc.com', 'email1')}
                    className="p-1 rounded hover:bg-[#F4F6F4] text-gray-500"
                    title="Copy email"
                  >
                    {copiedKey === 'email1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Email 2: tuheen@arielmc.com */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8A6D3B] block font-semibold uppercase">
                    Managing Director Desk
                  </span>
                  <div className="font-mono text-xs font-bold text-[#1F3A2E] mt-1 break-all">
                    tuheen@arielmc.com
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Syed Akramul Hassan (Executive)</p>
                </div>
                <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs">
                  <a
                    href="mailto:tuheen@arielmc.com?subject=Strategic%20Inquiry%20-%20ArielMC"
                    className="text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Compose <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    onClick={() => handleCopy('tuheen@arielmc.com', 'email2')}
                    className="p-1 rounded hover:bg-[#F4F6F4] text-gray-500"
                    title="Copy email"
                  >
                    {copiedKey === 'email2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Email 3: ArielMC.BD@gmail.com */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#6B7269] block font-semibold uppercase">
                    Operational Backup
                  </span>
                  <div className="font-mono text-xs font-bold text-[#1F3A2E] mt-1 break-all">
                    ArielMC.BD@gmail.com
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Google Workspace &amp; Cloud Backup</p>
                </div>
                <div className="pt-2 mt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs">
                  <a
                    href="mailto:ArielMC.BD@gmail.com?subject=Support%20Request%20-%20ArielMC"
                    className="text-[#1F3A2E] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Compose <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    onClick={() => handleCopy('ArielMC.BD@gmail.com', 'email3')}
                    className="p-1 rounded hover:bg-[#F4F6F4] text-gray-500"
                    title="Copy email"
                  >
                    {copiedKey === 'email3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
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
