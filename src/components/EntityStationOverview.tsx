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
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A6D3B]">
              <Globe2 className="w-4 h-4 text-[#C8A96A]" />
              <span>Multi-Entity Corporate Architecture</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1">
              Global Operating Stations & Jurisdictions
            </h1>
            <p className="text-sm text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              ArielMC operates across 5 sovereign jurisdictions with localized tax compliance (VAT, GST, Sales Tax, NBR), statutory corporate entities, and regional 3PL/FBA fulfillment networks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-xl p-3 text-xs shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <div>
              <span className="text-[#6B7269] block text-[10px] font-medium">Active Operational Context</span>
              <span className="font-bold text-[#1F3A2E] text-sm flex items-center gap-1.5">
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
              className={`rounded-xl border transition-all duration-200 relative flex flex-col justify-between overflow-hidden bg-white text-[#1A1A1A] ${
                isActive
                  ? 'border-[#C8A96A] shadow-md ring-1 ring-[#C8A96A]/60'
                  : 'border-[#DDE3DD] hover:border-[#C8A96A]/60 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Bar */}
              <div
                className={`h-1.5 w-full ${
                  isActive
                    ? 'bg-[#C8A96A]'
                    : 'bg-[#DDE3DD]'
                }`}
              />

              <div className="p-5 flex-1 space-y-4">
                {/* Station Title & Flag */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD]">
                      {comp.flag}
                    </span>
                    <div>
                      <h3 className="font-bold font-heading text-[#1F3A2E] text-sm leading-snug">
                        {comp.legalName}
                      </h3>
                      <p className="text-xs text-[#6B7269] font-medium">
                        {comp.city}, {comp.country}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A]/40">
                    {comp.baseCurrency}
                  </span>
                </div>

                {/* Role & Legal Description */}
                <div className="bg-[#F8FAF8] rounded-lg p-3 border border-[#DDE3DD] text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#6B7269] flex items-center justify-between">
                    <span>Legal Status:</span>
                    <span className="text-[#1A1A1A] text-right font-medium">{comp.legalStatus}</span>
                  </div>
                  <p className="text-[#1A1A1A] text-[11px] leading-relaxed pt-1 border-t border-[#DDE3DD]">
                    {comp.role}
                  </p>
                </div>

                {/* Tax & Compliance Identifiers */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD]">
                    <span className="text-[#6B7269] flex items-center gap-1.5 font-medium">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#14512C]" />
                      <span>{comp.taxIdentifier.type}:</span>
                    </span>
                    <span className="font-mono text-[#1F3A2E] font-bold text-[11px]">
                      {comp.taxIdentifier.number}
                    </span>
                  </div>

                  {/* Active Banking */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1 font-heading">
                      <Landmark className="w-3 h-3 text-[#1F5FA8]" />
                      <span>Commercial Treasury / Bank</span>
                    </div>
                    {comp.bankAccounts.map((bank, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A]"
                      >
                        <span className="truncate max-w-[170px] font-medium">{bank.bankName}</span>
                        <span className="font-mono text-[#6B7269]">{bank.accountNumberMask}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Facilities */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1 font-heading">
                      <Warehouse className="w-3 h-3 text-[#8A6D3B]" />
                      <span>Operating Hubs & Facilities</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {comp.activeFacilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#1F3A2E] border border-[#DDE3DD] font-medium shadow-xs"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-[#6B7269]">
                  <Globe2 className="w-3 h-3 text-[#6B7269]" />
                  <span>{comp.domains[0]}</span>
                </div>
                {isActive ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#14512C]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Station</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectEntity(comp.code)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors group"
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
