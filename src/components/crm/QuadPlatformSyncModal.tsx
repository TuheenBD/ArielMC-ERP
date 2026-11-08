'use client';

import React from 'react';
import { PlatformSyncStatus } from '@/types/arelCrm';
import {
  Globe,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

interface QuadPlatformSyncModalProps {
  syncStatus: PlatformSyncStatus;
  onTriggerSync?: () => void;
}

export default function QuadPlatformSyncModal({
  syncStatus,
  onTriggerSync,
}: QuadPlatformSyncModalProps) {
  const platforms = [
    {
      id: 'website',
      name: 'Corporate Web Gateway (www.arielenergybd.com)',
      url: 'https://www.arielenergybd.com',
      role: 'Inbound Roof Audits, Lead Capture & Client Portal',
      status: syncStatus.websiteInboundConnected,
      icon: Globe,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'saas',
      name: 'Ariel-SaaS™ IoT Engine (energy.arielmc.com)',
      url: 'https://energy.arielmc.com',
      role: '5-Pillar Solar Calculator, Live PR Telemetry & I-REC Ledger',
      status: syncStatus.saasTelemetryBridgeConnected,
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'erp',
      name: 'ArielMC-ERP (erp.arielmc.com / Port 3001)',
      url: 'https://erp.arielmc.com',
      role: 'Master Sourcing BOM, Central Warehouse & General Ledger',
      status: syncStatus.erpGeneralLedgerConnected,
      icon: Database,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'master-crm',
      name: 'Master-CRM Hub (crm.arielmc.com)',
      url: 'https://crm.arielmc.com',
      role: 'Conglomerate Executive Oversight, Accounts & SOP-B2B Rollup',
      status: syncStatus.masterCrmRollupConnected,
      icon: Cpu,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
            QUAD-PLATFORM DATA SYNCHRONIZATION BUS
          </span>
          <h4 className="text-sm font-bold text-[#0A1A2F] mt-0.5">
            Zero-Duplication Cross-Platform Connectivity
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYNC STATUS: {syncStatus.syncHealth}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Last: {syncStatus.lastSyncTimestamp}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((p) => {
          const IconComp = p.icon;
          return (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${p.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>{p.name}</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-700"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{p.role}</div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SYNCED</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
