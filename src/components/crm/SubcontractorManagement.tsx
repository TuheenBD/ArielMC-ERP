'use client';

import React, { useState } from 'react';
import { SubcontractorEntity, SubcontractorCategory } from '@/types/arelCrm';
import {
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Layers,
  Wrench,
  CheckCircle2,
  FileCheck,
  Filter,
} from 'lucide-react';

interface SubcontractorManagementProps {
  subcontractors: SubcontractorEntity[];
}

export default function SubcontractorManagement({
  subcontractors,
}: SubcontractorManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = subcontractors.filter((sub) => {
    if (selectedCategory !== 'ALL' && sub.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              IEB Engineering Bodies &amp; Certified Subcontractors
            </h3>
            <p className="text-[11px] text-slate-500">
              Vetted structural engineers, civil mounting crews, electrical EPC contractors &amp; 3D drone geomatics teams.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Engineering Categories</option>
            <option value="IEB Structural Engineering Firm">IEB Structural Engineering Firm</option>
            <option value="Civil & Mechanical Mounting Contractor">Civil &amp; Mechanical Mounting</option>
            <option value="Electrical HT/LT Substation EPC">Electrical HT/LT Substation EPC</option>
            <option value="Drone & 3D LiDAR Roof Audit Team">Drone &amp; 3D LiDAR Survey</option>
          </select>
        </div>
      </div>

      {/* Subcontractor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {sub.category}
                  </span>
                  <h4 className="text-base font-bold text-[#0A1A2F] mt-1.5">
                    {sub.companyName}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">
                    License / IEB Reg: {sub.licenseOrIebRegNo}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{sub.ratingScore.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lead: {sub.chiefEngineer}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sub.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sub.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 uppercase font-mono text-[9px]">Rate Card</div>
                  <div className="font-bold text-[#0A1A2F] font-mono mt-0.5">{sub.standardUnitRateBdt}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 uppercase font-mono text-[9px]">Completed MWp</div>
                  <div className="font-bold text-emerald-700 font-mono mt-0.5">{sub.completedMwpCapacity} MWp</div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono mb-1">Active Projects:</div>
                <div className="flex flex-wrap gap-1">
                  {sub.activeProjects.map((proj, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{sub.safetyCertification}</span>
              </span>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                Assign Work Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
