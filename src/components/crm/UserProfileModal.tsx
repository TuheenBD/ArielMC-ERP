'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  KeyRound,
  Laptop,
  Smartphone,
  LogOut,
  X,
  CheckCircle2,
  Lock,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    role: string;
    department: string;
    twoFactorEnabled: boolean;
    twoFactorMethod: string;
    avatarInitials: string;
    avatarColor: string;
    lastLogin: string;
  };
  onSwitchUser?: (userEmail: string) => void;
}

export const DEMO_USERS = [
  {
    name: 'Syed Akramul Hassan',
    email: 'tuheen@arielmc.com',
    phone: '+880 1819-273458',
    designation: 'Managing Director & Founder',
    role: 'SUPER_ADMIN',
    department: 'EXECUTIVE',
    twoFactorEnabled: true,
    twoFactorMethod: 'RFC-6238 Authenticator App',
    avatarInitials: 'AMC',
    avatarColor: '#C8A96A',
    lastLogin: '2026-11-08 14:15 UTC (Active Now)',
  },
  {
    name: 'Farhana Yasmin',
    email: 'f.yasmin@arielmc.com',
    phone: '+880 1713-902811',
    designation: 'Director of Sourcing & Merchandising',
    role: 'SOURCING_DIRECTOR',
    department: 'SOURCING_MERCHANDISING',
    twoFactorEnabled: true,
    twoFactorMethod: 'WhatsApp OTP Verified',
    avatarInitials: 'FY',
    avatarColor: '#1F3A2E',
    lastLogin: '2026-11-08 11:20 UTC',
  },
  {
    name: 'Tariqul Islam, FCA',
    email: 'tariqul@arielmc.com',
    phone: '+880 1819-994821',
    designation: 'Commercial Banking & Finance Controller',
    role: 'FINANCE_CONTROLLER',
    department: 'FINANCE_COMMERCIAL',
    twoFactorEnabled: true,
    twoFactorMethod: 'Authenticator App',
    avatarInitials: 'TI',
    avatarColor: '#162B22',
    lastLogin: '2026-11-08 09:40 UTC',
  },
  {
    name: 'Engr. Mahfuzur Rahman',
    email: 'compliance@arielmc.com',
    phone: '+880 1711-482910',
    designation: 'Head of Factory Compliance & IEB Audits',
    role: 'COMPLIANCE_AUDITOR',
    department: 'FACTORY_COMPLIANCE',
    twoFactorEnabled: true,
    twoFactorMethod: 'Authenticator App',
    avatarInitials: 'MR',
    avatarColor: '#2C5240',
    lastLogin: '2026-11-07 16:30 UTC',
  },
];

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-[#1B2D45]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-xs font-mono"
              style={{ backgroundColor: currentUser.avatarColor, color: '#0A1A2F' }}
            >
              {currentUser.avatarInitials}
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                Enterprise Executive Profile
              </h3>
              <div className="text-[10px] text-[#C9A86A] font-mono">
                ArielMC Sovereign Security &bull; RFC-6238 2SA
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-sans bg-[#FAF9F5]">
          {/* User Bio Card */}
          <div className="p-4 bg-white rounded-xl border border-[#DDE3DD] shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-[#1A1A1A]">
                  {currentUser.name}
                </h4>
                <div className="text-xs font-semibold text-[#1F3A2E] mt-0.5">
                  {currentUser.designation}
                </div>
                <div className="text-[11px] text-[#6B7269] font-mono mt-0.5">
                  {currentUser.department} &bull; Role: <strong className="text-[#1A1A1A]">{currentUser.role}</strong>
                </div>
              </div>

              <span className="px-2 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>2SA VERIFIED</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#DDE3DD] text-[11px] text-[#6B7269]">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#1F3A2E]" />
                <span className="font-mono text-[#1A1A1A]">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#1F3A2E]" />
                <span className="font-mono text-[#1A1A1A]">{currentUser.phone}</span>
              </div>
            </div>
          </div>

          {/* 2-Step Authentication & Security Status */}
          <div className="p-3.5 bg-white rounded-xl border border-[#DDE3DD] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Strict Two-Step Authentication (2SA)</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active &bull; Enforced
              </span>
            </div>
            <div className="text-[11px] text-[#6B7269] space-y-1">
              <div>Method: <strong className="text-[#1A1A1A]">{currentUser.twoFactorMethod}</strong></div>
              <div>Standard: <span className="font-mono text-[#1F3A2E]">RFC-6238 TOTP (Rolling 30s Codes)</span></div>
              <div>Emergency Keys: <span className="font-mono text-[#1A1A1A]">6 Single-Use Encrypted Codes Active</span></div>
            </div>
          </div>

          {/* Active Device Session */}
          <div className="p-3 bg-white rounded-xl border border-[#DDE3DD] shadow-2xs space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269] block">
              Active Authorized Session
            </span>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#1A1A1A] font-semibold">
                <Laptop className="w-3.5 h-3.5 text-[#1F3A2E]" />
                <span>MacBook Pro 16&quot; (macOS Sequoia)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                IP: 103.145.118.24 (Dhaka, BD)
              </span>
            </div>
            <div className="text-[10px] text-[#6B7269] font-mono">
              Last Login: {currentUser.lastLogin}
            </div>
          </div>

          {/* Switch Demo Executive Profile */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#6B7269] block">
              Switch Executive Role
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((usr) => (
                <button
                  key={usr.email}
                  type="button"
                  onClick={() => {
                    onSwitchUser?.(usr.email);
                    onClose();
                  }}
                  className={`p-2 rounded-lg border text-left transition flex items-center gap-2 cursor-pointer ${
                    currentUser.email === usr.email
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-white border-[#DDE3DD] hover:bg-slate-50 text-[#1A1A1A]'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ backgroundColor: usr.avatarColor, color: '#0A1A2F' }}
                  >
                    {usr.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold truncate">{usr.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-[#6B7269] truncate font-mono">{usr.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#DDE3DD] flex items-center justify-between text-xs">
          <div className="text-[10px] text-[#6B7269] font-mono">
            ArielMC Enterprise Staff Hub &bull; Port 3001
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A1A2F] hover:bg-[#1F3A2E] text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

