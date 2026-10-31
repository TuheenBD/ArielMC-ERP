'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  Ship,
  Sparkles,
  CreditCard,
  FileCheck2,
  Trash2,
  CheckCheck,
  X,
  ExternalLink,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface ErpNotification {
  id: string;
  title: string;
  message: string;
  category: 'LOGISTICS' | 'SOURCING' | 'CYBERSECURITY' | 'FINANCE' | 'COMPLIANCE';
  priority: 'HIGH' | 'MEDIUM' | 'INFO';
  timestamp: string;
  read: boolean;
  actionTab?: string;
  actionLabel?: string;
}

export const INITIAL_NOTIFICATIONS: ErpNotification[] = [
  {
    id: 'notif-001',
    title: 'Enterprise Edge Firewall & Bot Defense Active',
    message: 'Vercel Edge WAF Bot Protection and AI Scraper blocking successfully activated across all 5 ArielMC sovereign subdomains.',
    category: 'CYBERSECURITY',
    priority: 'HIGH',
    timestamp: '15 mins ago',
    read: false,
    actionTab: 'CYBER_SECURITY',
    actionLabel: 'Review Security SOP',
  },
  {
    id: 'notif-002',
    title: 'Database Reset & Clean Slate Confirmed',
    message: 'All mock transactions and test products cleared from Supabase. 12 Bonded Warehouses and 34 Compliance Checklists preserved.',
    category: 'COMPLIANCE',
    priority: 'HIGH',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-003',
    title: 'Chattogram Port (CTG) Feeder Vessel Schedule',
    message: 'Port of Chattogram feeder vessel cut-off schedule synchronized with Singapore and Colombo transshipment hubs.',
    category: 'LOGISTICS',
    priority: 'MEDIUM',
    timestamp: '3 hours ago',
    read: false,
    actionTab: 'LOGISTICS',
    actionLabel: 'Open Logistics Fleet',
  },
  {
    id: 'notif-004',
    title: 'Eastern Bank PLC Forex Rates Synchronized',
    message: 'Statutory exchange rates updated: USD/BDT 122.50, GBP/BDT 156.80, EUR/BDT 132.40. Dual-track balance sheet refreshed.',
    category: 'FINANCE',
    priority: 'INFO',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 'notif-005',
    title: 'LWG Leather & BSCI Audit Passport Active',
    message: 'Savar tannery cluster environmental audit verified under LWG Gold/Silver standards. Ready for Spring 2027 buyer sampling.',
    category: 'SOURCING',
    priority: 'MEDIUM',
    timestamp: 'Yesterday',
    read: true,
    actionTab: 'SAMPLES',
    actionLabel: 'View Sampling Desk',
  },
];

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  notifications: ErpNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onToggleRead,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'CYBERSECURITY' | 'LOGISTICS' | 'SOURCING' | 'FINANCE'>('ALL');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'ALL') return true;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CYBERSECURITY':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'LOGISTICS':
        return <Ship className="w-4 h-4 text-sky-400" />;
      case 'SOURCING':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'FINANCE':
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      case 'COMPLIANCE':
        return <FileCheck2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#0F241C] border border-[#2D5A47] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2D5A47] bg-[#153427] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-[#C8A96A]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#153427] animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Station Notification Center</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {unreadCount} Unread
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-300">
                Operational alerts across Dhaka HQ &amp; Global Stations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Filter Pills */}
        <div className="p-3 bg-[#0B1D16] border-b border-[#2D5A47] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-[#C8A96A] text-[#153427]'
                  : 'bg-[#153427] text-gray-300 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('UNREAD')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeFilter === 'UNREAD'
                  ? 'bg-[#C8A96A] text-[#153427]'
                  : 'bg-[#153427] text-gray-300 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('CYBERSECURITY')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeFilter === 'CYBERSECURITY'
                  ? 'bg-[#C8A96A] text-[#153427]'
                  : 'bg-[#153427] text-gray-300 hover:text-white'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveFilter('LOGISTICS')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeFilter === 'LOGISTICS'
                  ? 'bg-[#C8A96A] text-[#153427]'
                  : 'bg-[#153427] text-gray-300 hover:text-white'
              }`}
            >
              Logistics
            </button>
            <button
              onClick={() => setActiveFilter('FINANCE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeFilter === 'FINANCE'
                  ? 'bg-[#C8A96A] text-[#153427]'
                  : 'bg-[#153427] text-gray-300 hover:text-white'
              }`}
            >
              Finance
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center space-x-1 text-[11px] text-[#C8A96A] hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-gray-400 hover:text-rose-400 p-1"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2D5A47]/40 p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400/60 mb-2" />
              <div className="text-sm font-semibold text-gray-200">No active notifications</div>
              <p className="text-xs text-gray-400 mt-0.5">Station operational queue is clear.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onToggleRead(n.id)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer ${
                  n.read
                    ? 'bg-[#153427]/40 hover:bg-[#153427]/70 text-gray-300'
                    : 'bg-[#153427] hover:bg-[#1C4233] text-white border-l-4 border-[#C8A96A]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded bg-[#0F241C] border border-[#2D5A47]">
                      {getCategoryIcon(n.category)}
                    </span>
                    <span className="text-xs font-bold text-white">{n.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 shrink-0">
                    {n.timestamp}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pl-7">
                  {n.message}
                </p>

                {n.actionLabel && (
                  <div className="mt-2.5 pl-7 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (n.actionTab && onNavigateTab) {
                          onNavigateTab(n.actionTab);
                          onClose();
                        }
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-[#C8A96A] hover:underline"
                    >
                      <span>{n.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] uppercase font-mono text-gray-400">
                      {n.category}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#153427] border-t border-[#2D5A47] text-center text-[11px] text-gray-400 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Connected: Dhaka HQ Ops Webhook</span>
          </span>
          <span className="text-[#C8A96A]">ArielMC Enterprise ERP</span>
        </div>
      </div>
    </div>
  );
};

