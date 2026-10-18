'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  onApply: (start: string, end: string) => void;
  totalAvailableRecords?: number;
}

interface PresetOption {
  label: string;
  start: string;
  end: string;
  badge?: string;
}

export const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  isOpen,
  onClose,
  startDate,
  endDate,
  onApply,
  totalAvailableRecords = 48
}) => {
  const [tempStart, setTempStart] = useState<string>(startDate || '2026-10-01');
  const [tempEnd, setTempEnd] = useState<string>(endDate || '2026-10-18');
  const [activePreset, setActivePreset] = useState<string>('');

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate || '2026-10-01');
      setTempEnd(endDate || '2026-10-18');
      setActivePreset('');
    }
  }, [isOpen, startDate, endDate]);

  // Quick Preset Options tailored to Bangladesh / Fiscal / Global Trade Calendar
  const presets: PresetOption[] = useMemo(() => [
    { label: 'Today (18 Oct)', start: '2026-10-18', end: '2026-10-18', badge: 'Live Day' },
    { label: 'Yesterday', start: '2026-10-17', end: '2026-10-17' },
    { label: 'Last 7 Days', start: '2026-10-12', end: '2026-10-18' },
    { label: 'Last 15 Days', start: '2026-10-04', end: '2026-10-18' },
    { label: 'This Month (Oct 2026)', start: '2026-10-01', end: '2026-10-31', badge: 'Current' },
    { label: 'Previous Month (Sep 2026)', start: '2026-09-01', end: '2026-09-30' },
    { label: 'Q3 2026 (Jul – Sep)', start: '2026-07-01', end: '2026-09-30' },
    { label: 'Q4 2026 (Oct – Dec)', start: '2026-10-01', end: '2026-12-31' },
    { label: 'Year-to-Date (YTD 2026)', start: '2026-01-01', end: '2026-10-18' },
    { label: 'Fiscal Year 2026 / 2027', start: '2026-07-01', end: '2027-06-30', badge: 'BD Tax FY' },
    { label: 'Full Calendar Year 2026', start: '2026-01-01', end: '2026-12-31' }
  ], []);

  // Validation
  const isValid = Boolean(tempStart && tempEnd && tempStart <= tempEnd);

  // Calculate day difference (must be declared before any conditional return)
  const dayCount = useMemo(() => {
    if (!tempStart || !tempEnd) return 0;
    const s = new Date(tempStart).getTime();
    const e = new Date(tempEnd).getTime();
    if (isNaN(s) || isNaN(e) || s > e) return 0;
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }, [tempStart, tempEnd]);

  const handleSelectPreset = (preset: PresetOption) => {
    setTempStart(preset.start);
    setTempEnd(preset.end);
    setActivePreset(preset.label);
  };

  const handleApply = () => {
    if (!isValid) return;
    onApply(tempStart, tempEnd);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#162B22] to-[#0A140F] border-2 border-[#2C5240] text-white shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#2C5240] bg-[#12231B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-[#C8A96A] shadow-md">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C8A96A] text-[#12231B] font-mono text-[9px] font-black uppercase">
                  Audit Scope
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Custom Date Range
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold font-heading text-white">
                Select Custom Reporting Period
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Quick Presets Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                1-Click Quick Presets
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Select preset to auto-populate dates</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSelected = activePreset === p.label || (tempStart === p.start && tempEnd === p.end);
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-[#12231B] border-[#2C5240]/80 text-gray-300 hover:text-white hover:border-[#C8A96A]/60 hover:bg-[#1a382b]'
                    }`}
                  >
                    <span className="font-medium truncate">{p.label}</span>
                    {p.badge && (
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ml-1 shrink-0 ${
                        isSelected ? 'bg-emerald-400 text-[#0A140F]' : 'bg-black/40 text-[#C8A96A]'
                      }`}>
                        {p.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Date Range Pickers */}
          <div className="p-4 rounded-xl bg-[#0d1c15] border border-[#2C5240] space-y-3">
            <div className="text-[11px] font-mono font-bold text-[#C8A96A] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C8A96A]" />
              Exact Start &amp; End Calendar Dates
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono block">
                  FROM (START DATE):
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempStart}
                    onChange={(e) => {
                      setTempStart(e.target.value);
                      setActivePreset('');
                    }}
                    className="w-full bg-[#12231B] border border-[#2C5240] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono block">
                  TO (END DATE):
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempEnd}
                    onChange={(e) => {
                      setTempEnd(e.target.value);
                      setActivePreset('');
                    }}
                    className="w-full bg-[#12231B] border border-[#2C5240] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Validation & Duration Summary */}
            {isValid ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Valid Scope: <strong>{dayCount} Calendar Days</strong> ({Math.ceil(dayCount / 7)} Weeks)
                  </span>
                </div>
                <span className="text-[10px] text-gray-300 font-mono">
                  {tempStart} → {tempEnd}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Invalid Range: Start date must be earlier than or equal to End date.</span>
              </div>
            )}
          </div>

          {/* Scope Audit Summary Preview */}
          <div className="p-3 rounded-xl bg-black/40 border border-[#2C5240]/80 flex items-center justify-between gap-3 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Matched Records in Range:</span>
            </div>
            <span className="text-emerald-300 font-bold">
              {isValid ? `~${Math.min(totalAvailableRecords, Math.max(8, Math.round(dayCount * 1.8)))} Live Ledgers &amp; Chalans` : '0 Records'}
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#12231B] border-t border-[#2C5240] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!isValid}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Apply Custom Range</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8A96A]" />
          </button>
        </div>

      </div>
    </div>
  );
};
