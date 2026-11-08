'use client';

import React, { useState } from 'react';
import { SubcontractorEntity, SubcontractorCategory } from '@/types/arelCrm';
import AssignWorkOrderModal, { WorkOrderPayload } from './AssignWorkOrderModal';
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
  LayoutGrid,
  Table as TableIcon,
  Search,
  Plus,
} from 'lucide-react';

interface SubcontractorManagementProps {
  subcontractors: SubcontractorEntity[];
  onAssignWorkOrder?: (payload: WorkOrderPayload) => void;
  theme?: string;
}

export default function SubcontractorManagement({
  subcontractors,
  onAssignWorkOrder,
  theme = 'crm-green',
}: SubcontractorManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubcontractorEntity | null>(null);

  const handleOpenAssignModal = (sub?: SubcontractorEntity) => {
    setSelectedSub(sub || null);
    setIsWorkOrderModalOpen(true);
  };

  const handleWorkOrderSubmitted = (payload: WorkOrderPayload) => {
    if (onAssignWorkOrder) {
      onAssignWorkOrder(payload);
    }
  };

  const filtered = subcontractors.filter((sub) => {
    if (selectedCategory !== 'ALL' && sub.category !== selectedCategory) return false;
    if (
      searchTerm &&
      !sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sub.chiefEngineer.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sub.licenseOrIebRegNo.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              IEB Engineering Bodies &amp; Certified Subcontractors ({filtered.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Vetted structural engineers, civil mounting crews, electrical EPC contractors &amp; 3D drone geomatics teams.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search firm, engineer, reg #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
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

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Issue Work Order Button */}
          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Issue Work Order</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering: Grid vs Table View */}
      {viewMode === 'GRID' ? (
        /* Subcontractor Cards Grid */
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
                  onClick={() => handleOpenAssignModal(sub)}
                  className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition cursor-pointer text-[11px]"
                >
                  Assign Work Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Subcontractors Enterprise Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Engineering Category</th>
                  <th className="py-3 px-4">Company &amp; License / IEB Reg</th>
                  <th className="py-3 px-4">Chief Lead Engineer</th>
                  <th className="py-3 px-4">Contact (Phone / Email)</th>
                  <th className="py-3 px-4">Rate Card</th>
                  <th className="py-3 px-4">Track Record</th>
                  <th className="py-3 px-4">Active Deployments</th>
                  <th className="py-3 px-4">Safety &amp; Compliance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {sub.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0A1A2F]">{sub.companyName}</div>
                      <div className="text-[10px] font-mono text-slate-400">Reg: {sub.licenseOrIebRegNo}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{sub.chiefEngineer}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-600 font-mono text-[11px]">{sub.phone}</div>
                      <div className="text-slate-400 text-[10px]">{sub.email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#0A1A2F]">{sub.standardUnitRateBdt}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-emerald-700">{sub.completedMwpCapacity} MWp</div>
                      <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{sub.ratingScore.toFixed(1)} / 5.0</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {sub.activeProjects.map((proj, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-semibold">
                            {proj}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        <span>{sub.safetyCertification}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(sub)}
                        className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Assign Work Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Work Order Modal */}
      <AssignWorkOrderModal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        subcontractors={subcontractors}
        selectedSubcontractor={selectedSub}
        onAssignWorkOrder={handleWorkOrderSubmitted}
        theme={theme}
      />
    </div>
  );
}
