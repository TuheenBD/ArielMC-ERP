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
  Eye,
  Edit3,
  Trash2,
  Share2,
  Download,
  X,
  FileText,
} from 'lucide-react';

interface SubcontractorManagementProps {
  subcontractors: SubcontractorEntity[];
  onAssignWorkOrder?: (payload: WorkOrderPayload) => void;
  onEditSubcontractor?: (sub: SubcontractorEntity) => void;
  onDeleteSubcontractor?: (id: string) => void;
  theme?: string;
}

export default function SubcontractorManagement({
  subcontractors,
  onAssignWorkOrder,
  onEditSubcontractor,
  onDeleteSubcontractor,
  theme = 'crm-green',
}: SubcontractorManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [selectedSubForWorkOrder, setSelectedSubForWorkOrder] = useState<SubcontractorEntity | null>(null);

  // Multi-select & CRUD states
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [viewingSub, setViewingSub] = useState<SubcontractorEntity | null>(null);
  const [editingSub, setEditingSub] = useState<SubcontractorEntity | null>(null);
  const [deletingSub, setDeletingSub] = useState<SubcontractorEntity | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAssignModal = (sub?: SubcontractorEntity) => {
    setSelectedSubForWorkOrder(sub || null);
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

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedSubIds.length === filtered.length) {
      setSelectedSubIds([]);
    } else {
      setSelectedSubIds(filtered.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedSubIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSubIds.length} subcontractors?`)) {
      if (onDeleteSubcontractor) {
        selectedSubIds.forEach((id) => onDeleteSubcontractor(id));
      }
      setSelectedSubIds([]);
      showToast(`Deleted ${selectedSubIds.length} subcontractors`);
    }
  };

  // Share handler
  const handleShare = (sub: SubcontractorEntity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=subcontractors&subId=${sub.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Engineering Profile URL for ${sub.companyName} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Download PDF / Rate Card handler
  const handleDownloadPdf = (sub: SubcontractorEntity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating IEB Accreditation & Rate Card for ${sub.companyName}...`);

    setTimeout(() => {
      const docContent = `
================================================================================
INSTITUTION OF ENGINEERS BANGLADESH (IEB) ACCREDITED SUBCONTRACTOR PROFILE
================================================================================
Company Name:           ${sub.companyName}
Category:               ${sub.category.replace('_', ' ').toUpperCase()}
IEB Reg / License No:   ${sub.licenseOrIebRegNo}
Chief Lead Engineer:    ${sub.chiefEngineer}
Contact Phone:          ${sub.phone}
Contact Email:          ${sub.email}

COMMERCIAL & CAPACITY METRICS:
Standard Unit Rate:     ${sub.standardUnitRateBdt}
Completed Capacity:     ${sub.completedMwpCapacity} MWp Turnkey Solar PV Installed
Safety & QA Status:     ${sub.safetyCertification}
Overall Performance:    ${sub.ratingScore} / 5.0 Stars

ACTIVE EPC DEPLOYMENTS:
${sub.activeProjects.map((p, i) => `${i + 1}. ${p}`).join('\n')}

CERTIFIED UNDER:
Ariel Renewable Energy Limited • Engineering Contractor Quality Standard SOP-2026-ENG-V1
================================================================================
      `;
      const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sub.companyName.replace(/\s+/g, '_')}_RateCard.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    if (onEditSubcontractor) {
      onEditSubcontractor(editingSub);
    }
    showToast(`Updated Subcontractor ${editingSub.companyName}`);
    setEditingSub(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingSub) return;
    if (onDeleteSubcontractor) {
      onDeleteSubcontractor(deletingSub.id);
    }
    setSelectedSubIds((prev) => prev.filter((id) => id !== deletingSub.id));
    showToast(`Deleted ${deletingSub.companyName}`);
    setDeletingSub(null);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#0A1A2F]">
              IEB Engineering Bodies &amp; Certified Subcontractors ({filtered.length})
            </h3>
            <p className="text-[10px] text-slate-500">
              Vetted structural engineers, civil mounting crews, electrical EPC contractors &amp; 3D drone geomatics teams.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search firm, engineer, reg #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="STRUCTURAL_ENGINEERING">Structural &amp; P.E. Stamp</option>
            <option value="CIVIL_MOUNTING_WORKS">Civil &amp; Pier Mounting</option>
            <option value="ELECTRICAL_HT_LT_SUBSTATION">Electrical HT/LT Substation</option>
            <option value="ROOFTOP_3D_SURVEY">3D Drone &amp; Roof Geomatics</option>
          </select>

          {/* Bulk Selection Bar */}
          {selectedSubIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedSubIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected subcontractors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition font-mono cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Work Order</span>
          </button>
        </div>
      </div>

      {/* Subcontractors List */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sub) => {
            const isSelected = selectedSubIds.includes(sub.id);

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between ${
                  isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(sub.id, e)}
                        className="rounded text-emerald-600 focus:ring-0 cursor-pointer mt-0.5"
                      />
                      <div>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                          {sub.category.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-[#0A1A2F] text-sm">{sub.companyName}</h4>
                        <div className="text-[10px] text-slate-400 font-mono">Reg: {sub.licenseOrIebRegNo}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{sub.ratingScore}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-semibold">{sub.chiefEngineer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{sub.phone}</span>
                      <span className="text-slate-300">|</span>
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[140px]">{sub.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-2.5">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 uppercase font-mono text-[9px]">Rate Card</div>
                      <div className="font-bold text-[#0A1A2F] font-mono mt-0.5">{sub.standardUnitRateBdt}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 uppercase font-mono text-[9px]">Completed MWp</div>
                      <div className="font-bold text-emerald-700 font-mono mt-0.5">{sub.completedMwpCapacity} MWp</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 mt-2.5">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono mb-1">Active Projects:</div>
                    <div className="flex flex-wrap gap-1">
                      {sub.activeProjects.map((proj, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-semibold">
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{sub.safetyCertification}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingSub(sub)}
                      className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                      title="View Engineering Accreditation Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSub({ ...sub })}
                      className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                      title="Edit Subcontractor Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(sub, e)}
                      className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                      title="Share Profile"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPdf(sub, e)}
                      className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                      title="Download Rate Card & IEB Accreditation"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingSub(sub)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                      title="Delete Subcontractor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(sub)}
                      className="ml-1 px-2 py-0.5 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition cursor-pointer text-[10px]"
                    >
                      Assign Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Subcontractors Enterprise Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedSubIds.length === filtered.length}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3">Engineering Category</th>
                  <th className="py-2.5 px-3">Company &amp; License / IEB Reg</th>
                  <th className="py-2.5 px-3">Chief Lead Engineer</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Rate Card</th>
                  <th className="py-2.5 px-3">Track Record</th>
                  <th className="py-2.5 px-3">Safety &amp; Compliance</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((sub) => {
                  const isSelected = selectedSubIds.includes(sub.id);

                  return (
                    <tr key={sub.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(sub.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {sub.category.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#0A1A2F]">{sub.companyName}</div>
                        <div className="text-[10px] font-mono text-slate-400">Reg: {sub.licenseOrIebRegNo}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{sub.chiefEngineer}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                        <div>{sub.phone}</div>
                        <div className="text-[10px] text-slate-400">{sub.email}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-slate-900 text-[11px]">
                        {sub.standardUnitRateBdt}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-emerald-800 text-[11px]">
                        {sub.completedMwpCapacity} MWp
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{sub.safetyCertification}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => setViewingSub(sub)}
                            className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                            title="View Subcontractor Accreditation"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingSub({ ...sub })}
                            className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                            title="Edit Subcontractor Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Share */}
                          <button
                            type="button"
                            onClick={(e) => handleShare(sub, e)}
                            className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                            title="Share Profile"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Download */}
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPdf(sub, e)}
                            className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                            title="Download Rate Card & Accreditation"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingSub(sub)}
                            className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                            title="Delete Subcontractor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Assign Work Order */}
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(sub)}
                            className="ml-1 px-2 py-0.5 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition cursor-pointer text-[10px]"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
        selectedSubcontractor={selectedSubForWorkOrder}
        onAssignWorkOrder={handleWorkOrderSubmitted}
        theme={theme}
      />

      {/* View Subcontractor Profile Modal */}
      {viewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {viewingSub.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-black text-[#0A1A2F] mt-1">{viewingSub.companyName}</h3>
                <div className="text-xs font-mono text-slate-400">License / IEB Reg: {viewingSub.licenseOrIebRegNo}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Lead Engineer</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingSub.chiefEngineer}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Rating</span>
                  <div className="font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{viewingSub.ratingScore} / 5.0 Stars</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Rate Card</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{viewingSub.standardUnitRateBdt}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Track Record</span>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">{viewingSub.completedMwpCapacity} MWp Installed</div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 uppercase text-[9px] font-mono font-bold mb-1">Safety &amp; Compliance</div>
                <div className="font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{viewingSub.safetyCertification}</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 uppercase text-[9px] font-mono font-bold mb-1">Active Projects</div>
                <div className="space-y-1">
                  {viewingSub.activeProjects.map((p, idx) => (
                    <div key={idx} className="px-2.5 py-1 bg-slate-100 rounded text-slate-800 font-semibold text-[11px]">
                      • {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleDownloadPdf(viewingSub, e)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Rate Card</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A1A2F] text-white text-xs font-bold font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcontractor Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-[#0A1A2F]">Edit Subcontractor: {editingSub.companyName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editingSub.companyName}
                  onChange={(e) => setEditingSub({ ...editingSub, companyName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Chief Lead Engineer</label>
                  <input
                    type="text"
                    value={editingSub.chiefEngineer}
                    onChange={(e) => setEditingSub({ ...editingSub, chiefEngineer: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">IEB Reg / License</label>
                  <input
                    type="text"
                    value={editingSub.licenseOrIebRegNo}
                    onChange={(e) => setEditingSub({ ...editingSub, licenseOrIebRegNo: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingSub.phone}
                    onChange={(e) => setEditingSub({ ...editingSub, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingSub.email}
                    onChange={(e) => setEditingSub({ ...editingSub, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rate Card</label>
                  <input
                    type="text"
                    value={editingSub.standardUnitRateBdt}
                    onChange={(e) => setEditingSub({ ...editingSub, standardUnitRateBdt: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Completed MWp</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSub.completedMwpCapacity}
                    onChange={(e) => setEditingSub({ ...editingSub, completedMwpCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Safety &amp; Compliance Certification</label>
                <select
                  value={editingSub.safetyCertification}
                  onChange={(e) => setEditingSub({ ...editingSub, safetyCertification: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                >
                  <option value="Accord/RSC Compliant">Accord/RSC Compliant</option>
                  <option value="OSHA 30 Certified">OSHA 30 Certified</option>
                  <option value="Standard Civil">Standard Civil</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete subcontractor <span className="font-bold text-rose-600">{deletingSub.companyName}</span> ({deletingSub.licenseOrIebRegNo})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingSub(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
