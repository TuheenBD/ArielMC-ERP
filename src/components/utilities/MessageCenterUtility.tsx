'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Send,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCheck,
  Plus,
  Clock,
  Building2,
  ExternalLink,
  X
} from 'lucide-react';
import { OfficeMessage, MessagePriority } from '@/types/utilities';
import { INITIAL_OFFICE_MESSAGES } from '@/data/initialUtilitiesData';

export const MessageCenterUtility: React.FC = () => {
  const [messages, setMessages] = useState<OfficeMessage[]>(INITIAL_OFFICE_MESSAGES);
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose State
  const [composeForm, setComposeForm] = useState({
    title: '',
    content: '',
    priority: 'ANNOUNCEMENT' as MessagePriority,
    targetStation: 'ALL_STATIONS',
    senderRole: 'Executive Command',
  });

  const handleMarkAsRead = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const handleSendMessage = () => {
    if (!composeForm.title || !composeForm.content) return;
    const newMsg: OfficeMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      sender: 'Office of the Managing Director',
      senderRole: composeForm.senderRole,
      title: composeForm.title,
      content: composeForm.content,
      priority: composeForm.priority,
      targetStation: composeForm.targetStation,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' GMT',
      read: false,
    };
    setMessages(prev => [newMsg, ...prev]);
    setIsComposeOpen(false);
    setComposeForm({
      title: '',
      content: '',
      priority: 'ANNOUNCEMENT',
      targetStation: 'ALL_STATIONS',
      senderRole: 'Executive Command',
    });
  };

  const filteredMessages = messages.filter(m =>
    selectedPriority === 'ALL' ? true : m.priority === selectedPriority
  );

  const getPriorityBadge = (p: MessagePriority) => {
    switch (p) {
      case 'URGENT':
        return 'bg-red-950/80 text-red-300 border-red-500/40';
      case 'POLICY':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'OPERATION':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'ANNOUNCEMENT':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96A]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#1F3A2E] border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Bell className="w-3.5 h-3.5 text-[#C8A96A]" />
              Station Broadcast &amp; Alerts
            </span>
            <span className="text-xs text-slate-700 font-mono font-medium">
              Dhaka HQ ⇄ London ⇄ Global Desks
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-heading text-[#1F3A2E] mt-1.5 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#C8A96A]" />
            <span>ArielMC Message Center &amp; Internal Bulletin Board</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-all shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Memo</span>
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#DDE3DD] text-[#1F3A2E] hover:bg-[#F4F6F4] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#12241b] border border-[#2b5540] text-xs font-mono">
        {[
          { id: 'ALL', label: 'All Memos' },
          { id: 'POLICY', label: '🛡️ Policy & Security' },
          { id: 'OPERATION', label: '📦 Logistics & Operations' },
          { id: 'ANNOUNCEMENT', label: '📢 General Announcements' },
          { id: 'URGENT', label: '🚨 Urgent Alerts' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedPriority(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedPriority === tab.id
                ? 'bg-[#C8A96A] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#183225]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="space-y-3">
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            onClick={() => handleMarkAsRead(msg.id)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 ${
              msg.read
                ? 'bg-[#0f1f18]/80 border-[#234533] text-slate-300 opacity-90'
                : 'bg-[#14281f] border-[#2e5d45] text-white shadow-lg shadow-black/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#214232] pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {!msg.read && <span className="w-2 h-2 rounded-full bg-[#C8A96A] animate-ping" />}
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${getPriorityBadge(msg.priority)}`}>
                  {msg.priority}
                </span>
                <span className="text-xs font-bold text-slate-200">{msg.sender}</span>
                <span className="text-[11px] text-[#C8A96A] font-mono">({msg.senderRole})</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700">
                  Target: {msg.targetStation.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {msg.timestamp}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{msg.title}</h4>
              <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Broadcast Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1f18] border-2 border-[#C8A96A]/60 shadow-2xl p-6 space-y-4 text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#C8A96A]" />
                Broadcast Enterprise Memo
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Memo Title *:</label>
                <input
                  type="text"
                  value={composeForm.title}
                  onChange={e => setComposeForm({ ...composeForm, title: e.target.value })}
                  placeholder="e.g. Schedule Update for Chittagong Port Departure"
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-bold focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority Classification:</label>
                  <select
                    value={composeForm.priority}
                    onChange={e => setComposeForm({ ...composeForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="POLICY">Policy &amp; Governance</option>
                    <option value="OPERATION">Logistics &amp; Operations</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Station:</label>
                  <select
                    value={composeForm.targetStation}
                    onChange={e => setComposeForm({ ...composeForm, targetStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="ALL_STATIONS">All Sovereign Stations</option>
                    <option value="DHAKA_HQ">Dhaka Operations HQ</option>
                    <option value="LONDON_OFFICE">London Subsidiary</option>
                    <option value="US_STATION">USA Station</option>
                    <option value="EU_STATION">EU Station</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Message Content *:</label>
                <textarea
                  rows={4}
                  value={composeForm.content}
                  onChange={e => setComposeForm({ ...composeForm, content: e.target.value })}
                  placeholder="Write clear instructions, timelines, or compliance mandates..."
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#234534] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsComposeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!composeForm.title || !composeForm.content}
                className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50"
              >
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
