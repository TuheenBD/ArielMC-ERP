'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompanyEntity } from '@/types/erp';
import { CommunicationChannelsModal } from '@/components/CommunicationChannelsModal';
import {
  Building2,
  Package,
  Factory,
  FlaskConical,
  Users2,
  Repeat,
  Ship,
  Boxes,
  Landmark,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Phone,
  MessageSquare,
  Mail,
  Share2,
  Video
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

export type ActiveTab = 
  | 'STATIONS' 
  | 'PRODUCTS' 
  | 'FACTORIES' 
  | 'RND' 
  | 'CRM' 
  | 'ORDERS' 
  | 'LOGISTICS' 
  | 'INVENTORY' 
  | 'FINANCE' 
  | 'POS'
  | 'COMMUNICATIONS';

export type ThemeProfile = 'crm-green' | 'light-clean' | 'heritage-tan';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeEntity: CompanyEntity;
  theme?: ThemeProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeEntity,
  theme = 'crm-green',
}) => {
  const [isChannelsModalOpen, setIsChannelsModalOpen] = useState(false);

  const navSections = [
    {
      group: 'Phase 1: Foundation (Live)',
      items: [
        {
          id: 'STATIONS' as ActiveTab,
          label: 'Multi-Entity Stations',
          icon: Building2,
          badge: '5 Stations',
          phase: 'Phase 1',
        },
        {
          id: 'PRODUCTS' as ActiveTab,
          label: 'Sector Product Master',
          icon: Package,
          badge: '4 Sectors',
          phase: 'Phase 1',
        },
      ],
    },
    {
      group: 'Supply Chain & Manufacturing',
      items: [
        {
          id: 'FACTORIES' as ActiveTab,
          label: 'BD Factory & Compliance',
          icon: Factory,
          badge: '8 Factories',
          phase: 'Phase 2',
        },
        {
          id: 'RND' as ActiveTab,
          label: 'R&D, Tech Packs & Sampling',
          icon: FlaskConical,
          badge: '8 SDOs',
          phase: 'Phase 3',
        },
        {
          id: 'ORDERS' as ActiveTab,
          label: 'Two-Way Order Management',
          icon: Repeat,
          badge: '5 Orders',
          phase: 'Phase 5',
        },
      ],
    },
    {
      group: 'Commercial & Global Trade',
      items: [
        {
          id: 'COMMUNICATIONS' as ActiveTab,
          label: 'Communications & Meetings',
          icon: Video,
          badge: 'Live Desks',
          phase: 'Direct Hub',
        },
        {
          id: 'CRM' as ActiveTab,
          label: 'Global CRM & B2B Leads',
          icon: Users2,
          badge: '254 Leads',
          phase: 'Phase 4',
        },
        {
          id: 'LOGISTICS' as ActiveTab,
          label: 'Logistics & Export Docs',
          icon: Ship,
          badge: 'Dual-Hub Live',
          phase: 'Phase 6',
        },
        {
          id: 'INVENTORY' as ActiveTab,
          label: 'Multi-Warehouse Inventory',
          icon: Boxes,
          badge: 'Phase 7',
          phase: 'Phase 7',
        },
      ],
    },
    {
      group: 'Accounting & Expansion',
      items: [
        {
          id: 'FINANCE' as ActiveTab,
          label: 'Global Multi-Station Finance',
          icon: Landmark,
          badge: '10k P&L Live',
          phase: 'Phase 8',
        },
        {
          id: 'POS' as ActiveTab,
          label: 'Omnichannel Store POS',
          icon: Store,
          badge: 'Year 2+',
          phase: 'Phase 9',
        },
      ],
    },
  ];

  // Theme-specific styling variables
  const isLight = theme === 'light-clean';
  const isHeritage = theme === 'heritage-tan';

  const containerBg = isLight
    ? 'bg-white border-r border-[#DDE3DD]'
    : isHeritage
    ? 'bg-[#183124] border-r border-[#2A4837]'
    : 'bg-[#1F3A2E] border-r border-[#2C5240]'; // crm-green default

  const headerBg = isLight
    ? 'bg-[#F8F6F2] border-b border-[#DDE3DD]'
    : isHeritage
    ? 'bg-[#11231A] border-b border-[#2A4837]'
    : 'bg-[#172D24] border-b border-[#2C5240]';

  const brandText = isLight ? 'text-[#1F3A2E]' : 'text-white';
  const brandSubtext = isLight ? 'text-[#8A6D3B]' : 'text-[#C8A96A]';

  const entityBoxBg = isLight
    ? 'bg-white border border-[#DDE3DD]'
    : isHeritage
    ? 'bg-[#244232] border border-[#345943]'
    : 'bg-[#28493A] border border-[#3A6B54]';

  const entityTitle = isLight ? 'text-[#1A1A1A]' : 'text-white';
  const entitySub = isLight ? 'text-[#6B7269]' : 'text-[#CFE0D5]';

  const sectionGroupText = isLight
    ? 'text-[#1F3A2E]'
    : 'text-[#C8A96A]';

  const footerBg = isLight
    ? 'bg-[#F8F6F2] border-t border-[#DDE3DD]'
    : isHeritage
    ? 'bg-[#11231A] border-t border-[#2A4837]'
    : 'bg-[#172D24] border-t border-[#2C5240]';

  const footerText = isLight ? 'text-[#6B7269]' : 'text-[#CFE0D5]';

  return (
    <aside className={`w-72 ${containerBg} flex flex-col justify-between h-screen sticky top-0 select-none shadow-xl transition-colors`}>
      {/* Top Branding */}
      <div>
        <div className={`p-4 ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#C8A96A] p-1 flex items-center justify-center shadow-md">
              <Image
                src="/images/ArielMC_Logo.png"
                alt="ArielMC Logo"
                width={36}
                height={36}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-heading font-bold ${brandText} text-base tracking-wide`}>ArielMC</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-mono font-bold">
                  ERP
                </span>
              </div>
              <p className={`text-[10px] ${brandSubtext} font-medium tracking-tight truncate max-w-[170px]`}>
                Ariel Marketing &amp; Communications Ltd
              </p>
            </div>
          </div>

          {/* Active Operating Entity Bar */}
          <div className={`mt-3.5 p-2 rounded-lg ${entityBoxBg} flex items-center justify-between text-xs`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{activeEntity.flag}</span>
              <div>
                <span className={`font-medium ${entityTitle} block text-[11px] leading-tight`}>
                  {activeEntity.city} Station
                </span>
                <span className={`text-[9px] ${entitySub}`}>
                  {activeEntity.legalStatus.split(' ')[0]}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold border border-[#C8A96A]/40">
              {activeEntity.baseCurrency}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`px-2.5 py-1 text-[10px] font-bold tracking-wider ${sectionGroupText} uppercase font-heading`}>
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLive = item.id === 'STATIONS' || item.id === 'PRODUCTS' || item.id === 'FACTORIES' || item.id === 'CRM' || item.id === 'RND' || item.id === 'ORDERS' || item.id === 'LOGISTICS' || item.id === 'FINANCE' || item.id === 'COMMUNICATIONS';
                  
                  // Active / Inactive Button Styling
                  let buttonClass = '';
                  let iconClass = '';
                  let badgeClass = '';

                  if (isLight) {
                    if (isActive) {
                      buttonClass = 'bg-[#1F3A2E] text-white font-bold shadow-sm';
                      iconClass = 'text-[#C8A96A]';
                      badgeClass = 'bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40';
                    } else {
                      buttonClass = 'text-[#4A5568] hover:bg-[#F0F5F1] hover:text-[#1F3A2E]';
                      iconClass = isLive ? 'text-[#1F3A2E]' : 'text-gray-400';
                      badgeClass = 'bg-[#F4F6F4] text-[#6B7269] border border-[#DDE3DD]';
                    }
                  } else {
                    // crm-green or heritage-tan
                    if (isActive) {
                      buttonClass = 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-md shadow-[#C8A96A]/20';
                      iconClass = 'text-[#1F3A2E]';
                      badgeClass = 'bg-[#1F3A2E]/20 text-[#1F3A2E] font-bold border border-[#1F3A2E]/30';
                    } else {
                      buttonClass = 'text-[#CFE0D5] hover:bg-[#28493A] hover:text-white';
                      iconClass = isLive ? 'text-[#C8A96A]' : 'text-[#8EA896]';
                      badgeClass = 'bg-[#28493A] text-[#CFE0D5] border border-[#3A6B54]';
                    }
                  }

                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id.toLowerCase()}`}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${buttonClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${iconClass}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${badgeClass}`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Supplier & Buyer Communications Card & Footer */}
      <div>
        {/* Quick Channels Card */}
        <div className={`p-2.5 mx-3 mb-2 rounded-xl border text-xs space-y-2.5 ${isLight ? 'bg-[#F8F6F2] border-[#DDE3DD]' : 'bg-[#172D24] border-[#2C5240]'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-[#1F3A2E]' : 'text-[#C8A96A]'}`}>
              <Phone className="w-3 h-3 text-[#C8A96A]" />
              <span>Trade Channels</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectTab('COMMUNICATIONS')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all font-mono ${
                  activeTab === 'COMMUNICATIONS'
                    ? 'bg-[#C8A96A] text-[#1F3A2E]'
                    : isLight
                    ? 'bg-[#1F3A2E] text-white hover:bg-[#15271F]'
                    : 'bg-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A]/30 border border-[#C8A96A]/40'
                }`}
                title="Open Live Communications Hub"
              >
                Hub
              </button>
              <button
                onClick={() => setIsChannelsModalOpen(true)}
                className={`text-[10px] font-semibold underline hover:brightness-110 ${isLight ? 'text-[#1F3A2E]' : 'text-[#C8A96A]'}`}
                title="View Full Directory"
              >
                Directory
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <a href="tel:+8801819273458" className={`font-bold hover:underline ${isLight ? 'text-[#1A1A1A]' : 'text-white'}`}>
              +8801819273458
            </a>
            <a
              href="https://wa.me/8801819273458?text=Hello%20ArielMC%20Team%2C%20inquiry%20via%20ArielMC%20ERP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-mono font-bold"
              title="Chat on WhatsApp"
            >
              <WhatsappIcon className="w-3 h-3" />
              <span>WA</span>
            </a>
          </div>

          {/* Virtual Meetings Quick Launcher Bar (Zoom, Meet, Teams, Hostinger, Gmail) */}
          <div className={`pt-1.5 border-t flex items-center justify-between ${isLight ? 'border-[#DDE3DD]' : 'border-[#2C5240]'}`}>
            <a
              href="https://zoom.us/join"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#2D8CFF]/15 text-[#2D8CFF] hover:bg-[#2D8CFF] hover:text-white transition-colors"
              title="Zoom (TuheenBD@gmail.com)"
            >
              <ZoomIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#00897B]/15 text-[#00897B] hover:bg-[#00897B] hover:text-white transition-colors"
              title="Google Meet (TuheenBD@gmail.com)"
            >
              <GoogleMeetIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://teams.microsoft.com/l/chat/0/0?users=TuheenBD@msn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#5059C9]/15 text-[#5059C9] hover:bg-[#5059C9] hover:text-white transition-colors"
              title="Microsoft Teams (TuheenBD@msn.com)"
            >
              <TeamsIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://mail.hostinger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#673AB7]/15 text-[#673AB7] hover:bg-[#673AB7] hover:text-white transition-colors"
              title="Hostinger Business Mail (info@arielmc.com)"
            >
              <HostingerIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#EA4335]/15 text-[#EA4335] hover:bg-[#EA4335] hover:text-white transition-colors"
              title="Gmail / Google Workspace (TuheenBD@gmail.com)"
            >
              <GmailIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Social icons row */}
          <div className={`flex items-center justify-between pt-1.5 border-t ${isLight ? 'border-[#DDE3DD]' : 'border-[#2C5240]'}`}>
            <a
              href="https://www.linkedin.com/company/arielmc/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition-colors p-0.5"
              title="LinkedIn (ArielMC)"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/showcase/arielmc-shop/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition-colors text-[9px] font-mono font-bold"
              title="LinkedIn (ArielMC.shop)"
            >
              .shop
            </a>
            <a
              href="https://www.youtube.com/@ArielMC-BD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FF0000] transition-colors p-0.5"
              title="YouTube (ArielMC-BD)"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61593617982910"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877F2] transition-colors p-0.5"
              title="Facebook (ArielMC)"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:info@arielmc.com"
              className="text-gray-400 hover:text-[#C8A96A] transition-colors p-0.5"
              title="Email: info@arielmc.com"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer / System Health */}
        <div className={`p-3.5 ${footerBg} text-[11px] space-y-2`}>
          <div className={`flex items-center justify-between ${footerText}`}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-mono font-medium">ERP Engine Live</span>
            </span>
            <span className="text-[10px] font-mono text-[#C8A96A]">v1.0.0</span>
          </div>
          <div className={`text-[10px] ${footerText} flex items-center justify-between pt-1 border-t ${isLight ? 'border-[#DDE3DD]' : 'border-[#2C5240]'}`}>
            <span>PostgreSQL Active</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </div>

      {/* Communication Channels Modal */}
      <CommunicationChannelsModal
        isOpen={isChannelsModalOpen}
        onClose={() => setIsChannelsModalOpen(false)}
      />
    </aside>
  );
};
