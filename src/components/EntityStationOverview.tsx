'use client';

import React from 'react';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { 
  Building2, 
  Globe2, 
  CreditCard, 
  Warehouse, 
  FileCheck2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  Landmark,
  ArrowRight
} from 'lucide-react';

interface EntityStationOverviewProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  onSelectEntity: (code: EntityCode) => void;
}

export const EntityStationOverview: React.FC<EntityStationOverviewProps> = ({
  companies,
  activeEntity,
  onSelectEntity,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Globe2 className="w-4 h-4" />
              <span>Multi-Entity Corporate Architecture</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Global Operating Stations & Jurisdictions
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              ArielMC operates across 5 sovereign jurisdictions with localized tax compliance (VAT, GST, Sales Tax, NBR), statutory corporate entities, and regional 3PL/FBA fulfillment networks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-xl p-3 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-slate-400 block text-[10px]">Active Operational Context</span>
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>{activeEntity.flag}</span>
                <span>{activeEntity.legalName}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 5 Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((comp) => {
          const isActive = comp.code === activeEntity.code;
          return (
            <div
              key={comp.code}
              className={`rounded-xl border transition-all duration-200 relative flex flex-col justify-between overflow-hidden ${
                isActive
                  ? 'bg-slate-900/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Top Accent Bar */}
              <div
                className={`h-1.5 w-full ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-slate-800'
                }`}
              />

              <div className="p-5 flex-1 space-y-4">
                {/* Station Title & Flag */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 rounded-lg bg-slate-800/80 border border-slate-700/60 shadow-inner">
                      {comp.flag}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-snug">
                        {comp.legalName}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">
                        {comp.city}, {comp.country}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                    {comp.baseCurrency}
                  </span>
                </div>

                {/* Role & Legal Description */}
                <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>Legal Status:</span>
                    <span className="text-slate-200 text-right">{comp.legalStatus}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-slate-800/60">
                    {comp.role}
                  </p>
                </div>

                {/* Tax & Compliance Identifiers */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{comp.taxIdentifier.type}:</span>
                    </span>
                    <span className="font-mono text-slate-200 font-medium text-[11px]">
                      {comp.taxIdentifier.number}
                    </span>
                  </div>

                  {/* Active Banking */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-blue-400" />
                      <span>Commercial Treasury / Bank</span>
                    </div>
                    {comp.bankAccounts.map((bank, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-slate-950/30 text-slate-300"
                      >
                        <span className="truncate max-w-[170px]">{bank.bankName}</span>
                        <span className="font-mono text-slate-400">{bank.accountNumberMask}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Facilities */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Warehouse className="w-3 h-3 text-amber-400" />
                      <span>Operating Hubs & Facilities</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {comp.activeFacilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Globe2 className="w-3 h-3 text-slate-400" />
                  <span>{comp.domains[0]}</span>
                </div>
                {isActive ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Station</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectEntity(comp.code)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <span>Switch Station</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
