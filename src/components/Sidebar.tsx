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
  Video,
  BarChart3,
  FolderLock,
  LayoutDashboard
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
  | 'DASHBOARD'
  | 'STATIONS' 
  | 'DOCUMENTS'
  | 'PRODUCTS' 
  | 'FACTORIES' 
  | 'RND' 
  | 'CRM' 
  | 'ORDERS' 
  | 'LOGISTICS' 
  | 'INVENTORY' 
  | 'FINANCE' 
  | 'REPORTS'
  | 'POS' 
  | 'COMMUNICATIONS';

export type ThemeProfile = 
  | 'crm-green' 
  | 'royal-blue' 
  | 'heritage-tan'
  | 'california-beaches'
  | 'mossy-hollow'
  | 'ink-wash'
  | 'fresh-peach'
  | 'stormy-morning';

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
      group: 'Executive Command',
      items: [
        {
          id: 'DASHBOARD' as ActiveTab,
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          badge: 'Overview',
          phase: 'Command Hub',
        },
        {
          id: 'REPORTS' as ActiveTab,
          label: 'Executive Reports Suite',
          icon: BarChart3,
          badge: 'Executive',
          phase: 'Live Hub',
        },
      ],
    },
    {
      group: 'Foundation (Live)',
      items: [
        {
          id: 'STATIONS' as ActiveTab,
          label: 'Multi-Entity Stations',
          icon: Building2,
          badge: '5 Stations',
          phase: 'Foundation',
        },
        {
          id: 'DOCUMENTS' as ActiveTab,
          label: 'Document Portal',
          icon: FolderLock,
          badge: 'All Stations',
          phase: 'Statutory Hub',
        },
        {
          id: 'PRODUCTS' as ActiveTab,
          label: 'Sector Product Master',
          icon: Package,
          badge: '4 Sectors',
          phase: 'Foundation',
        },
      ],
    },
    {
      group: 'Global CRM & Sales Pipeline',
      items: [
        {
          id: 'CRM' as ActiveTab,
          label: 'Global CRM & B2B Leads',
          icon: Users2,
          badge: '254 Leads',
          phase: 'Live Suite',
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
          badge: '12 Hubs Live',
          phase: 'Phase 7 Live',
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
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const containerBg = isRoyal
    ? 'bg-[#0B132B] border-r border-[#1E293B]'
    : isHeritage
    ? 'bg-[#183124] border-r border-[#2A4837]'
    : isCalifornia
    ? 'bg-[#14232C] border-r border-[#203642]'
    : isMossy
    ? 'bg-[#282B1B] border-r border-[#3D4127]'
    : isInkWash
    ? 'bg-[#24272A] border-r border-[#363A3F]'
    : isPeach
    ? 'bg-[#2A1D1A] border-r border-[#422E29]'
    : isStormy
    ? 'bg-[#1E2730] border-r border-[#2E3C4A]'
    : 'bg-[#1F3A2E] border-r border-[#2C5240]'; // crm-green default

  const headerBg = isRoyal
    ? 'bg-[#0F172A] border-b border-[#1E293B]'
    : isHeritage
    ? 'bg-[#11231A] border-b border-[#2A4837]'
    : isCalifornia
    ? 'bg-[#0E1A21] border-b border-[#203642]'
    : isMossy
    ? 'bg-[#1D2013] border-b border-[#3D4127]'
    : isInkWash
    ? 'bg-[#1B1D1F] border-b border-[#363A3F]'
    : isPeach
    ? 'bg-[#1F1513] border-b border-[#422E29]'
    : isStormy
    ? 'bg-[#161D24] border-b border-[#2E3C4A]'
    : 'bg-[#172D24] border-b border-[#2C5240]';

  const brandText = 'text-white';
  const brandSubtext = isRoyal
    ? 'text-[#93C5FD]'
    : isCalifornia
    ? 'text-[#66F4FF]'
    : isMossy
    ? 'text-[#D4DE95]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#DBB06B]'
    : isStormy
    ? 'text-[#88BDF2]'
    : 'text-[#C8A96A]';

  const entityBoxBg = isRoyal
    ? 'bg-[#1E293B] border border-[#334155]'
    : isHeritage
    ? 'bg-[#244232] border border-[#345943]'
    : isCalifornia
    ? 'bg-[#1B2F3B] border border-[#2B4B5C]'
    : isMossy
    ? 'bg-[#343823] border border-[#4E5434]'
    : isInkWash
    ? 'bg-[#303438] border border-[#4A4F55]'
    : isPeach
    ? 'bg-[#382622] border border-[#543A34]'
    : isStormy
    ? 'bg-[#283542] border border-[#3E5164]'
    : 'bg-[#28493A] border border-[#3A6B54]';

  const entityTitle = 'text-white';
  const entitySub = isRoyal
    ? 'text-[#94A3B8]'
    : isCalifornia
    ? 'text-[#BACDD6]'
    : isMossy
    ? 'text-[#BAC095]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#BDDDFC]'
    : 'text-[#CFE0D5]';

  const sectionGroupText = isRoyal
    ? 'text-[#60A5FA]'
    : isCalifornia
    ? 'text-[#FFC067]'
    : isMossy
    ? 'text-[#D4DE95]'
    : isInkWash
    ? 'text-[#FFFFE3]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#BDDDFC]'
    : 'text-[#C8A96A]';

  const footerBg = isRoyal
    ? 'bg-[#0F172A] border-t border-[#1E293B]'
    : isHeritage
    ? 'bg-[#11231A] border-t border-[#2A4837]'
    : isCalifornia
    ? 'bg-[#0E1A21] border-t border-[#203642]'
    : isMossy
    ? 'bg-[#1D2013] border-t border-[#3D4127]'
    : isInkWash
    ? 'bg-[#1B1D1F] border-t border-[#363A3F]'
    : isPeach
    ? 'bg-[#1F1513] border-t border-[#422E29]'
    : isStormy
    ? 'bg-[#161D24] border-t border-[#2E3C4A]'
    : 'bg-[#172D24] border-t border-[#2C5240]';

  const footerText = isRoyal
    ? 'text-[#94A3B8]'
    : isCalifornia
    ? 'text-[#BACDD6]'
    : isMossy
    ? 'text-[#BAC095]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#BDDDFC]'
    : 'text-[#CFE0D5]';

  const dividerBorder = isRoyal
    ? 'border-[#1E293B]'
    : isHeritage
    ? 'border-[#2A4837]'
    : isCalifornia
    ? 'border-[#203642]'
    : isMossy
    ? 'border-[#3D4127]'
    : isInkWash
    ? 'border-[#363A3F]'
    : isPeach
    ? 'border-[#422E29]'
    : isStormy
    ? 'border-[#2E3C4A]'
    : 'border-[#2C5240]';

  return (
    <aside className={`w-72 ${containerBg} flex flex-col justify-between h-screen sticky top-0 select-none shadow-xl transition-colors`}>
      {/* Top Branding */}
      <div>
        <div className={`p-3.5 ${headerBg}`}>
          {/* Executive Official ArielMC Logo Card */}
          <div
            onClick={() => onSelectTab('DASHBOARD')}
            className="group cursor-pointer bg-white/95 hover:bg-white rounded-xl p-2.5 shadow-md border border-[#C8A96A]/60 flex items-center justify-between gap-2.5 transition-all hover:shadow-lg hover:border-[#C8A96A]"
            title="ArielMC Global Sourcing & Supply Chain ERP — Go to Executive Dashboard"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white shadow-md border border-[#C8A96A]/60">
                <Image
                  src="/images/ArielMC_ERP_Icon.png"
                  alt="ArielMC ERP Software Icon"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-[#003177] text-base tracking-tight leading-none group-hover:text-[#0A2540] transition-colors">
                    ArielMC
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1F3A2E] text-[#C8A96A] font-mono font-bold tracking-wider shrink-0">
                    ERP
                  </span>
                </div>
                <p className="text-[8.5px] font-bold text-[#E89A1B] uppercase tracking-tighter truncate mt-1 leading-tight">
                  Global Trade &amp; Sourcing ERP
                </p>
              </div>
            </div>
          </div>

          {/* Active Operating Entity Bar */}
          <div className={`mt-3.5 p-2 rounded-lg ${entityBoxBg} flex items-center justify-between text-xs`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{activeEntity.flag}</span>
              <div>
                <span className={`font-bold ${entityTitle} block text-[11px] leading-tight font-heading`}>
                  {activeEntity.code.replace('ARIEL_', 'ArielMC ')}
                </span>
                <span className={`text-[9px] ${entitySub}`}>
                  {activeEntity.city} Station
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

                  if (isRoyal) {
                    if (isActive) {
                      buttonClass = 'bg-[#4169E1] text-white font-bold shadow-lg shadow-[#4169E1]/30';
                      iconClass = 'text-white';
                      badgeClass = 'bg-white/20 text-white font-bold border border-white/30';
                    } else {
                      buttonClass = 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white';
                      iconClass = isLive ? 'text-[#60A5FA]' : 'text-slate-500';
                      badgeClass = 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]';
                    }
                  } else if (isCalifornia) {
                    if (isActive) {
                      buttonClass = 'bg-[#66C4FF] text-[#0E1A21] font-bold shadow-lg shadow-[#66C4FF]/30';
                      iconClass = 'text-[#0E1A21]';
                      badgeClass = 'bg-[#0E1A21]/20 text-[#0E1A21] font-bold border border-[#0E1A21]/30';
                    } else {
                      buttonClass = 'text-[#BACDD6] hover:bg-[#1B2F3B] hover:text-white';
                      iconClass = isLive ? 'text-[#FFC067]' : 'text-[#7D99AA]';
                      badgeClass = 'bg-[#1B2F3B] text-[#BACDD6] border border-[#2B4B5C]';
                    }
                  } else if (isMossy) {
                    if (isActive) {
                      buttonClass = 'bg-[#D4DE95] text-[#1D2013] font-bold shadow-md shadow-[#D4DE95]/25';
                      iconClass = 'text-[#1D2013]';
                      badgeClass = 'bg-[#1D2013]/20 text-[#1D2013] font-bold border border-[#1D2013]/30';
                    } else {
                      buttonClass = 'text-[#DCE0C5] hover:bg-[#343823] hover:text-white';
                      iconClass = isLive ? 'text-[#D4DE95]' : 'text-[#BAC095]';
                      badgeClass = 'bg-[#343823] text-[#DCE0C5] border border-[#4E5434]';
                    }
                  } else if (isInkWash) {
                    if (isActive) {
                      buttonClass = 'bg-[#6D8196] text-[#FFFFE3] font-bold shadow-md shadow-[#6D8196]/25';
                      iconClass = 'text-[#FFFFE3]';
                      badgeClass = 'bg-[#FFFFE3]/20 text-[#FFFFE3] font-bold border border-[#FFFFE3]/30';
                    } else {
                      buttonClass = 'text-[#CBCBCB] hover:bg-[#303438] hover:text-white';
                      iconClass = isLive ? 'text-[#6D8196]' : 'text-[#8E959E]';
                      badgeClass = 'bg-[#303438] text-[#CBCBCB] border border-[#4A4F55]';
                    }
                  } else if (isPeach) {
                    if (isActive) {
                      buttonClass = 'bg-[#E39A7B] text-[#1F1513] font-bold shadow-md shadow-[#E39A7B]/25';
                      iconClass = 'text-[#1F1513]';
                      badgeClass = 'bg-[#1F1513]/20 text-[#1F1513] font-bold border border-[#1F1513]/30';
                    } else {
                      buttonClass = 'text-[#FFD3AC] hover:bg-[#382622] hover:text-white';
                      iconClass = isLive ? 'text-[#FFB5AB]' : 'text-[#DBB06B]';
                      badgeClass = 'bg-[#382622] text-[#FFD3AC] border border-[#543A34]';
                    }
                  } else if (isStormy) {
                    if (isActive) {
                      buttonClass = 'bg-[#6A89A7] text-white font-bold shadow-md shadow-[#6A89A7]/30';
                      iconClass = 'text-white';
                      badgeClass = 'bg-white/20 text-white font-bold border border-white/30';
                    } else {
                      buttonClass = 'text-[#BDDDFC] hover:bg-[#283542] hover:text-white';
                      iconClass = isLive ? 'text-[#88BDF2]' : 'text-[#6A89A7]';
                      badgeClass = 'bg-[#283542] text-[#BDDDFC] border border-[#3E5164]';
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
        <div className={`p-2.5 mx-3 mb-2 rounded-xl border text-xs space-y-2.5 ${entityBoxBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${sectionGroupText}`}>
              <Phone className="w-3 h-3" />
              <span>Trade Channels</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectTab('COMMUNICATIONS')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all font-mono ${
                  activeTab === 'COMMUNICATIONS'
                    ? isRoyal
                      ? 'bg-[#4169E1] text-white'
                      : isCalifornia
                      ? 'bg-[#66C4FF] text-[#0E1A21]'
                      : isMossy
                      ? 'bg-[#D4DE95] text-[#1D2013]'
                      : isInkWash
                      ? 'bg-[#6D8196] text-[#FFFFE3]'
                      : isPeach
                      ? 'bg-[#E39A7B] text-[#1F1513]'
                      : isStormy
                      ? 'bg-[#6A89A7] text-white'
                      : 'bg-[#C8A96A] text-[#1F3A2E]'
                    : isRoyal
                    ? 'bg-[#4169E1]/20 text-[#60A5FA] hover:bg-[#4169E1]/30 border border-[#4169E1]/40'
                    : isCalifornia
                    ? 'bg-[#66C4FF]/20 text-[#66C4FF] hover:bg-[#66C4FF]/30 border border-[#66C4FF]/40'
                    : isMossy
                    ? 'bg-[#D4DE95]/20 text-[#D4DE95] hover:bg-[#D4DE95]/30 border border-[#D4DE95]/40'
                    : isInkWash
                    ? 'bg-[#6D8196]/20 text-[#FFFFE3] hover:bg-[#6D8196]/30 border border-[#6D8196]/40'
                    : isPeach
                    ? 'bg-[#E39A7B]/20 text-[#FFD3AC] hover:bg-[#E39A7B]/30 border border-[#E39A7B]/40'
                    : isStormy
                    ? 'bg-[#6A89A7]/20 text-[#BDDDFC] hover:bg-[#6A89A7]/30 border border-[#6A89A7]/40'
                    : 'bg-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A]/30 border border-[#C8A96A]/40'
                }`}
                title="Open Live Communications Hub"
              >
                Hub
              </button>
              <button
                onClick={() => setIsChannelsModalOpen(true)}
                className={`text-[10px] font-semibold underline hover:brightness-110 ${sectionGroupText}`}
                title="View Full Directory"
              >
                Directory
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <a href="tel:+8801819273458" className="font-bold hover:underline text-white">
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
          <div className={`pt-1.5 border-t flex items-center justify-between ${dividerBorder}`}>
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
          <div className={`flex items-center justify-between pt-1.5 border-t ${dividerBorder}`}>
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
          <div className={`text-[10px] ${footerText} flex items-center justify-between pt-1 border-t ${dividerBorder}`}>
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
